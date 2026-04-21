'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Tent, ChevronDown } from 'lucide-react'

export default function HomeSearch() {
  const router = useRouter()
  const [type, setType] = useState('all')
  const [state, setState] = useState('all')

  const go = () => {
    const p = new URLSearchParams()
    if (type !== 'all') p.set('siteType', type)
    if (state !== 'all') p.set('state', state)
    router.push(`/search?${p.toString()}`)
  }

  return (
    <div className="w-full">
      {/* Mobile: stacked single-column */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="relative">
          <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            className="w-full pl-9 pr-8 py-4 bg-white rounded-xl text-sm font-medium text-stone-800 border-0 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
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
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        </div>
        <div className="relative">
          <Tent size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full pl-9 pr-8 py-4 bg-white rounded-xl text-sm font-medium text-stone-800 border-0 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Any Site Type</option>
            <option value="RV">RV / Hookup</option>
            <option value="Tent">Tent</option>
            <option value="Cabin">Cabin</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        </div>
        <button
          onClick={go}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
        >
          <Search size={16} strokeWidth={2.5} />
          Search Campgrounds
        </button>
      </div>

      {/* Desktop: horizontal pill */}
      <div className="hidden sm:flex items-stretch bg-white rounded-2xl shadow-xl shadow-stone-950/10 overflow-hidden p-1.5 gap-1.5 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 flex-1 px-4 py-3">
          <MapPin size={15} className="text-stone-400 flex-shrink-0" />
          <div className="flex flex-col flex-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Where</label>
            <select
              value={state}
              onChange={e => setState(e.target.value)}
              className="text-sm font-semibold text-stone-900 bg-transparent appearance-none focus:outline-none cursor-pointer w-full"
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
        </div>
        <div className="w-px bg-stone-100 self-stretch my-1" />
        <div className="flex items-center gap-2 flex-1 px-4 py-3">
          <Tent size={15} className="text-stone-400 flex-shrink-0" />
          <div className="flex flex-col flex-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="text-sm font-semibold text-stone-900 bg-transparent appearance-none focus:outline-none cursor-pointer w-full"
            >
              <option value="all">Any Site</option>
              <option value="RV">RV / Hookup</option>
              <option value="Tent">Tent</option>
              <option value="Cabin">Cabin</option>
            </select>
          </div>
        </div>
        <button
          onClick={go}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl px-6 flex items-center gap-2 transition-colors flex-shrink-0"
        >
          <Search size={15} strokeWidth={2.5} />
          Search
        </button>
      </div>
    </div>
  )
}
