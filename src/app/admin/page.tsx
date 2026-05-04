'use client'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import { Users, Tent, Calendar, DollarSign, CheckCircle, XCircle, Clock, Search, UserPlus, Send, Shield, TrendingUp, AlertCircle, MapPin, Star, Phone, Mail, ExternalLink, RefreshCw } from 'lucide-react'

const ADMIN_EMAILS = ['lubiarz.tek@gmail.com', 'picinski@gmail.com', 'dawoodanialtaaf@gmail.com']

export default function AdminPage() {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [submissions, setSubmissions] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [photos, setPhotos] = useState<any[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('camper')
  const [inviting, setInviting] = useState(false)
  const [inviteDone, setInviteDone] = useState(false)
  const [emailTestTo, setEmailTestTo] = useState('')
  const [emailTestSending, setEmailTestSending] = useState(false)
  const [emailTestResult, setEmailTestResult] = useState<{ ok: boolean; msg: string } | null>(null)
  const [stats, setStats] = useState({ users: 0, bookings: 0, revenue: 0, pending: 0, owners: 0, campers: 0, pendingPhotos: 0 })
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    getSupabase().auth.getUser().then(({ data }: any) => {
      if (!data.user || !ADMIN_EMAILS.includes(data.user.email || '')) { router.push('/'); return }
      setAllowed(true)
      load()
    })
  }, [])

  async function load() {
    setRefreshing(true)
    const sb = getSupabase()
    const [subRes, userRes, bookRes, photoRes] = await Promise.all([
      sb.from('campground_submissions').select('*').order('created_at', { ascending: false }),
      sb.from('profiles').select('*').order('created_at', { ascending: false }),
      sb.from('bookings').select('*').order('created_at', { ascending: false }),
      sb.from('user_images').select('*').order('created_at', { ascending: false }),
    ])
    const subs = subRes.data || []
    const usrs = userRes.data || []
    const bks = bookRes.data || []
    setSubmissions(subs)
    setUsers(usrs)
    setBookings(bks)
    setPhotos(photoRes.data || [])
    setStats({
      users: usrs.length,
      bookings: bks.length,
      revenue: bks.filter(b => b.status === 'confirmed').reduce((s: number, b: any) => s + (b.commission_amount || 0), 0),
      pending: subs.filter(s => s.status === 'pending').length,
      pendingPhotos: (photoRes.data || []).filter((p: any) => !p.approved).length,
      owners: usrs.filter(u => u.role === 'owner').length,
      campers: usrs.filter(u => u.role === 'camper').length,
    })
    setLoading(false)
    setRefreshing(false)
  }

  async function updateSub(id: string, status: string) {
    await getSupabase().from('campground_submissions').update({ status }).eq('id', id)
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    setStats(prev => ({ ...prev, pending: prev.pending - 1 }))
  }

  async function updateRole(userId: string, role: string) {
    await getSupabase().from('profiles').update({ role }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
  }

  async function approvePhoto(id: string) {
    await getSupabase().from('user_images').update({ approved: true }).eq('id', id)
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, approved: true } : p))
    setStats(prev => ({ ...prev, pendingPhotos: Math.max(0, prev.pendingPhotos - 1) }))
  }

  async function rejectPhoto(id: string) {
    await getSupabase().from('user_images').delete().eq('id', id)
    setPhotos(prev => prev.filter(p => p.id !== id))
    setStats(prev => ({ ...prev, pendingPhotos: Math.max(0, prev.pendingPhotos - 1) }))
  }

  async function sendInvite() {
    if (!inviteEmail) return
    setInviting(true)
    await getSupabase().auth.signInWithOtp({
      email: inviteEmail,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?role=${inviteRole}` }
    })
    setInviting(false); setInviteDone(true); setInviteEmail('')
    setTimeout(() => setInviteDone(false), 3000)
  }

  async function sendTestEmail() {
    if (!emailTestTo || emailTestSending) return
    setEmailTestSending(true)
    setEmailTestResult(null)
    try {
      const { data: sessionData } = await getSupabase().auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) {
        setEmailTestResult({ ok: false, msg: 'No active session — please log in again.' })
        setEmailTestSending(false)
        return
      }
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ to: emailTestTo }),
      })
      const json = await res.json()
      if (res.ok && json.ok) {
        setEmailTestResult({ ok: true, msg: `Sent to ${emailTestTo} — check inbox in 30s. Resend ID: ${json.id}` })
      } else {
        setEmailTestResult({ ok: false, msg: json.error || `HTTP ${res.status}` })
      }
    } catch (err: any) {
      setEmailTestResult({ ok: false, msg: err?.message || 'Request failed' })
    }
    setEmailTestSending(false)
  }

  if (loading || !allowed) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const filteredUsers = users.filter(u => !userSearch || u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || u.username?.toLowerCase().includes(userSearch.toLowerCase()) || u.role?.includes(userSearch.toLowerCase()))

  const TABS = [
    { key: 'overview', label: 'Overview', badge: null },
    { key: 'submissions', label: 'Submissions', badge: stats.pending > 0 ? stats.pending : null },
    { key: 'users', label: 'Users', badge: null },
    { key: 'bookings', label: 'Bookings', badge: null },
    { key: 'invite', label: 'Invite', badge: null },
    { key: 'photos', label: 'Photos', badge: stats.pendingPhotos > 0 ? stats.pendingPhotos : null },
    { key: 'email', label: 'Email', badge: null },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield size={22} className="text-purple-600" /> Admin Panel
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">CamperWatch platform overview</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Campers', value: stats.campers, icon: Tent, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Owners', value: stats.owners, icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'CW Revenue', value: `$${stats.revenue.toFixed(0)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Bookings', value: stats.bookings, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Pending Review', value: stats.pending, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center mb-2`}>
                <s.icon size={16} className={s.color} />
              </div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              {t.label}
              {t.badge && <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center" style={{fontSize:'9px'}}>{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calendar size={16} className="text-indigo-500" /> Recent Bookings</h2>
              {bookings.length === 0 ? <p className="text-gray-400 text-sm">No bookings yet</p> : bookings.slice(0, 6).map(b => (
                <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{b.guest_name}</div>
                    <div className="text-xs text-gray-400">{b.campground_slug} · {b.check_in}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-700">${b.commission_amount?.toFixed(0)}<span className="text-xs text-gray-400 font-normal"> CW</span></div>
                    <div className="text-xs text-gray-400">${b.total_price} total</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><AlertCircle size={16} className="text-amber-500" /> Pending Submissions</h2>
              {submissions.filter(s => s.status === 'pending').length === 0 ? (
                <p className="text-gray-400 text-sm">No pending submissions</p>
              ) : submissions.filter(s => s.status === 'pending').slice(0, 4).map(s => (
                <div key={s.id} className="py-2.5 border-b border-gray-50 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.state} · {s.owner_name}</div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => updateSub(s.id, 'approved')} className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">✓ Approve</button>
                      <button onClick={() => updateSub(s.id, 'rejected')} className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium">✗</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Users size={16} className="text-blue-500" /> Recent Users</h2>
              {users.slice(0, 6).map(u => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: u.avatar_color || '#16a34a' }}>
                      {u.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{u.full_name}</div>
                      <div className="text-xs text-gray-400">@{u.username}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'owner' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{u.role}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-green-500" /> Platform health</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Campgrounds listed</span>
                  <span className="font-bold text-gray-900">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending approvals</span>
                  <span className={`font-bold ${stats.pending > 0 ? 'text-red-600' : 'text-gray-900'}`}>{stats.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversion rate</span>
                  <span className="font-bold text-gray-900">{stats.users > 0 ? ((stats.bookings / stats.users) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg booking value</span>
                  <span className="font-bold text-gray-900">${stats.bookings > 0 ? (bookings.reduce((s, b) => s + (b.total_price || 0), 0) / bookings.length).toFixed(0) : 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBMISSIONS */}
        {tab === 'submissions' && (
          <div className="space-y-3">
            {submissions.length === 0 && <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400">No submissions yet</div>}
            {submissions.map(s => (
              <div key={s.id} className={`bg-white rounded-2xl border p-5 ${s.status === 'pending' ? 'border-amber-200' : 'border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{s.name}</div>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={13} /> {s.address || s.state}</span>
                      <span className="flex items-center gap-1"><DollarSign size={13} /> ${s.price_per_night}/night</span>
                      {s.phone && <span className="flex items-center gap-1"><Phone size={13} /> {s.phone}</span>}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Owner: <strong>{s.owner_name}</strong> · <a href={`mailto:${s.owner_email}`} className="text-blue-600">{s.owner_email}</a>
                    </div>
                    {s.site_types?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {s.site_types.map((t: string) => <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{t}</span>)}
                      </div>
                    )}
                    {s.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{s.description}</p>}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${s.status === 'pending' ? 'bg-amber-100 text-amber-700' : s.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {s.status}
                  </span>
                </div>
                {s.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-50">
                    <button onClick={() => updateSub(s.id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
                      <CheckCircle size={15} /> Approve & notify owner
                    </button>
                    <button onClick={() => updateSub(s.id, 'rejected')}
                      className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
                      Reject
                    </button>
                  </div>
                )}
                <div className="text-xs text-gray-300 mt-2">{new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                placeholder="Search by name, username, or role..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="text-xs text-gray-400 px-1">{filteredUsers.length} users</div>
            {filteredUsers.map(u => (
              <div key={u.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                  style={{ background: u.avatar_color || '#16a34a' }}>
                  {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full rounded-full object-cover" alt="" /> : u.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{u.full_name}</div>
                  <div className="text-sm text-gray-400">@{u.username}</div>
                  <div className="text-xs text-gray-300 mt-0.5">Joined {new Date(u.created_at).toLocaleDateString()}</div>
                </div>
                <select value={u.role} onChange={e => updateRole(u.id, e.target.value)}
                  className={`text-xs px-3 py-1.5 rounded-xl border-2 font-semibold cursor-pointer focus:outline-none ${u.role === 'admin' ? 'bg-purple-50 border-purple-200 text-purple-700' : u.role === 'owner' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                  <option value="camper">Camper</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 && <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400">No bookings yet</div>}
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <div className="font-mono text-xs font-bold text-green-700 mb-1">{b.booking_ref}</div>
                    <div className="font-semibold text-gray-900">{b.guest_name}</div>
                    <div className="text-sm text-gray-400">{b.guest_email}</div>
                    <div className="text-sm text-gray-500 mt-1">{b.campground_slug} · {b.check_in} → {b.check_out}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-700 text-lg">${b.commission_amount?.toFixed(0)} <span className="text-xs text-gray-400 font-normal">CW cut</span></div>
                    <div className="text-sm text-gray-400">${b.total_price} total</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{b.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INVITE */}
        {tab === 'invite' && (
          <div className="max-w-md bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><UserPlus size={16} className="text-green-500" /> Invite someone</h2>
            <p className="text-gray-400 text-sm mb-5">Send a magic link. They'll sign up with the role you set.</p>
            <div className="space-y-3">
              <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                placeholder="email@address.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <div>
                <label className="text-xs text-gray-500 block mb-1">Role</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="camper">Camper</option>
                  <option value="owner">Campground Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {inviteDone && <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700"><CheckCircle size={15} /> Invite sent!</div>}
              <button onClick={sendInvite} disabled={inviting || !inviteEmail}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 disabled:opacity-40">
                {inviting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={15} /> Send invite</>}
              </button>
            </div>
          </div>
        )}


        {tab === 'photos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Photo approvals</h2>
              <span className="text-xs text-gray-400">{photos.filter(p => !p.approved).length} pending · {photos.filter(p => p.approved).length} approved</span>
            </div>
            {photos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400">No photos uploaded yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {photos.filter(p => !p.approved).concat(photos.filter(p => p.approved)).map((photo: any) => (
                  <div key={photo.id} className={"bg-white rounded-2xl border p-4 flex flex-col gap-3 " + (photo.approved ? 'border-green-200 opacity-60' : 'border-gray-200')}>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <img src={photo.url} alt={photo.alt || 'Campground photo'} className="w-full h-full object-cover" />
                      {photo.approved && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">Approved</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 space-y-0.5">
                      <div className="font-medium text-gray-700 truncate">{photo.campground_id}</div>
                      {photo.caption && <div className="truncate">{photo.caption}</div>}
                      <div className="text-gray-400">{new Date(photo.created_at).toLocaleDateString()}</div>
                    </div>
                    {!photo.approved && (
                      <div className="flex gap-2">
                        <button onClick={() => approvePhoto(photo.id)}
                          className="flex-1 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors">
                          ✓ Approve
                        </button>
                        <button onClick={() => rejectPhoto(photo.id)}
                          className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
                          ✕ Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === 'email' && (
          <div className="max-w-md bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><Mail size={16} className="text-green-500" /> Send test email</h2>
            <p className="text-gray-400 text-sm mb-5">Sends a branded test email through Resend to verify the pipeline. Use your own Gmail.</p>
            <div className="space-y-3">
              <input
                type="email"
                value={emailTestTo}
                onChange={e => setEmailTestTo(e.target.value)}
                placeholder="your-real-email@gmail.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {emailTestResult && (
                <div className={`flex items-start gap-2 rounded-xl p-3 text-sm ${emailTestResult.ok ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                  {emailTestResult.ok ? <CheckCircle size={15} className="mt-0.5 flex-shrink-0" /> : <XCircle size={15} className="mt-0.5 flex-shrink-0" />}
                  <span className="break-all">{emailTestResult.msg}</span>
                </div>
              )}
              <button
                onClick={sendTestEmail}
                disabled={emailTestSending || !emailTestTo}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 disabled:opacity-40">
                {emailTestSending
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><Send size={15} /> Send test</>
                }
              </button>
              <p className="text-xs text-gray-400">Sender: info@camperwatch.org &middot; Branded layout &middot; Logged to outbound_emails table</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
