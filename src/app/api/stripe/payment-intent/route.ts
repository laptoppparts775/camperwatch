/**
 * POST /api/stripe/payment-intent
 *
 * Creates a Stripe PaymentIntent for a campground booking.
 * - Charges the camper the full amount
 * - Takes 5% as CamperWatch application fee
 * - Transfers the remaining 95% to the owner's Stripe Connect account
 *
 * Body: { siteId, campgroundSlug, checkIn, checkOut, guests, guestName, guestEmail, guestPhone?, specialRequests? }
 * Auth: Bearer token (camper session)
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
  })
}

const COMMISSION_RATE = 0.05 // 5%

function calcNights(checkIn: string, checkOut: string): number {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // Auth
  const auth = req.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const anonSb = createClient(supabaseUrl, anonKey)
  const { data: { user }, error: userErr } = await anonSb.auth.getUser(token)
  if (userErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { siteId, campgroundSlug, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, specialRequests } = body
  if (!siteId || !campgroundSlug || !checkIn || !checkOut || !guestName || !guestEmail) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const sb = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Load site pricing
  const { data: site } = await sb
    .from('campground_sites')
    .select('price_per_night, weekend_price, name, campground_slug')
    .eq('id', siteId)
    .eq('active', true)
    .maybeSingle()

  if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 })

  // Calculate total
  const nights = calcNights(checkIn, checkOut)
  if (nights <= 0) return NextResponse.json({ error: 'Invalid dates' }, { status: 400 })

  let total = 0
  for (let i = 0; i < nights; i++) {
    const d = new Date(checkIn)
    d.setDate(d.getDate() + i)
    const day = d.getDay()
    const isWeekend = day === 5 || day === 6
    total += (isWeekend && site.weekend_price) ? site.weekend_price : site.price_per_night
  }

  const totalCents = Math.round(total * 100)
  const feeCents = Math.round(totalCents * COMMISSION_RATE)

  // Find owner's Stripe account
  const { data: ownerLink } = await sb
    .from('campground_owners')
    .select('owner_id')
    .eq('campground_slug', campgroundSlug)
    .eq('active', true)
    .maybeSingle()

  if (!ownerLink) return NextResponse.json({ error: 'No owner for campground' }, { status: 404 })

  const { data: ownerProfile } = await sb
    .from('owner_profiles')
    .select('stripe_account_id, verified')
    .eq('id', ownerLink.owner_id)
    .maybeSingle()

  if (!ownerProfile?.stripe_account_id) {
    return NextResponse.json({ error: 'Owner has not connected Stripe' }, { status: 402 })
  }

  // Create PaymentIntent
  const paymentIntent = await getStripe().paymentIntents.create({
    amount: totalCents,
    currency: 'usd',
    application_fee_amount: feeCents,
    transfer_data: {
      destination: ownerProfile.stripe_account_id,
    },
    metadata: {
      site_id: siteId,
      campground_slug: campgroundSlug,
      check_in: checkIn,
      check_out: checkOut,
      guest_id: user.id,
      guest_name: guestName,
      guest_email: guestEmail,
      guests: String(guests),
      nights: String(nights),
    },
    receipt_email: guestEmail,
    description: `CamperWatch: ${site.name} · ${checkIn} → ${checkOut}`,
  })

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    totalCents,
    feeCents,
    ownerPayoutCents: totalCents - feeCents,
    nights,
  })
}
