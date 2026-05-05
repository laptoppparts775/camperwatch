/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe webhook events.
 * Secured by STRIPE_WEBHOOK_SECRET.
 *
 * Events handled:
 *   payment_intent.succeeded  → create booking row + fire confirmation emails
 *   account.updated           → update owner_profiles.verified when KYC complete
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

function generateBookingRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'CW-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('[webhook] Signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const sb = getServiceClient()

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const meta = pi.metadata

    if (!meta.site_id || !meta.campground_slug) {
      console.log('[webhook] Skipping PI — no campground metadata')
      return NextResponse.json({ ok: true })
    }

    const totalPrice = pi.amount / 100
    const commissionAmount = (pi.application_fee_amount || 0) / 100
    const ownerPayout = totalPrice - commissionAmount
    const bookingRef = generateBookingRef()

    // Create booking
    const { data: booking, error: bookingErr } = await sb
      .from('bookings')
      .insert({
        booking_ref: bookingRef,
        site_id: meta.site_id,
        campground_slug: meta.campground_slug,
        guest_id: meta.guest_id,
        guest_name: meta.guest_name,
        guest_email: meta.guest_email,
        guest_phone: meta.guest_phone || null,
        check_in: meta.check_in,
        check_out: meta.check_out,
        num_guests: parseInt(meta.guests || '1'),
        nights: parseInt(meta.nights || '1'),
        total_price: totalPrice,
        commission_amount: commissionAmount,
        owner_payout: ownerPayout,
        status: 'confirmed',
        stripe_payment_intent_id: pi.id,
        special_requests: meta.special_requests || null,
      })
      .select('booking_ref')
      .single()

    if (bookingErr) {
      console.error('[webhook] Failed to create booking:', bookingErr)
      return NextResponse.json({ error: 'Booking creation failed' }, { status: 500 })
    }

    // Block dates in site_availability
    const nights = parseInt(meta.nights || '1')
    const blocked: { site_id: string; blocked_date: string; reason: string }[] = []
    for (let i = 0; i < nights; i++) {
      const d = new Date(meta.check_in)
      d.setDate(d.getDate() + i)
      blocked.push({ site_id: meta.site_id, blocked_date: d.toISOString().split('T')[0], reason: 'booked' })
    }
    await sb.from('site_availability').upsert(blocked as any, { onConflict: 'site_id,blocked_date' })

    // Fire confirmation emails (best-effort)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://camperwatch.org'
    fetch(`${siteUrl}/api/bookings/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingRef }),
    }).catch(() => {})

    console.log(`[webhook] Booking created: ${bookingRef}`)
  }

  if (event.type === 'account.updated') {
    const account = event.data.object as Stripe.Account
    const ownerId = account.metadata?.camperwatch_owner_id
    if (ownerId) {
      const isVerified =
        account.charges_enabled &&
        account.payouts_enabled &&
        account.details_submitted

      await sb
        .from('owner_profiles')
        .update({ verified: isVerified })
        .eq('stripe_account_id', account.id)

      console.log(`[webhook] Owner ${ownerId} verified: ${isVerified}`)
    }
  }

  return NextResponse.json({ ok: true })
}
