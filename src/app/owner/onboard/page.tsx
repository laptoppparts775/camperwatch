'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { TreePine, CheckCircle, MapPin, Phone, DollarSign, Tent, Camera, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

const SITE_TYPES = ['Tent sites', 'RV hookups', 'Cabins', 'Glamping', 'Group sites']
const AMENITIES = ['Showers', 'Toilets', 'Electric hookups', 'Water hookups', 'Sewer hookups', 'WiFi', 'Fire rings', 'Picnic tables', 'Dump station', 'Laundry', 'Store', 'Pet friendly', 'Pool', 'Playground']
const STEPS = ['About your campground', 'Location & contact', 'Sites & pricing', 'Done!']

export default function OwnerOnboard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', state: '', address: '',
    phone: '', owner_name: '', owner_email: '',
    price_per_night: '', price_high: '',
    site_types: [] as string[], amenities: [] as string[],
    season: 'Year-round', check_in: '3:00 PM', check_out: '11:00 AM',
    hookups: '', max_rig_length: '', cancellation_policy: '',
    lat: '', lng: '',
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const toggle = (k: 'site_types' | 'amenities', v: string) =>
    setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }))

  async function submit() {
    setSubmitting(true)
    const sb = getSupabase()
    const { data: { user } } = await sb.auth.getUser()

    // Geocode address using free API
    let lat = parseFloat(form.lat) || 0
    let lng = parseFloat(form.lng) || 0
    if (!lat && form.address) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address)}&limit=1`)
        const geo = await res.json()
        if (geo[0]) { lat = parseFloat(geo[0].lat); lng = parseFloat(geo[0].lon) }
      } catch {}
    }

    await sb.from('campground_submissions').insert({
      name: form.name, description: form.description,
      state: form.state, address: form.address, location: form.address,
      lat, lng, phone: form.phone,
      owner_name: form.owner_name, owner_email: form.owner_email,
      price_per_night: parseFloat(form.price_per_night) || 0,
      price_high: parseFloat(form.price_high) || 0,
      site_types: form.site_types, amenities: form.amenities,
      season: form.season, check_in: form.check_in, check_out: form.check_out,
      hookups: form.hookups, max_rig_length: parseInt(form.max_rig_length) || null,
      cancellation_policy: form.cancellation_policy,
      booking_url: '', user_id: user?.id || null, status: 'pending'
    })

    // If logged in, update their role to owner
    if (user) {
      await sb.from('profiles').update({ role: 'owner' }).eq('id', user.id)
    }

    setSubmitting(false)
    setDone(true)
  }

  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 to-emerald-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h1>
        <p className="text-gray-500 mb-2">We'll review your campground and get you live within 24 hours.</p>
        <p className="text-gray-500 text-sm mb-6">We'll email <strong>{form.owner_email}</strong> with next steps and your owner dashboard login.</p>
        <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
          <div className="text-sm font-semibold text-green-800 mb-2">What happens next:</div>
          <div className="space-y-2 text-sm text-green-700">
            <div className="flex items-start gap-2"><CheckCircle size={14} className="mt-0.5 shrink-0" /> Our team reviews your listing (usually same day)</div>
            <div className="flex items-start gap-2"><CheckCircle size={14} className="mt-0.5 shrink-0" /> We'll call you to verify details and help with photos</div>
            <div className="flex items-start gap-2"><CheckCircle size={14} className="mt-0.5 shrink-0" /> Your campground goes live — campers can start booking</div>
            <div className="flex items-start gap-2"><CheckCircle size={14} className="mt-0.5 shrink-0" /> You get a simple dashboard to manage bookings from your phone</div>
          </div>
        </div>
        <Link href="/" className="block w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
          Back to CamperWatch
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/"><TreePine size={22} className="text-green-600" /></Link>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900">List your campground</div>
            <div className="text-xs text-gray-400">Free forever · 5 minutes · No tech needed</div>
          </div>
          <div className="text-sm font-medium text-gray-400">Step {step + 1} of {STEPS.length - 1}</div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-1 bg-green-500 transition-all duration-300" style={{ width: `${((step) / (STEPS.length - 2)) * 100}%` }} />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.slice(0, -1).map((s, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? 'bg-green-600 text-white' : i === step ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs whitespace-nowrap ${i === step ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{s}</span>
              {i < STEPS.length - 2 && <div className="w-6 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* STEP 0: About */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Tell us about your campground</h1>
              <p className="text-gray-500 text-sm">Don't worry about making it perfect — we help you polish it before going live.</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Campground name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Pine Ridge Family Campground"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">What's special about your campground?</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={4} placeholder="Tell campers what makes your spot unique — the views, the peace and quiet, nearby activities..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">What type of sites do you offer? *</label>
              <div className="flex flex-wrap gap-2">
                {SITE_TYPES.map(t => (
                  <button key={t} onClick={() => toggle('site_types', t)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${
                      form.site_types.includes(t) ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Amenities you offer</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map(a => (
                  <button key={a} onClick={() => toggle('amenities', a)}
                    className={`px-3 py-2 rounded-xl text-sm border-2 transition-colors ${
                      form.amenities.includes(a) ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Location & Contact */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Where are you located?</h1>
              <p className="text-gray-500 text-sm">We use this to show your campground on our map and help campers find you.</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Full address *</label>
              <input value={form.address} onChange={e => set('address', e.target.value)}
                placeholder="123 Forest Road, Truckee, CA 96161"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <p className="text-xs text-gray-400 mt-1">We'll automatically put you on the map from this address.</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">State *</label>
              <select value={form.state} onChange={e => set('state', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select state...</option>
                {['AK','AL','AR','AZ','CA','CO','CT','DE','FL','GA','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA','WI','WV','WY'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Your name *</label>
                <input value={form.owner_name} onChange={e => set('owner_name', e.target.value)}
                  placeholder="John Smith"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Phone number *</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email address *</label>
              <input type="email" value={form.owner_email} onChange={e => set('owner_email', e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <p className="text-xs text-gray-400 mt-1">We'll send your dashboard login here. We never share your email.</p>
            </div>
          </div>
        )}

        {/* STEP 2: Pricing */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Pricing & availability</h1>
              <p className="text-gray-500 text-sm">Set a range — you control exact pricing for each site in your dashboard.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Starting price ($/night) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="number" value={form.price_per_night} onChange={e => set('price_per_night', e.target.value)}
                    placeholder="35"
                    className="w-full pl-8 pr-4 border border-gray-200 rounded-xl py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Maximum price ($/night)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="number" value={form.price_high} onChange={e => set('price_high', e.target.value)}
                    placeholder="95"
                    className="w-full pl-8 pr-4 border border-gray-200 rounded-xl py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Check-in time</label>
                <select value={form.check_in} onChange={e => set('check_in', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Check-out time</label>
                <select value={form.check_out} onChange={e => set('check_out', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['9:00 AM','10:00 AM','11:00 AM','12:00 PM'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Season</label>
              <select value={form.season} onChange={e => set('season', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {['Year-round','Spring–Fall (Apr–Oct)','Summer only (Jun–Sep)','Memorial Day–Labor Day','April–November'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Cancellation policy</label>
              <select value={form.cancellation_policy} onChange={e => set('cancellation_policy', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select...</option>
                <option>Flexible – Full refund 24 hours before check-in</option>
                <option>Moderate – Full refund 3 days before check-in</option>
                <option>Strict – Full refund 7 days before check-in, 50% after</option>
                <option>Non-refundable</option>
              </select>
            </div>

            {/* Social proof */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="text-sm font-semibold text-green-800 mb-2">Why campground owners choose CamperWatch</div>
              <div className="space-y-1.5">
                {['Lower commission than Hipcamp — you keep more per booking', 'Simple dashboard works on any phone — no computer needed', 'We handle payments, you just welcome guests', 'Real community of campers who write honest reviews'].map(t => (
                  <div key={t} className="flex items-start gap-2 text-xs text-green-700">
                    <CheckCircle size={13} className="mt-0.5 shrink-0 text-green-500" />{t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              ← Back
            </button>
          )}
          {step < 2 ? (
            <button onClick={() => setStep(s => s + 1)}
              disabled={step === 0 && (!form.name || form.site_types.length === 0)}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={submit} disabled={submitting || !form.price_per_night}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
              {submitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</> : <>Submit my campground ✓</>}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Free to list · No contract · We only charge when you get bookings
        </p>
      </div>
    </div>
  )
}
