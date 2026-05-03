/**
 * 1.7.2 — Resolved site helper
 *
 * Returns site data with parent-campground fallbacks applied for inheritable fields.
 * Pattern: site.cancellation_policy_override IS NULL ? campground.cancellation_policy : site.cancellation_policy_override
 *
 * This keeps inheritance logic in ONE place. UI and APIs read from here.
 */

import { getSupabase } from './supabase'
import { campgrounds as campgroundData } from './data'

export type ResolvedSite = {
  // raw site fields
  id: string
  campground_slug: string
  name: string
  site_type: string
  max_guests: number | null
  max_rig_length: number | null
  price_per_night: number
  weekend_price: number | null
  amenities: string[] | null
  images: string[] | null
  description: string | null
  active: boolean
  bookings_enabled: boolean
  // intelligence fields
  house_rules: string | null
  pet_policy: string | null
  welcome_message: string | null
  seo_keywords: string[] | null
  // resolved (with parent fallback applied)
  cancellation_policy: string | null
  check_in: string | null
  check_out: string | null
  // raw override values — useful for the editor UI to know "is this overridden?"
  cancellation_policy_override: string | null
  check_in_override: string | null
  check_out_override: string | null
  // parent campground name & images (for fallback display)
  parent: {
    name: string
    images: string[]
    cancellation_policy: string | null
    check_in: string | null
    check_out: string | null
  }
}

/**
 * Read a site by id and resolve inheritance from its parent campground.
 * Returns null if the site doesn't exist.
 */
export async function getResolvedSite(siteId: string): Promise<ResolvedSite | null> {
  const sb = getSupabase()
  const { data: site, error } = await sb
    .from('campground_sites')
    .select('*')
    .eq('id', siteId)
    .maybeSingle()

  if (error || !site) return null

  return resolveSite(site as any)
}

/**
 * Same as getResolvedSite but accepts a raw site row (skips the DB read).
 * Use this when you already have the row from a list query.
 */
export function resolveSite(site: any): ResolvedSite {
  // Parent campground comes from data.ts (build-time source of truth) — see skill
  const parent = campgroundData.find((c: any) => c.slug === site.campground_slug)

  const parentName = parent?.name || site.campground_slug
  const parentImages = (parent?.images || []).map((img: any) =>
    typeof img === 'string' ? img : img?.url
  ).filter(Boolean)
  const parentCancellation = parent?.cancellation_policy || null
  const parentCheckIn = parent?.check_in || null
  const parentCheckOut = parent?.check_out || null

  return {
    id: site.id,
    campground_slug: site.campground_slug,
    name: site.name,
    site_type: site.site_type,
    max_guests: site.max_guests,
    max_rig_length: site.max_rig_length,
    price_per_night: site.price_per_night,
    weekend_price: site.weekend_price,
    amenities: site.amenities,
    images: site.images,
    description: site.description,
    active: site.active,
    bookings_enabled: site.bookings_enabled,
    house_rules: site.house_rules,
    pet_policy: site.pet_policy,
    welcome_message: site.welcome_message,
    seo_keywords: site.seo_keywords,
    // Apply inheritance
    cancellation_policy: site.cancellation_policy_override ?? parentCancellation,
    check_in: site.check_in_override ?? parentCheckIn,
    check_out: site.check_out_override ?? parentCheckOut,
    // Raw overrides for the editor UI
    cancellation_policy_override: site.cancellation_policy_override,
    check_in_override: site.check_in_override,
    check_out_override: site.check_out_override,
    parent: {
      name: parentName,
      images: parentImages,
      cancellation_policy: parentCancellation,
      check_in: parentCheckIn,
      check_out: parentCheckOut,
    },
  }
}

/**
 * Get the inheritance status of a field — useful for the editor toggle UI.
 * Returns 'inherited' | 'overridden' so the UI can show the right state.
 */
export function getFieldStatus(
  override: string | null | undefined
): 'inherited' | 'overridden' {
  return override === null || override === undefined || override === '' ? 'inherited' : 'overridden'
}
