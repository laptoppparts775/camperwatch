'use client'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { UserPlus, UserMinus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FollowButton({ targetUserId, size = 'md' }: { targetUserId: string; size?: 'sm' | 'md' }) {
  const router = useRouter()
  const [myId, setMyId] = useState<string | null>(null)
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getSupabase()
    sb.auth.getSession().then(async ({ data }: any) => {
      const uid = data.session?.user?.id
      if (!uid) { setLoading(false); return }
      setMyId(uid)
      const { data: row } = await sb.from('user_follows')
        .select('follower_id').eq('follower_id', uid).eq('following_id', targetUserId).maybeSingle()
      setFollowing(!!row)
      setLoading(false)
    })
  }, [targetUserId])

  async function toggle() {
    if (!myId) { router.push('/auth/login'); return }
    if (myId === targetUserId) return
    const sb = getSupabase()
    setFollowing(f => !f)
    if (following) {
      await sb.from('user_follows').delete().eq('follower_id', myId).eq('following_id', targetUserId)
    } else {
      await sb.from('user_follows').insert({ follower_id: myId, following_id: targetUserId })
    }
  }

  if (loading || myId === targetUserId) return null

  const sm = size === 'sm'
  return (
    <button onClick={toggle}
      className={`flex items-center gap-1.5 font-semibold rounded-xl transition-all ${
        sm ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
      } ${following
        ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
        : 'bg-green-600 text-white hover:bg-green-700'
      }`}>
      {following ? <UserMinus size={sm ? 12 : 14} /> : <UserPlus size={sm ? 12 : 14} />}
      {following ? 'Following' : 'Follow'}
    </button>
  )
}
