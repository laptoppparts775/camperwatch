/**
 * GET /api/alerts/scan
 *
 * Cron worker — called by Vercel Cron every 10 minutes.
 * For each active availability_alert:
 *   1. Checks Recreation.gov availability for the alert's campground + date range
 *   2. If any site is open: sends alert email (rate-limited: 1 per facility per 24h)
 *   3. Email includes cross-sell of 2–3 nearby private CamperWatch campgrounds
 *
 * Secured by CRON_SECRET env var. Vercel Cron sets Authorization: Bearer <secret>.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'
import { availabilityAlertEmail } from '@/lib/emailTemplates'
import { SENDERS } from '@/lib/emailConfig'
import { campgrounds as allCampgrounds } from '@/lib/data'

// Private campgrounds (no ridb_facility_id) for cross-sell
const PRIVATE_CAMPGROUNDS = allCampgrounds
  .filter((c: any) => !c.ridb_facility_id)
  .map((c: any) => ({ name: c.name, slug: c.slug, pricePerNight: c.price_per_night }))

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

export async function GET(req: NextRequest) {
  // Auth: Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const sb = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Load all active alerts
  const { data: alerts, error: alertsErr } = await sb
    .from('availability_alerts')
    .select('*, profiles(email, full_name)')
    .eq('active', true)
    .not('check_in', 'is', null)
    .not('check_out', 'is', null)

  if (alertsErr || !alerts) {
    console.error('[alerts/scan] Failed to load alerts:', alertsErr)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  // Dedupe: one Recreation.gov fetch per unique campground_slug + month combo
  const availabilityCache: Record<string, Record<string, number>> = {}

  async function getAvailableForDate(campgroundSlug: string, dateStr: string): Promise<boolean> {
    // Find ridb_facility_id from data.ts
    const camp = allCampgrounds.find((c: any) => c.slug === campgroundSlug)
    const facilityId = (camp as any)?.ridb_facility_id
    if (!facilityId) return false // private campground — skip

    const monthStr = dateStr.substring(0, 7) + '-01'
    const cacheKey = `${facilityId}::${monthStr}`

    if (!availabilityCache[cacheKey]) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL || 'https://camperwatch.org'}/api/availability?facilityId=${facilityId}&month=${monthStr}`,
          { next: { revalidate: 0 } }
        )
        if (!res.ok) { availabilityCache[cacheKey] = {}; return false }
        const json = await res.json()
        availabilityCache[cacheKey] = json.dailyAvailable || {}
      } catch {
        availabilityCache[cacheKey] = {}
        return false
      }
    }

    // Check if any date in the range check_in → check_out has availability
    return (availabilityCache[cacheKey][dateStr] ?? 0) > 0
  }

  const results = { checked: 0, notified: 0, skipped: 0, errors: 0 }

  for (const alert of alerts) {
    results.checked++

    // Rate limit: skip if notified in last 24h
    if (alert.notified_at) {
      const lastNotified = new Date(alert.notified_at).getTime()
      if (Date.now() - lastNotified < TWENTY_FOUR_HOURS_MS) {
        results.skipped++
        continue
      }
    }

    // Check each date in range for availability
    let hasAvailability = false
    try {
      const start = new Date(alert.check_in)
      const end = new Date(alert.check_out)
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        if (await getAvailableForDate(alert.campground_slug, dateStr)) {
          hasAvailability = true
          break
        }
      }
    } catch {
      results.errors++
      continue
    }

    if (!hasAvailability) {
      results.skipped++
      continue
    }

    // Get user email
    const userEmail = (alert.profiles as any)?.email
    const userName = (alert.profiles as any)?.full_name || 'Camper'
    if (!userEmail) { results.skipped++; continue }

    // Find campground name + Recreation.gov URL
    const camp = allCampgrounds.find((c: any) => c.slug === alert.campground_slug)
    const campgroundName = (camp as any)?.name || alert.campground_slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const recreationGovUrl = (camp as any)?.booking_url || 'https://www.recreation.gov'

    // Pick 3 random private campgrounds for cross-sell
    const shuffled = [...PRIVATE_CAMPGROUNDS].sort(() => Math.random() - 0.5)
    const nearbyPrivate = shuffled.slice(0, 3)

    const tpl = availabilityAlertEmail({
      campgroundName,
      campgroundSlug: alert.campground_slug,
      checkIn: alert.check_in,
      checkOut: alert.check_out,
      recreationGovUrl,
      nearbyPrivate,
    })

    const result = await sendEmail({
      to: userEmail,
      from: SENDERS.alerts,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      templateKey: 'availability_alert',
      relatedEntityType: 'availability_alert',
      relatedEntityId: alert.id,
    })

    if (result.ok) {
      // Update notified_at
      await sb
        .from('availability_alerts')
        .update({ notified_at: new Date().toISOString() })
        .eq('id', alert.id)
      results.notified++
    } else {
      results.errors++
    }
  }

  console.log('[alerts/scan] done:', results)
  return NextResponse.json({ ok: true, ...results })
}
