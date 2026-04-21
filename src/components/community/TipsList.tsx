'use client'
import { useState, useEffect } from 'react'
import { supabase, UserTip } from '@/lib/supabase'
import { ThumbsUp, CheckCircle, Plus, Send } from 'lucide-react'
import Link from 'next/link'

export default function TipsList({ campgroundId }: { campgroundId: string }) {
  const [tips, setTips] = useState<UserTip[]>([])
  const [newTip, setNewTip] = useState('')
  const [user, setUser] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    fetchTips()
  }, [campgroundId])

  const fetchTips = async () => {
    const { data } = await supabase.from('user_tips')
      .select('*, profiles(username)')
      .eq('campground_id', campgroundId)
      .order('upvotes', { ascending: false })
    if (data) setTips(data as UserTip[])
  }

  const submitTip = async () => {
    if (!newTip.trim() || !user) return
    await supabase.from('user_tips').insert({ campground_id: campgroundId, user_id: user.id, tip: newTip })
    await supabase.from('profiles').update({ tips_shared: 1 }).eq('id', user.id)
    setNewTip('')
    setShowForm(false)
    fetchTips()
  }

  const upvote = async (tipId: string, current: number) => {
    if (!user || upvotedIds.has(tipId)) return
    setUpvotedIds(prev => { const n = new Set(Array.from(prev)); n.add(tipId); return n; })
    await supabase.from('tip_upvotes').insert({ tip_id: tipId, user_id: user.id })
    await supabase.from('user_tips').update({ upvotes: current + 1 }).eq('id', tipId)
    setTips(prev => prev.map(t => t.id === tipId ? { ...t, upvotes: t.upvotes + 1 } : t))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">Community Tips ({tips.length})</h3>
        {user ? (
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 text-xs text-green-700 font-medium hover:underline">
            <Plus size={13} /> Add tip
          </button>
        ) : (
          <Link href="/auth/login" className="text-xs text-green-700 font-medium hover:underline">Sign in to add tips</Link>
        )}
      </div>

      {showForm && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
          <textarea value={newTip} onChange={e => setNewTip(e.target.value)}
            placeholder="Share a specific insider tip for this campground..."
            className="w-full text-sm border-0 bg-transparent outline-none resize-none min-h-[60px] placeholder-green-500/60" />
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setShowForm(false)} className="text-xs text-gray-400 px-3 py-1.5 rounded-lg">Cancel</button>
            <button onClick={submitTip} disabled={!newTip.trim()}
              className="flex items-center gap-1 bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-40">
              <Send size={11} /> Submit
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tips.map(tip => (
          <div key={tip.id} className="bg-white border border-gray-100 rounded-xl p-3 flex gap-3">
            <button onClick={() => upvote(tip.id, tip.upvotes)}
              className={`flex flex-col items-center gap-0.5 flex-shrink-0 transition-colors ${upvotedIds.has(tip.id) ? 'text-green-600' : 'text-gray-300 hover:text-green-500'}`}>
              <ThumbsUp size={14} fill={upvotedIds.has(tip.id) ? 'currentColor' : 'none'} />
              <span className="text-xs font-semibold">{tip.upvotes}</span>
            </button>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">{tip.tip}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">@{tip.profiles?.username || 'camper'}</span>
                {tip.verified && (
                  <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium">
                    <CheckCircle size={11} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {tips.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">No community tips yet — be the first to share!</p>
        )}
      </div>
    </div>
  )
}
