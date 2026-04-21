'use client'
import { useState, useEffect } from 'react'
import { supabase, CommunityPost } from '@/lib/supabase'
import { Heart, Share2, MapPin, Camera, Send, TreePine } from 'lucide-react'
import Link from 'next/link'

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function CommunityFeed({ campgroundId }: { campgroundId?: string }) {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [content, setContent] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    fetchPosts()
  }, [campgroundId])

  const fetchPosts = async () => {
    let q = supabase.from('community_posts').select('*, profiles(username, avatar_url, full_name)').order('created_at', { ascending: false }).limit(20)
    if (campgroundId) q = q.eq('campground_id', campgroundId)
    const { data } = await q
    if (data) setPosts(data as CommunityPost[])
  }

  const handlePost = async () => {
    if (!content.trim() || !user) return
    setLoading(true)
    await supabase.from('community_posts').insert({ user_id: user.id, content, campground_id: campgroundId || null, images: [] })
    setContent('')
    await fetchPosts()
    setLoading(false)
  }

  const handleLike = async (postId: string) => {
    if (!user) return
    if (likedIds.has(postId)) return
    setLikedIds(prev => { const n = new Set(Array.from(prev)); n.add(postId); return n; })
    await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id })
    await supabase.from('community_posts').update({ likes: (posts.find(p => p.id === postId)?.likes || 0) + 1 }).eq('id', postId)
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p))
  }

  const handleShare = async (post: CommunityPost) => {
    const text = `${post.content}\n\nvia CamperWatch — camperwatch.org`
    if (navigator.share) {
      await navigator.share({ title: 'CamperWatch', text, url: 'https://camperwatch.org/community' })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }

  return (
    <div className="space-y-4">
      {/* Compose */}
      {user ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="Share a tip, photo spot, or trip report... 🏕️"
            className="w-full text-sm text-gray-700 resize-none border-0 outline-none mb-3 placeholder-gray-400 min-h-[80px]" />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button className="text-gray-400 hover:text-green-600 transition-colors"><Camera size={18} /></button>
            </div>
            <button onClick={handlePost} disabled={!content.trim() || loading}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-40">
              <Send size={13} /> Post
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <TreePine size={24} className="text-green-600 mx-auto mb-2" />
          <p className="text-sm text-green-800 font-medium mb-2">Join the community to share tips and connect with campers</p>
          <Link href="/auth/signup" className="bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg inline-block">Join Free</Link>
        </div>
      )}

      {/* Feed */}
      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <TreePine size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium text-gray-500">No posts yet — be the first!</p>
        </div>
      )}
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
              {(post.profiles?.username || 'C')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">{post.profiles?.username || 'Camper'}</p>
              <p className="text-xs text-gray-400">{timeAgo(post.created_at)}</p>
            </div>
            {post.campground_id && (
              <Link href={`/campground/${post.campground_id}`} className="ml-auto flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full hover:bg-green-100">
                <MapPin size={10} /> {post.campground_id.replace(/-/g, ' ')}
              </Link>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{post.content}</p>
          <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
            <button onClick={() => handleLike(post.id)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${likedIds.has(post.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
              <Heart size={14} fill={likedIds.has(post.id) ? 'currentColor' : 'none'} /> {post.likes}
            </button>
            <button onClick={() => handleShare(post)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-500 transition-colors ml-auto">
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
