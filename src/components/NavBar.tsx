'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { TreePine, User, LogOut, Settings, Tent, Shield, ChevronDown, Menu, X } from 'lucide-react'

type NavUser = {
  id: string
  email: string
  full_name: string
  username: string
  role: string
  avatar_url: string | null
  avatar_color: string
}

export default function NavBar({ dark = false }: { dark?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<NavUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = getSupabase()

    async function loadUser(userId: string, email: string) {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (data) {
        setUser({ ...data, email })
      } else {
        // Profile doesn't exist yet — create it
        const name = email.split('@')[0]
        await supabase.from('profiles').upsert({
          id: userId, username: name, full_name: name, role: 'camper'
        })
        setUser({ id: userId, email, full_name: name, username: name, role: 'camper', avatar_url: null, avatar_color: '#16a34a' })
      }
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }: any) => {
      if (data.session?.user) {
        loadUser(data.session.user.id, data.session.user.email)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e: any, session: any) => {
      if (session?.user) {
        loadUser(session.user.id, session.user.email)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  async function signOut() {
    setMenuOpen(false)
    await getSupabase().auth.signOut()
    router.push('/')
  }

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CW'
  const isActive = (path: string) => pathname === path

  const textColor = dark ? 'text-stone-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
  const bg = dark ? 'bg-transparent' : 'bg-white border-b border-gray-100'

  return (
    <header className={`sticky top-0 z-50 ${bg}`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <TreePine size={22} className="text-green-600" />
          <span className={`font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>CamperWatch</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/search" className={`text-sm font-medium transition-colors ${textColor} ${isActive('/search') ? 'text-green-600' : ''}`}>Browse</Link>
          <Link href="/community" className={`text-sm font-medium transition-colors ${textColor} ${isActive('/community') ? 'text-green-600' : ''}`}>Community</Link>
          {user?.role === 'owner' && (
            <Link href="/owner-dashboard" className={`text-sm font-medium transition-colors ${textColor}`}>My Campground</Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          ) : user ? (
            <div className="relative" ref={dropRef}>
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                  style={{ background: user.avatar_color || '#16a34a' }}>
                  {user.avatar_url
                    ? <img src={user.avatar_url} className="w-full h-full object-cover" alt={user.full_name} />
                    : initials}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {user.full_name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} className={`hidden sm:block ${dark ? 'text-white' : 'text-gray-500'}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden py-1">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-50">
                    <div className="font-semibold text-gray-900 text-sm">{user.full_name}</div>
                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'owner' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'}`}>
                      {user.role}
                    </span>
                  </div>

                  <Link href="/profile" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User size={15} className="text-gray-400" /> My Profile
                  </Link>

                  {user.role === 'owner' && (
                    <Link href="/owner-dashboard" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Tent size={15} className="text-amber-500" /> Owner Dashboard
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <>
                      <Link href="/owner-dashboard" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Tent size={15} className="text-amber-500" /> Owner Dashboard
                      </Link>
                      <Link href="/admin" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Shield size={15} className="text-purple-500" /> Admin Panel
                      </Link>
                    </>
                  )}

                  <div className="border-t border-gray-50 mt-1">
                    <button onClick={signOut}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login"
                className={`text-sm font-medium transition-colors ${dark ? 'text-stone-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Sign in
              </Link>
              <Link href="/auth/signup"
                className="text-sm font-semibold bg-green-600 text-white px-4 py-1.5 rounded-xl hover:bg-green-700 transition-colors">
                Join free
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
            {mobileOpen ? <X size={20} className={dark ? 'text-white' : 'text-gray-900'} /> : <Menu size={20} className={dark ? 'text-white' : 'text-gray-900'} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          <Link href="/search" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700">Browse Campgrounds</Link>
          <Link href="/community" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700">Community</Link>
          {user && <Link href="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-700">My Profile</Link>}
          {(user?.role === 'owner' || user?.role === 'admin') && (
            <Link href="/owner-dashboard" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-amber-700">Owner Dashboard</Link>
          )}
          {user?.role === 'admin' && (
            <Link href="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-purple-700">Admin Panel</Link>
          )}
          {!user && (
            <div className="flex gap-2 pt-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm border border-gray-200 rounded-xl text-gray-700">Sign in</Link>
              <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm bg-green-600 text-white rounded-xl font-semibold">Join free</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
