'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TreePine, Users, Tent, Calendar, DollarSign, CheckCircle, XCircle, Clock, Search, UserPlus, Send, Shield, TrendingUp, AlertCircle } from 'lucide-react'

const ADMIN_EMAILS = ['lubiarz.tek@gmail.com', 'picinski@gmail.com', 'dawoodanialtaaf@gmail.com']

type Submission = { id: string; name: string; state: string; owner_name: string; owner_email: string; status: string; created_at: string; price_per_night: number; site_types: string[] }
type User = { id: string; username: string; full_name: string; role: string; created_at: string; camps_visited: number; referral_code: string }
type Booking = { id: string; booking_ref: string; campground_slug: string; guest_name: string; guest_email: string; total_price: number; status: string; check_in: string; created_at: string; commission_amount: number }

const TABS = [
  { key: 'overview', label: 'Overview', icon: TrendingUp },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'submissions', label: 'Submissions', icon: Tent },
  { key: 'bookings', label: 'Bookings', icon: Calendar },
  { key: 'invite', label: 'Invite', icon: UserPlus },
]

export default function AdminPage() {
  const router = useRouter()
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [allowed, setAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('camper')
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, totalRevenue: 0, pendingSubmissions: 0 })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user || !ADMIN_EMAILS.includes(data.user.email || '')) {
        router.push('/')
        return
      }
      setAllowed(true)
      loadAll()
    })
  }, [])

  async function loadAll() {
    const [subRes, userRes, bookRes] = await Promise.all([
      supabase.from('campground_submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
    ])
    const subs = subRes.data || []
    const usrs = userRes.data || []
    const bks = bookRes.data || []
    setSubmissions(subs)
    setUsers(usrs)
    setBookings(bks)
    setStats({
      totalUsers: usrs.length,
      totalBookings: bks.length,
      totalRevenue: bks.filter((b: Booking) => b.status === 'confirmed').reduce((s: number, b: Booking) => s + (b.commission_amount || 0), 0),
      pendingSubmissions: subs.filter((s: Submission) => s.status === 'pending').length,
    })
    setLoading(false)
  }

  async function updateSubmission(id: string, status: string) {
    await supabase.from('campground_submissions').update({ status }).eq('id', id)
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    setStats(prev => ({ ...prev, pendingSubmissions: prev.pendingSubmissions - 1 }))
  }

  async function updateUserRole(userId: string, role: string) {
    await supabase.from('profiles').update({ role }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
  }

  async function sendInvite() {
    if (!inviteEmail) return
    setInviting(true)
    // Send magic link invite via Supabase
    const { error } = await supabase.auth.signInWithOtp({
      email: inviteEmail,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?role=${inviteRole}` }
    })
    setInviting(false)
    if (!error) { setInviteSuccess(true); setInviteEmail(''); setTimeout(() => setInviteSuccess(false), 3000) }
  }

  if (loading || !allowed) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const filteredUsers = users.filter(u =>
    !userSearch || u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || u.username?.toLowerCase().includes(userSearch.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-green-700 font-bold">
              <TreePine size={20} /> CamperWatch
            </Link>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Shield size={10} /> Admin
            </span>
          </div>
          <Link href="/profile" className="text-sm text-gray-500 hover:text-gray-700">My Profile</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'CW Revenue', value: `$${stats.totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Bookings', value: stats.totalBookings, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Pending Review', value: stats.pendingSubmissions, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon size={18} className={s.color} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              <t.icon size={12} /> {t.label}
              {t.key === 'submissions' && stats.pendingSubmissions > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center" style={{fontSize:'9px'}}>{stats.pendingSubmissions}</span>
              )}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Recent Bookings</h2>
              <div className="space-y-3">
                {bookings.slice(0, 5).map(b => (
                  <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{b.guest_name}</div>
                      <div className="text-xs text-gray-400">{b.campground_slug} · {b.check_in}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-700">${b.commission_amount?.toFixed(0)} CW</div>
                      <div className="text-xs text-gray-400">${b.total_price} total</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Recent Users</h2>
              <div className="space-y-2">
                {users.slice(0, 5).map(u => (
                  <div key={u.id} className="flex items-center justify-between py-1.5">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{u.full_name}</div>
                      <div className="text-xs text-gray-400">@{u.username}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'owner' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-500'}`}>{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                placeholder="Search users..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            {filteredUsers.map(u => (
              <div key={u.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{u.full_name}</div>
                    <div className="text-sm text-gray-400">@{u.username}</div>
                    <div className="text-xs text-gray-300 mt-0.5">Referral: {u.referral_code}</div>
                  </div>
                  <select value={u.role} onChange={e => updateUserRole(u.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-lg border-0 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'owner' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'}`}>
                    <option value="camper">Camper</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="mt-2 text-xs text-gray-300">Joined {new Date(u.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}

        {/* SUBMISSIONS */}
        {tab === 'submissions' && (
          <div className="space-y-3">
            {submissions.map(s => (
              <div key={s.id} className={`bg-white rounded-2xl border p-5 ${s.status === 'pending' ? 'border-amber-200' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{s.name}</div>
                    <div className="text-sm text-gray-500">{s.state} · ${s.price_per_night}/night</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.owner_name} · {s.owner_email}</div>
                    {s.site_types?.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {s.site_types.map(t => <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    s.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    s.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-600'}`}>{s.status}</span>
                </div>
                {s.status === 'pending' && (
                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button onClick={() => updateSubmission(s.id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
                      <CheckCircle size={15} /> Approve
                    </button>
                    <button onClick={() => updateSubmission(s.id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                )}
                <div className="text-xs text-gray-300 mt-2">{new Date(s.created_at).toLocaleDateString()}</div>
              </div>
            ))}
            {submissions.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <Tent size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No submissions yet.</p>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-xs text-green-700 font-bold mb-1">{b.booking_ref}</div>
                    <div className="font-semibold text-gray-900 text-sm">{b.guest_name}</div>
                    <div className="text-xs text-gray-400">{b.guest_email}</div>
                    <div className="text-xs text-gray-500 mt-1">{b.campground_slug} · {b.check_in}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-700">${b.commission_amount?.toFixed(0)} <span className="font-normal text-xs text-gray-400">CW</span></div>
                    <div className="text-xs text-gray-400">${b.total_price} total</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      b.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-500'}`}>{b.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INVITE */}
        {tab === 'invite' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-md">
            <h2 className="font-bold text-gray-900 mb-1">Invite a User</h2>
            <p className="text-gray-400 text-sm mb-5">Send a magic link invite. They'll land with the correct role set.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Email address</label>
                <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Role</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="camper">Camper</option>
                  <option value="owner">Campground Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {inviteSuccess && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                  <CheckCircle size={15} /> Invite sent successfully!
                </div>
              )}
              <button onClick={sendInvite} disabled={inviting || !inviteEmail}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-40">
                {inviting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={15} /> Send Invite</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
