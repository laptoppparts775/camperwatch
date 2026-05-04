'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Plus, Calendar, DollarSign, Users, Settings, ChevronRight, CheckCircle, Clock, XCircle, Tent, AlertCircle, Phone, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { scoreSiteCompleteness, aggregateCompleteness } from '@/lib/completeness'
import ICalTab from '@/components/ICalTab'

type Booking = {
  id: string
  booking_ref: string
  campground_slug: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in: string
  check_out: string
  nights: number
  num_guests: number
  total_price: number
  owner_payout: number
  commission_amount: number
  status: string
  created_at: string
  special_requests: string
  campground_sites: { name: string; site_type: string } | null
}

type Site = {
  id: string
  name: string
  site_type: string
  price_per_night: number
  max_guests: number
  active: boolean
  campground_slug: string
  // 1.7.7 fields used for completeness score
  description?: string | null
  amenities?: string[] | null
  images?: string[] | null
  house_rules?: string | null
  pet_policy?: string | null
  welcome_message?: string | null
  seo_keywords?: string[] | null
  bookings_enabled?: boolean
}

type OwnerCampground = {
  campground_slug: string
  commission_rate: number
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-gray-100 text-gray-600',
}

const STATUS_ICONS: Record<string, any> = {
  confirmed: CheckCircle,
  pending: Clock,
  cancelled: XCircle,
  completed: CheckCircle,
}

export default function OwnerDashboard() {
  const router = useRouter()
  const supabase = getSupabase()
  const [user, setUser] = useState<any>(null)
  const [campgrounds, setCampgrounds] = useState<OwnerCampground[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [activeTab, setActiveTab] = useState<'bookings' | 'sites' | 'add-site'>('bookings')
  const [loading, setLoading] = useState(true)

  // New site form
  const [newSite, setNewSite] = useState({
    campground_slug: '',
    name: '',
    site_type: 'tent',
    max_guests: 6,
    max_rig_length: '',
    price_per_night: '',
    weekend_price: '',
    description: '',
    amenities: '',
  })
  const [savingsite, setSavingSite] = useState(false)
  const [siteSuccess, setSiteSuccess] = useState(false)

  // Owner profile (1.6 — completion check)
  const [profile, setProfile] = useState<{ phone: string | null; payout_email: string | null; full_name: string | null; email: string | null } | null>(null)
  const [profileForm, setProfileForm] = useState({ phone: '', payout_email: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

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
      supabase.from('owner_profiles').select('phone, payout_email, full_name, email').eq('id', userId).maybeSingle(),
    ])
    setCampgrounds(campsRes.data || [])
    setBookings(bookRes.data || [])
    setSites(sitesRes.data || [])
    if (campsRes.data?.[0]) setNewSite(s => ({ ...s, campground_slug: campsRes.data![0].campground_slug }))
    if (profileRes.data) {
      setProfile(profileRes.data as any)
      setProfileForm({
        phone: (profileRes.data as any).phone || '',
        payout_email: (profileRes.data as any).payout_email || '',
      })
    }
    setLoading(false)
  }

  async function saveProfile() {
    if (!user) return
    setSavingProfile(true)
    setProfileSaved(false)
    const phone = profileForm.phone.trim()
    const payout_email = profileForm.payout_email.trim()
    // Upsert against the auth user id (owner_profiles.id is FK to auth.users)
    const { error } = await supabase.from('owner_profiles').upsert({
      id: user.id,
      full_name: profile?.full_name || user.user_metadata?.full_name || user.email,
      email: profile?.email || user.email,
      phone: phone || null,
      payout_email: payout_email || null,
    }, { onConflict: 'id' })
    setSavingProfile(false)
    if (!error) {
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
      // Re-fetch so banner updates
      loadData(user.id)
    }
  }

  async function saveSite() {
    if (!newSite.campground_slug || !newSite.name || !newSite.price_per_night) return
    setSavingSite(true)
    const { error } = await supabase.from('campground_sites').insert({
      campground_slug: newSite.campground_slug,
      name: newSite.name,
      site_type: newSite.site_type,
      max_guests: newSite.max_guests,
      max_rig_length: newSite.max_rig_length ? parseInt(newSite.max_rig_length) : null,
      price_per_night: parseFloat(newSite.price_per_night),
      weekend_price: newSite.weekend_price ? parseFloat(newSite.weekend_price) : null,
      description: newSite.description,
      amenities: newSite.amenities ? newSite.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
      active: true,
    })
    setSavingSite(false)
    if (!error) {
      setSiteSuccess(true)
      setTimeout(() => setSiteSuccess(false), 3000)
      loadData(user.id)
      setActiveTab('sites')
    }
  }

  async function toggleSite(siteId: string, active: boolean) {
    await supabase.from('campground_sites').update({ active: !active }).eq('id', siteId)
    setSites(prev => prev.map(s => s.id === siteId ? { ...s, active: !active } : s))
  }

  // Stats
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed')
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.owner_payout, 0)
  const totalNights = confirmedBookings.reduce((sum, b) => sum + (b.nights || 0), 0)
  const upcomingBookings = bookings.filter(b => b.check_in >= new Date().toISOString().split('T')[0] && b.status === 'confirmed')

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Earnings', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-green-600' },
            { label: 'Bookings', value: confirmedBookings.length, icon: Calendar, color: 'text-blue-600' },
            { label: 'Upcoming', value: upcomingBookings.length, icon: Clock, color: 'text-amber-600' },
            { label: 'Nights Booked', value: totalNights, icon: Tent, color: 'text-purple-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4">
              <stat.icon size={20} className={stat.color + ' mb-2'} />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 1.6 — Profile completion check */}
        {profile && (!profile.phone || !profile.payout_email) && campgrounds.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle size={22} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900 text-base mb-1">Complete your profile to start taking bookings</div>
                <p className="text-amber-700 text-sm">
                  Your campground listings are visible, but bookings are paused until your phone number and payout email are on file. Without these, campers can't reach you and we can't pay you out.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-600 font-medium block mb-1 flex items-center gap-1.5">
                  <Phone size={12} /> Phone number
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="(555) 555-1234"
                  className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <div className="text-xs text-gray-500 mt-1">Campers will see this to contact you</div>
              </div>
              <div>
                <label className="text-xs text-gray-600 font-medium block mb-1 flex items-center gap-1.5">
                  <Mail size={12} /> Payout email
                </label>
                <input
                  type="email"
                  value={profileForm.payout_email}
                  onChange={e => setProfileForm(f => ({ ...f, payout_email: e.target.value }))}
                  placeholder="payouts@yourcampground.com"
                  className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <div className="text-xs text-gray-500 mt-1">Where Stripe will deposit your money (only visible to you)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={saveProfile}
                disabled={savingProfile || !profileForm.phone.trim() || !profileForm.payout_email.trim()}
                className="px-5 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingProfile ? 'Saving…' : 'Save and enable bookings'}
              </button>
              {profileSaved && (
                <span className="text-green-700 text-sm font-medium flex items-center gap-1.5">
                  <CheckCircle size={14} /> Saved — bookings now enabled
                </span>
              )}
            </div>
          </div>
        )}

        {/* No campground linked yet */}
        {campgrounds.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center mb-6">
            <div className="text-amber-700 font-semibold mb-2">No campground linked to your account yet</div>
            <p className="text-amber-600 text-sm mb-4">Submit your campground via the owner portal, then contact us to get approved.</p>
            <Link href="/add-campsite" className="inline-block px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors">
              Submit Your Campground
            </Link>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 overflow-x-auto">
          {[
            { key: 'bookings', label: 'Bookings' },
            { key: 'sites', label: 'My Sites' },
            { key: 'add-site', label: '+ Add Site' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">No bookings yet. Add your sites to start accepting reservations.</p>
              </div>
            ) : bookings.map(booking => {
              const StatusIcon = STATUS_ICONS[booking.status] || Clock
              return (
                <div key={booking.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-green-700 text-sm">{booking.booking_ref}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[booking.status]}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="font-semibold text-gray-900">{booking.guest_name}</div>
                      <div className="text-sm text-gray-500">{booking.guest_email} {booking.guest_phone && `· ${booking.guest_phone}`}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-700 text-lg">${booking.owner_payout.toFixed(0)}</div>
                      <div className="text-xs text-gray-400">your payout</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div><span className="text-gray-400 block text-xs">Site</span>{booking.campground_sites?.name || '—'}</div>
                    <div><span className="text-gray-400 block text-xs">Dates</span>{booking.check_in} → {booking.check_out}</div>
                    <div><span className="text-gray-400 block text-xs">Guests</span>{booking.num_guests} · {booking.nights}n</div>
                  </div>
                  {booking.special_requests && (
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                      <span className="font-medium">Requests:</span> {booking.special_requests}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Sites tab */}
        {activeTab === 'sites' && (
          <div className="space-y-3">
            {sites.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <Tent size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No sites added yet. Add your first bookable site.</p>
                <button onClick={() => setActiveTab('add-site')} className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
                  Add First Site
                </button>
              </div>
            ) : (
              <>
                {/* 1.7.7 — Aggregate completeness banner */}
                {(() => {
                  const agg = aggregateCompleteness(sites)
                  const tone =
                    agg.averageScore >= 80 ? 'bg-green-50 border-green-200 text-green-800' :
                    agg.averageScore >= 50 ? 'bg-amber-50 border-amber-200 text-amber-800' :
                    'bg-rose-50 border-rose-200 text-rose-800'
                  return (
                    <div className={`rounded-2xl border p-4 mb-2 ${tone}`}>
                      <div className="flex items-center gap-3">
                        <Sparkles size={18} className="shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">
                            Average listing quality: {agg.averageScore}%
                          </div>
                          <div className="text-xs opacity-80 mt-0.5">
                            {agg.excellentCount} excellent · {agg.needsWorkCount} need{agg.needsWorkCount === 1 ? 's' : ''} work · {agg.totalSites} total
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {sites.map(site => {
                  const score = scoreSiteCompleteness(site)
                  const scoreColor =
                    score.score >= 80 ? 'bg-green-100 text-green-700' :
                    score.score >= 50 ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  return (
                    <div key={site.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="font-semibold text-gray-900">{site.name}</div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scoreColor}`}>
                              {score.score}% · {score.tier}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 capitalize mt-0.5">{site.site_type.replace('_', ' ')} · Up to {site.max_guests} guests · ${site.price_per_night}/night</div>
                          <div className="text-xs text-gray-400 mt-0.5">{site.campground_slug}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Link href={`/owner-dashboard/sites/${site.id}/edit`}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                            Edit
                          </Link>
                          <button
                            onClick={() => toggleSite(site.id, site.active)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                              site.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {site.active ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                      </div>
                      {/* Top missing items — drives owner to Edit */}
                      {score.topMissing.length > 0 && score.score < 90 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-xs font-medium text-gray-500 mb-1.5">To improve this listing:</div>
                          <ul className="space-y-1">
                            {score.topMissing.map(m => (
                              <li key={m.key} className="text-xs text-gray-600 flex items-start gap-1.5">
                                <span className="text-gray-300 mt-0.5">○</span>
                                <span><span className="font-medium">{m.label}</span> <span className="text-gray-400">— {m.hint}</span></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )}

        {/* iCal Sync tab */}
        {activeTab === 'ical' && user && (
          <ICalTab userId={user.id} sites={sites.map(s => ({ id: s.id, name: s.name, campground_slug: s.campground_slug }))} />
        )}

        {/* Add site tab */}
        {activeTab === 'add-site' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Add a bookable site</h2>
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Campground *</label>
                <select value={newSite.campground_slug} onChange={e => setNewSite(s => ({ ...s, campground_slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {campgrounds.map(c => <option key={c.campground_slug} value={c.campground_slug}>{c.campground_slug}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Site name *</label>
                <input value={newSite.name} onChange={e => setNewSite(s => ({ ...s, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Site 12, Lakeside Tent A, Cabin Bear" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Type *</label>
                  <select value={newSite.site_type} onChange={e => setNewSite(s => ({ ...s, site_type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="tent">Tent</option>
                    <option value="rv_hookup">RV Hookup</option>
                    <option value="cabin">Cabin</option>
                    <option value="glamping">Glamping</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Max guests *</label>
                  <input type="number" min={1} max={20} value={newSite.max_guests} onChange={e => setNewSite(s => ({ ...s, max_guests: parseInt(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Price/night ($) *</label>
                  <input type="number" min={1} value={newSite.price_per_night} onChange={e => setNewSite(s => ({ ...s, price_per_night: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="45" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Weekend price ($)</label>
                  <input type="number" min={1} value={newSite.weekend_price} onChange={e => setNewSite(s => ({ ...s, weekend_price: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="55 (optional)" />
                </div>
              </div>
              {newSite.site_type === 'rv_hookup' && (
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Max RV length (ft)</label>
                  <input type="number" value={newSite.max_rig_length} onChange={e => setNewSite(s => ({ ...s, max_rig_length: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="35" />
                </div>
              )}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Amenities (comma separated)</label>
                <input value={newSite.amenities} onChange={e => setNewSite(s => ({ ...s, amenities: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Fire ring, Picnic table, Water hookup" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Description</label>
                <textarea value={newSite.description} onChange={e => setNewSite(s => ({ ...s, description: e.target.value }))}
                  rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Shaded site near the creek, great for families..." />
              </div>

              {siteSuccess && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                  <CheckCircle size={16} /> Site added successfully!
                </div>
              )}

              <button
                onClick={saveSite}
                disabled={savingsite || !newSite.name || !newSite.price_per_night || !newSite.campground_slug}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-40"
              >
                {savingsite ? 'Saving...' : 'Add Site'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
