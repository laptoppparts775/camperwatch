'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  CheckCircle, Clock, XCircle, AlertCircle, Phone, Mail, Sparkles,
  TrendingUp, CalendarDays, Users, DollarSign, ArrowUpRight,
  ChevronRight, BarChart3, Zap, Globe, Settings2, PlusCircle
} from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { scoreSiteCompleteness, aggregateCompleteness } from '@/lib/completeness'
import ICalTab from '@/components/ICalTab'
import CollaborationTab from '@/components/CollaborationTab'

type Booking = {
  id: string; booking_ref: string; campground_slug: string
  guest_name: string; guest_email: string; guest_phone: string
  check_in: string; check_out: string; nights: number; num_guests: number
  total_price: number; owner_payout: number; commission_amount: number
  status: string; created_at: string; special_requests: string
  campground_sites: { name: string; site_type: string } | null
}

type Site = {
  id: string; name: string; site_type: string; price_per_night: number
  max_guests: number; active: boolean; campground_slug: string
  description?: string | null; amenities?: string[] | null; images?: string[] | null
  house_rules?: string | null; pet_policy?: string | null
  welcome_message?: string | null; seo_keywords?: string[] | null
  bookings_enabled?: boolean
}

type OwnerCampground = { campground_slug: string; commission_rate: number }

type TabKey = 'bookings' | 'sites' | 'calendar' | 'ical' | 'collab' | 'add-site'

const TABS = [
  { key: 'bookings',  label: 'Bookings',     icon: CalendarDays },
  { key: 'sites',     label: 'My Sites',     icon: Globe },
  { key: 'calendar',  label: 'Availability', icon: Clock },
  { key: 'ical',      label: 'iCal Sync',    icon: Zap },
  { key: 'collab',    label: 'Network',      icon: Users },
  { key: 'add-site',  label: 'Add Site',     icon: PlusCircle },
] as const

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
  confirmed: { label: 'Confirmed', dot: 'bg-emerald-500', text: 'text-emerald-700' },
  pending:   { label: 'Pending',   dot: 'bg-amber-400',   text: 'text-amber-700'  },
  cancelled: { label: 'Cancelled', dot: 'bg-red-400',     text: 'text-red-600'   },
  completed: { label: 'Completed', dot: 'bg-gray-400',    text: 'text-gray-600'  },
}

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function slugToName(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function OwnerDashboard() {
  const router = useRouter()
  const supabase = getSupabase()
  const [user, setUser] = useState<any>(null)
  const [campgrounds, setCampgrounds] = useState<OwnerCampground[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [activeTab, setActiveTab] = useState<TabKey>('bookings')
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<{ phone: string | null; payout_email: string | null; full_name: string | null; email: string | null; stripe_account_id: string | null; verified: boolean | null } | null>(null)
  const [connectingStripe, setConnectingStripe] = useState(false)
  const [profileForm, setProfileForm] = useState({ phone: '', payout_email: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [newSite, setNewSite] = useState({ campground_slug: '', name: '', site_type: 'tent', max_guests: 6, max_rig_length: '', price_per_night: '', weekend_price: '', description: '', amenities: '' })
  const [savingsite, setSavingSite] = useState(false)
  const [siteSuccess, setSiteSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: any }) => {
      if (!data.user) { router.push('/auth/login?redirect=/owner-dashboard'); return }
      setUser(data.user)
      loadData(data.user.id)
    })
  }, [])

  async function loadData(userId: string) {
    setLoading(true)
    const [campsRes, bookRes, sitesRes, profileRes] = await Promise.all([
      supabase.from('campground_owners').select('*').eq('owner_id', userId).eq('active', true),
      supabase.from('bookings').select('*, campground_sites(name, site_type)').in(
        'campground_slug',
        (await supabase.from('campground_owners').select('campground_slug').eq('owner_id', userId)).data?.map(r => r.campground_slug) || []
      ).order('created_at', { ascending: false }),
      supabase.from('campground_sites').select('*').in(
        'campground_slug',
        (await supabase.from('campground_owners').select('campground_slug').eq('owner_id', userId)).data?.map(r => r.campground_slug) || []
      ).order('created_at', { ascending: false }),
      supabase.from('owner_profiles').select('phone, payout_email, full_name, email, stripe_account_id, verified').eq('id', userId).maybeSingle(),
    ])
    setCampgrounds(campsRes.data || [])
    setBookings(bookRes.data || [])
    setSites(sitesRes.data || [])
    if (campsRes.data?.[0]) setNewSite(s => ({ ...s, campground_slug: campsRes.data![0].campground_slug }))
    if (profileRes.data) {
      setProfile(profileRes.data as any)
      setProfileForm({ phone: (profileRes.data as any).phone || '', payout_email: (profileRes.data as any).payout_email || '' })
    }
    setLoading(false)
  }

  async function saveProfile() {
    if (!user) return
    setSavingProfile(true); setProfileSaved(false)
    await supabase.from('owner_profiles').upsert({
      id: user.id,
      full_name: profile?.full_name || user.user_metadata?.full_name || user.email,
      email: profile?.email || user.email,
      phone: profileForm.phone.trim() || null,
      payout_email: profileForm.payout_email.trim() || null,
    }, { onConflict: 'id' })
    setSavingProfile(false); setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
    loadData(user.id)
  }

  async function connectStripe() {
    setConnectingStripe(true)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/stripe/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ returnUrl: window.location.href }),
    })
    const json = await res.json()
    setConnectingStripe(false)
    if (json.url) window.location.href = json.url
  }

  async function toggleSite(siteId: string, active: boolean) {
    await supabase.from('campground_sites').update({ active: !active }).eq('id', siteId)
    setSites(prev => prev.map(s => s.id === siteId ? { ...s, active: !active } : s))
  }

  async function saveSite() {
    if (!newSite.name || !newSite.price_per_night || !newSite.campground_slug) return
    setSavingSite(true)
    await supabase.from('campground_sites').insert({
      campground_slug: newSite.campground_slug,
      name: newSite.name,
      site_type: newSite.site_type,
      max_guests: newSite.max_guests,
      max_rig_length: newSite.max_rig_length ? parseInt(newSite.max_rig_length) : null,
      price_per_night: parseFloat(newSite.price_per_night),
      weekend_price: newSite.weekend_price ? parseFloat(newSite.weekend_price) : null,
      description: newSite.description || null,
      amenities: newSite.amenities ? newSite.amenities.split(',').map(a => a.trim()).filter(Boolean) : null,
      active: true,
    })
    setSavingSite(false); setSiteSuccess(true)
    setTimeout(() => setSiteSuccess(false), 3000)
    setNewSite(s => ({ ...s, name: '', description: '', amenities: '', price_per_night: '', weekend_price: '', max_rig_length: '' }))
    loadData(user.id)
  }

  // Derived stats
  const confirmed = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed')
  const totalRevenue = confirmed.reduce((s, b) => s + b.owner_payout, 0)
  const totalNights = confirmed.reduce((s, b) => s + (b.nights || 0), 0)
  const upcoming = bookings.filter(b => b.check_in >= new Date().toISOString().split('T')[0] && b.status === 'confirmed')
  const thisMonth = confirmed.filter(b => b.created_at?.slice(0, 7) === new Date().toISOString().slice(0, 7))
  const monthRevenue = thisMonth.reduce((s, b) => s + b.owner_payout, 0)

  const needsPhone = profile && (!profile.phone || !profile.payout_email) && campgrounds.length > 0
  const needsStripe = profile?.phone && profile?.payout_email && !profile?.stripe_account_id && campgrounds.length > 0
  const stripeIncomplete = profile?.stripe_account_id && !profile?.verified

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0b1a10' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-emerald-400/60 text-sm">Loading your dashboard…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#f7f6f2', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      <NavBar />

      {/* ── DARK HEADER BAND ── */}
      <div style={{ background: 'linear-gradient(135deg, #0b1a10 0%, #0f2416 60%, #1a3520 100%)' }}>
        <div className="max-w-6xl mx-auto px-5 pt-8 pb-10">

          {/* Owner identity */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <p className="text-emerald-400/60 text-xs font-medium uppercase tracking-widest mb-1">Owner Dashboard</p>
              <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight">
                {profile?.full_name || user?.email?.split('@')[0] || 'My Parks'}
              </h1>
              {campgrounds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {campgrounds.map(c => (
                    <Link key={c.campground_slug} href={`/campground/${c.campground_slug}`}
                      className="flex items-center gap-1 text-xs text-emerald-300/70 hover:text-emerald-300 transition-colors">
                      <span>{slugToName(c.campground_slug)}</span>
                      <ArrowUpRight size={10} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/campground/pyramid-lake-marina"
              className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400/70 hover:text-emerald-300 border border-emerald-800 hover:border-emerald-600 rounded-full px-3 py-1.5 transition-colors">
              <Globe size={12} /> View live site
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total earnings', value: `$${totalRevenue.toFixed(0)}`, sub: 'all time', icon: DollarSign, accent: '#34d399' },
              { label: 'This month', value: `$${monthRevenue.toFixed(0)}`, sub: `${thisMonth.length} booking${thisMonth.length !== 1 ? 's' : ''}`, icon: TrendingUp, accent: '#fbbf24' },
              { label: 'Upcoming stays', value: upcoming.length, sub: 'confirmed', icon: CalendarDays, accent: '#60a5fa' },
              { label: 'Nights booked', value: totalNights, sub: 'total', icon: BarChart3, accent: '#a78bfa' },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl p-4 relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="absolute top-3 right-3 opacity-20">
                  <stat.icon size={28} color={stat.accent} />
                </div>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs mt-0.5" style={{ color: stat.accent, opacity: 0.8 }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-6">

        {/* ── SETUP BANNERS ── */}
        {needsPhone && (
          <div className="mb-5 rounded-2xl overflow-hidden border border-amber-200"
            style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)' }}>
            <div className="px-5 py-4 border-b border-amber-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-900 text-sm">Complete your profile to activate bookings</p>
                <p className="text-xs text-amber-700 mt-0.5">Your parks are visible — bookings are paused until phone + payout email are saved.</p>
              </div>
            </div>
            <div className="px-5 py-4 grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-amber-800 block mb-1.5 flex items-center gap-1.5">
                  <Phone size={11} /> Phone number
                </label>
                <input type="tel" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="(775) 555-0100"
                  className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-amber-800 block mb-1.5 flex items-center gap-1.5">
                  <Mail size={11} /> Payout email
                </label>
                <input type="email" value={profileForm.payout_email} onChange={e => setProfileForm(f => ({ ...f, payout_email: e.target.value }))}
                  placeholder="payouts@yourpark.com"
                  className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <button onClick={saveProfile} disabled={savingProfile || !profileForm.phone.trim() || !profileForm.payout_email.trim()}
                  className="px-5 py-2 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
                  style={{ background: '#92400e' }}>
                  {savingProfile ? 'Saving…' : 'Save & activate bookings'}
                </button>
                {profileSaved && <span className="text-emerald-700 text-sm flex items-center gap-1.5"><CheckCircle size={14} /> Saved</span>}
              </div>
            </div>
          </div>
        )}

        {needsStripe && (
          <div className="mb-5 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <DollarSign size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-900">Connect Stripe to accept payments</p>
                <p className="text-sm text-blue-700 mt-0.5">Profile complete. 10-minute KYC setup — then you're live. CamperWatch takes 5%, you keep 95%.</p>
              </div>
            </div>
            <button onClick={connectStripe} disabled={connectingStripe}
              className="shrink-0 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap">
              {connectingStripe ? 'Redirecting…' : <><Zap size={14} /> Connect Stripe</>}
            </button>
          </div>
        )}

        {stripeIncomplete && (
          <div className="mb-5 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-3"
            style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <p className="text-sm text-amber-800">Stripe connected but verification not complete.</p>
            <button onClick={connectStripe} disabled={connectingStripe}
              className="text-xs px-4 py-1.5 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors">
              {connectingStripe ? '…' : 'Complete setup'}
            </button>
          </div>
        )}

        {profile?.stripe_account_id && profile?.verified && (
          <div className="mb-5 rounded-2xl px-5 py-3 flex items-center gap-3"
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <CheckCircle size={16} className="text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">Stripe connected — accepting live payments and payouts.</p>
          </div>
        )}

        {campgrounds.length === 0 && (
          <div className="mb-5 rounded-2xl p-8 text-center" style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
            <p className="font-semibold text-amber-900 mb-1">No campground linked yet</p>
            <p className="text-sm text-amber-700 mb-4">Submit your campground and we'll link it to your account.</p>
            <Link href="/add-campsite" className="inline-block px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors">
              Submit Your Campground
            </Link>
          </div>
        )}

        {/* ── TAB BAR ── */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {TABS.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.key
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as TabKey)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  background: active ? '#0b1a10' : 'transparent',
                  color: active ? '#fff' : '#6b7280',
                  border: active ? 'none' : '1px solid transparent',
                }}>
                <Icon size={14} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ── BOOKINGS TAB ── */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="rounded-2xl p-12 text-center" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#f0fdf4' }}>
                  <CalendarDays size={28} className="text-emerald-500" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">No bookings yet</p>
                <p className="text-sm text-gray-400">Once campers book your sites, every reservation appears here with guest info and payout details.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => {
                  const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending
                  return (
                    <div key={b.id} className="rounded-2xl p-5 transition-shadow hover:shadow-md"
                      style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                            <span className="font-mono text-sm font-bold text-emerald-700">{b.booking_ref}</span>
                            <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{ background: cfg.dot === 'bg-emerald-500' ? '#f0fdf4' : cfg.dot === 'bg-amber-400' ? '#fffbeb' : cfg.dot === 'bg-red-400' ? '#fef2f2' : '#f9fafb' }}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              <span className={cfg.text}>{cfg.label}</span>
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900">{b.guest_name}</p>
                          <p className="text-sm text-gray-400 mt-0.5">{b.guest_email}{b.guest_phone ? ` · ${b.guest_phone}` : ''}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-bold text-emerald-700">${b.owner_payout.toFixed(0)}</p>
                          <p className="text-xs text-gray-400">your payout</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 grid grid-cols-3 gap-3 text-sm" style={{ borderTop: '1px solid #f3f4f6' }}>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Site</p>
                          <p className="font-medium text-gray-800 truncate">{b.campground_sites?.name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Dates</p>
                          <p className="font-medium text-gray-800">{fmtDate(b.check_in)} → {fmtDate(b.check_out)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Guests</p>
                          <p className="font-medium text-gray-800">{b.num_guests} · {b.nights}n</p>
                        </div>
                      </div>
                      {b.special_requests && (
                        <div className="mt-3 px-3 py-2 rounded-lg text-xs text-gray-600" style={{ background: '#f9fafb' }}>
                          <span className="font-semibold">Requests:</span> {b.special_requests}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── SITES TAB ── */}
        {activeTab === 'sites' && (
          <div className="space-y-3">
            {sites.length === 0 ? (
              <div className="rounded-2xl p-12 text-center" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#f0fdf4' }}>
                  <Globe size={28} className="text-emerald-500" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">No sites yet</p>
                <p className="text-sm text-gray-400 mb-4">Add your first bookable site to start accepting reservations.</p>
                <button onClick={() => setActiveTab('add-site')}
                  className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl"
                  style={{ background: '#0b1a10' }}>
                  Add First Site
                </button>
              </div>
            ) : (
              <>
                {(() => {
                  const agg = aggregateCompleteness(sites)
                  const good = agg.averageScore >= 80
                  return (
                    <div className="rounded-2xl px-5 py-4 flex items-center gap-4"
                      style={{ background: good ? '#f0fdf4' : '#fffbeb', border: `1px solid ${good ? '#bbf7d0' : '#fde68a'}` }}>
                      <Sparkles size={18} className={good ? 'text-emerald-600' : 'text-amber-600'} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: good ? '#065f46' : '#92400e' }}>
                          Listing quality: {agg.averageScore}%
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: good ? '#047857' : '#b45309' }}>
                          {agg.excellentCount} excellent · {agg.needsWorkCount} need work · {agg.totalSites} total sites
                        </p>
                      </div>
                    </div>
                  )
                })()}

                {/* Group by campground */}
                {campgrounds.map(cg => {
                  const cgSites = sites.filter(s => s.campground_slug === cg.campground_slug)
                  if (!cgSites.length) return null
                  return (
                    <div key={cg.campground_slug}>
                      <div className="flex items-center gap-2 mb-2 mt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{slugToName(cg.campground_slug)}</p>
                        <div className="flex-1 h-px bg-gray-100" />
                        <p className="text-xs text-gray-400">{cgSites.length} site{cgSites.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="space-y-2">
                        {cgSites.map(site => {
                          const score = scoreSiteCompleteness(site)
                          return (
                            <div key={site.id} className="rounded-2xl p-4"
                              style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                                    style={{ background: '#f0fdf4' }}>
                                    {site.site_type === 'tent' ? '⛺' : site.site_type === 'cabin' ? '🏠' : site.site_type === 'glamping' ? '✨' : '🚐'}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm truncate">{site.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {site.site_type.replace('_', ' ')} · {site.max_guests} guests · ${site.price_per_night}/night
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs px-2 py-1 rounded-lg font-medium"
                                    style={{
                                      background: score.score >= 80 ? '#f0fdf4' : score.score >= 50 ? '#fffbeb' : '#fef2f2',
                                      color: score.score >= 80 ? '#065f46' : score.score >= 50 ? '#92400e' : '#991b1b',
                                    }}>
                                    {score.score}%
                                  </span>
                                  <Link href={`/owner-dashboard/sites/${site.id}/edit`}
                                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                                    Edit
                                  </Link>
                                  <button onClick={() => toggleSite(site.id, site.active)}
                                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                                    style={{
                                      background: site.active ? '#f0fdf4' : '#f3f4f6',
                                      color: site.active ? '#065f46' : '#6b7280',
                                    }}>
                                    {site.active ? 'Live' : 'Off'}
                                  </button>
                                </div>
                              </div>
                              {score.topMissing.length > 0 && score.score < 90 && (
                                <div className="mt-3 pt-3 flex flex-wrap gap-2" style={{ borderTop: '1px solid #f3f4f6' }}>
                                  {score.topMissing.slice(0, 3).map(m => (
                                    <span key={m.key} className="text-xs px-2 py-1 rounded-lg text-amber-700 bg-amber-50 border border-amber-100">
                                      + {m.label}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )}

        {/* ── AVAILABILITY / CALENDAR TAB ── */}
        {activeTab === 'calendar' && (
          <div className="rounded-2xl p-8 text-center" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#f0fdf4' }}>
              <Clock size={28} className="text-emerald-500" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">Availability calendar</p>
            <p className="text-sm text-gray-400 mb-4 max-w-sm mx-auto">
              Block dates for maintenance, personal use, or phone bookings. Blocked dates won't show as available to campers.
            </p>
            {sites.length > 0 ? (
              <div className="text-left max-w-lg mx-auto space-y-3">
                {sites.slice(0, 5).map(site => (
                  <div key={site.id} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{site.name}</p>
                      <p className="text-xs text-gray-400">{site.campground_slug}</p>
                    </div>
                    <Link href={`/owner-dashboard/sites/${site.id}/edit`}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-800 text-white hover:bg-gray-700 transition-colors">
                      Manage →
                    </Link>
                  </div>
                ))}
                {sites.length > 5 && <p className="text-xs text-gray-400 text-center">+{sites.length - 5} more sites</p>}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Add sites first to manage their availability.</p>
            )}
          </div>
        )}

        {/* ── ICAL SYNC TAB ── */}
        {activeTab === 'ical' && user && (
          <ICalTab userId={user.id} sites={sites.map(s => ({ id: s.id, name: s.name, campground_slug: s.campground_slug }))} />
        )}

        {/* ── NETWORK / COLLAB TAB ── */}
        {activeTab === 'collab' && user && (
          <CollaborationTab userId={user.id} ownedCampgrounds={campgrounds} />
        )}

        {/* ── ADD SITE TAB ── */}
        {activeTab === 'add-site' && (
          <div className="rounded-2xl p-6 max-w-lg" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
            <h2 className="font-bold text-gray-900 text-lg mb-5">Add a bookable site</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Campground *</label>
                <select value={newSite.campground_slug} onChange={e => setNewSite(s => ({ ...s, campground_slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {campgrounds.map(c => <option key={c.campground_slug} value={c.campground_slug}>{slugToName(c.campground_slug)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Site name *</label>
                <input value={newSite.name} onChange={e => setNewSite(s => ({ ...s, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Site 12, Lakeside 30A, Cabin Bear" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Type *</label>
                  <select value={newSite.site_type} onChange={e => setNewSite(s => ({ ...s, site_type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="tent">Tent</option>
                    <option value="rv_hookup">RV Hookup</option>
                    <option value="cabin">Cabin</option>
                    <option value="glamping">Glamping</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Max guests *</label>
                  <input type="number" min={1} max={20} value={newSite.max_guests} onChange={e => setNewSite(s => ({ ...s, max_guests: parseInt(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Price/night ($) *</label>
                  <input type="number" min={1} value={newSite.price_per_night} onChange={e => setNewSite(s => ({ ...s, price_per_night: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="45" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Weekend price ($)</label>
                  <input type="number" min={1} value={newSite.weekend_price} onChange={e => setNewSite(s => ({ ...s, weekend_price: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="55" />
                </div>
              </div>
              {newSite.site_type === 'rv_hookup' && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Max RV length (ft)</label>
                  <input type="number" value={newSite.max_rig_length} onChange={e => setNewSite(s => ({ ...s, max_rig_length: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="45" />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Amenities (comma-separated)</label>
                <input value={newSite.amenities} onChange={e => setNewSite(s => ({ ...s, amenities: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="30 amp, Water hookup, Fire ring, Pet friendly" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Description</label>
                <textarea value={newSite.description} onChange={e => setNewSite(s => ({ ...s, description: e.target.value }))}
                  rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Paved lakefront site with direct beach access…" />
              </div>
              {siteSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <CheckCircle size={15} /> Site added successfully!
                </div>
              )}
              <button onClick={saveSite} disabled={savingsite || !newSite.name || !newSite.price_per_night || !newSite.campground_slug}
                className="w-full py-3 text-white font-bold rounded-xl transition-colors disabled:opacity-40 text-sm"
                style={{ background: '#0b1a10' }}>
                {savingsite ? 'Saving…' : 'Add Site'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
