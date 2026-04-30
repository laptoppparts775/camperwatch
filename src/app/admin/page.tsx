'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TreePine, Inbox, MapPin, Mail, CheckCircle, XCircle, Clock, RefreshCw, Eye, ChevronDown, ChevronUp, Users, MessageSquare, AlertCircle, Lightbulb, Building2 } from 'lucide-react'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'camperwatch2026'

type Submission = {
  id: string
  name: string
  address: string
  state: string
  owner_name: string
  owner_email: string
  status: string
  created_at: string
  description: string
  price_per_night: number
  site_types: string[]
  booking_url: string
}

type ContactMessage = {
  id: string
  reason: string
  campground_ref: string | null
  name: string
  email: string
  message: string
  status: string
  created_at: string
}

const reasonIcon: Record<string, React.ReactNode> = {
  correction: <AlertCircle size={14} className="text-red-500" />,
  tip: <Lightbulb size={14} className="text-amber-500" />,
  partnership: <Building2 size={14} className="text-blue-500" />,
  general: <MessageSquare size={14} className="text-gray-500" />,
}

const reasonLabel: Record<string, string> = {
  correction: 'Data Correction',
  tip: 'Insider Tip',
  partnership: 'Partnership',
  general: 'General',
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [tab, setTab] = useState<'submissions' | 'messages'>('submissions')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const login = () => {
    if (pw === ADMIN_PASSWORD) setAuthed(true)
    else alert('Wrong password')
  }

  const loadData = async () => {
    setLoading(true)
    const [{ data: subs }, { data: msgs }] = await Promise.all([
      supabase.from('campground_submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    ])
    setSubmissions(subs || [])
    setMessages(msgs || [])
    setLoading(false)
  }

  useEffect(() => { if (authed) loadData() }, [authed])

  const updateStatus = async (table: string, id: string, status: string) => {
    await supabase.from(table).update({ status }).eq('id', id)
    loadData()
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending:  'bg-amber-100 text-amber-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      read:     'bg-gray-100 text-gray-600',
    }
    return `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || map.pending}`
  }

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0e1a13] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <TreePine size={20} className="text-green-700" />
            <span className="font-bold text-gray-900">CamperWatch Admin</span>
          </div>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Admin password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button onClick={login} className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors">
            Sign in
          </button>
        </div>
      </div>
    )
  }

  const pendingSubs = submissions.filter(s => s.status === 'pending').length
  const unreadMsgs = messages.filter(m => m.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <TreePine size={20} className="text-green-700" />
          <span className="font-bold text-gray-900">CamperWatch Admin</span>
        </div>
        <button onClick={loadData} disabled={loading} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </header>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-3 flex gap-6">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} className="text-green-600" />
          <span className="text-gray-500">Submissions:</span>
          <span className="font-semibold text-gray-900">{submissions.length}</span>
          {pendingSubs > 0 && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">{pendingSubs} pending</span>}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail size={14} className="text-blue-600" />
          <span className="text-gray-500">Messages:</span>
          <span className="font-semibold text-gray-900">{messages.length}</span>
          {unreadMsgs > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{unreadMsgs} unread</span>}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('submissions')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'submissions' ? 'bg-green-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            Campground Submissions {pendingSubs > 0 && `(${pendingSubs})`}
          </button>
          <button
            onClick={() => setTab('messages')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'messages' ? 'bg-green-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            Contact Messages {unreadMsgs > 0 && `(${unreadMsgs})`}
          </button>
        </div>

        {/* Submissions tab */}
        {tab === 'submissions' && (
          <div className="space-y-3">
            {submissions.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100">No submissions yet.</div>
            )}
            {submissions.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MapPin size={16} className="text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.address} · {fmt(s.created_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className={statusBadge(s.status)}>{s.status}</span>
                    {expanded === s.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>

                {expanded === s.id && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-gray-400 text-xs">Owner</span><p className="font-medium text-gray-900">{s.owner_name}</p></div>
                      <div><span className="text-gray-400 text-xs">Email</span><p className="font-medium text-gray-900 break-all">{s.owner_email}</p></div>
                      <div><span className="text-gray-400 text-xs">State</span><p className="font-medium text-gray-900">{s.state}</p></div>
                      <div><span className="text-gray-400 text-xs">Price/night</span><p className="font-medium text-gray-900">${s.price_per_night}</p></div>
                      <div><span className="text-gray-400 text-xs">Site Types</span><p className="font-medium text-gray-900">{(s.site_types || []).join(', ')}</p></div>
                      {s.booking_url && <div><span className="text-gray-400 text-xs">Booking URL</span><a href={s.booking_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-xs break-all">{s.booking_url}</a></div>}
                    </div>
                    {s.description && (
                      <div>
                        <span className="text-gray-400 text-xs">Description</span>
                        <p className="text-sm text-gray-700 mt-1">{s.description}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => updateStatus('campground_submissions', s.id, 'approved')}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button
                        onClick={() => updateStatus('campground_submissions', s.id, 'rejected')}
                        className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                      <button
                        onClick={() => updateStatus('campground_submissions', s.id, 'pending')}
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                      >
                        <Clock size={14} /> Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Messages tab */}
        {tab === 'messages' && (
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100">No messages yet.</div>
            )}
            {messages.map(m => (
              <div key={m.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setExpanded(expanded === m.id ? null : m.id)
                    if (m.status === 'pending') updateStatus('contact_messages', m.id, 'read')
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0">{reasonIcon[m.reason] || reasonIcon.general}</div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {m.name}
                        {m.status === 'pending' && <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />}
                      </div>
                      <div className="text-xs text-gray-400">
                        {reasonLabel[m.reason] || 'General'}
                        {m.campground_ref && ` · ${m.campground_ref}`}
                        {' · '}{fmt(m.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className={statusBadge(m.status)}>{m.status}</span>
                    {expanded === m.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>

                {expanded === m.id && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-400 text-xs">Email</span><p className="font-medium text-gray-900">{m.email}</p></div>
                      {m.campground_ref && <div><span className="text-gray-400 text-xs">Campground</span><p className="font-medium text-gray-900">{m.campground_ref}</p></div>}
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">Message</span>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{m.message}</p>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <a
                        href={`mailto:${m.email}?subject=Re: Your CamperWatch ${reasonLabel[m.reason] || 'message'}`}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                      >
                        <Mail size={14} /> Reply via Email
                      </a>
                      <button
                        onClick={() => updateStatus('contact_messages', m.id, 'resolved')}
                        className="flex items-center gap-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                      >
                        <CheckCircle size={14} /> Mark Resolved
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
