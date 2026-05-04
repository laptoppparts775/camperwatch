'use client'

import { useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import { Bell, BellOff, CheckCircle, Loader2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  campgroundSlug: string
  campgroundName: string
  facilityId: string
}

export default function AlertButton({ campgroundSlug, campgroundName, facilityId }: Props) {
  const supabase = getSupabase()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [siteType, setSiteType] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  async function save() {
    setError('')
    if (!checkIn || !checkOut) { setError('Both dates are required.'); return }
    if (checkIn >= checkOut) { setError('Check-out must be after check-in.'); return }

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push(`/auth/login?redirect=/campground/${campgroundSlug}`)
      return
    }

    const { error: insertErr } = await supabase.from('availability_alerts').insert({
      user_id: user.id,
      campground_slug: campgroundSlug,
      check_in: checkIn,
      check_out: checkOut,
      site_type: siteType || null,
      notify_via: 'email',
      active: true,
    })

    setSaving(false)
    if (insertErr) { setError('Failed to save alert. Try again.'); return }
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
        <CheckCircle size={16} className="text-green-600 shrink-0" />
        <span>Alert set! We'll email you when a site opens up.</span>
        <button onClick={() => setDone(false)} className="ml-auto text-green-500 hover:text-green-700">
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors"
        >
          <Bell size={15} />
          Notify me when this opens up — free
        </button>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              <Bell size={15} />
              Set availability alert
            </div>
            <button onClick={() => setOpen(false)} className="text-amber-500 hover:text-amber-700">
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-amber-700">
            We'll email you the moment a site opens for your dates at {campgroundName}.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-amber-800 font-medium block mb-1">Check-in</label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="w-full border border-amber-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="text-xs text-amber-800 font-medium block mb-1">Check-out</label>
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full border border-amber-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-amber-800 font-medium block mb-1">Site type (optional)</label>
            <select
              value={siteType}
              onChange={e => setSiteType(e.target.value)}
              className="w-full border border-amber-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">Any site type</option>
              <option value="tent">Tent</option>
              <option value="rv_hookup">RV / Hookup</option>
              <option value="cabin">Cabin</option>
            </select>
          </div>
          {error && <div className="text-xs text-red-600">{error}</div>}
          <button
            onClick={save}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Bell size={14} />}
            {saving ? 'Saving…' : 'Alert me when it opens'}
          </button>
          <p className="text-xs text-amber-600 text-center">Free · Email only · Unsubscribe anytime from /alerts</p>
        </div>
      )}
    </div>
  )
}
