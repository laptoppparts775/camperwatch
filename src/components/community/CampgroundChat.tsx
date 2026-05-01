'use client'
import { useState, useEffect, useRef } from 'react'
import { getSupabase } from '@/lib/supabase'
import { Send, MessageCircle, Lightbulb, HelpCircle, AlertTriangle, Users, X } from 'lucide-react'

type Message = {
  id: string
  user_id: string
  message: string
  type: string
  created_at: string
  profiles?: { username: string; full_name: string; avatar_color: string }
}

const TYPE_CONFIG = {
  message: { icon: MessageCircle, color: 'text-gray-500', bg: '' },
  tip: { icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50 border border-amber-100' },
  question: { icon: HelpCircle, color: 'text-blue-500', bg: 'bg-blue-50 border border-blue-100' },
  alert: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 border border-red-100' },
}

export default function CampgroundChat({ slug }: { slug: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [type, setType] = useState<'message' | 'tip' | 'question' | 'alert'>('message')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [online, setOnline] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sb = getSupabase()

    // Get user
    sb.auth.getSession().then(({ data }: any) => setUser(data.session?.user || null))

    // Load recent messages with profiles
    sb.from('campground_chat')
      .select('*, profiles(username, full_name, avatar_color)')
      .eq('campground_slug', slug)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setMessages((data || []).reverse())
        setLoading(false)
      })

    // Subscribe to new messages
    const channel = sb.channel(`chat:${slug}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'campground_chat',
        filter: `campground_slug=eq.${slug}`
      }, async (payload) => {
        // Fetch the profile for new message
        const { data: profile } = await sb.from('profiles')
          .select('username, full_name, avatar_color')
          .eq('id', payload.new.user_id)
          .single()
        setMessages(prev => [...prev, { ...payload.new as Message, profiles: profile || undefined }])
      })
      .on('presence', { event: 'sync' }, () => {
        setOnline(Object.keys(channel.presenceState()).length)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await channel.track({ user_id: user.id })
        }
      })

    return () => { sb.removeChannel(channel) }
  }, [slug, user?.id])

  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    if (!text.trim() || !user) return
    const sb = getSupabase()
    await sb.from('campground_chat').insert({
      campground_slug: slug,
      user_id: user.id,
      message: text.trim(),
      type,
    })
    setText('')
    setType('message')
  }

  function timeAgo(ts: string) {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return new Date(ts).toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className="text-green-600" />
          <span className="font-semibold text-gray-900 text-sm">Camper Chat</span>
          <span className="text-xs text-gray-400">— ask questions, share tips</span>
        </div>
        {online > 0 && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            {online} online
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loading && <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>}

        {!loading && messages.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle size={28} className="text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Be the first to say something!</p>
            <p className="text-gray-300 text-xs mt-1">Ask about availability, site conditions, tips...</p>
          </div>
        )}

        {messages.map(msg => {
          const cfg = TYPE_CONFIG[msg.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.message
          const initials = msg.profiles?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
          const isOwn = user?.id === msg.user_id
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: msg.profiles?.avatar_color || '#6b7280' }}>
                {initials}
              </div>
              <div className={`max-w-xs ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-medium text-gray-700">{isOwn ? 'You' : (msg.profiles?.username || 'Camper')}</span>
                  <span className="text-xs text-gray-300">{timeAgo(msg.created_at)}</span>
                </div>
                <div className={`rounded-2xl px-3 py-2 text-sm ${
                  isOwn ? 'bg-green-600 text-white rounded-tr-sm' :
                  msg.type !== 'message' ? `${cfg.bg} rounded-tl-sm` :
                  'bg-white border border-gray-100 rounded-tl-sm text-gray-800'
                }`}>
                  {msg.type !== 'message' && !isOwn && (
                    <div className="flex items-center gap-1 mb-1">
                      <cfg.icon size={11} className={isOwn ? 'text-green-200' : cfg.color} />
                      <span className={`text-xs font-semibold capitalize ${isOwn ? 'text-green-200' : cfg.color}`}>{msg.type}</span>
                    </div>
                  )}
                  {msg.message}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {user ? (
        <div className="p-3 border-t border-gray-100">
          {/* Type selector */}
          <div className="flex gap-1 mb-2">
            {(['message', 'tip', 'question', 'alert'] as const).map(t => {
              const cfg = TYPE_CONFIG[t]
              return (
                <button key={t} onClick={() => setType(t)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                    type === t ? `${t === 'message' ? 'bg-green-50 text-green-700' : cfg.bg + ' ' + cfg.color}` : 'text-gray-400 hover:bg-gray-50'
                  }`}>
                  <cfg.icon size={11} /> {t}
                </button>
              )
            })}
          </div>
          <div className="flex gap-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              placeholder={
                type === 'tip' ? 'Share an insider tip...' :
                type === 'question' ? 'Ask a question...' :
                type === 'alert' ? 'Report a condition (fire, bear, weather)...' :
                'Chat with other campers...'
              }
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button onClick={send} disabled={!text.trim()}
              className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-40 transition-colors">
              <Send size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-gray-100 text-center">
          <a href="/auth/login" className="text-sm text-green-700 font-medium hover:underline">Sign in to join the conversation</a>
        </div>
      )}
    </div>
  )
}
