'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { campgrounds as allCampgrounds } from '@/lib/data'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Props {
  campgroundSlug: string
}

// Pyramid Lake Paiute Tribe — all 3 properties cross-sell each other
const PLPT_SLUGS = ['pyramid-lake-marina', 'big-bend-rv-park', 'i80-smokeshop-campground']

const PLPT_TAGLINES: Record<string, string> = {
  'pyramid-lake-marina': 'Full hookups on Nevada\u2019s most spectacular lake',
  'big-bend-rv-park': 'Shady paved sites on the Truckee River',
  'i80-smokeshop-campground': 'Permits, fireworks & easy I-80 access',
}

function campName(slug: string) {
  return (allCampgrounds as any[]).find(c => c.slug === slug)?.name ||
    slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function campPrice(slug: string) {
  return (allCampgrounds as any[]).find(c => c.slug === slug)?.price_per_night
}

export default function ReferralPartners({ campgroundSlug }: Props) {
  const supabase = getSupabase()
  const [partners, setPartners] = useState<string[]>([])

  useEffect(() => {
    // Static PLPT cross-sell — always show other Pyramid Lake Paiute Tribe properties
    const plptSiblings = PLPT_SLUGS.filter(s => s !== campgroundSlug)
    const staticPartners = PLPT_SLUGS.includes(campgroundSlug) ? plptSiblings : []

    async function load() {
      // Also pull DB-configured referral partners from owner accounts
      const { data: ownerLinks } = await supabase
        .from('campground_owners')
        .select('owner_id')
        .eq('campground_slug', campgroundSlug)
        .eq('active', true)

      if (!ownerLinks?.length) {
        setPartners(staticPartners.slice(0, 3))
        return
      }

      const ownerIds = ownerLinks.map((r: any) => r.owner_id)

      const { data: refs } = await supabase
        .from('owner_referral_partners')
        .select('partner_campground_slug')
        .in('owner_id', ownerIds)
        .eq('enabled', true)

      const dbSlugs: string[] = (refs || []).map((r: any) => r.partner_campground_slug as string)

      // Merge static + DB, deduplicate, exclude current page
      const merged = Array.from(new Set([...staticPartners, ...dbSlugs]))
        .filter(s => s !== campgroundSlug)
        .slice(0, 3)

      setPartners(merged)
    }
    load()
  }, [campgroundSlug])

  const isPlpt = PLPT_SLUGS.includes(campgroundSlug)

  if (partners.length === 0) return null

  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
      <div className="text-xs font-semibold text-amber-800 mb-1 uppercase tracking-wide">
        {isPlpt ? 'More parks from this host' : 'Nearby alternatives with availability'}
      </div>
      {isPlpt && (
        <p className="text-xs text-amber-700 mb-3">
          All three parks are operated by the Pyramid Lake Paiute Tribe — book any directly, no middleman fees.
        </p>
      )}
      <div className="space-y-2">
        {partners.map(slug => {
          const price = campPrice(slug)
          const tagline = PLPT_TAGLINES[slug]
          return (
            <Link
              key={slug}
              href={`/campground/${slug}`}
              className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 hover:bg-amber-50 transition-colors border border-amber-100"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">{campName(slug)}</div>
                {tagline && <div className="text-xs text-gray-500">{tagline}</div>}
                {!tagline && price && <div className="text-xs text-gray-500">from ${price}/night</div>}
              </div>
              <ArrowRight size={14} className="text-amber-600 shrink-0" />
            </Link>
          )
        })}
      </div>
      <p className="text-xs text-amber-600 mt-2">
        {isPlpt ? 'Tribal parks — book directly, owner keeps 95%.' : 'Recommended by the host — book directly, no fees.'}
      </p>
    </div>
  )
}
