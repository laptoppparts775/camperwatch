import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Campground Booking Software Comparison 2026 | CamperWatch',
  description: 'Compare campground booking software: Campspot, RoverPass, Firefly, ResNexus, and CamperWatch. Pricing, features, and honest pros and cons for independent campground owners.',
  alternates: { canonical: 'https://camperwatch.org/campground-booking-software' },
  openGraph: {
    title: 'Best Campground Booking Software 2026 — Honest Comparison',
    description: 'Campspot vs RoverPass vs Firefly vs CamperWatch — which is right for your campground? Side-by-side pricing and features.',
    images: [{ url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const platforms = [
  {
    name: 'CamperWatch',
    tagline: 'Best for: independent owners who want no monthly overhead',
    monthly: '$0/mo',
    commission: '5% on bookings we send',
    setup: 'Free',
    guestData: true,
    icalSync: true,
    siteMap: false,
    discovery: 'National park overflow traffic — campers looking for alternatives to sold-out parks',
    contract: 'None — cancel any time',
    highlight: true,
  },
  {
    name: 'Campspot',
    tagline: 'Best for: established RV parks with high booking volume',
    monthly: '$99–$299/mo',
    commission: 'Monthly fee + transaction fees',
    setup: 'Paid setup may apply',
    guestData: true,
    icalSync: true,
    siteMap: true,
    discovery: 'Campspot marketplace + your own website',
    contract: 'Annual plans available',
    highlight: false,
  },
  {
    name: 'RoverPass',
    tagline: 'Best for: campgrounds wanting OTA sync + marketplace',
    monthly: '$49–$149/mo',
    commission: 'Monthly fee + booking fees',
    setup: 'Free trial available',
    guestData: true,
    icalSync: true,
    siteMap: true,
    discovery: 'RoverPass marketplace + Airbnb/Hipcamp sync',
    contract: 'Monthly or annual',
    highlight: false,
  },
  {
    name: 'Firefly Reservations',
    tagline: 'Best for: campgrounds wanting Airbnb and Hipcamp integration',
    monthly: 'Transaction-based pricing',
    commission: 'Per-booking transaction fees',
    setup: 'No upfront fee',
    guestData: true,
    icalSync: true,
    siteMap: true,
    discovery: 'Airbnb, Hipcamp, ReserveAmerica integration',
    contract: 'Cancel any time',
    highlight: false,
  },
  {
    name: 'ResNexus',
    tagline: 'Best for: larger campgrounds wanting a full PMS',
    monthly: '$99–$199/mo',
    commission: 'Monthly fee + per-booking fees',
    setup: 'Onboarding fee',
    guestData: true,
    icalSync: true,
    siteMap: true,
    discovery: 'OTA integrations + direct booking engine',
    contract: 'Annual contract',
    highlight: false,
  },
]

const faqs = [
  {
    q: 'What is campground booking software?',
    a: 'Campground booking software lets campground owners accept online reservations, manage site availability, and process payments without phone calls or paper records. Most platforms include a booking portal campers use to select dates and sites, an owner dashboard to view upcoming reservations, and payment processing to collect and distribute booking fees.',
  },
  {
    q: 'What is the best free campground booking software?',
    a: 'CamperWatch offers free campground listing with no monthly fee. Owners pay 5% only on bookings CamperWatch sends — if you get no bookings in a month, you pay nothing. For a full property management system with no upfront cost, Firefly Reservations uses transaction-based pricing with no monthly minimum.',
  },
  {
    q: 'How much does campground booking software cost?',
    a: 'Campground booking software typically costs $49–$299 per month for a full property management system, plus per-booking transaction fees. CamperWatch is an exception: no monthly fee, 5% commission only on bookings it sends. For campgrounds with high booking volume, a monthly-fee platform can be cheaper overall; for smaller operations, a commission-only model saves money during slow seasons.',
  },
  {
    q: 'Do I need campground booking software or a listing platform?',
    a: 'Booking software (Campspot, ResNexus, CampLife) manages your entire operation — reservations, site maps, payments, check-in. A listing platform (CamperWatch, Hipcamp) drives camper traffic and bookings to your campground. They are not mutually exclusive: many owners use a listing platform for discovery traffic and a PMS for backend management, with iCal sync keeping both in sync.',
  },
  {
    q: 'Can I switch from Campspot to CamperWatch?',
    a: 'You can add CamperWatch without removing Campspot. CamperWatch imports your iCal feed from Campspot to prevent double bookings. Over time, if CamperWatch sends bookings at lower total cost, you can evaluate whether to reduce or eliminate your Campspot subscription.',
  },
]

export default function CampgroundBookingSoftware() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <NavBar />

      <section className="bg-[#0b1510] pt-24 pb-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700/60
                          rounded-full px-4 py-1.5 text-green-300 text-xs font-semibold
                          tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            2026 software comparison
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
            Campground booking software:<br />
            <span className="text-green-400">an honest comparison</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Campspot, RoverPass, Firefly, ResNexus, and CamperWatch — compared on pricing,
            features, and what type of campground each actually suits.
          </p>
        </div>
      </section>

      {/* Platform cards */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-5xl mx-auto px-5 space-y-6">
          {platforms.map(p => (
            <div key={p.name}
              className={`rounded-3xl border p-8 ${p.highlight
                ? 'bg-white border-green-300 shadow-md ring-1 ring-green-200'
                : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-gray-900">{p.name}</h2>
                    {p.highlight && (
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                        This site
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{p.tagline}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xl font-bold ${p.highlight ? 'text-green-600' : 'text-gray-800'}`}>{p.monthly}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{p.commission}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-5">
                {[
                  { label: 'Setup cost', val: p.setup },
                  { label: 'iCal sync', val: p.icalSync ? 'Yes' : 'No', good: p.icalSync },
                  { label: 'Site map', val: p.siteMap ? 'Yes' : 'No', good: p.siteMap },
                  { label: 'Contract', val: p.contract },
                ].map(({ label, val, good }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="text-gray-400 mb-1">{label}</div>
                    <div className={`font-semibold ${good === true ? 'text-green-700' : good === false ? 'text-red-500' : 'text-gray-800'}`}>{val}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 border border-gray-100">
                <span className="font-semibold text-gray-800">Discovery: </span>{p.discovery}
              </div>

              {p.highlight && (
                <div className="mt-5">
                  <Link href="/owner/onboard"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white
                               font-bold px-6 py-3 rounded-xl transition-all text-sm">
                    List your campground free <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-14">
            Campground booking software — common questions
          </h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 p-7">
                <h3 className="font-bold text-gray-900 mb-3">{q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b1510] py-24 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-5">
            No monthly fee. 5% only when we send you a booking.
          </h2>
          <Link href="/owner/onboard"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white
                       font-bold px-10 py-4 rounded-2xl transition-colors text-base shadow-lg shadow-green-900/40">
            List your campground free <ArrowRight size={18} />
          </Link>
          <div className="flex flex-wrap justify-center gap-5 mt-8">
            {['No setup fee', 'No monthly fee', '5% only on bookings we send', 'Cancel any time'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle size={11} className="text-green-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question', name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      })}} />
    </div>
  )
}
