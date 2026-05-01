'use client'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { CheckCircle, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TripLogButton({ slug, campName }: { slug: string; campName: string }) {
  const router = useRouter()
  const [visited, setVisited] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [notes, setNotes] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const sb = getSupabase()
    sb.auth.getSession().then(async ({ data }: any) => {
      const uid = data.session?.user?.id
      if (!uid) { setLoading(false); return }
      setUserId(uid)
      const { data: log } = await sb.from('trip_logs')
        .select('id').eq('user_id', uid).eq('campground_slug', slug).maybeSingle()
      setVisited(!!log)
      setLoading(false)
    })
  }, [slug])

  async function markVisited() {
    if (!userId) { router.push('/auth/login'); return }
    setSaving(true)
    const sb = getSupabase()
    await sb.from('trip_logs').upsert({
      user_id: userId,
      campground_slug: slug,
      visit_date: new Date().toISOString().split('T')[0],
      rating,
      notes,
    }, { onConflict: 'user_id,campground_slug' })
    // Update camps_visited count
    await sb.rpc('increment_camps_visited' as any, { uid: userId }).catch(() => null)
    setVisited(true)
    setSaving(false)
    setShowForm(false)
  }

  if (loading) return null

  if (visited) return (
    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
      <CheckCircle size={15} className="text-green-500" /> Been here
    </div>
  )

  return (
    <div className="relative">
      <button onClick={() => userId ? setShowForm(true) : router.push('/auth/login')}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:border-green-400 hover:text-green-700 transition-colors">
        <MapPin size={15} /> Mark as visited
      </button>

      {showForm && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 z-30">
          <div className="font-semibold text-gray-900 text-sm mb-3">Log your visit to {campName}</div>
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Your rating</div>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(s)}
                  className={`text-lg ${s <= rating ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
              ))}
            </div>
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            rows={2} placeholder="Any notes about your stay? (optional)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-green-500 mb-3" />
          <div className="flex gap-2">
            <button onClick={markVisited} disabled={saving}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save visit'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
