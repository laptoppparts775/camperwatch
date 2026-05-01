'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import Link from 'next/link'
import { campgrounds } from '@/lib/data'
import {
  Send, Camera, MapPin, Star, Heart, MessageCircle,
  AlertTriangle, Lightbulb, HelpCircle, FileText,
  Image, ChevronDown, Filter, TrendingUp, Clock,
  Flame, Search, X, Check
} from 'lucide-react'
import dynamic from 'next/dynamic'
import FollowButton from '@/components/FollowButton'

type Post = {
  id: string
  user_id: string
  campground_id: string | null
  campground_name: string | null
  content: string
  images: string[]
  post_type: string
  rating: number | null
  tags: string[]
  likes: number
  created_at: string
  profiles?: {
    username: string
    full_name: string
    avatar_color: string
    avatar_url: string | null
    privacy_display_name: string
    privacy_avatar: string
  }
  has_liked?: boolean
}

const POST_TYPES = [
  { key: 'all', label: 'All posts', icon: TrendingUp, color: 'text-gray-600' },
  { key: 'alert', label: 'Alerts', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  { key: 'trip_report', label: 'Trip reports', icon: FileText, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  { key: 'tip', label: 'Tips', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { key: 'question', label: 'Questions', icon: HelpCircle, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { key: 'photo', label: 'Photos', icon: Image, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
]

const TYPE_CONFIG: Record<string, { icon: any; label: string; color: string; bg: string; placeholder: string }> = {
  general: { icon: MessageCircle, label: 'Post', color: 'text-gray-600', bg: 'bg-gray-50', placeholder: 'Share something with the community...' },
  alert: { icon: AlertTriangle, label: 'Alert', color: 'text-red-600', bg: 'bg-red-50 border border-red-200', placeholder: 'Report a condition — bear, fire, road, weather...' },
  trip_report: { icon: FileText, label: 'Trip report', color: 'text-green-700', bg: 'bg-green-50 border border-green-200', placeholder: 'Share your experience — what site, what worked, what didn\'t...' },
  tip: { icon: Lightbulb, label: 'Tip', color: 'text-amber-700', bg: 'bg-amber-50 border border-amber-200', placeholder: 'Share an insider tip other campers will appreciate...' },
  question: { icon: HelpCircle, label: 'Question', color: 'text-blue-600', bg: 'bg-blue-50 border border-blue-200', placeholder: 'Ask the community anything about campgrounds, gear, bookings...' },
  photo: { icon: Camera, label: 'Photo', color: 'text-purple-600', bg: 'bg-purple-50 border border-purple-200', placeholder: 'Add a caption for your photo...' },
}

function getDisplayName(p: any) {
  if (!p) return 'A camper'
  switch (p.privacy_display_name) {
    case 'full_name': return p.full_name
    case 'anonymous': return 'A camper'
    default: return `@${p.username}`
  }
}

function Avatar({ p, size = 9 }: { p: any; size?: number }) {
  if (!p || p.privacy_avatar === 'hidden') return (
    <div className={`w-${size} h-${size} rounded-full bg-gray-200 flex items-center justify-center shrink-0`}>
      <span className="text-gray-400 text-xs">?</span>
    </div>
  )
  if (p.privacy_avatar === 'show' && p.avatar_url) return (
    <img src={p.avatar_url} className={`w-${size} h-${size} rounded-full object-cover shrink-0`} alt="" />
  )
  const initials = (p.full_name || p.username || 'C').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}
      style={{ background: p.avatar_color || '#16a34a' }}>
      {initials}
    </div>
  )
}

function timeAgo(ts: string) {
  const d = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (d < 60) return 'just now'
  if (d < 3600) return `${Math.floor(d / 60)}m ago`
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`
  if (d < 604800) return `${Math.floor(d / 86400)}d ago`
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function CommunityPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [user, setUser] = useState<any>(null)
  const [myProfile, setMyProfile] = useState<any>(null)
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState('general')
  const [campSlug, setCampSlug] = useState('')
  const [campSearch, setCampSearch] = useState('')
  const [rating, setRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [filter, setFilter] = useState('all')
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [pendingImages, setPendingImages] = useState<string[]>([])

  const campResults = campSearch
    ? campgrounds.filter(c => c.name.toLowerCase().includes(campSearch.toLowerCase()) || c.location.toLowerCase().includes(campSearch.toLowerCase())).slice(0, 5)
    : []

  useEffect(() => {
    const sb = getSupabase()
    sb.auth.getSession().then(async ({ data }: any) => {
      const u = data.session?.user
      setUser(u)
      if (u) {
        const { data: prof } = await sb.from('profiles').select('*').eq('id', u.id).single()
        setMyProfile(prof)
      }
    })
    loadPosts()
  }, [filter])

  async function loadPosts() {
    const sb = getSupabase()
    setLoading(true)
    let q = sb.from('community_posts')
      .select('*, profiles(username,full_name,avatar_color,avatar_url,privacy_display_name,privacy_avatar)')
      .order('created_at', { ascending: false })
      .limit(30)

    if (filter !== 'all') q = q.eq('post_type', filter)

    const { data } = await q
    setPosts(data || [])
    setLoading(false)
  }

  async function handlePost() {
    if (!content.trim() || !user) return
    setPosting(true)
    const sb = getSupabase()
    const camp = campgrounds.find(c => c.slug === campSlug)
    await sb.from('community_posts').insert({
      user_id: user.id,
      content: content.trim(),
      post_type: postType,
      campground_id: campSlug || null,
      campground_name: camp?.name || null,
      images: pendingImages,
      rating: rating || null,
      tags: [],
      likes: 0,
    })
    setContent(''); setPostType('general'); setCampSlug(''); setCampSearch(''); setRating(0); setPendingImages([])
    setPosting(false)
    loadPosts()
  }

  async function toggleLike(post: Post) {
    if (!user) { router.push('/auth/login?redirect=/community'); return }
    const sb = getSupabase()
    const newLikes = post.has_liked ? post.likes - 1 : post.likes + 1
    await sb.from('community_posts').update({ likes: newLikes }).eq('id', post.id)
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: newLikes, has_liked: !p.has_liked } : p))
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploadingImg(true)
    const sb = getSupabase()
    const path = `community/${user.id}/${Date.now()}.${file.name.split('.').pop()}`
    const { data, error } = await sb.storage.from('campground-images').upload(path, file)
    if (!error && data) {
      const { data: { publicUrl } } = sb.storage.from('campground-images').getPublicUrl(path)
      setPendingImages(prev => [...prev, publicUrl])
      setPostType('photo')
    }
    setUploadingImg(false)
  }

  const cfg = TYPE_CONFIG[postType] || TYPE_CONFIG.general

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 py-6 overflow-hidden pb-24 sm:pb-6">
        <div className="grid lg:grid-cols-[1fr_280px] gap-6 w-full min-w-0 overflow-hidden">

          {/* Main feed */}
          <div className="space-y-4 min-w-0 overflow-hidden w-full">

            {/* Compose box */}
            {user ? (
              <div className={`bg-white rounded-2xl border border-gray-200 p-4 ${cfg.bg}`}>
                <div className="flex items-start gap-3 mb-3">
                  <Avatar p={myProfile} size={9} />
                  <div className="flex-1">
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      placeholder={cfg.placeholder}
                      rows={3}
                      className="w-full text-sm text-gray-900 placeholder-gray-400 bg-transparent resize-none focus:outline-none min-w-0"
                    />
                    {pendingImages.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {pendingImages.map((url, i) => (
                          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                            <img src={url} className="w-full h-full object-cover" alt="" />
                            <button onClick={() => setPendingImages(p => p.filter((_, j) => j !== i))}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Camp tag + rating */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="relative">
                    <div className="flex items-center gap-1 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-500 hover:border-gray-300 cursor-pointer bg-white"
                      onClick={() => document.getElementById('camp-search')?.focus()}>
                      <MapPin size={12} />
                      {campSlug ? campgrounds.find(c => c.slug === campSlug)?.name : 'Tag a campground'}
                      {campSlug && <button onClick={e => { e.stopPropagation(); setCampSlug(''); setCampSearch('') }} className="ml-1 text-gray-400 hover:text-gray-600"><X size={10} /></button>}
                    </div>
                    {!campSlug && (
                      <input id="camp-search" value={campSearch} onChange={e => setCampSearch(e.target.value)}
                        placeholder="Search..." className="sr-only" />
                    )}
                    {campResults.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl border border-gray-100 shadow-lg z-20 overflow-hidden">
                        {campResults.map(c => (
                          <button key={c.slug} onClick={() => { setCampSlug(c.slug); setCampSearch('') }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                            <MapPin size={11} className="text-green-500" /> {c.name} <span className="text-gray-400">· {c.state}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {postType === 'trip_report' && (
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setRating(s)}>
                          <Star size={16} className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post type selector + actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex gap-1 flex-wrap">
                    {POST_TYPES.slice(1).map(t => (
                      <button key={t.key} onClick={() => setPostType(t.key)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                          postType === t.key ? `${t.color} bg-gray-100` : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}>
                        <t.icon size={11} />{t.label}
                      </button>
                    ))}
                    <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-purple-600 hover:bg-purple-50">
                      {uploadingImg ? <div className="w-3 h-3 border border-purple-500 border-t-transparent rounded-full animate-spin" /> : <Camera size={11} />}
                      Photo
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} className="hidden" />
                  </div>
                  <button onClick={handlePost} disabled={posting || !content.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 disabled:opacity-40 transition-colors">
                    {posting ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={12} />}
                    Post
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop: inline join box */}
                <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 p-5 text-center">
                  <p className="text-gray-600 text-sm mb-3">Join the community — share trip reports, tips, alerts and questions with real campers</p>
                  <div className="flex gap-2 justify-center">
                    <Link href="/auth/signup" className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700">Join free</Link>
                    <Link href="/auth/login" className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50">Sign in</Link>
                  </div>
                </div>
                {/* Mobile: sticky bottom post CTA — poster psychology */}
                <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-3 pb-5 z-40 shadow-2xl">
                  <p className="text-xs text-gray-500 text-center mb-2">See something campers should know?</p>
                  <div className="flex gap-2">
                    <Link href="/auth/signup" className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-2xl text-sm font-bold">
                      <Send size={14}/> Post an alert
                    </Link>
                    <Link href="/auth/login" className="px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-2xl text-sm font-semibold">
                      Sign in
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* Filter tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 w-full" style={{scrollbarWidth:'none'}}>
              {POST_TYPES.map(t => (
                <button key={t.key} onClick={() => setFilter(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                    filter === t.key ? `bg-white border border-gray-200 shadow-sm ${t.color}` : 'text-gray-400 hover:text-gray-600'
                  }`}>
                  <t.icon size={12} />{t.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            {loading ? (
              <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                <div className="text-4xl mb-3">🏕</div>
                <p className="text-gray-500 font-medium mb-1">No {filter !== 'all' ? filter.replace('_',' ') + 's' : 'posts'} yet</p>
                <p className="text-gray-400 text-sm">Be the first to share something</p>
              </div>
            ) : posts.map(post => {
              const typeCfg = TYPE_CONFIG[post.post_type] || TYPE_CONFIG.general
              const TypeIcon = typeCfg.icon
              const isAlert = post.post_type === 'alert'
              const isExpanded = expandedPost === post.id
              const shouldTruncate = post.content.length > 280 && !isExpanded

              return (
                <div key={post.id} className={`bg-white rounded-2xl border overflow-hidden w-full min-w-0 ${isAlert ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}>
                  {/* Alert banner */}
                  {isAlert && (
                    <div className="bg-red-500 px-4 py-1.5 flex items-center gap-2">
                      <AlertTriangle size={13} className="text-white" />
                      <span className="text-white text-xs font-bold uppercase tracking-wide">Condition alert</span>
                    </div>
                  )}

                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar p={post.profiles} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <span className="font-semibold text-gray-900 text-sm">{getDisplayName(post.profiles)}</span>
                          {post.post_type !== 'general' && (
                            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                              post.post_type === 'alert' ? 'bg-red-100 text-red-700' :
                              post.post_type === 'trip_report' ? 'bg-green-100 text-green-700' :
                              post.post_type === 'tip' ? 'bg-amber-100 text-amber-700' :
                              post.post_type === 'question' ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              <TypeIcon size={10} />
                              {typeCfg.label}
                            </span>
                          )}
                          {post.campground_id && (
                            <Link href={`/campground/${post.campground_id}`}
                              className="flex items-center gap-1 text-xs text-green-700 hover:underline">
                              <MapPin size={10} />{post.campground_name || post.campground_id}
                            </Link>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
                          {post.rating && (
                            <div className="flex items-center gap-0.5">
                              {[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= post.rating! ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p className={`text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words overflow-hidden ${shouldTruncate ? 'line-clamp-4' : ''}`}>
                      {post.content}
                    </p>
                    {post.content.length > 280 && (
                      <button onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                        className="text-xs text-green-700 mt-1 hover:underline">
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}

                    {/* Images */}
                    {post.images?.length > 0 && (
                      <div className={`mt-3 grid gap-1.5 ${post.images.length === 1 ? '' : 'grid-cols-2'}`}>
                        {post.images.slice(0, 4).map((img, i) => (
                          <div key={i} className="relative">
                            <img src={img} className="w-full h-48 object-cover rounded-xl" alt="" />
                            {i === 3 && post.images.length > 4 && (
                              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center text-white font-bold text-xl">+{post.images.length - 4}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 w-full overflow-hidden">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">#{tag}</span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                      <button onClick={() => toggleLike(post)}
                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${post.has_liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
                        <Heart size={14} className={post.has_liked ? 'fill-red-500' : ''} />
                        {post.likes > 0 ? post.likes : 'Like'}
                      </button>
                      {post.user_id !== user?.id && (
                        <FollowButton targetUserId={post.user_id} size="sm" />
                      )}
                      {post.campground_id && (
                        <Link href={`/campground/${post.campground_id}`}
                          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 font-medium transition-colors">
                          <MessageCircle size={14} /> Chat at {post.campground_name?.split(' ')[0]}
                        </Link>
                      )}
                      {post.post_type === 'question' && (
                        <span className="ml-auto text-xs text-blue-500 font-medium flex items-center gap-1">
                          <HelpCircle size={12} /> Awaiting answers
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right sidebar — desktop only */}
          <div className="hidden lg:block space-y-4">

            {/* What this is */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3">🏕 The CamperWatch Community</h3>
              <p className="text-sm text-gray-600 mb-4">Real campers sharing real experiences. Not reviews — live reports, honest tips, and real-time alerts from people who were just there.</p>
              <div className="space-y-2.5">
                {[
                  { icon: AlertTriangle, color: 'text-red-500', label: 'Alerts', desc: 'Bear sightings, fire restrictions, road closures' },
                  { icon: FileText, color: 'text-green-600', label: 'Trip reports', desc: 'Honest accounts of actual stays' },
                  { icon: Lightbulb, color: 'text-amber-500', label: 'Tips', desc: 'Insider knowledge that isn\'t on any website' },
                  { icon: HelpCircle, color: 'text-blue-500', label: 'Questions', desc: 'Ask — someone has been there' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <item.icon size={14} className={`${item.color} mt-0.5 shrink-0`} />
                    <div>
                      <span className="text-xs font-semibold text-gray-800">{item.label}</span>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active campground chats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <MessageCircle size={14} className="text-green-600" /> Active campground chats
              </h3>
              <div className="space-y-2">
                {campgrounds.filter(c => c.available).slice(0, 6).map(c => (
                  <Link key={c.slug} href={`/campground/${c.slug}`}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                    <img src={c.images?.[0]?.url} className="w-8 h-8 rounded-lg object-cover shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate group-hover:text-green-700">{c.name}</div>
                      <div className="text-xs text-gray-400">{c.location}</div>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Join tribes */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Find your tribe</h3>
              <p className="text-xs text-gray-500 mb-3">RV life, solo adventures, family camping, national parks — connect with campers like you.</p>
              <Link href="/tribes" className="block text-center text-xs font-semibold bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition-colors">
                Browse tribes →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
