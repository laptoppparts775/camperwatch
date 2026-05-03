'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import { campgrounds as campgroundData } from '@/lib/data'
import NavBar from '@/components/NavBar'
import {
  ArrowLeft, Save, CheckCircle, AlertCircle, Tent, DollarSign,
  Clock, FileText, PawPrint, ScrollText, Sparkles, Lock
} from 'lucide-react'

const SITE_TYPE_OPTIONS = [
  { value: 'tent', label: 'Tent Site' },
  { value: 'rv_hookup', label: 'RV Hookup' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'glamping', label: 'Glamping' },
]

/**
 * 1.7.3 — Site editor page
 *
 * Per-site editing with inheritance toggles:
 * - Basic fields (name, type, price, max guests) are always site-specific
 * - Cancellation policy / check-in / check-out can INHERIT from parent campground
 *   or be OVERRIDDEN per site. Owner toggles inheritance with a checkbox.
 * - House rules / pet policy / welcome message are site-only fields
 * - SEO keywords are tag chips (used by 1.7.8 metadata generation)
 *
 * Image upload is 1.7.4. AI fill is 1.7.5/1.7.6. Comes later.
 */
export default function SiteEditorPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const siteId = params.id
  const supabase = getSupabase()

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  // Form state — populated from DB on load
  const [form, setForm] = useState({
    name: '',
    site_type: 'tent',
    max_guests: 6,
    max_rig_length: '',
    price_per_night: '',
    weekend_price: '',
    description: '',
    amenities: '',
    house_rules: '',
    pet_policy: '',
    welcome_message: '',
    seo_keywords: '',
    cancellation_policy_override: '',
    check_in_override: '',
    check_out_override: '',
    active: true,
  })

  // Per-field inheritance toggles. true = inherit from parent (override is NULL)
  const [inherits, setInherits] = useState({
    cancellation_policy: true,
    check_in: true,
    check_out: true,
  })

  // Parent campground data for showing inherited values
  const [parent, setParent] = useState<{
    name: string
    cancellation_policy: string | null
    check_in: string | null
    check_out: string | null
  } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      if (!data.user) {
        router.push(`/auth/login?redirect=/owner-dashboard/sites/${siteId}/edit`)
        return
      }
      setUser(data.user)
      loadSite(data.user.id)
    })
  }, [siteId])

  async function loadSite(userId: string) {
    setLoading(true)

    // Load the site
    const { data: site, error: siteErr } = await supabase
      .from('campground_sites')
      .select('*')
      .eq('id', siteId)
      .maybeSingle()

    if (siteErr || !site) {
      setNotFound(true)
      setLoading(false)
      return
    }

    // Verify the logged-in user owns the campground this site belongs to
    const { data: ownerLink } = await supabase
      .from('campground_owners')
      .select('owner_id')
      .eq('campground_slug', site.campground_slug)
      .eq('owner_id', userId)
      .eq('active', true)
      .maybeSingle()

    if (!ownerLink) {
      setNotFound(true)
      setLoading(false)
      return
    }

    // Find parent campground in static data
    const p = campgroundData.find((c: any) => c.slug === site.campground_slug)
    if (p) {
      setParent({
        name: p.name,
        cancellation_policy: p.cancellation_policy ?? null,
        check_in: p.check_in ?? null,
        check_out: p.check_out ?? null,
      })
    }

    // Populate form from site row
    setForm({
      name: site.name || '',
      site_type: site.site_type || 'tent',
      max_guests: site.max_guests ?? 6,
      max_rig_length: site.max_rig_length != null ? String(site.max_rig_length) : '',
      price_per_night: site.price_per_night != null ? String(site.price_per_night) : '',
      weekend_price: site.weekend_price != null ? String(site.weekend_price) : '',
      description: site.description || '',
      amenities: (site.amenities || []).join(', '),
      house_rules: site.house_rules || '',
      pet_policy: site.pet_policy || '',
      welcome_message: site.welcome_message || '',
      seo_keywords: (site.seo_keywords || []).join(', '),
      cancellation_policy_override: site.cancellation_policy_override || '',
      check_in_override: site.check_in_override || '',
      check_out_override: site.check_out_override || '',
      active: !!site.active,
    })

    // Inheritance flags: NULL override = inherit from parent
    setInherits({
      cancellation_policy: site.cancellation_policy_override == null,
      check_in: site.check_in_override == null,
      check_out: site.check_out_override == null,
    })

    setLoading(false)
  }

  async function save() {
    if (!form.name.trim() || !form.price_per_night) {
      setError('Site name and price per night are required.')
      return
    }
    setSaving(true)
    setError('')
    setSaved(false)

    const payload: any = {
      name: form.name.trim(),
      site_type: form.site_type,
      max_guests: form.max_guests,
      max_rig_length: form.max_rig_length ? parseInt(form.max_rig_length) : null,
      price_per_night: parseFloat(form.price_per_night),
      weekend_price: form.weekend_price ? parseFloat(form.weekend_price) : null,
      description: form.description.trim() || null,
      amenities: form.amenities ? form.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
      house_rules: form.house_rules.trim() || null,
      pet_policy: form.pet_policy.trim() || null,
      welcome_message: form.welcome_message.trim() || null,
      seo_keywords: form.seo_keywords ? form.seo_keywords.split(',').map(a => a.trim()).filter(Boolean) : [],
      // Inheritance: if inherits=true, override is NULL. Otherwise use form value (null if blank).
      cancellation_policy_override: inherits.cancellation_policy
        ? null
        : (form.cancellation_policy_override.trim() || null),
      check_in_override: inherits.check_in
        ? null
        : (form.check_in_override.trim() || null),
      check_out_override: inherits.check_out
        ? null
        : (form.check_out_override.trim() || null),
      active: form.active,
    }

    const { error: updErr } = await supabase
      .from('campground_sites')
      .update(payload)
      .eq('id', siteId)

    setSaving(false)
    if (updErr) {
      setError('Save failed. Please try again.')
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <Lock size={32} className="text-gray-300 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Site not found</h1>
        <p className="text-gray-500 text-sm mb-4">This site doesn't exist or you don't have access to it.</p>
        <Link href="/owner-dashboard" className="text-green-600 hover:underline">Back to dashboard</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/owner-dashboard" className="text-gray-400 hover:text-green-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-400">Editing site at {parent?.name || ''}</div>
            <h1 className="text-xl font-bold text-gray-900 truncate">{form.name || 'Site editor'}</h1>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={14} />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-start gap-2">
            <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
            <div className="text-sm text-green-700">Saved.</div>
          </div>
        )}

        {/* Section: Basic info */}
        <Section icon={<Tent size={16} />} title="Basics" subtitle="Visible to campers on the booking page">
          <Field label="Site name *">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Site 12, Lakeside Tent A, Cabin Bear"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Site type">
              <select value={form.site_type} onChange={e => setForm({ ...form, site_type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {SITE_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Max guests">
              <input type="number" min={1} max={20} value={form.max_guests}
                onChange={e => setForm({ ...form, max_guests: parseInt(e.target.value) || 1 })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </Field>
          </div>
          <Field label="Max rig length (feet, RV sites only)" optional>
            <input type="number" min={0} value={form.max_rig_length}
              onChange={e => setForm({ ...form, max_rig_length: e.target.value })}
              placeholder="e.g. 35"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </Field>
          <Field label="Site description" optional hint="What makes this specific site stand out — view, shade, privacy, hookups">
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Tent pad with morning sun and lake glimpse through pines. Closest site to the trailhead."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y" />
          </Field>
          <Field label="Amenities" optional hint="Comma-separated list specific to this site (e.g. Picnic table, Fire ring, Electric hookup)">
            <input value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })}
              placeholder="Picnic table, Fire ring, Shade trees"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </Field>
        </Section>

        {/* Section: Pricing */}
        <Section icon={<DollarSign size={16} />} title="Pricing" subtitle="Per-night rates for this site">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price per night (USD) *">
              <input type="number" step="0.01" min="0" value={form.price_per_night}
                onChange={e => setForm({ ...form, price_per_night: e.target.value })}
                placeholder="55.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </Field>
            <Field label="Weekend price" optional hint="If different from weekday rate">
              <input type="number" step="0.01" min="0" value={form.weekend_price}
                onChange={e => setForm({ ...form, weekend_price: e.target.value })}
                placeholder="75.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </Field>
          </div>
        </Section>

        {/* Section: Inheritable policies */}
        <Section icon={<Clock size={16} />} title="Times & policies" subtitle="By default these inherit from your campground. Override when this site is different.">
          <InheritableField
            label="Check-in time"
            inherits={inherits.check_in}
            onInheritsChange={v => setInherits({ ...inherits, check_in: v })}
            inheritedValue={parent?.check_in || '—'}
            value={form.check_in_override}
            onChange={v => setForm({ ...form, check_in_override: v })}
            placeholder="e.g. 3:00 PM"
          />
          <InheritableField
            label="Check-out time"
            inherits={inherits.check_out}
            onInheritsChange={v => setInherits({ ...inherits, check_out: v })}
            inheritedValue={parent?.check_out || '—'}
            value={form.check_out_override}
            onChange={v => setForm({ ...form, check_out_override: v })}
            placeholder="e.g. 11:00 AM"
          />
          <InheritableField
            label="Cancellation policy"
            inherits={inherits.cancellation_policy}
            onInheritsChange={v => setInherits({ ...inherits, cancellation_policy: v })}
            inheritedValue={parent?.cancellation_policy || '—'}
            value={form.cancellation_policy_override}
            onChange={v => setForm({ ...form, cancellation_policy_override: v })}
            placeholder="e.g. Full refund 7 days before check-in, 50% refund 3 days before"
            multiline
          />
        </Section>

        {/* Section: Site-specific rules */}
        <Section icon={<ScrollText size={16} />} title="House rules & policies" subtitle="Site-specific — only fill these out when this site needs its own rules">
          <Field label="House rules" optional hint="Quiet hours, fire restrictions, vehicles allowed, anything specific">
            <textarea value={form.house_rules} onChange={e => setForm({ ...form, house_rules: e.target.value })}
              rows={3}
              placeholder="Quiet hours 10pm – 6am. One vehicle per site. No generators."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y" />
          </Field>
          <Field label="Pet policy" optional hint={<><PawPrint size={11} className="inline mr-1" />Specific to this site</>}>
            <input value={form.pet_policy} onChange={e => setForm({ ...form, pet_policy: e.target.value })}
              placeholder="Leashed dogs welcome. $10/night per pet. Max 2."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </Field>
          <Field label="Welcome message / arrival instructions" optional hint="Sent to campers in their booking confirmation email">
            <textarea value={form.welcome_message} onChange={e => setForm({ ...form, welcome_message: e.target.value })}
              rows={3}
              placeholder="Welcome! Gate code is 1234. The site is on the right past the bathhouse — look for the wooden sign with site number."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y" />
          </Field>
        </Section>

        {/* Section: SEO keywords */}
        <Section icon={<Sparkles size={16} />} title="SEO keywords" subtitle="Helps your site appear in searches. Comma-separated.">
          <Field label="Keywords" optional hint="e.g. lakefront, pet-friendly, RV-50amp, family-friendly, secluded">
            <input value={form.seo_keywords} onChange={e => setForm({ ...form, seo_keywords: e.target.value })}
              placeholder="lakefront, pet-friendly, full hookup, family"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </Field>
        </Section>

        {/* Section: Status */}
        <Section icon={<FileText size={16} />} title="Listing status">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 accent-green-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Active</div>
              <div className="text-xs text-gray-500">Uncheck to hide this site from the booking page</div>
            </div>
          </label>
        </Section>

        {/* Save button (sticky at bottom for long form) */}
        <div className="flex justify-end gap-3 mt-6 mb-12">
          <Link href="/owner-dashboard" className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={14} />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ----- Helper components ----- */

function Section({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-700 shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

function Field({ label, hint, optional, children }: { label: string; hint?: React.ReactNode; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-gray-600 font-medium block mb-1">
        {label}
        {optional && <span className="text-gray-400 font-normal"> · optional</span>}
      </label>
      {children}
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </div>
  )
}

function InheritableField({
  label, inherits, onInheritsChange, inheritedValue, value, onChange, placeholder, multiline,
}: {
  label: string
  inherits: boolean
  onInheritsChange: (v: boolean) => void
  inheritedValue: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-gray-600 font-medium">{label}</label>
        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
          <input type="checkbox" checked={inherits} onChange={e => onInheritsChange(e.target.checked)}
            className="w-3.5 h-3.5 accent-green-600" />
          Inherit from campground
        </label>
      </div>
      {inherits ? (
        <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 border border-dashed border-gray-200 whitespace-pre-wrap">
          {inheritedValue}
        </div>
      ) : multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={2} placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y" />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      )}
    </div>
  )
}
