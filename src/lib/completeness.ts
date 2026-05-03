/**
 * 1.7.7 — Listing completeness score
 *
 * Scores how complete a site's listing is. Owners see this on the dashboard
 * with concrete next steps ("Add 2 more photos to reach Pro").
 *
 * Weights are deliberate:
 *  - Photos and description are the biggest conversion drivers.
 *  - Amenities help filterability.
 *  - Welcome message and pet policy are nice-to-haves.
 *  - Rules/inheritance overrides DON'T penalize — inherited is a valid state.
 */

import type { ResolvedSite } from './resolvedSite'

export type CompletenessCheck = {
  key: string
  label: string
  weight: number
  done: boolean
  hint: string
}

export type CompletenessResult = {
  /** 0–100 */
  score: number
  /** Same checks for rendering a list */
  checks: CompletenessCheck[]
  /** The next 1-3 most impactful uncompleted items */
  topMissing: CompletenessCheck[]
  /** Tier label for quick UI summary */
  tier: 'Incomplete' | 'Basic' | 'Good' | 'Excellent'
}

/**
 * Score a single site. Pass either a raw row or a ResolvedSite — only fields
 * that exist on both (raw site fields, NOT inherited parent fields) are checked.
 */
export function scoreSiteCompleteness(site: any | ResolvedSite): CompletenessResult {
  const images: string[] = Array.isArray(site.images) ? site.images : []
  const amenities: string[] = Array.isArray(site.amenities) ? site.amenities : []
  const description: string = site.description || ''
  const welcome: string = site.welcome_message || ''
  const houseRules: string = site.house_rules || ''
  const petPolicy: string = site.pet_policy || ''
  const seoKeywords: string[] = Array.isArray(site.seo_keywords) ? site.seo_keywords : []

  const checks: CompletenessCheck[] = [
    {
      key: 'photos_3plus',
      label: 'Add at least 3 photos',
      weight: 25,
      done: images.length >= 3,
      hint: images.length === 0
        ? 'Sites with photos get booked 3× more often than sites without.'
        : `You have ${images.length} photo${images.length === 1 ? '' : 's'}. Add ${3 - images.length} more.`,
    },
    {
      key: 'photos_5plus',
      label: 'Add 5+ photos for best results',
      weight: 10,
      done: images.length >= 5,
      hint: 'Listings with 5+ photos rank higher in search.',
    },
    {
      key: 'description',
      label: 'Write a description (50+ characters)',
      weight: 15,
      done: description.trim().length >= 50,
      hint: 'Tell campers what makes this specific site special. Try the AI assist.',
    },
    {
      key: 'amenities_3plus',
      label: 'Tag at least 3 amenities',
      weight: 15,
      done: amenities.length >= 3,
      hint: `You have ${amenities.length} amenit${amenities.length === 1 ? 'y' : 'ies'} tagged. Add at least 3 so search filters find this site.`,
    },
    {
      key: 'welcome_message',
      label: 'Add a guest welcome message',
      weight: 10,
      done: welcome.trim().length >= 30,
      hint: 'Sent in the booking confirmation email. Include arrival instructions and a gate code if relevant.',
    },
    {
      key: 'house_rules',
      label: 'Set house rules',
      weight: 8,
      done: houseRules.trim().length >= 20,
      hint: 'Quiet hours, fire restrictions, vehicle limits.',
    },
    {
      key: 'pet_policy',
      label: 'Set pet policy',
      weight: 7,
      done: petPolicy.trim().length >= 10,
      hint: 'Even "no pets" is helpful — set expectations.',
    },
    {
      key: 'seo_keywords',
      label: 'Add 3+ SEO keywords',
      weight: 10,
      done: seoKeywords.length >= 3,
      hint: 'Helps your listing show up in search. Try: lakefront, pet-friendly, full-hookup.',
    },
  ]

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0)
  const earned = checks.filter(c => c.done).reduce((s, c) => s + c.weight, 0)
  const score = Math.round((earned / totalWeight) * 100)

  // Top missing = uncompleted checks sorted by weight desc, take 3
  const topMissing = checks
    .filter(c => !c.done)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)

  let tier: CompletenessResult['tier'] = 'Incomplete'
  if (score >= 90) tier = 'Excellent'
  else if (score >= 70) tier = 'Good'
  else if (score >= 40) tier = 'Basic'

  return { score, checks, topMissing, tier }
}

/**
 * Score multiple sites and return aggregate stats for a dashboard widget.
 */
export function aggregateCompleteness(sites: any[]): {
  averageScore: number
  totalSites: number
  excellentCount: number
  needsWorkCount: number
} {
  if (sites.length === 0) return { averageScore: 0, totalSites: 0, excellentCount: 0, needsWorkCount: 0 }
  const scores = sites.map(s => scoreSiteCompleteness(s))
  const sum = scores.reduce((s, r) => s + r.score, 0)
  return {
    averageScore: Math.round(sum / sites.length),
    totalSites: sites.length,
    excellentCount: scores.filter(r => r.tier === 'Excellent').length,
    needsWorkCount: scores.filter(r => r.score < 70).length,
  }
}
