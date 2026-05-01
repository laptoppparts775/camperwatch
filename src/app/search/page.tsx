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
      {/* ── DESKTOP header: research mode — logo + search bar + list/map toggle ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm shrink-0">
            <ChevronLeft size={16} /> <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2 shrink-0">
            <TreePine size={20} className="text-green-700" />
            <span className="font-display font-semibold text-gray-900 hidden sm:inline">CamperWatch</span>
          </div>
          {/* Desktop: search context */}
          <div className="flex-1 hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 max-w-md">
            <Search size={14} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              {checkIn && checkOut ? `${checkIn} → ${checkOut}` : 'All campgrounds'}
            </span>
          </div>
          {/* Desktop: list/map toggle */}
          <div className="ml-auto hidden md:flex gap-2">
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'}`}>List</button>
            <button onClick={() => setView('map')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'map' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'}`}>Map</button>
          </div>
          {/* Mobile: result count + map toggle only */}
          <div className="ml-auto flex md:hidden items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">{results.length} found</span>
            <button onClick={() => setView(view === 'list' ? 'map' : 'list')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-700 text-white">
              {view === 'list' ? <><MapPin size={12}/> Map</> : <><Search size={12}/> List</>}
            </button>
          </div>
        </div>

        {/* ── MOBILE quick-filter strip — thumb-friendly, no sidebar needed ── */}
        <div className="md:hidden border-t border-gray-100 px-3 py-2 overflow-x-auto flex gap-2" style={{scrollbarWidth:'none'}}>
          {[
            { key: 'all', label: '🏕 All' },
            { key: 'available', label: '✅ Available' },
            { key: 'Tent', label: '⛺ Tent' },
            { key: 'RV', label: '🚐 RV' },
            { key: 'Cabin', label: '🏠 Cabin' },
            { key: 'pet', label: '🐾 Pet OK' },
          ].map(f => (
            <button key={f.key}
              onClick={() => {
                if (f.key === 'available') setFilters(prev => ({...prev, availableOnly: !prev.availableOnly}))
                else if (f.key === 'pet') setFilters(prev => ({...prev, petFriendly: !prev.petFriendly}))
                else setFilters(prev => ({...prev, siteType: f.key}))
              }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                (f.key === 'available' && filters.availableOnly) ||
                (f.key === 'pet' && filters.petFriendly) ||
                (f.key !== 'available' && f.key !== 'pet' && filters.siteType === f.key)
                  ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`}>
              {f.label}
            </button>
          ))}
          <select value={filters.state} onChange={e => setFilters(f => ({...f, state: e.target.value}))}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 bg-white text-gray-600 focus:outline-none">
            <option value="all">🗺 All states</option>
            {['CA','NV','UT','WY','CO','WA','OR','MT','AZ'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex gap-6">
        {/* ── DESKTOP filters sidebar — research mode, full controls ── */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal size={16} className="text-green-700" />
              <h3 className="font-semibold text-gray-900">Refine results</h3>
            </div>
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">State</label>
              <select value={filters.state} onChange={e => setFilters(f => ({ ...f, state: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-700">
                <option value="all">All States</option>
                {['CA','NV','UT','WY','CO','WA','OR','MT','AZ'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Site Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['all', 'RV', 'Tent', 'Cabin'].map(type => (
                  <button key={type} onClick={() => setFilters(f => ({ ...f, siteType: type }))}
                    className={`py-1.5 rounded-lg text-xs font-medium transition-colors border ${filters.siteType === type ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                    {type === 'all' ? 'All' : type}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Max Price: ${filters.maxPrice === 200 ? 'Any' : filters.maxPrice + '/night'}
              </label>
              <input type="range" min={20} max={200} step={5} value={filters.maxPrice}
                onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                className="w-full accent-green-700" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$20</span><span>$200+</span></div>
            </div>
            <div className="space-y-3">
              {[{ key: 'availableOnly', label: 'Available only' }, { key: 'petFriendly', label: 'Pet friendly' }].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setFilters(f => ({ ...f, [key]: !f[key as keyof typeof f] }))}
                    className={`w-9 h-5 rounded-full transition-colors relative ${filters[key as keyof typeof filters] ? 'bg-green-700' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters[key as keyof typeof filters] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main results */}
        <div className="flex-1 min-w-0">
          <div className="mb-3 hidden md:flex items-center justify-between">
            <p className="text-sm text-gray-500"><span className="font-semibold text-gray-900">{results.length}</span> campgrounds found</p>
          </div>

          {view === 'list' ? (
            <div className="space-y-3 md:space-y-4">
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
            <div className="h-[calc(100svh-120px)] md:h-[600px] rounded-2xl overflow-hidden border border-gray-100">
              <MapView campgrounds={results} selectedId={selectedId} onSelect={setSelectedId} />
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
    <div className="campground-card cursor-pointer" onClick={() => router.push(`/campground/${camp.slug}`)}>
      {/* Mobile layout: stacked image + compact info + big CTA */}
      <div className="flex md:hidden flex-col">
        <div className="h-44 overflow-hidden relative">
          <img src={(camp.images as any)[0]?.url} alt={camp.name} width={400} height={176}
            loading={priority ? 'eager' : 'lazy'} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-bold text-white text-base leading-tight">{camp.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-white/70 flex items-center gap-1"><MapPin size={10}/>{camp.location}</span>
              <span className="flex items-center gap-1 text-xs text-amber-300"><Star size={10} className="fill-amber-300"/>{camp.rating}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${camp.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {camp.available ? 'Open' : 'Full'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-2.5 bg-white">
          <div className="flex flex-wrap gap-1">
            {camp.amenities.slice(0, 3).map(a => <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>)}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <div className="text-right">
              <span className="text-base font-bold text-gray-900">${camp.price_per_night}</span>
              <span className="text-[10px] text-gray-400">/night</span>
            </div>
            <a href={camp.booking_url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-xl">
              Book
            </a>
          </div>
        </div>
      </div>

      {/* Desktop layout: horizontal research card */}
      <div className="hidden md:flex flex-row">
        <div className="w-64 h-48 flex-shrink-0 overflow-hidden">
          <img src={(camp.images as any)[0]?.url} alt={camp.name} width={256} height={192}
            loading={priority ? 'eager' : 'lazy'} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{camp.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500"><MapPin size={12}/><span>{camp.location}</span></div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">${camp.price_per_night}</div>
              <div className="text-xs text-gray-400">per night</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{camp.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {camp.amenities.slice(0, 4).map(a => <span key={a} className="badge-blue text-xs">{a}</span>)}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold">{camp.rating}</span>
                <span className="text-xs text-gray-400">({camp.review_count})</span>
              </div>
              <span className={camp.available ? 'badge-green' : 'badge-red'}>{camp.available ? 'Available' : 'Fully Booked'}</span>
            </div>
            <a href={camp.booking_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
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
