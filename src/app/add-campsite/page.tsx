'use client'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { TreePine, MapPin, DollarSign, Info, Camera, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Logo from '@/components/Logo'

const STATES = ['AK','AL','AR','AZ','CA','CO','CT','DE','FL','GA','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA','WI','WV','WY']

export default function AddCampsitePage() {
  const supabase = getSupabase()
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', address: '', state: 'NV', location: '', lat: '', lng: '',
    description: '', price_per_night: '', price_high: '', season: '',
    site_types: [] as string[], amenities: '', phone: '', booking_url: '',
    check_in: '', check_out: '', max_rig_length: '', hookups: '',
    cancellation_policy: '', known_issues: '', owner_name: '', owner_email: '',
  })

  useEffect(() => { supabase.auth.getUser().then(({ data }: { data: any }) => setUser(data.user)) }, [])

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const toggleSiteType = (t: string) => setForm(f => ({
    ...f, site_types: f.site_types.includes(t) ? f.site_types.filter(s => s !== t) : [...f.site_types, t]
  }))

  const handleSubmit = async () => {
    await supabase.from('campground_submissions').insert({
      ...form,
      lat: parseFloat(form.lat) || null,
      lng: parseFloat(form.lng) || null,
      price_per_night: parseInt(form.price_per_night) || null,
      price_high: parseInt(form.price_high) || null,
      max_rig_length: parseInt(form.max_rig_length) || null,
      amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
      user_id: user?.id || null,
      status: 'pending',
    }).then(() => setSubmitted(true))
  }

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <CheckCircle size={56} className="text-green-600 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
        <p className="text-gray-500 mb-6">Your campsite has been submitted for review. We verify every listing before publishing — usually within 48 hours.</p>
        <Link href="/search" className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm inline-block">Browse Campgrounds</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl p-8 text-white mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">List Your Campground</h1>
          <p className="text-green-100 text-sm">Join CamperWatch and reach thousands of campers searching for their next adventure. Free to list — we only charge a small commission on bookings we drive your way.</p>
          <div className="flex gap-6 mt-4 text-sm">
            {['Free to list', 'Verified & published in 48hrs', 'Keep full control of your booking'].map(b => (
              <div key={b} className="flex items-center gap-1.5 text-green-200"><CheckCircle size={14} />{b}</div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {['Basic Info', 'Details', 'Contact'].map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full mb-1 ${step > i ? 'bg-green-600' : step === i + 1 ? 'bg-green-400' : 'bg-gray-200'}`} />
              <span className={`text-xs ${step === i + 1 ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>{s}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Info size={16} className="text-green-700" /> Basic Information</h2>
              {[
                { key: 'name', label: 'Campground Name *', placeholder: 'e.g. Pine Valley RV Resort' },
                { key: 'address', label: 'Street Address *', placeholder: '123 Forest Rd' },
                { key: 'location', label: 'City, State *', placeholder: 'e.g. Reno, NV' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
                  <input value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">State *</label>
                  <select value={form.state} onChange={e => set('state', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600">
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Latitude</label>
                  <input value={form.lat} onChange={e => set('lat', e.target.value)} placeholder="39.1234"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Longitude</label>
                  <input value={form.lng} onChange={e => set('lng', e.target.value)} placeholder="-119.8765"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Description *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Describe your campground — location, scenery, what makes it special..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 min-h-[100px] resize-none" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2"><MapPin size={16} className="text-green-700" /> Site Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Price/Night (from) *</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={form.price_per_night} onChange={e => set('price_per_night', e.target.value)} placeholder="35" type="number"
                      className="w-full pl-8 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Price/Night (max)</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={form.price_high} onChange={e => set('price_high', e.target.value)} placeholder="95" type="number"
                      className="w-full pl-8 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Site Types *</label>
                <div className="flex flex-wrap gap-2">
                  {['RV', 'Tent', 'Cabin', 'Glamping', 'Yurt', 'Treehouse', 'Van/Car'].map(t => (
                    <button key={t} onClick={() => toggleSiteType(t)} type="button"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.site_types.includes(t) ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {[
                { key: 'amenities', label: 'Amenities (comma-separated)', placeholder: 'Full Hookups, Showers, WiFi, Pet Friendly, Pool...' },
                { key: 'season', label: 'Season Open', placeholder: 'e.g. Year-round or May - October' },
                { key: 'hookups', label: 'Hookup Details', placeholder: 'e.g. Full hookups 30/50A, water, sewer' },
                { key: 'check_in', label: 'Check-In Time', placeholder: '2:00 PM' },
                { key: 'check_out', label: 'Check-Out Time', placeholder: '11:00 AM' },
                { key: 'max_rig_length', label: 'Max RV Length (ft)', placeholder: '45' },
                { key: 'cancellation_policy', label: 'Cancellation Policy', placeholder: 'Full refund if cancelled 48+ hours before...' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
                  <input value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Camera size={16} className="text-green-700" /> Contact & Booking</h2>
              {[
                { key: 'owner_name', label: 'Your Name *', placeholder: 'John Smith' },
                { key: 'owner_email', label: 'Your Email *', placeholder: 'john@yourcamp.com' },
                { key: 'phone', label: 'Campground Phone', placeholder: '(775) 555-0100' },
                { key: 'booking_url', label: 'Booking URL *', placeholder: 'https://yourcamp.com/reservations or Recreation.gov link' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
                  <input value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
                </div>
              ))}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                <strong>What happens next:</strong> Our team verifies your campground details within 48 hours, then publishes it on CamperWatch. You'll receive a confirmation email once it's live.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
                Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                Next Step
              </button>
            ) : (
              <button onClick={handleSubmit}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                Submit for Review
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
