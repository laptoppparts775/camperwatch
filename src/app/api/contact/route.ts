/**
 * Server-side contact form handler.
 *
 * Anti-spam stack (no CAPTCHA, zero friction for real users):
 *  1. Honeypot field — bots fill hidden inputs, humans don't
 *  2. Timing check — submissions under 3 seconds are bots (no human types that fast)
 *  3. Rate limit — max 3 submissions per email per hour (checked in DB)
 *  4. Server-side field validation — never trust the client
 *  5. Message length cap — prevents payload abuse
 *  6. Allowlisted reason values — rejects tampered enums
 *
 * Spam is silently rejected with a 200 OK so bots don't learn to retry.
 * Only genuine validation errors return 400.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const VALID_REASONS = ['correction', 'tip', 'partnership', 'general'] as const
const MAX_MESSAGE_LENGTH = 2000
const MIN_ELAPSED_MS = 3000   // <3s = bot
const RATE_LIMIT_PER_HOUR = 3

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

// Simple email format check
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const {
    reason,
    campground,
    name,
    email,
    message,
    // Honeypot fields — should always be empty for real users
    website,    // hidden <input name="website">
    phone_alt,  // hidden <input name="phone_alt">
    // Timing — frontend stamps when form first rendered
    _loaded_at,
  } = body as Record<string, string>

  // 1. Honeypot — if either hidden field has any value, it's a bot. Silent 200.
  if (website || phone_alt) {
    return NextResponse.json({ ok: true })
  }

  // 2. Timing check — must take at least 3 seconds to fill out
  const loadedAt = Number(_loaded_at) || 0
  const elapsed = Date.now() - loadedAt
  if (loadedAt > 0 && elapsed < MIN_ELAPSED_MS) {
    return NextResponse.json({ ok: true }) // silent 200 for bot
  }

  // 3. Server-side field validation
  const reasonClean = (reason || '').trim()
  const nameClean = (name || '').trim().slice(0, 100)
  const emailClean = (email || '').trim().toLowerCase().slice(0, 254)
  const messageClean = (message || '').trim().slice(0, MAX_MESSAGE_LENGTH)
  const campgroundClean = (campground || '').trim().slice(0, 200) || null

  if (!VALID_REASONS.includes(reasonClean as typeof VALID_REASONS[number])) {
    return NextResponse.json({ error: 'Please select a reason.' }, { status: 400 })
  }
  if (!nameClean || nameClean.length < 2) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
  }
  if (!isValidEmail(emailClean)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (!messageClean || messageClean.length < 10) {
    return NextResponse.json({ error: 'Message must be at least 10 characters.' }, { status: 400 })
  }

  const sb = getServiceSupabase()
  if (!sb) {
    return NextResponse.json({ error: 'Server error. Please email hello@camperwatch.org directly.' }, { status: 500 })
  }

  // 4. Rate limit — max 3 per email per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await sb
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('email', emailClean)
    .gte('created_at', oneHourAgo)

  if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
    // Silent 200 — don't tell spammers they're rate-limited
    return NextResponse.json({ ok: true })
  }

  // 5. Insert
  const { error: dbError } = await sb.from('contact_messages').insert({
    reason: reasonClean,
    campground_ref: campgroundClean,
    name: nameClean,
    email: emailClean,
    message: messageClean,
  })

  if (dbError) {
    console.error('[contact] DB insert error:', dbError.message)
    return NextResponse.json(
      { error: 'Something went wrong. Please email hello@camperwatch.org directly.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
