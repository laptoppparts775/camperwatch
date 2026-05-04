'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { campgrounds } from '@/lib/data'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import AvailabilityCalendar from '@/components/AvailabilityCalendar'
import OutdoorsyRvCard from '@/components/affiliate/OutdoorsyRvCard'
import {
  ArrowLeft, CheckCircle, AlertCircle, MapPin, Star, ExternalLink,
  Tent, Zap, Clock, Shield, Info, Phone
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

type BookingMode =
  | 'direct'
  | 'recreation_gov'
  | 'koa'
  | 'campspot'
  | 'reserve_california'
  | 'reserve_america'
  | 'external'
  | 'phone_only'

const TYPE_ICONS: Record<string, string> = {
  tent: '⛺', rv_hookup: '🚐', cabin: '🏠', glamping: '✨'
}

const TYPE_LABELS: Record<string, string> = {
  tent: 'Tent Site', rv_hookup: 'RV Hookup', cabin: 'Cabin', glamping: 'Glamping'
}

/**
 * Decide how this campground gets booked.
 *  - direct: real CamperWatch booking flow (private, owner has live sites in DB)
 *  - recreation_gov / koa / campspot / reserve_*: hand off to that platform
 *  - external: hand off to the campground's own site
 *  - phone_only: only a phone number, no booking_url
 */
function detectBookingMode(camp: any, hasDirectSites: boolean): BookingMode {
  if (hasDirectSites) return 'direct'
  const url = (camp.booking_url || '').toLowerCase()
  if (camp.ridb_facility_id || url.includes('recreation.gov')) return 'recreation_gov'
  if (url.includes('koa.com')) return 'koa'
  if (url.includes('campspot.com')) return 'campspot'
  if (url.includes('reservecalifornia')) return 'reserve_california'
  if (url.includes('reserveamerica')) return 'reserve_america'
  if (url) return 'external'
  return 'phone_only'
}

function platformLabel(mode: BookingMode): string {
  switch (mode) {
    case 'recreation_gov': return 'Recreation.gov'
    case 'koa': return 'KOA.com'
    case 'campspot': return 'Campspot'
    case 'reserve_california': return 'ReserveCalifornia'
    case 'reserve_america': return 'ReserveAmerica'
    default: return 'official site'
  }
}

/** Heuristic: does this campground welcome RVs? */
function isRvFriendly(camp: any): boolean {
  const types = (camp.site_types || []).join(' ').toLowerCase()
  const hookups = (camp.hookups || '').toLowerCase()
  if (types.includes('rv')) return true
  if (hookups && !hookups.includes('none') && !hookups.includes('no hookup')) return true
  return false
}

export default function BookPage() {
  const { slug } = useParams() as { slug: string }
  const router = useRouter()
  const camp = campgrounds.find(c => c.slug === slug)

  const [sites, setSites] = useState<Site[]>([])
  const [loadingSites, setLoadingSites] = useState(true)

  // Direct booking state
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitting, setSubmitting] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  const today = new Date().toISOString().split('T')[0]
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
      .then(({ data }) => { setSites(data || []); setLoadingSites(false) })
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

    const blocked: { site_id: string; blocked_date: string; reason: string }[] = []
    for (let i = 0; i < nights; i++) {
      const d = new Date(checkIn)
      d.setDate(d.getDate() + i)
      blocked.push({ site_id: selectedSite.id, blocked_date: d.toISOString().split('T')[0], reason: 'booked' })
    }
    await sb.from('site_availability').upsert(blocked, { onConflict: 'site_id,blocked_date' })

    // Fire confirmation emails (best-effort — failure never blocks booking)
    fetch('/api/bookings/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingRef: data.booking_ref }),
    }).catch(() => {}) // silent — email failure must never break UX

    setBookingRef(data.booking_ref)
    setStep(3)
  }

  // 404
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

  // Wait for sites query
  if (loadingSites) return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )

  const mode = detectBookingMode(camp, sites.length > 0)

  // Confirmation (only via direct mode)
  if (step === 3) {
    const nights = calcNights()
    const total = calcTotal()
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-lg mx-auto px-4 py-10">
          <div className="bg-white rounded-3xl border border-green-200 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re all set!</h1>
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
  }

  // Shared context bar
  const ContextBar = () => (
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
          </div>
        </div>
        {camp.phone && (
          <a href={`tel:${camp.phone}`} className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 transition-colors">
            <Phone size={13} />{camp.phone}
          </a>
        )}
      </div>
    </div>
  )

  // Federal handoff with live availability
  if (mode === 'recreation_gov') {
    const facilityId = camp.ridb_facility_id || (camp.booking_url || '').match(/campgrounds\/(\d+)/)?.[1] || ''
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <ContextBar />
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-blue-900 mb-1">Federal campground — booked through Recreation.gov</div>
                <p className="text-sm text-blue-800">
                  This is a federal site, so the actual reservation has to happen on Recreation.gov.
                  We&apos;re showing live availability here so you don&apos;t waste time hunting for an open date.
                  When you find one, click through and we&apos;ll take you straight there.
                </p>
              </div>
            </div>
          </div>

          {facilityId ? (
            <AvailabilityCalendar
              facilityId={facilityId}
              bookingUrl={camp.booking_url || ''}
              campgroundName={camp.name}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-sm text-gray-500">
              Live availability data isn&apos;t configured for this campground.
            </div>
          )}

          {camp.booking_url && (
            <a
              href={camp.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors text-sm"
            >
              <ExternalLink size={16} />
              Continue on Recreation.gov
            </a>
          )}

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="font-semibold text-gray-900 text-sm mb-3">What happens next on Recreation.gov</div>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
              <li>You&apos;ll land on the {camp.name} page on Recreation.gov</li>
              <li>Pick your dates on their calendar (we just showed you what&apos;s open)</li>
              <li>Choose a specific site number — green sites on their map are available</li>
              <li>Sign in to your Recreation.gov account (or create one) and pay there</li>
            </ol>
            <div className="mt-3 text-xs text-gray-400 flex items-start gap-2">
              <Shield size={12} className="shrink-0 mt-0.5" />
              <span>CamperWatch never charges you a fee. Federal reservation fees go directly to the U.S. Treasury.</span>
            </div>
          </div>

          {camp.pro_tips && camp.pro_tips.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="font-semibold text-amber-900 text-sm mb-3">Insider tips from real campers</div>
              <ul className="space-y-2 text-sm text-amber-800">
                {camp.pro_tips.slice(0, 4).map((t: string, i: number) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}

          <OutdoorsyRvCard
            subId={`book-fed-${slug}`}
            variant={isRvFriendly(camp) ? 'rv_friendly' : 'general'}
            campgroundName={camp.name}
          />
        </div>
      </div>
    )
  }

  // KOA / Campspot / Reserve* / external
  if (mode === 'koa' || mode === 'campspot' || mode === 'reserve_california' || mode === 'reserve_america' || mode === 'external') {
    const platform = platformLabel(mode)
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <ContextBar />
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-blue-900 mb-1">Booked through {platform}</div>
                <p className="text-sm text-blue-800">
                  This campground takes reservations on {platform}. Click through to check live availability and book directly.
                  CamperWatch doesn&apos;t sit between you and the campground — you book at the same price you would on {platform} alone.
                </p>
              </div>
            </div>
          </div>

          {camp.booking_url && (
            <a
              href={camp.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors text-sm"
            >
              <ExternalLink size={16} />
              Continue on {platform}
            </a>
          )}

          {camp.phone && (
            <a
              href={`tel:${camp.phone}`}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-blue-200 text-blue-700 font-semibold rounded-2xl hover:bg-blue-50 transition-colors text-sm"
            >
              <Phone size={16} />
              Or call {camp.phone}
            </a>
          )}

          {camp.pro_tips && camp.pro_tips.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="font-semibold text-amber-900 text-sm mb-3">Insider tips from real campers</div>
              <ul className="space-y-2 text-sm text-amber-800">
                {camp.pro_tips.slice(0, 4).map((t: string, i: number) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}

          {isRvFriendly(camp) && (
            <OutdoorsyRvCard
              subId={`book-ext-${slug}`}
              variant="rv_friendly"
              campgroundName={camp.name}
            />
          )}

          <div className="text-center">
            <Link href={`/campground/${slug}`} className="text-sm text-green-600 hover:underline">
              ← Back to {camp.name}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Phone only
  if (mode === 'phone_only') {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <ContextBar />
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900 mb-1">Phone reservations only</div>
                <p className="text-sm text-amber-800">
                  This campground takes bookings by phone, not online. Give them a call — most owners answer themselves.
                </p>
              </div>
            </div>
          </div>
          {camp.phone ? (
            <a
              href={`tel:${camp.phone}`}
              className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors text-base"
            >
              <Phone size={18} />
              Call {camp.phone}
            </a>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 text-sm text-gray-500 text-center">
              No phone number on file. <Link href={`/campground/${slug}`} className="text-green-600 underline">View campground details</Link>.
            </div>
          )}
          <div className="text-center">
            <Link href={`/campground/${slug}`} className="text-sm text-green-600 hover:underline">
              ← Back to {camp.name}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Direct booking flow (private campgrounds with bookable sites in DB)
  const nights = calcNights()
  const total = calcTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <ContextBar />

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-4">
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
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <h2 className="font-bold text-gray-900">Choose your site</h2>
              </div>
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
            </div>

            {step === 2 && selectedSite && (
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

            {step === 1 && (
              <button disabled={!selectedSite || !checkIn || !checkOut || nights <= 0}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors disabled:opacity-40 text-sm">
                Continue to your details →
              </button>
            )}

            {step === 2 && (
              <button disabled={submitting || !guestName || !guestEmail}
                onClick={submitBooking}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 text-sm">
                {submitting
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                  : <><Shield size={16} /> Confirm booking · ${total.toFixed(2)}</>
                }
              </button>
            )}

            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Shield size={12} /> Secure booking</span>
              <span className="flex items-center gap-1"><CheckCircle size={12} /> No hidden fees</span>
              <span className="flex items-center gap-1"><Zap size={12} /> Instant confirmation</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Price summary</h3>
              {selectedSite && nights > 0 ? (
                <>
                  <div className="space-y-2.5 text-sm mb-4">
                    <div className="flex justify-between"><span className="text-gray-600">{selectedSite.name}</span></div>
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
          </div>
        </div>
      </div>
    </div>
  )
}
