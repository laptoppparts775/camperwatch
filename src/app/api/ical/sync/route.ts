/**
 * POST /api/ical/sync
 *
 * Syncs all active external_calendars for a given owner (or all owners if no body).
 * Called by:
 *   - Vercel Cron every 15 min (no body — syncs all active calendars)
 *   - Owner dashboard "Sync now" button (body: { ownerId })
 *
 * For each external calendar:
 *   1. Fetch iCal URL
 *   2. Parse VEVENT entries
 *   3. Upsert blocked dates into site_availability with reason='external_ical'
 *   4. Update last_sync / last_sync_error on external_calendars row
 *
 * Secured by CRON_SECRET for cron calls. Owner calls use Supabase auth.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import ICAL from 'ical.js'

const CRON_SECRET = process.env.CRON_SECRET

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

function dateRange(start: Date, end: Date): string[] {
  const dates: string[] = []
  const d = new Date(start)
  while (d < end) {
    dates.push(d.toISOString().split('T')[0])
    d.setDate(d.getDate() + 1)
  }
  return dates
}

async function syncCalendar(
  sb: ReturnType<typeof createClient>,
  cal: { id: string; site_id: string; source_url: string; label: string }
): Promise<{ ok: boolean; dates: number; error?: string }> {
  // Fetch the iCal feed
  let rawText: string
  try {
    const res = await fetch(cal.source_url, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    rawText = await res.text()
  } catch (err: any) {
    return { ok: false, dates: 0, error: `Fetch failed: ${err.message}` }
  }

  // Parse iCal using ical.js (pure JS, Vercel-compatible)
  const blockedDates: string[] = []
  try {
    const jcalData = ICAL.parse(rawText)
    const comp = new ICAL.Component(jcalData)
    const vevents = comp.getAllSubcomponents('vevent')
    for (const vevent of vevents) {
      try {
        const ev = new ICAL.Event(vevent)
        const start = ev.startDate?.toJSDate()
        const end = ev.endDate?.toJSDate()
        if (!start || !end) continue
        blockedDates.push(...dateRange(start, end))
      } catch { continue }
    }
  } catch (err: any) {
    return { ok: false, dates: 0, error: `Parse failed: ${err.message}` }
  }

  if (blockedDates.length === 0) {
    return { ok: true, dates: 0 }
  }

  // Upsert into site_availability
  const rows = Array.from(new Set(blockedDates)).map(date => ({
    site_id: cal.site_id,
    blocked_date: date,
    reason: 'external_ical',
  }))

  const { error: upsertErr } = await sb
    .from('site_availability')
    .upsert(rows as any, { onConflict: 'site_id,blocked_date' })

  if (upsertErr) {
    return { ok: false, dates: 0, error: `DB upsert failed: ${upsertErr.message}` }
  }

  return { ok: true, dates: rows.length }
}

export async function POST(req: NextRequest) {
  // Auth: cron vs owner
  const auth = req.headers.get('authorization')
  const isCron = CRON_SECRET && auth === `Bearer ${CRON_SECRET}`

  let ownerId: string | null = null

  if (!isCron) {
    // Owner-initiated sync — verify session
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const anonSb = createClient(url, anonKey)
    const { data: { user }, error } = await anonSb.auth.getUser(token)
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    ownerId = user.id
  }

  const sb = getServiceClient()

  // Load active external calendars (filter by owner if owner-initiated)
  let query = sb
    .from('external_calendars')
    .select('id, site_id, source_url, label, owner_id')
    .eq('active', true)
    .not('site_id', 'is', null)

  if (ownerId) query = query.eq('owner_id', ownerId)

  const { data: calendars, error: calErr } = await query
  if (calErr || !calendars) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  const results = { synced: 0, failed: 0, totalDates: 0 }

  for (const cal of calendars) {
    const result = await syncCalendar(sb as any, cal as any)

    // Update last_sync status on the calendar row
    await sb.from('external_calendars').update({
      last_sync: new Date().toISOString(),
      last_sync_error: result.ok ? null : result.error,
    }).eq('id', cal.id)

    if (result.ok) {
      results.synced++
      results.totalDates += result.dates
    } else {
      results.failed++
      console.error(`[ical/sync] Calendar ${cal.id} failed:`, result.error)
    }
  }

  return NextResponse.json({ ok: true, ...results })
}
