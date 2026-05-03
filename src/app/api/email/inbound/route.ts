/**
 * Inbound email webhook handler.
 *
 * Resend POSTs here when an email arrives at any *@camperwatch.org address.
 *
 * Flow:
 *   1. Read raw body (CRITICAL: signature verification requires raw body, not parsed)
 *   2. Verify signature using RESEND_WEBHOOK_SECRET via resend.webhooks.verify()
 *   3. Dedupe on email_id (Resend webhooks are at-least-once)
 *   4. Look up routing rules per recipient address
 *   5. Fetch full body via resend.emails.receiving.get(emailId)
 *   6. Wrap with "Forwarded from X" banner + original body
 *   7. Send to routed admins with reply_to set to ORIGINAL SENDER —
 *      so when admin hits reply in Gmail, it goes directly to the person who emailed in
 *   8. Log to inbound_emails for audit trail
 *
 * Resend retains inbound emails for 30 days, so re-fetching is fine within that window.
 *
 * NOTE on attachments: this v1 does NOT forward attachments. Attachment URLs from
 * Resend expire after 1 hour, so we'd need to either embed them inline (size limits)
 * or upload to our own storage. Punted to a follow-up. Subject notes attachment
 * count so admin knows to check the dashboard if needed.
 *
 * Returns 2xx fast on every valid request even if forwarding fails — Resend
 * retrying won't fix the underlying issue, and we have it logged for manual replay.
 */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { resolveInboundRoute, SENDERS, BRAND } from '@/lib/emailConfig'
import { sendEmail } from '@/lib/email'
import { forwardedInboundEmail } from '@/lib/emailTemplates'

export const dynamic = 'force-dynamic'

let resendClient: Resend | null = null
function getResend(): Resend | null {
  if (resendClient) return resendClient
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  resendClient = new Resend(key)
  return resendClient
}

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

type ResendInboundEvent = {
  type: 'email.received' | string
  created_at: string
  data: {
    email_id: string
    created_at?: string
    from: string
    to: string[]
    cc?: string[]
    bcc?: string[]
    subject?: string
    message_id?: string
    attachments?: Array<{ id: string; filename: string; content_type: string }>
  }
}

/** Parse "Display Name <email@addr>" → { name, email }. */
function parseFromHeader(raw: string): { name?: string; email: string } {
  const match = raw.match(/^\s*(?:"?([^"<]*?)"?\s*)?<([^>]+)>\s*$/)
  if (match) {
    return { name: match[1]?.trim() || undefined, email: match[2].trim() }
  }
  return { email: raw.trim() }
}

export async function POST(req: NextRequest) {
  // 1. Read raw body
  let rawBody: string
  try {
    rawBody = await req.text()
  } catch {
    return NextResponse.json({ error: 'Failed to read body' }, { status: 400 })
  }

  // 2. Verify signature
  const secret = process.env.RESEND_WEBHOOK_SECRET
  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!secret) {
    console.error('[inbound-webhook] RESEND_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing signature headers' }, { status: 400 })
  }

  const resend = getResend()
  if (!resend) {
    console.error('[inbound-webhook] RESEND_API_KEY not set')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  let event: ResendInboundEvent
  try {
    event = resend.webhooks.verify({
      payload: rawBody,
      headers: {
        id: svixId,
        timestamp: svixTimestamp,
        signature: svixSignature,
      },
      webhookSecret: secret,
    } as any) as ResendInboundEvent
  } catch (err: any) {
    console.warn('[inbound-webhook] Signature verification failed:', err?.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  if (event.type !== 'email.received') {
    return NextResponse.json({ ok: true, ignored: event.type })
  }

  const data = event.data
  const sb = getServiceSupabase()

  // 3. Dedupe
  if (sb) {
    const { data: existing } = await sb
      .from('inbound_emails')
      .select('id')
      .eq('resend_email_id', data.email_id)
      .maybeSingle()
    if (existing) {
      return NextResponse.json({ ok: true, duplicate: true, id: existing.id })
    }
  }

  // 4. Routing
  const recipients = [...(data.to || []), ...(data.cc || []), ...(data.bcc || [])]
  const forwardSet = new Set<string>()
  const primaryTo = data.to?.[0] || ''
  for (const r of recipients) {
    const route = resolveInboundRoute(r)
    if (route === null) continue
    for (const addr of route) forwardSet.add(addr)
  }
  const forwardTo = Array.from(forwardSet)
  const sender = parseFromHeader(data.from)

  // Pre-record
  let inboundLogId: string | null = null
  if (sb) {
    const { data: row } = await sb
      .from('inbound_emails')
      .insert({
        resend_email_id: data.email_id,
        from_address: sender.email,
        from_name: sender.name || null,
        to_addresses: data.to || [],
        subject: data.subject || null,
        raw_headers: {
          svix_id: svixId,
          svix_timestamp: svixTimestamp,
          attachments: data.attachments || [],
        },
        forwarded_to: forwardTo.length > 0 ? forwardTo : null,
        forward_status: forwardTo.length === 0 ? 'discarded' : 'pending',
      })
      .select('id')
      .single()
    inboundLogId = row?.id || null
  }

  if (forwardTo.length === 0) {
    return NextResponse.json({ ok: true, discarded: true })
  }

  // 5. Fetch full body
  let bodyHtml: string | undefined
  let bodyText: string | undefined
  try {
    const { data: fullEmail, error: getErr } =
      await resend.emails.receiving.get(data.email_id)
    if (getErr) {
      const msg = (getErr as any)?.message || JSON.stringify(getErr)
      console.error('[inbound-webhook] Body fetch failed for', data.email_id, msg)
      if (sb && inboundLogId) {
        await sb
          .from('inbound_emails')
          .update({
            forward_status: 'failed',
            forward_error: 'fetch_body_failed: ' + msg,
          })
          .eq('id', inboundLogId)
      }
      return NextResponse.json({ ok: true, error: 'fetch_failed' })
    }
    bodyHtml = fullEmail?.html || undefined
    bodyText = fullEmail?.text || undefined
    if (sb && inboundLogId) {
      await sb
        .from('inbound_emails')
        .update({
          body_text: bodyText || null,
          body_html: bodyHtml || null,
        })
        .eq('id', inboundLogId)
    }
  } catch (err: any) {
    console.error('[inbound-webhook] Body fetch threw:', err?.message)
    if (sb && inboundLogId) {
      await sb
        .from('inbound_emails')
        .update({
          forward_status: 'failed',
          forward_error: 'fetch_body_threw: ' + (err?.message || ''),
        })
        .eq('id', inboundLogId)
    }
    return NextResponse.json({ ok: true, error: 'fetch_threw' })
  }

  // 6. Build forwarded email
  const attachmentCount = data.attachments?.length || 0
  const tpl = forwardedInboundEmail({
    originalFrom: sender.email,
    originalFromName: sender.name,
    originalTo: primaryTo,
    originalSubject: data.subject || '',
    bodyHtml,
    bodyText,
  })
  const finalSubject =
    attachmentCount > 0
      ? `${tpl.subject} (${attachmentCount} attachment${attachmentCount > 1 ? 's' : ''})`
      : tpl.subject

  // 7. Send to admins with reply_to = ORIGINAL SENDER (so Gmail Reply works)
  const result = await sendEmail({
    to: forwardTo,
    from: SENDERS.noreply,
    replyTo: sender.email,
    subject: finalSubject,
    html: tpl.html,
    text: tpl.text,
    templateKey: 'inbound_forward',
    relatedEntityType: 'inbound_email',
    relatedEntityId: data.email_id,
  })

  // 8. Update log
  if (sb && inboundLogId) {
    await sb
      .from('inbound_emails')
      .update({
        forward_status: result.ok ? 'sent' : 'failed',
        forward_error: result.ok ? null : result.error || null,
      })
      .eq('id', inboundLogId)
  }

  return NextResponse.json({
    ok: true,
    forwarded: result.ok,
    forward_id: result.ok ? result.id : null,
    routed_to: forwardTo,
    attachments: attachmentCount,
  })
}

/** Health check — Resend dashboard may ping when registering webhook. */
export async function GET() {
  return NextResponse.json({ service: 'inbound-webhook', brand: BRAND.name })
}
