/**
 * Dynamic llms.txt — auto-generated from campgrounds data.
 * Every new campground added to data.ts automatically appears here.
 * Served at /llms.txt (Next.js intercepts before the static public/ file).
 *
 * Robots.txt already points to sitemap.xml for Googlebot; llms.txt is for
 * AI crawlers and is explicitly allowed for GPTBot, ClaudeBot, PerplexityBot, etc.
 */

import { campgrounds } from '@/lib/data'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 3600 // re-generate at most once per hour

export async function GET() {
  const base = 'https://camperwatch.org'

  // Group campgrounds by region for better LLM readability
  const tahoeReno = campgrounds.filter(c =>
    ['CA', 'NV'].includes((c as any).state || '') &&
    !['watchman-campground', 'colter-bay-grand-teton', 'madison-yellowstone', 'moraine-park-rmnp',
      'upper-pines-yosemite', 'sol-duc-olympic', 'apgar-glacier', 'mather-grand-canyon',
      'cape-lookout-oregon', 'pfeiffer-big-sur', 'rubys-inn-bryce'].includes(c.slug)
  )
  const nationalParks = campgrounds.filter(c =>
    ['watchman-campground', 'colter-bay-grand-teton', 'madison-yellowstone', 'moraine-park-rmnp',
     'upper-pines-yosemite', 'sol-duc-olympic', 'apgar-glacier', 'mather-grand-canyon'].includes(c.slug)
  )
  const stateOther = campgrounds.filter(c =>
    ['cape-lookout-oregon', 'pfeiffer-big-sur', 'rubys-inn-bryce'].includes(c.slug)
  )

  const formatEntry = (c: typeof campgrounds[number]) =>
    `- [${c.name}](${base}/campground/${c.slug}) — ${c.location} — ${c.description?.slice(0, 80)}...`

  const body = `# CamperWatch

> CamperWatch is a national campground intelligence directory for the United States. It provides verified campground data, insider booking strategies, loop-by-loop site guides, and community-sourced tips for federal, state, and private campgrounds.

CamperWatch covers ${campgrounds.length} campgrounds across the US with verified pricing, amenities, site-type breakdowns, known issues, real camper reviews, and direct booking links. Federal campground data is enriched with live data from the Recreation Information Database (RIDB) via the Recreation.gov API.

## What CamperWatch Provides

- Verified campground data: pricing, amenities, site types, hookups, max RV length, elevation, season
- Insider booking strategies: exact times to book, which sites/loops to request, cancellation tips
- Site-by-site guides: best sites by number, loop character, what to avoid
- Real community reviews sourced from Google, Yelp, Tripadvisor, Reddit, The Dyrt, Campendium, Recreation.gov
- Live facility data from Recreation.gov RIDB for federal campgrounds (NPS, USFS)
- Campaign intelligence: sentiment analysis, target audience, top positives/negatives per campground

## Campground Directory

### Lake Tahoe / Nevada / California
${tahoeReno.map(formatEntry).join('\n')}

### National Parks
${nationalParks.map(formatEntry).join('\n')}

### State Parks & Other
${stateOther.map(formatEntry).join('\n')}

## Key Pages

- [Search All Campgrounds](${base}/search) — Filter by state, site type, price, pet-friendly
- [Community Feed](${base}/community) — Camper posts, tips, and trip reports
- [Add Your Campground](${base}/add-campsite) — Owner portal for campground submissions
- [Contact CamperWatch](${base}/contact) — Questions, corrections, partnerships

## Data Sources

Federal campground data is sourced from the Recreation Information Database (RIDB) — the official federal recreation database maintained by Recreation.gov and 12 participating federal agencies (NPS, USFS, BLM, USBR, FWS, USACE, TVA, NARA, BOR, DOD, NPS, USDA). Community reviews are paraphrased from public sources including Google Reviews, Yelp, Tripadvisor, Reddit, The Dyrt, and Campendium.
`

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
