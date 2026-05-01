'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import { Send, Search, MessageCircle, ArrowLeft, Lock, User, Check, CheckCheck } from 'lucide-react'
import { Suspense } from 'react'

type Thread = {
  id: string
  other_user: { id: string; username: string; full_name: string; avatar_color: string; avatar_url: string | null; privacy_display_name: string; privacy_avatar: string }
  last_message: string
  last_message_at: string
  unread: number
}

type Message = {
  id: string
  from_user: string
  to_user: string
  message: string
  read: boolean
  created_at: string
}

function getDisplayName(u: { username: string; full_name: string; privacy_display_name: string }, isOwn = false) {
  if (isOwn) return u.full_name || u.username
  switch (u.privacy_display_name) {
    case 'full_name': return u.full_name
    case 'anonymous': return 'A camper'
    default: return `@${u.username}`
  }
}

function getAvatar(u: { avatar_url: string | null; avatar_color: string; full_name: string; username: string; privacy_display_name: string; privacy_avatar: string }) {
  if (u.privacy_avatar === 'hidden') return { type: 'hidden' as const }
  if (u.privacy_avatar === 'show' && u.avatar_url) return { type: 'image' as const, url: u.avatar_url }
  const name = u.privacy_display_name === 'anonymous' ? 'A' :
    (u.full_name || u.username || 'C').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return { type: 'initials' as const, initials: name, color: u.avatar_color || '#16a34a' }
}

function Avatar({ u, size = 10 }: { u: any; size?: number }) {
  const av = getAvatar(u)
  const cls = `w-${size} h-${size} rounded-full flex items-center justify-center shrink-0 overflow-hidden`
  if (av.type === 'hidden') return <div className={`${cls} bg-gray-200`}><User size={size * 2} className="text-gray-400" /></div>
  if (av.type === 'image') return <div className={cls}><img src={av.url} className="w-full h-full object-cover" alt="" /></div>
  return <div className={`${cls} text-white text-xs font-bold`} style={{ background: av.color }}>{av.initials}</div>
}

function MessagesInner() {
  const router = useRouter()
  const params = useSearchParams()
  const toUser = params.get('to')

  const [myUser, setMyUser] = useState<any>(null)
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeThread, setActiveThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileView, setMobileView] = useState<'threads' | 'chat'>('threads')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sb = getSupabase()
    sb.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user
      if (!user) { router.push('/auth/login?redirect=/messages'); return }

      // Get profile
      const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single()
      setMyUser({ ...user, profile })

      // Load threads (conversations this user is in)
      const { data: dms } = await sb.from('dm_threads').select('*')
        .or(`user_one.eq.${user.id},user_two.eq.${user.id}`)
        .order('last_message_at', { ascending: false })

      if (dms) {
        const enriched = await Promise.all(dms.map(async dm => {
          const otherId = dm.user_one === user.id ? dm.user_two : dm.user_one
          const { data: other } = await sb.from('profiles').select('id,username,full_name,avatar_color,avatar_url,privacy_display_name,privacy_avatar').eq('id', otherId).single()
          return {
            ...dm,
            other_user: other,
            unread: dm.user_one === user.id ? dm.unread_one : dm.unread_two
          }
        }))
        setThreads(enriched.filter(t => t.other_user))
      }
      setLoading(false)

      // If ?to= param, open that conversation
      if (toUser) openThread(toUser, user.id)
    })
  }, [])

  const isInitialLoad = useRef(true)
  useEffect(() => {
    if (isInitialLoad.current) { isInitialLoad.current = false; return }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function openThread(otherId: string, myId?: string) {
    const sb = getSupabase()
    const uid = myId || myUser?.id
    if (!uid) return

    // Get other user profile
    const { data: other } = await sb.from('profiles').select('id,username,full_name,avatar_color,avatar_url,privacy_display_name,privacy_avatar').eq('id', otherId).single()
    if (!other) return

    // Load messages
    const { data: msgs } = await sb.from('direct_messages')
      .select('*')
      .or(`and(from_user.eq.${uid},to_user.eq.${otherId}),and(from_user.eq.${otherId},to_user.eq.${uid})`)
      .order('created_at', { ascending: true })
      .limit(100)

    setMessages(msgs || [])
    setActiveThread({ id: otherId, other_user: other, last_message: '', last_message_at: '', unread: 0 })
    setMobileView('chat')

    // Mark as read
    if (msgs?.some(m => m.to_user === uid && !m.read)) {
      await sb.from('direct_messages').update({ read: true }).eq('to_user', uid).eq('from_user', otherId)
    }

    // Subscribe to new messages
    sb.channel(`dm:${[uid, otherId].sort().join('-')}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' }, payload => {
        const msg = payload.new as Message
        if ((msg.from_user === uid && msg.to_user === otherId) || (msg.from_user === otherId && msg.to_user === uid)) {
          setMessages(prev => [...prev, msg])
        }
      })
      .subscribe()
  }

  async function sendMessage() {
    if (!text.trim() || !activeThread || !myUser) return
    const sb = getSupabase()
    const uid = myUser.id
    const otherId = activeThread.other_user.id

    await sb.from('direct_messages').insert({
      from_user: uid,
      to_user: otherId,
      message: text.trim(),
    })

    // Update/create thread
    await sb.from('dm_threads').upsert({
      user_one: [uid, otherId].sort()[0],
      user_two: [uid, otherId].sort()[1],
      last_message: text.trim(),
      last_message_at: new Date().toISOString(),
    }, { onConflict: 'user_one,user_two' })

    setText('')
  }

  async function searchUsers(q: string) {
    if (!q.trim()) { setSearchResults([]); return }
    const { data } = await getSupabase().from('profiles')
      .select('id,username,full_name,avatar_color,avatar_url,privacy_display_name,privacy_avatar,privacy_dm')
      .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`)
      .neq('id', myUser?.id)
      .limit(8)
    setSearchResults(data || [])
  }

  function timeAgo(ts: string) {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
    if (diff < 60) return 'now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return new Date(ts).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-5xl mx-auto px-0 sm:px-4 py-0 sm:py-6">
        <div className="flex h-[calc(100vh-120px)] bg-white sm:rounded-2xl sm:border border-gray-200 overflow-hidden">

          {/* Left — thread list */}
          <div className={`w-full sm:w-80 border-r border-gray-100 flex flex-col ${mobileView === 'chat' ? 'hidden sm:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-100">
              <h1 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MessageCircle size={18} className="text-green-600" /> Messages
              </h1>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); searchUsers(e.target.value) }}
                  placeholder="Find a camper..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              {searchResults.length > 0 && (
                <div className="mt-2 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
                  {searchResults.map(u => (
                    <button key={u.id} onClick={() => { setSearch(''); setSearchResults([]); openThread(u.id) }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left">
                      <Avatar u={u} size={8} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{getDisplayName(u)}</div>
                        {u.privacy_dm === 'nobody' && <div className="text-xs text-gray-400 flex items-center gap-1"><Lock size={10} /> DMs disabled</div>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading && <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>}
              {!loading && threads.length === 0 && (
                <div className="text-center py-12 px-6">
                  <MessageCircle size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-1">No messages yet</p>
                  <p className="text-gray-300 text-xs">Search for a camper to start a conversation</p>
                </div>
              )}
              {threads.map(t => (
                <button key={t.id} onClick={() => openThread(t.other_user.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 ${activeThread?.other_user.id === t.other_user.id ? 'bg-green-50' : ''}`}>
                  <div className="relative">
                    <Avatar u={t.other_user} size={10} />
                    {t.unread > 0 && <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white" style={{fontSize:'9px'}}>{t.unread}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm truncate ${t.unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{getDisplayName(t.other_user)}</span>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">{timeAgo(t.last_message_at)}</span>
                    </div>
                    <div className={`text-xs truncate ${t.unread > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{t.last_message}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right — chat */}
          <div className={`flex-1 flex flex-col ${mobileView === 'threads' ? 'hidden sm:flex' : 'flex'}`}>
            {!activeThread ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">Select a conversation</p>
                  <p className="text-gray-300 text-sm mt-1">or search for a camper to message</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  <button onClick={() => { setMobileView('threads'); setActiveThread(null) }} className="sm:hidden text-gray-400">
                    <ArrowLeft size={18} />
                  </button>
                  <Avatar u={activeThread.other_user} size={9} />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{getDisplayName(activeThread.other_user)}</div>
                    <div className="text-xs text-gray-400">
                      {activeThread.other_user.privacy_display_name === 'anonymous' ? 'Identity protected' : `@${activeThread.other_user.username}`}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">Start the conversation</p>
                      <p className="text-gray-300 text-xs mt-1">Your messages are private</p>
                    </div>
                  )}
                  {messages.map(msg => {
                    const isOwn = msg.from_user === myUser?.id
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-sm ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className={`rounded-2xl px-4 py-2.5 text-sm ${isOwn ? 'bg-green-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
                            {msg.message}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5 px-1">
                            <span className="text-xs text-gray-300">{timeAgo(msg.created_at)}</span>
                            {isOwn && (msg.read ? <CheckCheck size={12} className="text-green-500" /> : <Check size={12} className="text-gray-300" />)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2 items-end">
                    <input value={text} onChange={e => setText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                      placeholder="Message..."
                      className="flex-1 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                    <button onClick={sendMessage} disabled={!text.trim()}
                      className="p-2.5 bg-green-600 text-white rounded-2xl hover:bg-green-700 disabled:opacity-40 transition-colors shrink-0">
                      <Send size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-center text-gray-300 mt-2 flex items-center justify-center gap-1">
                    <Lock size={10} /> Messages are private
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return <Suspense fallback={<div className="min-h-screen bg-gray-50"><NavBar /></div>}><MessagesInner /></Suspense>
}
export const dynamic = 'force-dynamic'
