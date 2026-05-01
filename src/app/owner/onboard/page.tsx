'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { CheckCircle, ArrowRight, Sparkles, Upload, X, MapPin, Phone, DollarSign, Camera, Loader } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'

const SITE_TYPES = ['Tent sites', 'RV hookups', 'Cabins', 'Glamping', 'Group sites']
const AMENITIES = ['Showers', 'Toilets', 'Electric hookups', 'Water hookups', 'Sewer hookups', 'WiFi', 'Fire rings', 'Picnic tables', 'Dump station', 'Laundry', 'Store', 'Pet friendly', 'Pool', 'Playground', 'Fishing', 'Hiking trails']

export default function OwnerOnboard() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
  const [done, setDone] = useState(false)
  const [aiResult, setAiResult] = useState<any>(null)
  const [images, setImages] = useState<string[]>([])
  const [uploadingImg, setUploadingImg] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', state: '', address: '',
    phone: '', owner_name: '', owner_email: '',
    price_per_night: '', price_high: '',
    site_types: [] as string[], amenities: [] as string[],
    season: 'Year-round', check_in: '3:00 PM', check_out: '11:00 AM',
    cancellation_policy: 'Moderate – Full refund 3 days before check-in',
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const toggle = (k: 'site_types' | 'amenities', v: string) =>
    setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }))

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImg(true)
    const sb = getSupabase()
    const ext = file.name.split('.').pop()
    const path = `submissions/${Date.now()}.${ext}`
    const { data, error } = await sb.storage.from('campground-images').upload(path, file)
    if (!error && data) {
      const { data: { publicUrl } } = sb.storage.from('campground-images').getPublicUrl(path)
      setImages(prev => [...prev, publicUrl])
    }
    setUploadingImg(false)
  }

  async function enhanceWithAI() {
    if (!form.name) return
    setEnhancing(true)
    try {
      const res = await fetch('/api/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          amenities: form.amenities,
          site_types: form.site_types,
          state: form.state,
          address: form.address,
        })
      })
      const data = await res.json()
      if (data.success) {
        setAiResult(data.result)
        set('description', data.result.description)
      }
    } catch {}
    setEnhancing(false)
  }

  async function submit() {
    setSubmitting(true)
    const sb = getSupabase()
    const { data: { user } } = await sb.auth.getUser()

    // Auto-geocode
    let lat = 0, lng = 0
    if (form.address) {
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address + ' ' + form.state)}&limit=1`)
        const g = await r.json()
        if (g[0]) { lat = parseFloat(g[0].lat); lng = parseFloat(g[0].lon) }
      } catch {}
    }

    const { data: sub } = await sb.from('campground_submissions').insert({
      name: form.name,
      description: aiResult?.description || form.description,
      state: form.state, address: form.address, location: `${form.address}, ${form.state}`,
      lat, lng, phone: form.phone,
      owner_name: form.owner_name, owner_email: form.owner_email,
      price_per_night: parseFloat(form.price_per_night) || 0,
      price_high: parseFloat(form.price_high) || 0,
      site_types: form.site_types, amenities: form.amenities,
      season: form.season, check_in: form.check_in, check_out: form.check_out,
      cancellation_policy: form.cancellation_policy,
      booking_url: '', user_id: user?.id || null, status: 'pending'
    }).select().single()

    // Save AI draft if we have one
    if (aiResult && sub && user) {
      await sb.from('listing_ai_drafts').insert({
        submission_id: sub.id,
        owner_id: user.id,
        ai_description: aiResult.description,
        ai_tagline: aiResult.tagline,
        ai_pro_tips: aiResult.pro_tips,
        ai_target_audience: aiResult.target_audience,
      })
    }

    // Save media
    if (images.length > 0 && user) {
      await sb.from('campground_media').insert(
        images.map(url => ({
          campground_slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          user_id: user.id, url, type: 'image', source: 'owner', approved: false
        }))
      )
    }

    if (user) await sb.from('profiles').update({ role: 'owner' }).eq('id', user.id)
    setSubmitting(false)
    setDone(true)
  }

  if (done) return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h1>
        <p className="text-gray-500 mb-6">We'll review <strong>{form.name}</strong> and have you live within 24 hours. Check <strong>{form.owner_email}</strong> for next steps.</p>
        <div className="bg-green-50 rounded-2xl p-5 text-left mb-6 space-y-2.5">
          {['Our team reviews your listing today', 'We may call to verify details and help with photos', 'Your campground goes live — campers can book', 'You get a phone-friendly dashboard to manage everything'].map(t => (
            <div key={t} className="flex items-start gap-2.5 text-sm text-green-700">
              <CheckCircle size={14} className="mt-0.5 shrink-0 text-green-500" />{t}
            </div>
          ))}
        </div>
        <Link href="/owner-dashboard" className="block w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 mb-3">Go to my dashboard</Link>
        <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600">Back to CamperWatch</Link>
      </div>
    </div>
  )

  const STEPS = ['Your campground', 'Location & contact', 'Pricing', 'Photos & AI']
  const canNext = [
    form.name.length > 2 && form.site_types.length > 0,
    form.address.length > 5 && form.state && form.owner_name && form.owner_email,
    form.price_per_night.length > 0,
    true,
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < step ? 'bg-green-600 text-white' : i === step ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs whitespace-nowrap ${i === step ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-5 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* STEP 0 */}
        {step === 0 && (
          <div className="space-y-5">
            <div><h1 className="text-2xl font-bold text-gray-900 mb-1">Tell us about your campground</h1><p className="text-gray-400 text-sm">We'll use AI to help write your listing — just give us the basics.</p></div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Campground name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Pine Ridge Family Campground"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Describe your campground in your own words</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                placeholder="What makes your spot special? Views, activities, vibe, who it's great for..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              <p className="text-xs text-gray-400 mt-1">Don't worry about making it perfect — our AI will enhance it on step 4.</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">What sites do you offer? *</label>
              <div className="flex flex-wrap gap-2">
                {SITE_TYPES.map(t => (
                  <button key={t} onClick={() => toggle('site_types', t)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${form.site_types.includes(t) ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map(a => (
                  <button key={a} onClick={() => toggle('amenities', a)}
                    className={`px-3 py-1.5 rounded-xl text-xs border-2 transition-all ${form.amenities.includes(a) ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div><h1 className="text-2xl font-bold text-gray-900 mb-1">Where are you and who are you?</h1><p className="text-gray-400 text-sm">We'll put you on the map automatically from your address.</p></div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Full address *</label>
              <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Forest Road, Truckee, CA 96161"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">State *</label>
              <select value={form.state} onChange={e => set('state', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select state...</option>
                {['AK','AL','AR','AZ','CA','CO','CT','DE','FL','GA','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA','WI','WV','WY'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Your name *</label>
                <input value={form.owner_name} onChange={e => set('owner_name', e.target.value)} placeholder="John Smith"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Phone *</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 000-0000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email address *</label>
              <input type="email" value={form.owner_email} onChange={e => set('owner_email', e.target.value)} placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <p className="text-xs text-gray-400 mt-1">We'll send your dashboard login here. Never shared.</p>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <div><h1 className="text-2xl font-bold text-gray-900 mb-1">Pricing & availability</h1><p className="text-gray-400 text-sm">You control exact pricing per site in your dashboard.</p></div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Starting price ($/night) *</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input type="number" value={form.price_per_night} onChange={e => set('price_per_night', e.target.value)} placeholder="35"
                    className="w-full pl-8 pr-4 border border-gray-200 rounded-xl py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Max price ($/night)</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input type="number" value={form.price_high} onChange={e => set('price_high', e.target.value)} placeholder="95"
                    className="w-full pl-8 pr-4 border border-gray-200 rounded-xl py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Check-in</label>
                <select value={form.check_in} onChange={e => set('check_in', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Check-out</label>
                <select value={form.check_out} onChange={e => set('check_out', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['9:00 AM','10:00 AM','11:00 AM','12:00 PM'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Season</label>
              <select value={form.season} onChange={e => set('season', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {['Year-round','Spring–Fall (Apr–Oct)','Summer only (Jun–Sep)','Memorial Day–Labor Day'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Cancellation policy</label>
              <select value={form.cancellation_policy} onChange={e => set('cancellation_policy', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Flexible – Full refund 24 hours before check-in</option>
                <option>Moderate – Full refund 3 days before check-in</option>
                <option>Strict – Full refund 7 days before check-in, 50% after</option>
                <option>Non-refundable</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3 — Photos + AI */}
        {step === 3 && (
          <div className="space-y-5">
            <div><h1 className="text-2xl font-bold text-gray-900 mb-1">Photos & AI enhancement</h1><p className="text-gray-400 text-sm">Add photos and let AI write your perfect listing description.</p></div>

            {/* Photo upload */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Upload photos of your campground</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {images.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                    <img src={url} className="w-full h-full object-cover" alt="" />
                    <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5">
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <button onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-green-400 transition-colors">
                  {uploadingImg ? <Loader size={16} className="animate-spin text-gray-400" /> : <><Camera size={16} className="text-gray-400 mb-1" /><span className="text-xs text-gray-400">Add photo</span></>}
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <p className="text-xs text-gray-400">Photos make your listing 3x more likely to get booked. Don't worry about quality — we can help with that.</p>
            </div>

            {/* AI enhancement */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">AI listing enhancement</div>
                  <div className="text-sm text-gray-500">Our AI will write a compelling description, tagline, and insider tips for your campground — free.</div>
                </div>
              </div>

              {!aiResult ? (
                <button onClick={enhanceWithAI} disabled={enhancing || !form.name}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 disabled:opacity-40 transition-colors">
                  {enhancing ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Writing your listing...</> : <><Sparkles size={15} /> Enhance my listing with AI</>}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-green-700"><CheckCircle size={15} /> AI enhancement complete!</div>
                  <div className="bg-white rounded-xl p-4 border border-purple-100">
                    <div className="text-xs font-bold text-purple-600 uppercase mb-1">Tagline</div>
                    <div className="text-sm font-semibold text-gray-900 mb-3">{aiResult.tagline}</div>
                    <div className="text-xs font-bold text-purple-600 uppercase mb-1">Description</div>
                    <div className="text-sm text-gray-700 line-clamp-3">{aiResult.description}</div>
                    {aiResult.pro_tips?.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-bold text-purple-600 uppercase mb-1">Pro tips</div>
                        {aiResult.pro_tips.slice(0, 2).map((t: string, i: number) => (
                          <div key={i} className="text-xs text-gray-600 mb-0.5">• {t}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={enhanceWithAI} className="text-xs text-purple-600 hover:underline">Regenerate</button>
                </div>
              )}
            </div>

            {/* Trust signals */}
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-sm font-semibold text-green-800 mb-2">Why list on CamperWatch?</div>
              <div className="grid grid-cols-2 gap-2">
                {['Free to list, no monthly fees', 'Lower commission than Hipcamp', 'Simple phone-friendly dashboard', 'Real community of campers'].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-green-700">
                    <CheckCircle size={12} className="text-green-500 shrink-0" />{t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">← Back</button>
          )}
          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext[step]}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-40 flex items-center justify-center gap-2">
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={submit} disabled={submitting}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-40 flex items-center justify-center gap-2">
              {submitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</> : 'Submit my campground ✓'}
            </button>
          )}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Free forever · No contract · Commission only when you get bookings</p>
      </div>
    </div>
  )
}
