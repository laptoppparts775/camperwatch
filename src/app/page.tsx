'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar, Users, ChevronRight, TreePine } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')
  const [siteType, setSiteType] = useState('all')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests) params.set('guests', guests)
    if (siteType) params.set('siteType', siteType)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <main className="min-h-screen">
      <section
        className="relative min-h-[85vh] flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f2d1f 0%, #1a4a2e 40%, #1e3a5f 100%)' }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <TreePine className="text-green-400" size={32} />
            <span className="text-white font-display text-2xl font-semibold tracking-wide">CamperWatch</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Find Your Perfect
            <span className="block text-green-400">CamperWatchite</span>
          </h1>
          <p className="text-green-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Search campgrounds across the US in one place. Real availability, transparent pricing, no surprises.
          </p>
          <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Check In
                </label>
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                  min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Check Out
                </label>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                  min={checkIn || new Date().toISOString().split('T')[0]} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin size={12} /> Site Type
                </label>
                <select value={siteType} onChange={e => setSiteType(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white">
                  <option value="all">All Types</option>
                  <option value="RV">RV</option>
                  <option value="Tent">Tent</option>
                  <option value="Cabin">Cabin</option>
                  <option value="Glamping">Glamping</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Users size={12} /> Guests
                </label>
                <div className="flex gap-2">
                  <select value={guests} onChange={e => setGuests(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white flex-1">
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                  <button onClick={handleSearch}
                    className="bg-green-700 hover:bg-green-800 text-white rounded-xl px-4 flex items-center gap-1 font-semibold transition-colors">
                    <Search size={16} />
                  </button>
                </div>
              </div>
            </div>
            <button onClick={handleSearch}
              className="w-full mt-3 bg-green-700 hover:bg-green-800 text-white rounded-xl py-3 font-semibold transition-colors flex items-center justify-center gap-2">
              <Search size={16} /> Search Campgrounds
            </button>
          </div>
          <div className="flex items-center justify-center gap-8 mt-10 text-green-200 text-sm">
            <span>✓ 6+ Campgrounds</span>
            <span>✓ No hidden fees</span>
            <span>✓ Real-time availability</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center text-gray-900 mb-2">Why CamperWatch?</h2>
        <p className="text-center text-gray-500 mb-12">Everything you need, none of the hassle.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🔍', title: 'Unified Search', desc: 'Compare all Tahoe campgrounds side-by-side. No more bouncing between rec.gov, KOA, and a dozen other sites.' },
            { icon: '💰', title: 'Transparent Pricing', desc: 'See the full cost upfront—no surprise fees at checkout. Know exactly what you pay before you commit.' },
            { icon: '📋', title: 'Clear Policies', desc: 'Cancellation policies, pet rules, RV size limits—all displayed clearly so you book with confidence.' },
          ].map(item => (
            <div key={item.title} className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-16 px-4 bg-green-800 text-white text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Ready to find your campsite?</h2>
        <p className="text-green-200 mb-8">Search real availability across campgrounds right now.</p>
        <button onClick={() => router.push('/search')}
          className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors">
          Browse All Campgrounds <ChevronRight size={18} />
        </button>
      </section>
      <footer className="py-8 px-4 text-center text-gray-400 text-sm border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TreePine size={16} className="text-green-600" />
          <span className="font-semibold text-gray-600">CamperWatch</span>
        </div>
        <p>© 2026 CamperWatch · All data sourced from official operator websites.</p>
      </footer>
    </main>
  )
}
