'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { campgrounds } from '@/lib/data'
import Link from 'next/link'
import { ArrowLeft, Calendar, Users, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'

type Site = {
  id: string
  name: string
  site_type: string
  max_guests: number
  max_rig_length: number | null
  price_per_night: number
  weekend_price: number | null
  amenities: string[]
  description: string
}

const SITE_TYPE_LABELS: Record<string, string> = {
  tent: 'Tent Site',
  rv_hookup: 'RV Hookup',
  cabin: 'Cabin',
  glamping: 'Glamping',
}

export default function BookPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const camp = campgrounds.find(c => c.slug === slug)

  const [sites, setSites] = useState<Site[]>([])
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user?.email) setGuestEmail(data.user.email)
      if (data.user?.user_metadata?.full_name) setGuestName(data.user.user_metadata.full_name)
    })
    fetchSites()
  }, [slug])

  async function fetchSites() {
    const { data } = await supabase
      .from('campground_sites')
      .select('*')
      .eq('campground_slug', slug)
      .eq('active', true)
      .order('price_per_night')
    if (data) setSites(data)
  }

  function calcNights() {
    if (!checkIn || !checkOut) return 0
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return Math.round(diff / (1000 * 60 * 60 * 24))
  }

  function calcTotal() {
    if (!selectedSite || !checkIn || !checkOut) return 0
    const nights = calcNights()
    if (nights <= 0) return 0
    // Weekend pricing: count Fri + Sat nights
    let total = 0
    for (let i = 0; i < nights; i++) {
      const d = new Date(checkIn)
      d.setDate(d.getDate() + i)
      const day = d.getDay()
      const isWeekend = day === 5 || day === 6
      const rate = (isWeekend && selectedSite.weekend_price) ? selectedSite.weekend_price : selectedSite.price_per_night
      total += rate
    }
    return total
  }

  function calcCommission(total: number) {
    return Math.round(total * 0.10 * 100) / 100 // 10% to CamperWatch
  }

  async function submitBooking() {
    if (!selectedSite || !checkIn || !checkOut || !guestName || !guestEmail) {
      setError('Please fill in all required fields.')
      return
    }
    const nights = calcNights()
    if (nights <= 0) {
      setError('Check-out must be after check-in.')
      return
    }
    if (!user) {
      router.push(`/auth/login?redirect=/book/${slug}`)
      return
    }

    setLoading(true)
    setError('')

    const total = calcTotal()
    const commission = calcCommission(total)

    const { data, error: err } = await supabase
      .from('bookings')
      .insert({
        site_id: selectedSite.id,
        campground_slug: slug,
        guest_id: user.id,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in: checkIn,
        check_out: checkOut,
        num_guests: guests,
        total_price: total,
        commission_amount: commission,
        owner_payout: total - commission,
        status: 'confirmed', // TODO: change to 'pending' once Stripe is live
        special_requests: specialRequests,
      })
      .select('booking_ref')
      .single()

    setLoading(false)

    if (err) {
      setError('Booking failed. Please try again.')
      return
    }

    // Block those dates in site_availability
    const blockedDates = []
    for (let i = 0; i < nights; i++) {
      const d = new Date(checkIn)
      d.setDate(d.getDate() + i)
      blockedDates.push({
        site_id: selectedSite.id,
        blocked_date: d.toISOString().split('T')[0],
        reason: 'booked',
      })
    }
    await supabase.from('site_availability').upsert(blockedDates, { onConflict: 'site_id,blocked_date' })

    setBookingRef(data.booking_ref)
    setStep(3)
  }

  if (!camp) return <div className="p-8 text-center text-gray-500">Campground not found.</div>

  const nights = calcNights()
  const total = calcTotal()
  const commission = calcCommission(total)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`/campground/${slug}`} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{camp.name}</div>
            <div className="text-xs text-gray-400">Book directly — no extra fees</div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Step 3 — Confirmation */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-green-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-500 mb-4">Your booking reference is</p>
            <div className="text-3xl font-mono font-bold text-green-700 mb-6">{bookingRef}</div>
            <p className="text-sm text-gray-500 mb-6">
              A confirmation has been sent to <strong>{guestEmail}</strong>.<br/>
              The campground owner will reach out if they need anything before your stay.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left text-sm mb-6">
              <div className="flex justify-between mb-2"><span className="text-gray-500">Campground</span><span className="font-medium">{camp.name}</span></div>
              <div className="flex justify-between mb-2"><span className="text-gray-500">Site</span><span className="font-medium">{selectedSite?.name}</span></div>
              <div className="flex justify-between mb-2"><span className="text-gray-500">Check-in</span><span className="font-medium">{checkIn}</span></div>
              <div className="flex justify-between mb-2"><span className="text-gray-500">Check-out</span><span className="font-medium">{checkOut}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Paid</span><span className="font-bold text-green-700">${total.toFixed(2)}</span></div>
            </div>
            <Link href="/" className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
              Back to CamperWatch
            </Link>
          </div>
        )}

        {step !== 3 && (
          <div className="grid md:grid-cols-[1fr_300px] gap-6">
            {/* Left — steps */}
            <div className="space-y-5">

              {/* Step 1 — Pick dates + site */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <h2 className="font-semibold text-gray-900">Choose dates</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Check-in</label>
                    <input
                      type="date"
                      min={today}
                      value={checkIn}
                      onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut('') }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Check-out</label>
                    <input
                      type="date"
                      min={checkIn || today}
                      value={checkOut}
                      onChange={e => setCheckOut(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Guests</label>
                  <select
                    value={guests}
                    onChange={e => setGuests(Number(e.target.value))}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
                  </select>
                </div>
              </div>

              {/* Site picker */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <h2 className="font-semibold text-gray-900">Choose a site</h2>
                </div>

                {sites.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-3">No sites listed yet for this campground.</p>
                    <p className="text-xs text-gray-300">The owner hasn't set up direct booking yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sites.map(site => (
                      <button
                        key={site.id}
                        onClick={() => setSelectedSite(site.id === selectedSite?.id ? null : site)}
                        className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                          selectedSite?.id === site.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{site.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {SITE_TYPE_LABELS[site.site_type] || site.site_type} · Up to {site.max_guests} guests
                              {site.max_rig_length ? ` · ${site.max_rig_length}ft max RV` : ''}
                            </div>
                            {site.description && <div className="text-xs text-gray-400 mt-1">{site.description}</div>}
                            {site.amenities?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {site.amenities.slice(0, 4).map(a => (
                                  <span key={a} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{a}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-3 shrink-0">
                            <div className="font-bold text-gray-900">${site.price_per_night}</div>
                            <div className="text-xs text-gray-400">/night</div>
                            {site.weekend_price && (
                              <div className="text-xs text-amber-600 mt-0.5">${site.weekend_price} wknd</div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2 — Guest details */}
              {step === 2 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <h2 className="font-semibold text-gray-900">Your details</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Full name *</label>
                      <input value={guestName} onChange={e => setGuestName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Jane Smith" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Email *</label>
                      <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="jane@email.com" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Phone</label>
                      <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="+1 555 000 0000" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Special requests</label>
                      <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)}
                        rows={2}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        placeholder="Early arrival, accessibility needs, pet info..." />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {/* CTA */}
              {step === 1 && (
                <button
                  disabled={!selectedSite || !checkIn || !checkOut || nights <= 0}
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue to details →
                </button>
              )}

              {step === 2 && (
                <button
                  disabled={loading || !guestName || !guestEmail}
                  onClick={submitBooking}
                  className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard size={18} /> Confirm Booking · ${total.toFixed(2)}</>
                  )}
                </button>
              )}

              {step === 2 && (
                <p className="text-center text-xs text-gray-400">
                  🔒 Secure booking · No extra fees added by CamperWatch · Payment collected at campground
                </p>
              )}
            </div>

            {/* Right — price summary */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-20">
                <h3 className="font-semibold text-gray-900 mb-4">Price summary</h3>
                {selectedSite && nights > 0 ? (
                  <>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{selectedSite.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">${selectedSite.price_per_night} × {nights} night{nights !== 1 ? 's' : ''}</span>
                        <span className="font-medium">${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-700">
                        <span>CamperWatch fee</span>
                        <span className="font-medium">$0</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-700">${total.toFixed(2)}</span>
                    </div>
                    <div className="mt-3 text-xs text-gray-400 text-center">
                      {checkIn} → {checkOut}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-400 text-center py-4">
                    Select a site and dates to see pricing
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
