/**
 * Email sending helper.
 *
 * Server-side only. Imports the resend package directly + reads RESEND_API_KEY
 * from process.env. Never import this from a client component.
 *
 * Emails are best-effort: a Resend failure logs to console + outbound_emails
 * but does NOT throw. Booking flow must not break when email is down.
 */

import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

type SendInput = {
  to: string | string[]
  from: string
  subject: string
  html: string
  text?: string
  replyTo?: string
  cc?: string | string[]
  templateKey?: string
  relatedEntityType?: string
  relatedEntityId?: string
}

type SendResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

let resendClient: Resend | null = null

function getResend(): Resend | null {
  if (resendClient) return resendClient
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — outbound mail disabled')
    return null
  }
  resendClient = new Resend(apiKey)
  return resendClient
}

/**
 * Service-role Supabase client for server-side logging.
 * Returns null if env not configured (logging is best-effort too).
 */
function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.warn('[email] SUPABASE_SERVICE_ROLE_KEY not set — outbound logging disabled')
    return null
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function toArray(v: string | string[] | undefined): string[] | undefined {
  if (!v) return undefined
  return Array.isArray(v) ? v : [v]
}

/**
 * Send an email through Resend, log to outbound_emails, return result.
 * Failures are logged but do NOT throw — caller never has to catch.
 */
export async function sendEmail(input: SendInput): Promise<SendResult> {
  const resend = getResend()
  const sb = getServiceSupabase()
  const toArr = toArray(input.to) || []
  const ccArr = toArray(input.cc)

  // Pre-write a queued log row so we have a record even if Resend hangs
  let logId: string | null = null
  if (sb) {
    const { data: logRow } = await sb
      .from('outbound_emails')
      .insert({
        from_address: input.from,
        to_addresses: toArr,
        cc_addresses: ccArr || null,
        reply_to: input.replyTo || null,
        subject: input.subject,
        template_key: input.templateKey || null,
        related_entity_type: input.relatedEntityType || null,
        related_entity_id: input.relatedEntityId || null,
        status: 'queued',
      })
      .select('id')
      .single()
    logId = logRow?.id || null
  }

  if (!resend) {
    if (sb && logId) {
      await sb
        .from('outbound_emails')
        .update({ status: 'failed', error_message: 'RESEND_API_KEY missing' })
        .eq('id', logId)
    }
    return { ok: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: input.from,
      to: toArr,
      cc: ccArr,
      reply_to: input.replyTo,
      subject: input.subject,
      html: input.html,
      text: input.text,
    } as any)

    if (error) {
      const msg = (error as any)?.message || JSON.stringify(error)
      console.error('[email] Resend send failed:', msg)
      if (sb && logId) {
        await sb
          .from('outbound_emails')
          .update({ status: 'failed', error_message: msg })
          .eq('id', logId)
      }
      return { ok: false, error: msg }
    }

    const resendId = (data as any)?.id || ''
    if (sb && logId) {
      await sb
        .from('outbound_emails')
        .update({
          status: 'sent',
          resend_email_id: resendId,
          sent_at: new Date().toISOString(),
        })
        .eq('id', logId)
    }
    return { ok: true, id: resendId }
  } catch (err: any) {
    const msg = err?.message || String(err)
    console.error('[email] Resend send threw:', msg)
    if (sb && logId) {
      await sb
        .from('outbound_emails')
        .update({ status: 'failed', error_message: msg })
        .eq('id', logId)
    }
    return { ok: false, error: msg }
  }
}
