'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { Plus, Trash2, Loader2, RefreshCw, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react'

interface ExternalCal {
  id: string
  site_id: string
  campground_slug: string
  source_url: string
  label: string
  source: string
  last_sync: string | null
  last_sync_error: string | null
  active: boolean
}

interface Site {
  id: string
  name: string
  campground_slug: string
}

interface Props {
  userId: string
  sites: Site[]
}

const SOURCE_OPTIONS = [
  { value: 'hipcamp', label: 'Hipcamp' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'campspot', label: 'Campspot' },
  { value: 'other', label: 'Other' },
]

export default function ICalTab({ userId, sites }: Props) {
  const supabase = getSupabase()
  const [cals, setCals] = useState<ExternalCal[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [saveOk, setSaveOk] = useState(false)

  const [form, setForm] = useState({
    site_id: sites[0]?.id || '',
    source_url: '',
    label: '',
    source: 'hipcamp',
  })

  const exportUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://camperwatch.org'}/api/owner/${userId}/calendar.ics`

  useEffect(() => {
    fetchCals()
  }, [])

  async function fetchCals() {
    setLoading(true)
    const { data } = await supabase
      .from('external_calendars')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
    setCals(data || [])
    setLoading(false)
  }

  async function addCal() {
    setError('')
    setSaveOk(false)
    if (!form.site_id) { setError('Select a site first.'); return }
    if (!form.source_url.trim().startsWith('http')) { setError('Enter a valid iCal URL (starts with http).'); return }

    const site = sites.find(s => s.id === form.site_id)
    const { error: insertErr } = await supabase.from('external_calendars').insert({
      owner_id: userId,
      site_id: form.site_id,
      campground_slug: site?.campground_slug || '',
      source_url: form.source_url.trim(),
      label: form.label.trim() || `${form.source} calendar`,
      source: form.source,
      active: true,
    })

    if (insertErr) { setError('Failed to save. Try again.'); return }
    setForm(f => ({ ...f, source_url: '', label: '' }))
    setSaveOk(true)
    setTimeout(() => setSaveOk(false), 3000)
    fetchCals()
  }

  async function deleteCal(id: string) {
    setDeleting(id)
    await supabase.from('external_calendars').delete().eq('id', id)
    setCals(prev => prev.filter(c => c.id !== id))
    setDeleting(null)
  }

  async function syncNow() {
    setSyncing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await fetch('/api/ical/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
      })
      await fetchCals()
    } finally {
      setSyncing(false)
    }
  }

  async function copyExportUrl() {
    await navigator.clipboard.writeText(exportUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">

      {/* Export section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <ExternalLink size={15} className="text-green-600" />
          Your CamperWatch export URL
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Paste this URL into Hipcamp, Airbnb, or Campspot to sync your CamperWatch bookings to those platforms. They'll automatically pick up new bookings every few hours.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 font-mono truncate">
            {exportUrl}
          </div>
          <button
            onClick={copyExportUrl}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors shrink-0"
          >
            {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Import section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Import from other platforms</h3>
          {cals.length > 0 && (
            <button
              onClick={syncNow}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {syncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
              Sync now
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Add your Hipcamp, Airbnb, or Campspot iCal URL to automatically block dates on CamperWatch when those platforms have bookings. Syncs every 15 minutes.
        </p>

        {/* Existing calendars */}
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
            <Loader2 size={12} className="animate-spin" /> Loading…
          </div>
        ) : cals.length > 0 ? (
          <div className="space-y-2 mb-4">
            {cals.map(cal => (
              <div key={cal.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800">{cal.label}</div>
                  <div className="text-xs text-gray-400 truncate">{cal.source_url}</div>
                  {cal.last_sync && !cal.last_sync_error && (
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
                      <CheckCircle size={10} /> Synced {new Date(cal.last_sync).toLocaleString()}
                    </div>
                  )}
                  {cal.last_sync_error && (
                    <div className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
                      <AlertCircle size={10} /> {cal.last_sync_error}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteCal(cal.id)}
                  disabled={deleting === cal.id}
                  className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40 shrink-0"
                >
                  {deleting === cal.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {/* Add new feed */}
        <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-3">
          <div className="text-xs font-medium text-gray-600">Add an iCal feed</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Site</label>
              <select
                value={form.site_id}
                onChange={e => setForm(f => ({ ...f, site_id: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Platform</label>
              <select
                value={form.source}
                onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {SOURCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">iCal URL</label>
            <input
              value={form.source_url}
              onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))}
              placeholder="https://hipcamp.com/ical/your-campground.ics"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Label (optional)</label>
            <input
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              placeholder="e.g. Hipcamp — Site A"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {error && <div className="text-xs text-red-600">{error}</div>}
          {saveOk && (
            <div className="flex items-center gap-1.5 text-xs text-green-700">
              <CheckCircle size={12} /> Calendar added — will sync within 15 minutes.
            </div>
          )}
          <button
            onClick={addCal}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Plus size={14} /> Add calendar
          </button>
        </div>
      </div>
    </div>
  )
}
