'use client'
import { useState, useEffect, useRef } from 'react'
import { getSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TreePine, MapPin, Users, Star, Copy, Check, Bell, LogOut, Tent, Share2, ChevronRight, Calendar, UserPlus, Heart, MessageCircle, Award } from 'lucide-react'
import { campgrounds } from '@/lib/data'

type Profile = {
  id: string; username: string; full_name: string; avatar_url: string | null
  bio: string | null; location: string | null; role: string; referral_code: string
  camps_visited: number; tips_shared: number; avatar_color: string
}
type Booking = { id: string; booking_ref: string; campground_slug: string; check_in: string; check_out: string; status: string; total_price: number }
type Notification = { id: string; type: string; title: string; body: string; link: string; read: boolean; created_at: string }
type TripLog = { id: string; campground_slug: string; visit_date: string; rating: number; notes: string }

const TABS = [
  { key: 'trips', label: 'Trips', icon: Tent },
  { key: 'bookings', label: 'Bookings', icon: Calendar },
  { key: 'referrals', label: 'Invite', icon: UserPlus },
  { key: 'notifications', label: 'Alerts', icon: Bell },
]

export default function ProfilePage() {
  const router = useRouter()
  const supabase = getSupabase()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [trips, setTrips] = useState<TripLog[]>([])
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [referralCount, setReferralCount] = useState(0)
  const [tab, setTab] = useState('trips')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [unread, setUnread] = useState(0)
  const [editBio, setEditBio] = useState(false)
  const [bioText, setBioText] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: any }) => {
      if (!data.user) { router.push('/auth/login?redirect=/profile'); return }
      loadAll(data.user.id)
    })
  }, [])

  async function loadAll(userId: string) {
    const [profRes, bookRes, notifRes, tripRes, followerRes, followingRes, referralRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('bookings').select('*').eq('guest_id', userId).order('check_in', { ascending: false }),
      supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(30),
      supabase.from('trip_logs').select('*').eq('user_id', userId).order('visit_date', { ascending: false }),
      supabase.from('user_follows').select('id', { count: 'exact' }).eq('following_id', userId),
      supabase.from('user_follows').select('id', { count: 'exact' }).eq('follower_id', userId),
      supabase.from('referrals').select('id', { count: 'exact' }).eq('referrer_id', userId),
    ])
    setProfile(profRes.data)
    setBioText(profRes.data?.bio || '')
    setBookings(bookRes.data || [])
    setNotifications(notifRes.data || [])
    setTrips(tripRes.data || [])
    setFollowers(followerRes.count || 0)
    setFollowing(followingRes.count || 0)
    setReferralCount(referralRes.count || 0)
    setUnread((notifRes.data || []).filter((n: Notification) => !n.read).length)
    setLoading(false)
  }

  async function copyReferral() {
    const url = `${window.location.origin}/auth/signup?ref=${profile?.referral_code}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function saveBio() {
    if (!profile) return
    await supabase.from('profiles').update({ bio: bioText }).eq('id', profile.id)
    setProfile(p => p ? { ...p, bio: bioText } : p)
    setEditBio(false)
  }

  async function markAllRead() {
    if (!profile) return
    await supabase.from('notifications').update({ read: true }).eq('user_id', profile.id).eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnread(0)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!profile) return null

  const initials = profile.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CW'
  const upcomingBookings = bookings.filter(b => b.check_in >= new Date().toISOString().split('T')[0] && b.status === 'confirmed')
  const pastBookings = bookings.filter(b => b.check_in < new Date().toISOString().split('T')[0] || b.status === 'completed')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-green-700 font-bold">
            <TreePine size={20} /> CamperWatch
          </Link>
          <div className="flex items-center gap-3">
            {unread > 0 && (
              <button onClick={() => setTab('notifications')} className="relative">
                <Bell size={20} className="text-gray-500" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unread}</span>
              </button>
            )}
            <button onClick={signOut} className="text-gray-400 hover:text-gray-600"><LogOut size={18} /></button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
              style={{ background: profile.avatar_color || '#16a34a' }}>
              {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full rounded-2xl object-cover" /> : initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="font-bold text-gray-900 text-lg leading-tight">{profile.full_name}</h1>
                {profile.role === 'admin' && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>}
                {profile.role === 'owner' && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">Owner</span>}
              </div>
              <p className="text-gray-400 text-sm">@{profile.username}</p>
              {profile.location && <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5"><MapPin size={11} />{profile.location}</p>}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-3">
            {editBio ? (
              <div className="space-y-2">
                <textarea value={bioText} onChange={e => setBioText(e.target.value)} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tell other campers about yourself..." />
                <div className="flex gap-2">
                  <button onClick={saveBio} className="px-4 py-1.5 bg-green-600 text-white text-xs rounded-lg font-medium">Save</button>
                  <button onClick={() => setEditBio(false)} className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">Cancel</button>
                </div>
              </div>
            ) : (
              <p onClick={() => setEditBio(true)} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                {profile.bio || <span className="text-gray-300 italic">Add a bio...</span>}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-gray-50">
            {[
              { label: 'Trips', value: trips.length || profile.camps_visited },
              { label: 'Followers', value: followers },
              { label: 'Following', value: following },
              { label: 'Referrals', value: referralCount },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-bold text-gray-900 text-lg">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Role-specific links */}
          {(profile.role === 'owner' || profile.role === 'admin') && (
            <div className="mt-3 pt-3 border-t border-gray-50 flex gap-2">
              {profile.role === 'owner' && (
                <Link href="/owner-dashboard" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-colors">
                  <Tent size={13} /> Owner Dashboard
                </Link>
              )}
              {profile.role === 'admin' && (
                <Link href="/admin" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-semibold hover:bg-purple-100 transition-colors">
                  <Award size={13} /> Admin Panel
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Upcoming bookings highlight */}
        {upcomingBookings.length > 0 && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 mb-4 text-white">
            <div className="text-xs font-medium text-green-100 mb-1">UPCOMING TRIP</div>
            <div className="font-bold text-lg">{campgrounds.find(c => c.slug === upcomingBookings[0].campground_slug)?.name || upcomingBookings[0].campground_slug}</div>
            <div className="text-green-100 text-sm mt-0.5">{upcomingBookings[0].check_in} → {upcomingBookings[0].check_out}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-mono text-green-100 text-xs">{upcomingBookings[0].booking_ref}</span>
              <span className="text-white font-bold">${upcomingBookings[0].total_price}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap relative ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              <t.icon size={12} />
              {t.label}
              {t.key === 'notifications' && unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" style={{fontSize: '9px'}}>{unread}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}

        {/* TRIPS */}
        {tab === 'trips' && (
          <div className="space-y-3">
            {trips.length === 0 && bookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <Tent size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-4">No trips yet. Start exploring!</p>
                <Link href="/search" className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors inline-block">
                  Find Campgrounds
                </Link>
              </div>
            ) : (
              <>
                {trips.map(trip => {
                  const camp = campgrounds.find(c => c.slug === trip.campground_slug)
                  return (
                    <Link key={trip.id} href={`/campground/${trip.campground_slug}`}
                      className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 hover:border-green-200 transition-colors">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                        <Tent size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">{camp?.name || trip.campground_slug}</div>
                        <div className="text-xs text-gray-400">{trip.visit_date}</div>
                        {trip.rating && (
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= trip.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />)}
                          </div>
                        )}
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </Link>
                  )
                })}
                {/* Past bookings as trips if no manual trips */}
                {trips.length === 0 && pastBookings.map(b => {
                  const camp = campgrounds.find(c => c.slug === b.campground_slug)
                  return (
                    <Link key={b.id} href={`/campground/${b.campground_slug}`}
                      className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 hover:border-green-200 transition-colors">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <Tent size={20} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">{camp?.name || b.campground_slug}</div>
                        <div className="text-xs text-gray-400">{b.check_in} → {b.check_out}</div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </Link>
                  )
                })}
              </>
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-4">No bookings yet.</p>
                <Link href="/search" className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 inline-block">
                  Find a Campground
                </Link>
              </div>
            ) : bookings.map(b => {
              const camp = campgrounds.find(c => c.slug === b.campground_slug)
              const isPast = b.check_in < new Date().toISOString().split('T')[0]
              return (
                <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{camp?.name || b.campground_slug}</div>
                      <div className="text-xs text-gray-400">{b.check_in} → {b.check_out}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      b.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>{b.status}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="font-mono text-xs text-gray-400">{b.booking_ref}</span>
                    <span className="font-bold text-green-700">${b.total_price}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* REFERRALS */}
        {tab === 'referrals' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="text-center mb-4">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <UserPlus size={24} className="text-green-600" />
                </div>
                <h2 className="font-bold text-gray-900">Invite Friends</h2>
                <p className="text-gray-400 text-sm mt-1">Share your unique link and grow the community</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <div className="text-xs text-gray-400 mb-1">Your invite link</div>
                <div className="font-mono text-sm text-gray-700 break-all">{typeof window !== 'undefined' ? `${window.location.origin}/auth/signup?ref=${profile.referral_code}` : `camperwatch.org/auth/signup?ref=${profile.referral_code}`}</div>
              </div>

              <div className="flex gap-2">
                <button onClick={copyReferral}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
                  {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy Link</>}
                </button>
                <button onClick={() => {
                  if (navigator.share) navigator.share({ title: 'Join CamperWatch', url: `${window.location.origin}/auth/signup?ref=${profile.referral_code}` })
                }}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <Share2 size={15} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <div className="text-3xl font-bold text-green-700 mb-1">{referralCount}</div>
              <div className="text-sm text-gray-500">friends invited</div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab === 'notifications' && (
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <Bell size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No notifications yet.</p>
              </div>
            ) : (
              <>
                {unread > 0 && (
                  <button onClick={markAllRead} className="w-full text-center text-xs text-green-700 font-medium py-2 hover:underline">
                    Mark all as read
                  </button>
                )}
                {notifications.map(n => (
                  <div key={n.id} className={`bg-white rounded-2xl border p-4 ${!n.read ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!n.read ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {n.type === 'booking_confirmed' && <Calendar size={14} className="text-green-600" />}
                        {n.type === 'new_follower' && <UserPlus size={14} className="text-blue-600" />}
                        {n.type === 'tip_upvoted' && <Heart size={14} className="text-red-500" />}
                        {!['booking_confirmed','new_follower','tip_upvoted'].includes(n.type) && <Bell size={14} className="text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{n.title}</div>
                        {n.body && <div className="text-xs text-gray-500 mt-0.5">{n.body}</div>}
                        <div className="text-xs text-gray-300 mt-1">{new Date(n.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
