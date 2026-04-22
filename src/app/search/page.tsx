'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { campgrounds, Campground } from '@/lib/data'
import { Search, MapPin, SlidersHorizontal, Star, ExternalLink, TreePine, ChevronLeft } from 'lucide-react'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [results, setResults] = useState<Campground[]>(campgrounds)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'map'>('list')
  const [filters, setFilters] = useState({
    siteType: searchParams.get('siteType') || 'all',
    state: searchParams.get('state') || 'all',
    maxPrice: 200,
    availableOnly: false,
    petFriendly: false,
  })

  useEffect(() => {
    let filtered = [...campgrounds]

    if (filters.state !== 'all') {
      filtered = filtered.filter(c => c.state === filters.state)
    }
    if (filters.siteType !== 'all') {
      filtered = filtered.filter(c => c.site_types.includes(filters.siteType))
    }
    if (filters.maxPrice < 200) {
      filtered = filtered.filter(c => c.price_per_night <= filters.maxPrice)
    }
    if (filters.availableOnly) {
      filtered = filtered.filter(c => c.available)
    }
    if (filters.petFriendly) {
      filtered = filtered.filter(c => c.amenities.includes('Pet Friendly'))
    }

    setResults(filtered)
  }, [filters])

  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm">
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2">
            <TreePine size={20} className="text-green-700" />
            <span className="font-display font-semibold text-gray-900">CamperWatch</span>
          </div>
          <div className="flex-1 hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 max-w-md">
            <Search size={14} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              Lake Tahoe
              {checkIn && checkOut ? ` · ${checkIn} → ${checkOut}` : ''}
            </span>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              List
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'map' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Map
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Filters Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal size={16} className="text-green-700" />
              <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>

            {/* State */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">State</label>
              <select
                value={filters.state}
                onChange={e => setFilters(f => ({ ...f, state: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700"
              >
                <option value="all">All States</option>
                <option value="CA">California</option>
                <option value="NV">Nevada</option>
                <option value="UT">Utah</option>
                <option value="WY">Wyoming</option>
                <option value="CO">Colorado</option>
                <option value="WA">Washington</option>
                <option value="OR">Oregon</option>
                <option value="MT">Montana</option>
                <option value="AZ">Arizona</option>
              </select>
            </div>

            {/* Site Type */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Site Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['all', 'RV', 'Tent', 'Cabin'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilters(f => ({ ...f, siteType: type }))}
                    className={`py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      filters.siteType === type
                        ? 'bg-green-700 text-white border-green-700'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                    }`}
                  >
                    {type === 'all' ? 'All' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Max Price: ${filters.maxPrice === 200 ? 'Any' : filters.maxPrice + '/night'}
              </label>
              <input
                type="range"
                min={20}
                max={200}
                step={5}
                value={filters.maxPrice}
                onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                className="w-full accent-green-700"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$20</span>
                <span>$200+</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              {[
                { key: 'availableOnly', label: 'Available only' },
                { key: 'petFriendly', label: 'Pet friendly' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setFilters(f => ({ ...f, [key]: !f[key as keyof typeof f] }))}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      filters[key as keyof typeof filters] ? 'bg-green-700' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      filters[key as keyof typeof filters] ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </div>
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{results.length}</span> campgrounds found
            </p>
          </div>

          {view === 'list' ? (
            <div className="space-y-4">
              {results.map((camp, i) => (
                <CampgroundCard key={camp.id} camp={camp} priority={i === 0} />
              ))}
              {results.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <TreePine size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="font-semibold text-gray-600">No campgrounds match your filters</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[600px] rounded-2xl overflow-hidden border border-gray-100">
              <MapView
                campgrounds={results}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CampgroundCard({ camp, priority = false }: { camp: Campground, priority?: boolean }) {
  const router = useRouter()

  return (
    <div
      className="campground-card cursor-pointer flex flex-col md:flex-row"
      onClick={() => router.push(`/campground/${camp.slug}`)}
    >
      {/* Image */}
      <div className="md:w-64 h-48 md:h-auto flex-shrink-0 overflow-hidden">
        <img
          src={(camp.images as any)[0]?.url || (camp.images as any)[0]}
          alt={camp.name}
          width={256} height={192}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'low'}
          decoding={priority ? 'sync' : 'async'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{camp.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={12} />
              <span>{camp.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${camp.price_per_night}</div>
            <div className="text-xs text-gray-400">per night</div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{camp.description}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {camp.amenities.slice(0, 4).map(a => (
            <span key={a} className="badge-blue text-xs">{a}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold">{camp.rating}</span>
              <span className="text-xs text-gray-400">({camp.review_count})</span>
            </div>
            <span className={camp.available ? 'badge-green' : 'badge-red'}>
              {camp.available ? 'Available' : 'Fully Booked'}
            </span>
          </div>
          <div className="flex gap-2">
            <a
              href={camp.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              Book Now <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}
