'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { campgrounds } from '@/lib/data'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import {
  ArrowLeft, Calendar, Users, CreditCard, CheckCircle,
  AlertCircle, MapPin, Star, ExternalLink, Tent, Zap,
  Clock, Shield, ChevronRight, Info, Phone
} from 'lucide-react'

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

const TYPE_ICONS: Record<string, string> = {
  tent: '⛺', rv_hookup: '🚐', cabin: '🏠', glamping: '✨'
}

const TYPE_LABELS: Record<string, string> = {
  tent: 'Tent Site', rv_hookup: 'RV Hookup', cabin: 'Cabin', glamping: 'Glamping'
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
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  const today = new Date().toISOString().split('T')[0]
  // Default check-in to tomorrow, check-out to 4 days from now (3 nights)
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
  const threeDays = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0]

  useEffect(() => {
    const sb = getSupabase()
    sb.auth.getSession().then(({ data }: any) => {
      const u = data.session?.user
      setUser(u)
      if (u?.email) setGuestEmail(u.email)
      if (u?.user_metadata?.full_name) setGuestName(u.user_metadata.full_name)
    })
    sb.from('campground_sites').select('*')
      .eq('campground_slug', slug).eq('active', true).eq('bookings_enabled', true)
      .order('price_per_night')
      .then(({ data }) => { setSites(data || []); setLoading(false) })
    setCheckIn(tomorrow)
    setCheckOut(threeDays)
  }, [slug])

  function calcNights() {
    if (!checkIn || !checkOut) return 0
    return Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
  }

  function calcTotal() {
    if (!selectedSite || !checkIn || !checkOut) return 0
    const nights = calcNights()
    let total = 0
    for (let i = 0; i < nights; i++) {
      const d = new Date(checkIn)
      d.setDate(d.getDate() + i)
      const day = d.getDay()
      const isWknd = day === 5 || day === 6
      total += (isWknd && selectedSite.weekend_price) ? selectedSite.weekend_price : selectedSite.price_per_night
    }
    return total
  }

  async function submitBooking() {
    if (!selectedSite || !checkIn || !checkOut || !guestName || !guestEmail) {
      setError('Please fill in all required fields.')
      return
    }
    const nights = calcNights()
    if (nights <= 0) { setError('Check-out must be after check-in.'); return }
    if (!user) { router.push(`/auth/login?redirect=/book/${slug}`); return }

    setSubmitting(true)
    setError('')
    const total = calcTotal()
    const commission = Math.round(total * 0.10 * 100) / 100
    const sb = getSupabase()

    const { data, error: err } = await sb.from('bookings').insert({
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
      status: 'confirmed',
      special_requests: specialRequests,
    }).select('booking_ref').single()

    setSubmitting(false)

    if (err) { setError('Booking failed. Please try again.'); return }

    // Block those dates
    const blocked: { site_id: string; blocked_date: string; reason: string }[] = []
    for (let i = 0; i < nights; i++) {
      const d = new Date(checkIn)
      d.setDate(d.getDate() + i)
      blocked.push({ site_id: selectedSite.id, blocked_date: d.toISOString().split('T')[0], reason: 'booked' })
    }
    await sb.from('site_availability').upsert(blocked, { onConflict: 'site_id,blocked_date' })

    setBookingRef(data.booking_ref)
    setStep(3)
  }

  if (!camp) return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🏕</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Campground not found</h1>
        <Link href="/search" className="text-green-600 hover:underline">Browse all campgrounds</Link>
      </div>
    </div>
  )

  const nights = calcNights()
  const total = calcTotal()
  const hasSites = sites.length > 0

  // CONFIRMATION
  if (step === 3) return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl border border-green-200 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h1>
          <p className="text-gray-500 text-sm mb-4">Booking confirmed at {camp.name}</p>
          <div className="text-3xl font-mono font-bold text-green-700 mb-6">{bookingRef}</div>
          <div className="bg-gray-50 rounded-2xl p-4 text-left text-sm space-y-2 mb-6">
            <div className="flex justify-between"><span className="text-gray-500">Campground</span><span className="font-medium">{camp.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Site</span><span className="font-medium">{selectedSite?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Dates</span><span className="font-medium">{checkIn} → {checkOut}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Guests</span><span className="font-medium">{guests}</span></div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="font-semibold">Total paid</span>
              <span className="font-bold text-green-700 text-lg">${total.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-6">Confirmation sent to <strong>{guestEmail}</strong>. The campground owner will be in touch before your stay.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/profile?tab=bookings" className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 text-center">View my bookings</Link>
            <Link href={`/campground/${slug}`} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 text-center">Back to campground</Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Campground context bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`/campground/${slug}`} className="text-gray-400 hover:text-green-600 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
            <img src={camp.images?.[0]?.url} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-sm truncate">{camp.name}</div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <MapPin size={11} />{camp.location}
              <span>·</span>
              <Star size={11} className="text-amber-400 fill-amber-400" />{camp.rating}
              <span>·</span>
              <span className="text-green-600 font-medium">No extra fees</span>
            </div>
          </div>
          {camp.phone && (
            <a href={`tel:${camp.phone}`} className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 transition-colors">
              <Phone size={13} />{camp.phone}
            </a>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">

          {/* LEFT — booking flow */}
          <div className="space-y-4">

            {/* Step 1 — Dates */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <h2 className="font-bold text-gray-900">Choose your dates</h2>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">CHECK-IN</label>
                  <input type="date" min={today} value={checkIn}
                    onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut('') }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">CHECK-OUT</label>
                  <input type="date" min={checkIn || today} value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">GUESTS</label>
                <select value={guests} onChange={e => setGuests(Number(e.target.value))}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
                </select>
              </div>
              {nights > 0 && (
                <div className="mt-3 flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 text-sm text-green-700">
                  <Clock size={14} /> <strong>{nights} night{nights !== 1 ? 's' : ''}</strong>
                  <span className="text-green-500">·</span>
                  {camp.check_in} check-in · {camp.check_out} check-out
                  <span className="text-xs text-green-500 ml-auto">Adjust dates above for longer stays</span>
                </div>
              )}
            </div>

            {/* Step 2 — Site picker */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${hasSites ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <h2 className="font-bold text-gray-900">Choose your site</h2>
              </div>

              {loading && <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>}

              {!loading && !hasSites && (
                <div className="space-y-4">
                  {/* Intelligent fallback — not just "no sites" */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-amber-800 text-sm mb-1">Direct booking not set up yet</div>
                        <p className="text-amber-700 text-sm">This campground hasn't configured direct booking through CamperWatch yet. Here's how you can still book:</p>
                      </div>
                    </div>
                  </div>

                  {/* Smart alternatives based on camp data */}
                  <div className="space-y-3">
                    {camp.booking_url && (
                      <a href={camp.booking_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white border-2 border-green-200 rounded-xl hover:border-green-400 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <ExternalLink size={18} className="text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">Book on official site</div>
                            <div className="text-xs text-gray-500">Go directly to {camp.booking_url.includes('recreation.gov') ? 'Recreation.gov' : 'campground website'}</div>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                      </a>
                    )}

                    {camp.phone && (
                      <a href={`tel:${camp.phone}`}
                        className="flex items-center justify-between p-4 bg-white border-2 border-blue-100 rounded-xl hover:border-blue-300 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Phone size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">Call to book</div>
                            <div className="text-xs text-gray-500">{camp.phone} — most campground owners prefer a quick call</div>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </a>
                    )}

                    <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                        <Zap size={18} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-purple-900 text-sm mb-1">Want direct booking here?</div>
                        <p className="text-purple-700 text-xs">We're working with this campground to enable one-tap booking. <Link href="/community" className="underline">Ask in our community</Link> or check back soon.</p>
                      </div>
                    </div>
                  </div>

                  {/* Show similar campgrounds with direct booking */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Similar campgrounds with direct booking available</div>
                    <div className="space-y-2">
                      {campgrounds
                        .filter(c => c.slug !== slug && c.state === camp.state && c.rating >= 3.5)
                        .slice(0, 3)
                        .map(c => (
                          <Link key={c.slug} href={`/book/${c.slug}`}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <img src={c.images?.[0]?.url} className="w-12 h-12 rounded-xl object-cover shrink-0" alt="" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 text-sm truncate">{c.name}</div>
                              <div className="text-xs text-gray-400 flex items-center gap-1">
                                <Star size={10} className="text-amber-400 fill-amber-400" />{c.rating}
                                <span>·</span>${c.price_per_night}/night
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-gray-400 shrink-0" />
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {!loading && hasSites && (
                <div className="space-y-3">
                  {sites.map(site => (
                    <button key={site.id} onClick={() => setSelectedSite(site.id === selectedSite?.id ? null : site)}
                      className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${selectedSite?.id === site.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{TYPE_ICONS[site.site_type] || '🏕'}</span>
                            <span className="font-bold text-gray-900">{site.name}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{TYPE_LABELS[site.site_type] || site.site_type}</span>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            Up to {site.max_guests} guests
                            {site.max_rig_length ? ` · ${site.max_rig_length}ft max` : ''}
                          </div>
                          {site.description && <p className="text-sm text-gray-600 mb-2">{site.description}</p>}
                          {site.amenities?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {site.amenities.slice(0, 5).map((a: string) => (
                                <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xl font-bold text-gray-900">${site.price_per_night}</div>
                          <div className="text-xs text-gray-400">per night</div>
                          {site.weekend_price && (
                            <div className="text-xs text-amber-600 mt-0.5">${site.weekend_price} Fri–Sat</div>
                          )}
                          {selectedSite?.id === site.id && nights > 0 && (
                            <div className="text-sm font-bold text-green-700 mt-1">${calcTotal()} total</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2.5 — Guest details (only show if site selected) */}
            {step === 2 && selectedSite && hasSites && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <h2 className="font-bold text-gray-900">Your details</h2>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">FULL NAME *</label>
                      <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Jane Smith"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">PHONE</label>
                      <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+1 555 000 0000"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">EMAIL *</label>
                    <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="you@email.com"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">SPECIAL REQUESTS</label>
                    <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} rows={2}
                      placeholder="Accessibility needs, early arrival, pet info, anything the owner should know..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                <AlertCircle size={16} />{error}
              </div>
            )}

            {/* CTAs */}
            {hasSites && step === 1 && (
              <button disabled={!selectedSite || !checkIn || !checkOut || nights <= 0}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors disabled:opacity-40 text-sm">
                Continue to your details →
              </button>
            )}

            {hasSites && step === 2 && (
              <button disabled={submitting || !guestName || !guestEmail}
                onClick={submitBooking}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 text-sm">
                {submitting
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                  : <><Shield size={16} /> Confirm booking · ${total.toFixed(2)}</>
                }
              </button>
            )}

            {hasSites && (
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Shield size={12} /> Secure booking</span>
                <span className="flex items-center gap-1"><CheckCircle size={12} /> No hidden fees</span>
                <span className="flex items-center gap-1"><Zap size={12} /> Instant confirmation</span>
              </div>
            )}
          </div>

          {/* RIGHT — price summary + campground info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Price summary</h3>

              {selectedSite && nights > 0 ? (
                <>
                  <div className="space-y-2.5 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{selectedSite.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">${selectedSite.price_per_night}/night × {nights} night{nights !== 1 ? 's' : ''}</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span className="flex items-center gap-1"><CheckCircle size={12} /> CamperWatch fee</span>
                      <span className="font-semibold">$0</span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Service fee</span>
                      <span className="font-semibold">$0</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-green-700">${total.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-400 text-center mt-2">{checkIn} → {checkOut}</div>
                </>
              ) : (
                <div className="text-sm text-gray-400 text-center py-4 space-y-1">
                  <div>Select a site and dates</div>
                  <div>to see your total</div>
                </div>
              )}

              {/* Camp quick info */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} className="text-gray-400" />
                  Check-in {camp.check_in} · Check-out {camp.check_out}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Tent size={12} className="text-gray-400" />
                  {camp.total_sites}
                </div>
                {camp.elevation && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={12} className="text-gray-400" />
                    {camp.elevation}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <Shield size={12} />
                  {camp.cancellation_policy?.split('–')[0] || 'See cancellation policy'}
                </div>
              </div>
            </div>

            {/* Camp image card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <img src={camp.images?.[0]?.url} className="w-full h-40 object-cover" alt={camp.name} />
              <div className="p-4">
                <div className="font-semibold text-gray-900 text-sm">{camp.name}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <Star size={11} className="text-amber-400 fill-amber-400" />{camp.rating}
                  <span className="text-gray-300">·</span>
                  {camp.review_count} reviews
                  <span className="text-gray-300">·</span>
                  {camp.location}
                </div>
                <Link href={`/campground/${slug}`} className="mt-2 block text-xs text-green-600 hover:underline">
                  View full details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
