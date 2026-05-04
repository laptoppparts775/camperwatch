'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import { Bell, BellOff, Trash2, Loader2, CheckCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

type Alert = {
  id: string
  campground_slug: string
  check_in: string
  check_out: string
  site_type: string | null
  active: boolean
  notified_at: string | null
  created_at: string
}

function fmtDate(iso: string) {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return iso }
}

function fmtCampground(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function AlertsPage() {
  const supabase = getSupabase()
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      if (!data.user) { router.push('/auth/login?redirect=/alerts'); return }
      load(data.user.id)
    })
  }, [])

  async function load(userId: string) {
    const { data } = await supabase
      .from('availability_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setAlerts(data || [])
    setLoading(false)
  }

  async function toggle(id: string, active: boolean) {
    setToggling(id)
    await supabase.from('availability_alerts').update({ active: !active }).eq('id', id)
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !active } : a))
    setToggling(null)
  }

  async function remove(id: string) {
    setDeleting(id)
    await supabase.from('availability_alerts').delete().eq('id', id)
    setAlerts(prev => prev.filter(a => a.id !== id))
    setDeleting(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={22} className="text-amber-500" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Availability Alerts</h1>
            <p className="text-sm text-gray-500">Get emailed when sold-out campgrounds open up for your dates.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={20} className="animate-spin text-gray-300" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <Bell size={32} className="text-gray-200 mx-auto mb-3" />
            <div className="font-semibold text-gray-700 mb-1">No alerts yet</div>
            <p className="text-sm text-gray-400 mb-5">Browse a sold-out federal campground and click "Notify me when this opens up".</p>
            <Link href="/search" className="inline-block px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
              Browse campgrounds
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`bg-white rounded-2xl border p-4 ${alert.active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Link
                        href={`/campground/${alert.campground_slug}`}
                        className="font-semibold text-gray-900 hover:text-green-700 transition-colors flex items-center gap-1"
                      >
                        {fmtCampground(alert.campground_slug)}
                        <ExternalLink size={12} className="text-gray-400" />
                      </Link>
                      {alert.active ? (
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">Watching</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Paused</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {fmtDate(alert.check_in)} → {fmtDate(alert.check_out)}
                      {alert.site_type && <span className="text-gray-400"> · {alert.site_type.replace('_', ' ')}</span>}
                    </div>
                    {alert.notified_at && (
                      <div className="flex items-center gap-1 text-xs text-green-700 mt-1">
                        <CheckCircle size={11} />
                        Last alerted {new Date(alert.notified_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggle(alert.id, alert.active)}
                      disabled={toggling === alert.id}
                      title={alert.active ? 'Pause alert' : 'Resume alert'}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-amber-600 disabled:opacity-40"
                    >
                      {toggling === alert.id
                        ? <Loader2 size={15} className="animate-spin" />
                        : alert.active ? <BellOff size={15} /> : <Bell size={15} />}
                    </button>
                    <button
                      onClick={() => remove(alert.id)}
                      disabled={deleting === alert.id}
                      title="Delete alert"
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-500 disabled:opacity-40"
                    >
                      {deleting === alert.id
                        ? <Loader2 size={15} className="animate-spin" />
                        : <Trash2 size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
