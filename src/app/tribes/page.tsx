'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import { Users, MessageCircle, Plus, Send, ArrowLeft, Lightbulb, HelpCircle, AlertTriangle, Lock } from 'lucide-react'

const CATEGORY_ICONS: Record<string, string> = {
  general: '🏕', rv: '🚐', tent: '⛺', hiking: '🥾', family: '👨‍👩‍👧', solo: '🧍', state: '📍', campground: '🌲'
}

type Tribe = { id: string; name: string; description: string; slug: string; category: string; avatar_color: string; member_count: number; is_member?: boolean }
type TribeMsg = { id: string; user_id: string; message: string; type: string; created_at: string; profiles?: any }

export default function TribesPage() {
  const router = useRouter()
  const [tribes, setTribes] = useState<Tribe[]>([])
  const [activeTribe, setActiveTribe] = useState<Tribe | null>(null)
  const [messages, setMessages] = useState<TribeMsg[]>([])
  const [text, setText] = useState('')
  const [msgType, setMsgType] = useState<'message'|'tip'|'question'|'alert'>('message')
  const [user, setUser] = useState<any>(null)
  const [myProfile, setMyProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileView, setMobileView] = useState<'list'|'chat'>('list')
  const [creating, setCreating] = useState(false)
  const [newTribe, setNewTribe] = useState({ name: '', description: '', category: 'general' })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sb = getSupabase()
    sb.auth.getSession().then(async ({ data }: any) => {
      const u = data.session?.user
      setUser(u)
      if (u) {
        const { data: prof } = await sb.from('profiles').select('*').eq('id', u.id).single()
        setMyProfile(prof)
      }
      await loadTribes(u?.id)
    })
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function loadTribes(uid?: string) {
    const sb = getSupabase()
    const { data } = await sb.from('tribes').select('*').order('member_count', { ascending: false })
    if (!data) { setLoading(false); return }

    if (uid) {
      const { data: memberships } = await sb.from('tribe_members').select('tribe_id').eq('user_id', uid)
      const memberSet = new Set(memberships?.map(m => m.tribe_id) || [])
      setTribes(data.map(t => ({ ...t, is_member: memberSet.has(t.id) })))
    } else {
      setTribes(data)
    }
    setLoading(false)
  }

  async function joinTribe(tribe: Tribe) {
    if (!user) { router.push('/auth/login?redirect=/tribes'); return }
    const sb = getSupabase()
    await sb.from('tribe_members').insert({ tribe_id: tribe.id, user_id: user.id })
    await sb.from('tribes').update({ member_count: (tribe.member_count || 0) + 1 }).eq('id', tribe.id)
    setTribes(prev => prev.map(t => t.id === tribe.id ? { ...t, is_member: true, member_count: t.member_count + 1 } : t))
    openTribe({ ...tribe, is_member: true })
  }

  async function openTribe(tribe: Tribe) {
    const sb = getSupabase()
    setActiveTribe(tribe)
    setMobileView('chat')

    const { data } = await sb.from('tribe_messages')
      .select('*, profiles(username, full_name, avatar_color, avatar_url, privacy_display_name, privacy_avatar)')
      .eq('tribe_id', tribe.id)
      .order('created_at', { ascending: false })
      .limit(50)
    setMessages((data || []).reverse())

    sb.channel(`tribe:${tribe.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tribe_messages', filter: `tribe_id=eq.${tribe.id}` },
        async payload => {
          const { data: prof } = await sb.from('profiles').select('username,full_name,avatar_color,avatar_url,privacy_display_name,privacy_avatar').eq('id', payload.new.user_id).single()
          setMessages(prev => [...prev, { ...payload.new as TribeMsg, profiles: prof }])
        })
      .subscribe()
  }

  async function sendMessage() {
    if (!text.trim() || !activeTribe || !user) return
    await getSupabase().from('tribe_messages').insert({ tribe_id: activeTribe.id, user_id: user.id, message: text.trim(), type: msgType })
    setText(''); setMsgType('message')
  }

  async function createTribe() {
    if (!newTribe.name || !user) return
    const sb = getSupabase()
    const slug = newTribe.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
    const { data } = await sb.from('tribes').insert({ ...newTribe, slug, created_by: user.id, member_count: 1 }).select().single()
    if (data) {
      await sb.from('tribe_members').insert({ tribe_id: data.id, user_id: user.id, role: 'admin' })
      setTribes(prev => [{ ...data, is_member: true }, ...prev])
      setCreating(false)
      openTribe({ ...data, is_member: true })
    }
  }

  function getDisplayName(p: any) {
    if (!p) return 'Camper'
    switch (p.privacy_display_name) {
      case 'full_name': return p.full_name
      case 'anonymous': return 'A camper'
      default: return `@${p.username}`
    }
  }

  function timeAgo(ts: string) {
    const d = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
    if (d < 60) return 'now'
    if (d < 3600) return `${Math.floor(d/60)}m`
    if (d < 86400) return `${Math.floor(d/3600)}h`
    return new Date(ts).toLocaleDateString()
  }

  const TYPE_STYLE: Record<string, string> = {
    tip: 'bg-amber-50 border-amber-100',
    question: 'bg-blue-50 border-blue-100',
    alert: 'bg-red-50 border-red-100',
    message: 'bg-white',
  }
  const TYPE_ICONS_MSG: Record<string, any> = { tip: Lightbulb, question: HelpCircle, alert: AlertTriangle }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-5xl mx-auto px-0 sm:px-4 py-0 sm:py-6">
        <div className="flex h-[calc(100vh-120px)] bg-white sm:rounded-2xl sm:border border-gray-200 overflow-hidden">

          {/* Left — tribe list */}
          <div className={`w-full sm:w-72 border-r border-gray-100 flex flex-col ${mobileView === 'chat' ? 'hidden sm:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h1 className="font-bold text-gray-900 flex items-center gap-2"><Users size={18} className="text-green-600" /> Tribes</h1>
              {user && <button onClick={() => setCreating(true)} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"><Plus size={16} /></button>}
            </div>

            {creating && (
              <div className="p-4 border-b border-gray-100 bg-green-50">
                <div className="text-xs font-bold text-green-800 mb-2">Create a tribe</div>
                <input value={newTribe.name} onChange={e => setNewTribe(n => ({...n, name: e.target.value}))}
                  placeholder="Tribe name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                <textarea value={newTribe.description} onChange={e => setNewTribe(n => ({...n, description: e.target.value}))}
                  placeholder="What's it about?" rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500" />
                <select value={newTribe.category} onChange={e => setNewTribe(n => ({...n, category: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none">
                  {Object.entries(CATEGORY_ICONS).map(([k,v]) => <option key={k} value={k}>{v} {k}</option>)}
                </select>
                <div className="flex gap-2">
                  <button onClick={createTribe} disabled={!newTribe.name} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold disabled:opacity-40">Create</button>
                  <button onClick={() => setCreating(false)} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs">Cancel</button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {loading ? <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div> :
                tribes.map(t => (
                  <button key={t.id} onClick={() => t.is_member ? openTribe(t) : joinTribe(t)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors text-left ${activeTribe?.id === t.id ? 'bg-green-50' : ''}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{background: t.avatar_color + '20'}}>
                      {CATEGORY_ICONS[t.category] || '🏕'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.member_count} members</div>
                    </div>
                    {!t.is_member && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">Join</span>}
                  </button>
                ))
              }
            </div>
          </div>

          {/* Right — tribe chat */}
          <div className={`flex-1 flex flex-col ${mobileView === 'list' ? 'hidden sm:flex' : 'flex'}`}>
            {!activeTribe ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="text-5xl mb-4">🏕</div>
                  <p className="text-gray-500 font-semibold mb-1">Join a tribe</p>
                  <p className="text-gray-400 text-sm">Connect with campers who share your passion. RVers, solo adventurers, families, national park chasers — find your people.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  <button onClick={() => { setMobileView('list'); setActiveTribe(null) }} className="sm:hidden text-gray-400"><ArrowLeft size={18} /></button>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{background: activeTribe.avatar_color + '20'}}>{CATEGORY_ICONS[activeTribe.category]}</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-sm">{activeTribe.name}</div>
                    <div className="text-xs text-gray-400">{activeTribe.member_count} members · {activeTribe.description}</div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No messages yet — be the first!</p>
                      <p className="text-gray-300 text-xs mt-1">Share tips, ask questions, post alerts</p>
                    </div>
                  )}
                  {messages.map(msg => {
                    const isOwn = user?.id === msg.user_id
                    const TypeIcon = TYPE_ICONS_MSG[msg.type]
                    const name = getDisplayName(msg.profiles)
                    const initials = (msg.profiles?.full_name || msg.profiles?.username || 'C').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                    return (
                      <div key={msg.id} className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                        {msg.profiles?.privacy_avatar !== 'hidden' ? (
                          msg.profiles?.avatar_url && msg.profiles?.privacy_avatar === 'show'
                            ? <img src={msg.profiles.avatar_url} className="w-7 h-7 rounded-full object-cover shrink-0" alt="" />
                            : <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{background: msg.profiles?.avatar_color || '#6b7280'}}>{initials}</div>
                        ) : <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />}
                        <div className={`max-w-xs ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                          {!isOwn && <span className="text-xs text-gray-500 mb-0.5 px-1">{name}</span>}
                          <div className={`rounded-2xl px-3 py-2 text-sm border ${isOwn ? 'bg-green-600 text-white border-transparent rounded-br-sm' : `${TYPE_STYLE[msg.type]} rounded-bl-sm`}`}>
                            {TypeIcon && !isOwn && (
                              <div className="flex items-center gap-1 mb-1 opacity-70">
                                <TypeIcon size={11} /><span className="text-xs font-semibold capitalize">{msg.type}</span>
                              </div>
                            )}
                            {msg.message}
                          </div>
                          <span className="text-xs text-gray-300 mt-0.5 px-1">{timeAgo(msg.created_at)}</span>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>

                {user && activeTribe.is_member ? (
                  <div className="p-3 border-t border-gray-100 bg-white">
                    <div className="flex gap-1 mb-2">
                      {(['message','tip','question','alert'] as const).map(t => {
                        const icons = { message: MessageCircle, tip: Lightbulb, question: HelpCircle, alert: AlertTriangle }
                        const Icon = icons[t]
                        return (
                          <button key={t} onClick={() => setMsgType(t)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${msgType === t ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:bg-gray-50'}`}>
                            <Icon size={11} />{t}
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input value={text} onChange={e => setText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                        placeholder={msgType === 'tip' ? 'Share a tip...' : msgType === 'question' ? 'Ask the tribe...' : msgType === 'alert' ? 'Post a condition alert...' : 'Say something...'}
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                      <button onClick={sendMessage} disabled={!text.trim()} className="p-2 bg-green-600 text-white rounded-xl disabled:opacity-40 hover:bg-green-700">
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                ) : !user ? (
                  <div className="p-3 border-t border-gray-100 text-center">
                    <a href="/auth/login?redirect=/tribes" className="text-sm text-green-700 font-medium hover:underline">Sign in to join this tribe</a>
                  </div>
                ) : (
                  <div className="p-3 border-t border-gray-100 text-center">
                    <button onClick={() => joinTribe(activeTribe)} className="text-sm text-green-700 font-semibold hover:underline">Join this tribe to chat</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
