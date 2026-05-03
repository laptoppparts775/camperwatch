/**
 * TEMPORARY one-shot smoke-test endpoint.
 *
 * Sends a branded test email to all 3 admin Gmails so we can verify
 * the Resend Pro pipeline end-to-end without needing an authenticated
 * admin session. Deleted in the next commit.
 *
 * Gate: caller must supply ?key=<sha256(RESEND_API_KEY)> in the URL.
 * The hash of RESEND_API_KEY is hardcoded below — only the holder of
 * the actual key (which is in Vercel env, not in chat) can compute it.
 *
 * This avoids:
 *   - putting any plaintext secret in git
 *   - needing a new env var
 *   - needing an admin session
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { sendEmail } from '@/lib/email'
import { testEmail } from '@/lib/emailTemplates'
import { SENDERS, ADMIN_GMAILS } from '@/lib/emailConfig'

export async function GET(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 })
  }

  const provided = req.nextUrl.searchParams.get('key') || ''
  const expected = createHash('sha256').update(apiKey).digest('hex')

  if (provided !== expected) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const tpl = testEmail()
  const results: Array<{ to: string; ok: boolean; id?: string; error?: string }> = []

  for (const to of ADMIN_GMAILS) {
    const r = await sendEmail({
      to,
      from: SENDERS.info,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      templateKey: 'test_email_one_shot',
    })
    if (r.ok) {
      results.push({ to, ok: true, id: r.id })
    } else {
      results.push({ to, ok: false, error: r.error })
    }
  }

  const allOk = results.every(r => r.ok)
  return NextResponse.json({ ok: allOk, results }, { status: allOk ? 200 : 502 })
}
