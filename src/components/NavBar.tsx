'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { campgrounds } from '@/lib/data'
import {
  TreePine, MapPin, Search, ChevronDown, Menu, X, LogOut,
  Tent, Shield, User, Star, Zap, Map, Users, Plus,
  Phone, Calendar, DollarSign, Bell, Navigation, Coffee
} from 'lucide-react'

type NavUser = { id: string; email: string; full_name: string; username: string; role: string; avatar_url: string | null; avatar_color: string }

const STATES = Array.from(new Set(campgrounds.map(c => c.state))).sort()
const CATEGORIES = [
  { label: 'RV Parks', icon: '🚐', filter: 'RV' },
  { label: 'Tent Sites', icon: '⛺', filter: 'Tent' },
  { label: 'Cabins', icon: '🏠', filter: 'Cabin' },
  { label: 'Glamping', icon: '✨', filter: 'Glamping' },
  { label: 'Pet Friendly', icon: '🐾', filter: 'pet' },
  { label: 'Near Water', icon: '💧', filter: 'water' },
]
const POPULAR = campgrounds.filter(c => c.rating >= 4.0).slice(0, 6)

export default function NavBar({ dark = false }: { dark?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<NavUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [megaOpen, setMegaOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState<typeof campgrounds>([])
  const [nearMe, setNearMe] = useState<{name:string,slug:string,dist:number}[]>([])
  const [locating, setLocating] = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  // Auth
  useEffect(() => {
    const sb = getSupabase()
    async function load(uid: string, email: string) {
      const { data } = await sb.from('profiles').select('*').eq('id', uid).single()
      if (data) setUser({ ...data, email })
      else {
        const name = email.split('@')[0]
        await sb.from('profiles').upsert({ id: uid, username: name, full_name: name, role: 'camper' })
        setUser({ id: uid, email, full_name: name, username: name, role: 'camper', avatar_url: null, avatar_color: '#16a34a' })
      }
      setLoading(false)
    }
    sb.auth.getSession().then(({ data }: any) => {
      if (data.session?.user) load(data.session.user.id, data.session.user.email)
      else setLoading(false)
    })
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e: any, session: any) => {
      if (session?.user) load(session.user.id, session.user.email)
      else { setUser(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Live search
  useEffect(() => {
    if (!searchQ.trim()) { setSearchResults([]); return }
    const q = searchQ.toLowerCase()
    setSearchResults(campgrounds.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.amenities?.some((a: string) => a.toLowerCase().includes(q))
    ).slice(0, 5))
  }, [searchQ])

  // Location — find nearest campgrounds
  function findNearMe() {
    setLocating(true)
    navigator.geolocation?.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      const sorted = campgrounds.map(c => ({
        name: c.name, slug: c.slug,
        dist: Math.round(Math.sqrt(Math.pow((c.lat - lat) * 69, 2) + Math.pow((c.lng - lng) * 54, 2)))
      })).sort((a, b) => a.dist - b.dist).slice(0, 4)
      setNearMe(sorted)
      setLocating(false)
    }, () => setLocating(false))
  }

  async function signOut() {
    setUserOpen(false); setMobileOpen(false)
    await getSupabase().auth.signOut()
    router.push('/')
  }

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CW'
  const textMuted = dark ? 'text-stone-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'
  const navBg = dark ? 'bg-green-950/95 backdrop-blur-sm border-b border-white/10' : 'bg-white border-b border-gray-100'

  return (
    <>
      <header className={`sticky top-0 z-50 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-14 gap-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
              <TreePine size={20} className="text-green-500" />
              <span className={`font-bold text-base ${dark ? 'text-white' : 'text-gray-900'}`}>CamperWatch</span>
            </Link>

            {/* Desktop: Search bar */}
            <div className="hidden md:flex flex-1 max-w-sm relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                onFocus={() => setMegaOpen(false)}
                placeholder="Search campgrounds, states, amenities..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-50">
                  {searchResults.map(r => (
                    <Link key={r.slug} href={`/campground/${r.slug}`}
                      onClick={() => setSearchQ('')}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                      <MapPin size={13} className="text-green-500 shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-400">{r.location} · ${r.price_per_night}/night</div>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-xs text-amber-500">
                        <Star size={11} className="fill-amber-400" />{r.rating}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: Mega menu trigger */}
            <div className="hidden md:flex items-center gap-1 ml-1" ref={megaRef}>
              <button onClick={() => setMegaOpen(!megaOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${megaOpen ? 'bg-green-50 text-green-700' : textMuted}`}>
                <Map size={15} /> Explore <ChevronDown size={13} className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
              </button>
              <Link href="/community" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${textMuted}`}>
                Community
              </Link>
              {(user?.role === 'owner' || user?.role === 'admin') && (
                <Link href="/owner-dashboard" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-amber-600 hover:text-amber-700`}>
                  My Campground
                </Link>
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Near Me — mobile + desktop */}
              <button onClick={findNearMe}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                <Navigation size={13} className={locating ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Near Me</span>
              </button>

              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
              ) : user ? (
                <div className="relative" ref={userRef}>
                  <button onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0"
                      style={{ background: user.avatar_color || '#16a34a' }}>
                      {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="" /> : initials}
                    </div>
                    <ChevronDown size={13} className={`hidden sm:block ${dark ? 'text-white' : 'text-gray-400'} transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <div className="font-semibold text-gray-900 text-sm">{user.full_name}</div>
                        <div className="text-xs text-gray-400 truncate">{user.email}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'owner' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'}`}>{user.role}</span>
                      </div>
                      <Link href="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <User size={14} className="text-gray-400" /> My Profile
                      </Link>
                      <Link href="/profile?tab=bookings" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <Calendar size={14} className="text-gray-400" /> My Bookings
                      </Link>
                      {(user.role === 'owner' || user.role === 'admin') && (
                        <Link href="/owner-dashboard" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Tent size={14} className="text-amber-500" /> Owner Dashboard
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link href="/admin" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Shield size={14} className="text-purple-500" /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-50 mt-1">
                        <button onClick={signOut} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login" className={`text-sm font-medium transition-colors hidden sm:block ${textMuted}`}>Sign in</Link>
                  <Link href="/auth/signup" className="text-sm font-semibold bg-green-600 text-white px-4 py-1.5 rounded-xl hover:bg-green-700 transition-colors">Join free</Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1">
                {mobileOpen ? <X size={20} className={dark ? 'text-white' : 'text-gray-900'} /> : <Menu size={20} className={dark ? 'text-white' : 'text-gray-900'} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu — Desktop */}
        {megaOpen && (
          <div className="hidden md:block absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-2xl z-40">
            <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-4 gap-8">

              {/* Col 1: Browse by type */}
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Browse by type</div>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <Link key={cat.filter} href={`/search?siteType=${cat.filter}`}
                      onClick={() => setMegaOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">{cat.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Col 2: Browse by state */}
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Browse by state</div>
                <div className="grid grid-cols-2 gap-1">
                  {STATES.map(state => (
                    <Link key={state} href={`/search?state=${state}`}
                      onClick={() => setMegaOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 hover:text-green-700 transition-colors">
                      <MapPin size={12} className="text-gray-300" />{state}
                      <span className="ml-auto text-xs text-gray-400">{campgrounds.filter(c => c.state === state).length}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Col 3: Top rated */}
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Top rated</div>
                <div className="space-y-2">
                  {POPULAR.map(c => (
                    <Link key={c.slug} href={`/campground/${c.slug}`}
                      onClick={() => setMegaOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                      <img src={c.images?.[0]?.url} className="w-10 h-10 rounded-lg object-cover shrink-0" alt="" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-gray-900 group-hover:text-green-700 leading-tight truncate">{c.name}</div>
                        <div className="text-xs text-gray-400">{c.location}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs text-gray-600">{c.rating} · ${c.price_per_night}/night</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Col 4: Near me + owner CTA */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Near you now</div>
                  {nearMe.length === 0 ? (
                    <button onClick={findNearMe}
                      className="w-full flex items-center gap-2 p-3 bg-green-50 rounded-xl text-sm font-medium text-green-700 hover:bg-green-100 transition-colors">
                      <Navigation size={15} className={locating ? 'animate-spin' : ''} />
                      {locating ? 'Locating...' : 'Find campgrounds near me'}
                    </button>
                  ) : (
                    <div className="space-y-1">
                      {nearMe.map(c => (
                        <Link key={c.slug} href={`/campground/${c.slug}`}
                          onClick={() => setMegaOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                          <Navigation size={12} className="text-green-500" />
                          <span className="flex-1 truncate">{c.name}</span>
                          <span className="text-xs text-gray-400 shrink-0">{c.dist}mi</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                  <div className="text-sm font-bold text-amber-900 mb-1">🏕 Own a campground?</div>
                  <p className="text-xs text-amber-700 mb-3">List for free in 5 minutes. No website needed. Start getting bookings today.</p>
                  <Link href="/owner/onboard" onClick={() => setMegaOpen(false)}
                    className="block text-center text-xs font-semibold bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors">
                    List my campground →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-gray-900">Menu</span>
              <button onClick={() => setMobileOpen(false)}><X size={20} className="text-gray-500" /></button>
            </div>

            {/* Mobile search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search campgrounds..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 space-y-1">
                  {searchResults.map(r => (
                    <Link key={r.slug} href={`/campground/${r.slug}`}
                      onClick={() => { setSearchQ(''); setMobileOpen(false) }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <MapPin size={13} className="text-green-500 shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-400">{r.location}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Near me */}
            <div className="p-4 border-b border-gray-100">
              <button onClick={findNearMe}
                className="w-full flex items-center justify-center gap-2 p-3 bg-green-50 rounded-xl text-sm font-semibold text-green-700">
                <Navigation size={15} className={locating ? 'animate-spin' : ''} />
                {locating ? 'Locating...' : nearMe.length ? `${nearMe[0].name} (${nearMe[0].dist}mi)` : 'Campgrounds near me'}
              </button>
              {nearMe.length > 0 && (
                <div className="mt-2 space-y-1">
                  {nearMe.map(c => (
                    <Link key={c.slug} href={`/campground/${c.slug}`} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg text-sm text-gray-700">
                      <Navigation size={12} className="text-green-500" />
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-xs text-gray-400">{c.dist}mi</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Browse categories */}
            <div className="p-4 border-b border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Browse</div>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <Link key={cat.filter} href={`/search?siteType=${cat.filter}`} onClick={() => setMobileOpen(false)}
                    className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs font-medium text-gray-700">{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* User section */}
            <div className="p-4">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: user.avatar_color || '#16a34a' }}>
                      {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full rounded-full object-cover" alt="" /> : initials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{user.full_name}</div>
                      <div className="text-xs text-gray-400">{user.role}</div>
                    </div>
                  </div>
                  {[
                    { href: '/profile', label: 'My Profile', icon: User },
                    { href: '/profile?tab=bookings', label: 'My Bookings', icon: Calendar },
                    { href: '/community', label: 'Community', icon: Users },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm text-gray-700">
                      <item.icon size={16} className="text-gray-400" /> {item.label}
                    </Link>
                  ))}
                  {(user.role === 'owner' || user.role === 'admin') && (
                    <Link href="/owner-dashboard" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 text-sm text-amber-700 font-medium">
                      <Tent size={16} className="text-amber-500" /> Owner Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 text-sm text-purple-700 font-medium">
                      <Shield size={16} className="text-purple-500" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={signOut}
                    className="flex items-center gap-3 p-3 rounded-xl text-sm text-red-600 hover:bg-red-50 w-full mt-2">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                    className="block text-center py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700">Sign In</Link>
                  <Link href="/auth/signup" onClick={() => setMobileOpen(false)}
                    className="block text-center py-3 bg-green-600 rounded-xl text-sm font-semibold text-white">Join CamperWatch Free</Link>
                  <Link href="/owner/onboard" onClick={() => setMobileOpen(false)}
                    className="block text-center py-3 bg-amber-50 rounded-xl text-sm font-semibold text-amber-700">List my campground →</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
