'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { TreePine, Mail, MessageSquare, MapPin, AlertCircle, Lightbulb, Building2, CheckCircle2, ChevronDown } from 'lucide-react'

const REASONS = [
  { value: 'correction',   label: 'Report a data error',         icon: AlertCircle,    desc: 'Pricing, amenities, or info is wrong' },
  { value: 'tip',          label: 'Share an insider tip',         icon: Lightbulb,      desc: 'Help other campers with local knowledge' },
  { value: 'partnership',  label: 'Campground owner / partner',   icon: Building2,      desc: 'List your campground or discuss partnership' },
  { value: 'general',      label: 'General question',             icon: MessageSquare,  desc: 'Anything else' },
]

export default function ContactPage() {
  const [form, setForm] = useState({
    reason: '',
    campground: '',
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.reason || !form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')
    const { error: dbError } = await supabase.from('contact_messages').insert({
      reason: form.reason,
      campground_ref: form.campground || null,
      name: form.name,
      email: form.email,
      message: form.message,
    })
    setLoading(false)
    if (dbError) {
      setError('Something went wrong. Please email us directly at hello@camperwatch.org')
      return
    }
    setSubmitted(true)
  }

  const selectedReason = REASONS.find(r => r.value === form.reason)

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0e1a13] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Got it — thanks!</h2>
          <p className="text-gray-500 mb-6">
            {form.reason === 'correction'
              ? "We'll verify your correction and update the listing within 48 hours."
              : form.reason === 'tip'
              ? "Your tip will be reviewed and added to help fellow campers."
              : form.reason === 'partnership'
              ? "Someone from our team will reach out within 2 business days."
              : "We'll get back to you as soon as we can."}
          </p>
          <Link href="/" className="inline-block bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800 transition-colors">
            Back to CamperWatch
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0e1a13]">
      {/* Nav */}
      <nav className="px-4 py-4 sm:px-8 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <TreePine size={20} className="text-green-400" />
          <span className="font-semibold">CamperWatch</span>
        </Link>
        <span className="text-white/30">/</span>
        <span className="text-white/60 text-sm">Contact</span>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/40 rounded-full px-4 py-1.5 mb-4">
            <Mail size={14} className="text-green-400" />
            <span className="text-green-300 text-sm font-medium">Get in touch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            How can we help?
          </h1>
          <p className="text-white/50">
            Found wrong info? Have an insider tip? Want to list your campground? We read every message.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Step 1: Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              What's this about? <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REASONS.map(r => {
                const Icon = r.icon
                const active = form.reason === r.value
                return (
                  <button
                    key={r.value}
                    onClick={() => set('reason', r.value)}
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                      active
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-100 hover:border-green-200 bg-gray-50'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-green-600 mt-0.5' : 'text-gray-400 mt-0.5'} />
                    <div>
                      <div className={`text-sm font-semibold ${active ? 'text-green-800' : 'text-gray-700'}`}>{r.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{r.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Campground (contextual — shown for correction/tip) */}
          {(form.reason === 'correction' || form.reason === 'tip') && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Which campground?
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.campground}
                  onChange={e => set('campground', e.target.value)}
                  placeholder="e.g. Nevada Beach Campground"
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              {form.reason === 'correction' && (
                <p className="text-xs text-gray-400 mt-1.5">Leave blank if it applies to the whole site</p>
              )}
            </div>
          )}

          {/* Partnership context */}
          {form.reason === 'partnership' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>Campground owners:</strong> Use the message field below to tell us about your campground — location, site count, amenities, and booking platform. We'll reach out within 2 business days.
            </div>
          )}

          {/* Step 3: Name + Email */}
          {form.reason && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="First name is fine"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 4: Message */}
          {form.reason && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {form.reason === 'correction'
                  ? 'What needs correcting?'
                  : form.reason === 'tip'
                  ? 'What\'s your tip?'
                  : form.reason === 'partnership'
                  ? 'Tell us about your campground'
                  : 'Your message'}{' '}
                <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={e => set('message', e.target.value)}
                rows={5}
                placeholder={
                  form.reason === 'correction'
                    ? 'e.g. "Nevada Beach pricing is wrong — sites are $47 not $55. Source: recreation.gov"'
                    : form.reason === 'tip'
                    ? 'e.g. "Sites 14 and 28 at Nevada Beach have direct lake views. Book 6 months out at exactly 7am PST."'
                    : form.reason === 'partnership'
                    ? 'Tell us your campground name, location, site count, and how you currently handle bookings...'
                    : 'What\'s on your mind?'
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Submit */}
          {form.reason && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold py-4 rounded-2xl transition-colors"
            >
              {loading ? 'Sending…' : selectedReason ? `Send — ${selectedReason.label}` : 'Send Message'}
            </button>
          )}

          <p className="text-xs text-gray-400 text-center">
            Or email us directly at{' '}
            <a href="mailto:hello@camperwatch.org" className="text-green-600 hover:underline">
              hello@camperwatch.org
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
