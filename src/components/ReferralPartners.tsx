'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { campgrounds as allCampgrounds } from '@/lib/data'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Props {
  campgroundSlug: string
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
    async function load() {
      // Find owners of this campground
      const { data: ownerLinks } = await supabase
        .from('campground_owners')
        .select('owner_id')
        .eq('campground_slug', campgroundSlug)
        .eq('active', true)

      if (!ownerLinks?.length) return

      const ownerIds = ownerLinks.map((r: any) => r.owner_id)

      // Find their enabled referral partners
      const { data: refs } = await supabase
        .from('owner_referral_partners')
        .select('partner_campground_slug')
        .in('owner_id', ownerIds)
        .eq('enabled', true)

      const slugs = [...new Set((refs || []).map((r: any) => r.partner_campground_slug))]
      setPartners(slugs.slice(0, 3))
    }
    load()
  }, [campgroundSlug])

  if (partners.length === 0) return null

  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
      <div className="text-xs font-semibold text-amber-800 mb-3 uppercase tracking-wide">
        Nearby alternatives with availability
      </div>
      <div className="space-y-2">
        {partners.map(slug => {
          const price = campPrice(slug)
          return (
            <Link
              key={slug}
              href={`/campground/${slug}`}
              className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 hover:bg-amber-50 transition-colors border border-amber-100"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">{campName(slug)}</div>
                {price && <div className="text-xs text-gray-500">from ${price}/night</div>}
              </div>
              <ArrowRight size={14} className="text-amber-600 shrink-0" />
            </Link>
          )
        })}
      </div>
      <p className="text-xs text-amber-600 mt-2">Recommended by the host — book directly, no fees.</p>
    </div>
  )
}
