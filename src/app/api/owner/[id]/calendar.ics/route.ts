/**
 * GET /api/owner/[id]/calendar.ics
 *
 * Generates an iCal (.ics) feed of all confirmed bookings for all sites
 * owned by the given owner. This URL can be pasted into Hipcamp, Airbnb,
 * Campspot etc. to sync CamperWatch bookings out to those platforms.
 *
 * Public URL — no auth required (the owner_id in the URL is the secret).
 * Returns: text/calendar
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function pad(n: number) { return String(n).padStart(2, '0') }

function toICalDate(iso: string): string {
  // YYYY-MM-DD → YYYYMMDD (all-day event format)
  return iso.replace(/-/g, '')
}

function toICalDateTime(date: Date): string {
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    'T',
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    'Z',
  ].join('')
}

function escapeIcal(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ownerId = params.id

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return new NextResponse('Server not configured', { status: 500 })
  }

  const sb = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Get all campground slugs owned by this owner
  const { data: ownerLinks } = await sb
    .from('campground_owners')
    .select('campground_slug')
    .eq('owner_id', ownerId)
    .eq('active', true)

  const slugs = (ownerLinks || []).map((r: any) => r.campground_slug)
  if (slugs.length === 0) {
    return new NextResponse('No campgrounds found', { status: 404 })
  }

  // Fetch all confirmed/pending bookings for those campgrounds
  const { data: bookings } = await sb
    .from('bookings')
    .select('id, booking_ref, campground_slug, check_in, check_out, guest_name, status, campground_sites(name)')
    .in('campground_slug', slugs)
    .in('status', ['confirmed', 'pending'])
    .order('check_in', { ascending: true })

  const now = toICalDateTime(new Date())
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://camperwatch.org'

  const events = (bookings || []).map((b: any) => {
    const siteName = b.campground_sites?.name || b.campground_slug
    const summary = `Booked: ${siteName} (${b.booking_ref})`
    const uid = `${b.id}@camperwatch.org`

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${toICalDate(b.check_in)}`,
      `DTEND;VALUE=DATE:${toICalDate(b.check_out)}`,
      `SUMMARY:${escapeIcal(summary)}`,
      `DESCRIPTION:${escapeIcal(`Guest: ${b.guest_name}\\nRef: ${b.booking_ref}\\nStatus: ${b.status}`)}`,
      `URL:${siteUrl}/owner-dashboard`,
      'END:VEVENT',
    ].join('\r\n')
  })

  const cal = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CamperWatch//CamperWatch Bookings//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:CamperWatch Bookings`,
    `X-WR-CALDESC:Your CamperWatch booking calendar`,
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')

  return new NextResponse(cal, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="camperwatch-bookings.ics"`,
      'Cache-Control': 'no-store',
    },
  })
}
