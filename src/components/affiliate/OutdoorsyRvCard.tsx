'use client'

/**
 * Outdoorsy RV rental affiliate placement.
 *
 * Compensation: $60 per booking (Booking Departed). $50 per RV listing.
 * Tune offer_id=2, aff_id=2914.
 *
 * Placement principles:
 *   - Inline contextual, not banner. Looks like part of the page.
 *   - Honest copy. We disclose it's a partnership.
 *   - Optional `subId` lets us track which page converted (campground slug).
 *   - rel="sponsored noopener noreferrer" per FTC and AvantLink/Tune guidance.
 *
 * Future: when we add Roamly (RV insurance, payout per quote) and other
 * AvantLink merchants, follow the same pattern in this folder.
 */

import { Tent } from 'lucide-react'

const OUTDOORSY_BASE = 'https://outdoorsyinc.go2cloud.org/aff_c?offer_id=2&aff_id=2914'

function buildLink(subId?: string) {
  // aff_sub lets us see in Tune which campground page sent the click
  return subId ? `${OUTDOORSY_BASE}&aff_sub=${encodeURIComponent(subId)}` : OUTDOORSY_BASE
}

interface Props {
  /** Optional sub-id for tracking (usually the campground slug) */
  subId?: string
  /** Optional context — tweaks the copy for tents-only vs RV-friendly campgrounds */
  variant?: 'rv_friendly' | 'general'
  /** Campground name to make copy specific */
  campgroundName?: string
}

export default function OutdoorsyRvCard({ subId, variant = 'general', campgroundName }: Props) {
  const url = buildLink(subId)

  const headline = variant === 'rv_friendly'
    ? 'Need an RV for this trip?'
    : 'Thinking about an RV trip?'

  const body = campgroundName && variant === 'rv_friendly'
    ? `${campgroundName} has full RV hookups but you don't have to own one. Outdoorsy lets you rent from local owners — often cheaper than a hotel for a family of four.`
    : `Renting from a real owner on Outdoorsy is usually cheaper than flights plus hotels for a family of four — and lets you actually camp at the campsite instead of nearby.`

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <Tent size={20} className="text-amber-700" />
        </div>
        <div>
          <div className="font-bold text-amber-900 text-sm mb-1">{headline}</div>
          <p className="text-sm text-amber-800 leading-relaxed">{body}</p>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="block w-full text-center py-2.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors text-sm"
      >
        Browse RV rentals on Outdoorsy →
      </a>
      <p className="text-[10px] text-amber-700 mt-2 text-center opacity-75">
        We earn a small commission if you rent — it costs you nothing extra and helps us keep CamperWatch free.
      </p>
    </div>
  )
}
