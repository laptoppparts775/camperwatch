'use client'
import { useState } from 'react'
import { Review } from '@/lib/reviews'
import { Star, ThumbsUp, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

const SOURCE_COLORS: Record<string, string> = {
  Google: 'bg-blue-50 text-blue-700',
  Yelp: 'bg-red-50 text-red-700',
  Tripadvisor: 'bg-green-50 text-green-700',
  Reddit: 'bg-orange-50 text-orange-700',
  Campendium: 'bg-purple-50 text-purple-700',
  'The Dyrt': 'bg-teal-50 text-teal-700',
  KOA: 'bg-yellow-50 text-yellow-800',
  'Recreation.gov': 'bg-blue-50 text-blue-800',
  RVLife: 'bg-indigo-50 text-indigo-700',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

export default function ReviewsSection({ campgroundId, reviews, sentiment }: {
  campgroundId: string
  reviews: Review[]
  sentiment: number
}) {
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'mixed'>('all')
  const [showAll, setShowAll] = useState(false)

  const filtered = reviews.filter(r => filter === 'all' || r.type === filter)
  const displayed = showAll ? filtered : filtered.slice(0, 4)

  const pos = reviews.filter(r => r.type === 'positive').length
  const neg = reviews.filter(r => r.type === 'negative').length
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center gap-4 mb-4 p-4 bg-white rounded-xl border border-gray-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{avg.toFixed(1)}</div>
          <Stars rating={Math.round(avg)} />
          <div className="text-xs text-gray-400 mt-0.5">{reviews.length} reviews</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-green-700 font-medium w-16">Positive</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(pos/reviews.length)*100}%` }} />
            </div>
            <span className="text-xs text-gray-500 w-6">{pos}</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-yellow-700 font-medium w-16">Mixed</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${((reviews.length-pos-neg)/reviews.length)*100}%` }} />
            </div>
            <span className="text-xs text-gray-500 w-6">{reviews.length-pos-neg}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-700 font-medium w-16">Critical</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-400 rounded-full" style={{ width: `${(neg/reviews.length)*100}%` }} />
            </div>
            <span className="text-xs text-gray-500 w-6">{neg}</span>
          </div>
        </div>
        <div className="text-center hidden md:block">
          <div className={`text-2xl font-bold ${sentiment >= 75 ? 'text-green-600' : sentiment >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
            {sentiment}%
          </div>
          <div className="text-xs text-gray-400">positive sentiment</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'positive', 'mixed', 'negative'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
            {f === 'all' ? `All (${reviews.length})` : f === 'positive' ? `✓ Positive (${pos})` : f === 'negative' ? `✗ Critical (${neg})` : `~ Mixed (${reviews.length-pos-neg})`}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-3">
        {displayed.map(review => (
          <div key={review.id} className={`bg-white rounded-xl border p-4 ${review.type === 'positive' ? 'border-green-100' : review.type === 'negative' ? 'border-red-100' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between mb-2 gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-gray-900">{review.author}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SOURCE_COLORS[review.source] || 'bg-gray-50 text-gray-600'}`}>{review.source}</span>
                  {review.verified && <span className="text-xs text-green-600 font-medium">✓ Verified</span>}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Stars rating={review.rating} />
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
              </div>
              {review.helpful && (
                <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                  <ThumbsUp size={11} /> {review.helpful} found helpful
                </div>
              )}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>

      {filtered.length > 4 && (
        <button onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          {showAll ? <><ChevronUp size={15}/> Show less</> : <><ChevronDown size={15}/> Show all {filtered.length} reviews</>}
        </button>
      )}

      <p className="text-xs text-gray-400 mt-3 text-center">Reviews sourced from Yelp, Google, Tripadvisor, Reddit, Campendium, The Dyrt, and KOA — paraphrased. All opinions belong to original authors.</p>
    </div>
  )
}
