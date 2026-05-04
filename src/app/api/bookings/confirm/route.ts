/**
 * POST /api/bookings/confirm
 *
 * Called by the booking page immediately after a booking row is inserted.
 * Fetches full booking + owner details from Supabase (service role),
 * then fires two emails in parallel:
 *   1. Booking confirmation → camper
 *   2. New booking notification → owner
 *
 * Best-effort: email failures are logged but never block the booking.
 * Body: { bookingRef: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'
import { bookingConfirmationCamper, bookingConfirmationOwner } from '@/lib/emailTemplates'
import { SENDERS } from '@/lib/emailConfig'

export async function POST(req: NextRequest) {
  let body: { bookingRef?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const bookingRef = body?.bookingRef?.trim()
  if (!bookingRef) {
    return NextResponse.json({ error: 'bookingRef required' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    console.error('[confirm] Supabase env missing')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const sb = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Fetch booking + site name in one query
  const { data: booking, error: bookingErr } = await sb
    .from('bookings')
    .select('*, campground_sites(name)')
    .eq('booking_ref', bookingRef)
    .maybeSingle()

  if (bookingErr || !booking) {
    console.error('[confirm] booking not found:', bookingRef, bookingErr)
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Fetch owner profile for the campground
  const { data: ownerLink } = await sb
    .from('campground_owners')
    .select('owner_id')
    .eq('campground_slug', booking.campground_slug)
    .eq('active', true)
    .maybeSingle()

  let ownerName: string | undefined
  let ownerEmail: string | undefined

  if (ownerLink?.owner_id) {
    const { data: ownerProfile } = await sb
      .from('owner_profiles')
      .select('full_name, email, payout_email')
      .eq('id', ownerLink.owner_id)
      .maybeSingle()

    if (ownerProfile) {
      ownerName = ownerProfile.full_name || undefined
      ownerEmail = ownerProfile.email || ownerProfile.payout_email || undefined
    }
  }

  // Find campground name from static data isn't available server-side,
  // so use the slug formatted nicely as fallback
  const campgroundName = booking.campground_slug
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const siteName = (booking.campground_sites as any)?.name || 'Your site'

  const input = {
    bookingRef: booking.booking_ref,
    campgroundName,
    campgroundSlug: booking.campground_slug,
    siteName,
    checkIn: booking.check_in,
    checkOut: booking.check_out,
    guests: booking.num_guests,
    totalPrice: booking.total_price,
    guestName: booking.guest_name,
    ownerName,
    ownerEmail,
    guestEmail: booking.guest_email,
    guestPhone: booking.guest_phone || undefined,
    specialRequests: booking.special_requests || undefined,
  }

  // Fire both emails in parallel — failures are logged inside sendEmail, never throw
  const [camperResult, ownerResult] = await Promise.all([
    sendEmail({
      to: booking.guest_email,
      from: SENDERS.bookings,
      replyTo: ownerEmail,
      subject: bookingConfirmationCamper(input).subject,
      html: bookingConfirmationCamper(input).html,
      text: bookingConfirmationCamper(input).text,
      templateKey: 'booking_confirmation_camper',
      relatedEntityType: 'booking',
      relatedEntityId: booking.id,
    }),
    ownerEmail
      ? sendEmail({
          to: ownerEmail,
          from: SENDERS.bookings,
          replyTo: booking.guest_email,
          subject: bookingConfirmationOwner(input).subject,
          html: bookingConfirmationOwner(input).html,
          text: bookingConfirmationOwner(input).text,
          templateKey: 'booking_confirmation_owner',
          relatedEntityType: 'booking',
          relatedEntityId: booking.id,
        })
      : Promise.resolve({ ok: false, error: 'no owner email' } as const),
  ])

  return NextResponse.json({
    ok: true,
    camper: camperResult.ok,
    owner: ownerResult.ok,
  })
}
