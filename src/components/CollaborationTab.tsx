'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { campgrounds as allCampgrounds } from '@/lib/data'
import { Plus, Trash2, Loader2, CheckCircle, Users, Share2, Code, Copy } from 'lucide-react'
import Link from 'next/link'

interface OwnerCampground {
  campground_slug: string
}

interface ReferralPartner {
  id: string
  partner_campground_slug: string
  enabled: boolean
}

interface Props {
  userId: string
  ownedCampgrounds: OwnerCampground[]
}

function campgroundName(slug: string) {
  const found = allCampgrounds.find((c: any) => c.slug === slug)
  return (found as any)?.name || slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function CollaborationTab({ userId, ownedCampgrounds }: Props) {
  const supabase = getSupabase()
  const [partners, setPartners] = useState<ReferralPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveOk, setSaveOk] = useState(false)
  const [error, setError] = useState('')
  const [copiedWidget, setCopiedWidget] = useState<string | null>(null)
  const [selectedSlug, setSelectedSlug] = useState('')

  async function copyWidget(widgetSlug: string) {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://camperwatch.org'
    const snippet = '<iframe src="' + siteUrl + '/widget/' + widgetSlug + '" width="420" height="520" frameborder="0" style="border-radius:16px;border:1px solid #e5e7eb;"></iframe>'
    await navigator.clipboard.writeText(snippet)
    setCopiedWidget(widgetSlug)
    setTimeout(() => setCopiedWidget(null), 2000)
  }

  // Campgrounds owner does NOT own — candidates for referral partners
  const ownedSlugs = new Set(ownedCampgrounds.map(c => c.campground_slug))
  const partnerSlugs = new Set(partners.map(p => p.partner_campground_slug))
  const candidates = allCampgrounds
    .filter((c: any) => !ownedSlugs.has(c.slug) && !partnerSlugs.has(c.slug))

  useEffect(() => {
    fetchPartners()
  }, [])

  async function fetchPartners() {
    setLoading(true)
    const { data } = await supabase
      .from('owner_referral_partners')
      .select('id, partner_campground_slug, enabled')
      .eq('owner_id', userId)
      .order('created_at', { ascending: true })
    setPartners(data || [])
    setLoading(false)
  }

  async function addPartner() {
    setError('')
    setSaveOk(false)
    if (!selectedSlug) { setError('Select a campground first.'); return }
    setSaving(true)
    const { error: insertErr } = await supabase.from('owner_referral_partners').insert({
      owner_id: userId,
      partner_campground_slug: selectedSlug,
      enabled: true,
    })
    setSaving(false)
    if (insertErr) { setError('Failed to save. Try again.'); return }
    setSelectedSlug('')
    setSaveOk(true)
    setTimeout(() => setSaveOk(false), 3000)
    fetchPartners()
  }

  async function togglePartner(id: string, enabled: boolean) {
    await supabase.from('owner_referral_partners').update({ enabled: !enabled }).eq('id', id)
    setPartners(prev => prev.map(p => p.id === id ? { ...p, enabled: !enabled } : p))
  }

  async function deletePartner(id: string) {
    setDeleting(id)
    await supabase.from('owner_referral_partners').delete().eq('id', id)
    setPartners(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  return (
    <div className="space-y-5">

      {/* Sister properties */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Users size={15} className="text-green-600" />
          Your campgrounds
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          All campgrounds linked to your account. Each has its own calendar and booking settings. Add more campgrounds by submitting via the owner portal.
        </p>
        {ownedCampgrounds.length === 0 ? (
          <div className="text-xs text-gray-400">No campgrounds linked yet.</div>
        ) : (
          <div className="space-y-2">
            {ownedCampgrounds.map(c => (
              <div key={c.campground_slug} className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{campgroundName(c.campground_slug)}</div>
                  <div className="text-xs text-gray-400">{c.campground_slug}</div>
                </div>
                <Link
                  href={`/campground/${c.campground_slug}`}
                  className="text-xs text-green-700 hover:underline font-medium"
                  target="_blank"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        )}
        {ownedCampgrounds.length > 1 && (
          <p className="text-xs text-gray-400 mt-3">
            Multi-property unified calendar is available in the 📅 Availability tab — each site's calendar is managed separately.
          </p>
        )}
      </div>

      {/* Embeddable widget */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Code size={15} className="text-green-600" />
          Embeddable booking widget
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Paste this snippet into your own website so campers can check availability and book without leaving your site.
        </p>
        <div className="space-y-3">
          {ownedCampgrounds.length === 0 ? (
            <div className="text-xs text-gray-400">No campgrounds linked yet.</div>
          ) : ownedCampgrounds.map(c => (
            <div key={c.campground_slug} className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-800">{campgroundName(c.campground_slug)}</div>
                <button
                  onClick={() => copyWidget(c.campground_slug)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                >
                  {copiedWidget === c.campground_slug ? <CheckCircle size={12} /> : <Copy size={12} />}
                  {copiedWidget === c.campground_slug ? 'Copied!' : 'Copy embed code'}
                </button>
              </div>
              <div className="text-xs text-gray-400 font-mono truncate">
                {`<iframe src="https://camperwatch.org/widget/${c.campground_slug}" width="420" height="520" ...>`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral network */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Share2 size={15} className="text-green-600" />
          Referral network
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          When you're fully booked, CamperWatch shows campers these nearby alternatives. You help them find a spot — they remember you next time. No commission, no strings.
        </p>

        {loading ? (
          <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
            <Loader2 size={12} className="animate-spin" /> Loading…
          </div>
        ) : (
          <>
            {partners.length > 0 && (
              <div className="space-y-2 mb-4">
                {partners.map(p => (
                  <div key={p.id} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${p.enabled ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800">{campgroundName(p.partner_campground_slug)}</div>
                      <div className="text-xs text-gray-400">{p.partner_campground_slug}</div>
                    </div>
                    <button
                      onClick={() => togglePartner(p.id, p.enabled)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${p.enabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {p.enabled ? 'Active' : 'Paused'}
                    </button>
                    <button
                      onClick={() => deletePartner(p.id)}
                      disabled={deleting === p.id}
                      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                    >
                      {deleting === p.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add partner */}
            <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-3">
              <div className="text-xs font-medium text-gray-600">Add a referral partner</div>
              <select
                value={selectedSlug}
                onChange={e => setSelectedSlug(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a campground…</option>
                {candidates.map((c: any) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
              {error && <div className="text-xs text-red-600">{error}</div>}
              {saveOk && (
                <div className="flex items-center gap-1.5 text-xs text-green-700">
                  <CheckCircle size={12} /> Partner added.
                </div>
              )}
              <button
                onClick={addPartner}
                disabled={saving || !selectedSlug}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {saving ? 'Saving…' : 'Add partner'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
