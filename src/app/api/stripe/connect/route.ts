/**
 * POST /api/stripe/connect
 *
 * Starts Stripe Connect Express onboarding for an owner.
 * 1. Creates a Stripe Connect Express account (or retrieves existing)
 * 2. Saves stripe_account_id to owner_profiles
 * 3. Returns an account link URL for the owner to complete KYC
 *
 * Body: { returnUrl: string }
 * Auth: Bearer token (owner session)
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
  })
}

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // Auth: verify owner session
  const auth = req.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const anonSb = createClient(supabaseUrl, anonKey)
  const { data: { user }, error: userErr } = await anonSb.auth.getUser(token)
  if (userErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { returnUrl?: string }
  try { body = await req.json() } catch { body = {} }
  const returnUrl = body.returnUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://camperwatch.org'}/owner-dashboard`

  const sb = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Load existing profile
  const { data: profile } = await sb
    .from('owner_profiles')
    .select('stripe_account_id, email, full_name')
    .eq('id', user.id)
    .maybeSingle()

  let accountId = profile?.stripe_account_id

  // Create Connect account if not exists
  if (!accountId) {
    const account = await getStripe().accounts.create({
      type: 'express',
      email: profile?.email || user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: { camperwatch_owner_id: user.id },
    })
    accountId = account.id

    // Save to profile
    await sb
      .from('owner_profiles')
      .upsert({ id: user.id, stripe_account_id: accountId }, { onConflict: 'id' })
  }

  // Create account link for onboarding
  const accountLink = await getStripe().accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://camperwatch.org'}/owner-dashboard?stripe=refresh`,
    return_url: returnUrl,
    type: 'account_onboarding',
  })

  return NextResponse.json({ url: accountLink.url, accountId })
}
