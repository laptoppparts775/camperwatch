/**
 * Admin-only smoke test for the email pipeline.
 *
 * Usage: POST /api/email/test  (logged-in admin session required)
 *   body: { to: "your@email.com" }
 *
 * Sends one test email through the real Resend pipeline so we can verify
 * the full path (Resend Pro → DNS → branded template → inbox) before wiring
 * into booking flow.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'
import { testEmail } from '@/lib/emailTemplates'
import { SENDERS } from '@/lib/emailConfig'

const ADMIN_EMAILS = [
  'lubiarz.tek@gmail.com',
  'picinski@gmail.com',
  'dawoodanialtaaf@gmail.com',
]

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  // Verify admin session
  const auth = req.headers.get('authorization')
  const accessToken = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sb = createClient(url, anonKey)
  const { data: userData, error: userErr } = await sb.auth.getUser(accessToken)
  if (userErr || !userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const email = userData.user.email || ''
  if (!ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Parse body
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const to = String(body?.to || email).trim()
  if (!to.includes('@')) {
    return NextResponse.json({ error: 'Invalid recipient' }, { status: 400 })
  }

  const tpl = testEmail()
  const result = await sendEmail({
    to,
    from: SENDERS.info,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    templateKey: 'test_email',
  })

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 })
  }
  return NextResponse.json({ ok: true, id: result.id, sentTo: to, sentBy: email })
}
