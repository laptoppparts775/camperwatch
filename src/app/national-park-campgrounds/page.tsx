import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { campgrounds } from '@/lib/data'
import { ArrowRight, MapPin, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'National Park Campgrounds — Availability & Booking Guide 2026 | CamperWatch',
  description: 'Live availability for national park campgrounds across the US. Check Recreation.gov status, get notified when sites open, and find nearby private campgrounds when parks sell out.',
  alternates: { canonical: 'https://camperwatch.org/national-park-campgrounds' },
  openGraph: {
    title: 'National Park Campgrounds — Live Availability 2026 | CamperWatch',
    description: 'Check live availability for Yosemite, Zion, Grand Canyon, Yellowstone, and more. Get alerts when sold-out sites open up.',
    images: [{ url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80', width: 1200, height: 630 }],
  },
}

// Federal campgrounds only (have ridb_facility_id)
const federalCampgrounds = campgrounds.filter(c => c.ridb_facility_id)

const grouped: Record<string, typeof campgrounds> = {}
for (const c of federalCampgrounds) {
  const state = c.state || 'Other'
  if (!grouped[state]) grouped[state] = []
  grouped[state].push(c)
}
const sortedStates = Object.keys(grouped).sort()

const faqs = [
  {
    q: 'How do I check availability at national park campgrounds?',
    a: 'Most national park campgrounds in the US are reservable through Recreation.gov. CamperWatch pulls live availability data from Recreation.gov and displays it on each campground page as a color-coded calendar — green means available, red means booked. Click any campground below to see live dates.',
  },
  {
    q: 'Why are national park campgrounds always sold out?',
    a: 'High-demand national park campgrounds like Upper Pines in Yosemite or Watchman in Zion release reservations 6 months in advance and sell out within minutes. Recreation.gov\'s cancellation system means sites occasionally open back up — CamperWatch\'s free availability alert will notify you the moment a site opens for your target dates.',
  },
  {
    q: 'What should I do if a national park campground is sold out?',
    a: 'Three options: (1) Set a free availability alert on CamperWatch to get notified the moment a site opens. (2) Check for nearby private campgrounds — CamperWatch lists private options within driving distance of every national park. (3) Look for less-known campgrounds within the same park — Cosby in the Smokies or Apgar in Glacier are often available when the main campgrounds are full.',
  },
  {
    q: 'Do national park campgrounds require reservations?',
    a: 'Most popular national park campgrounds require reservations made through Recreation.gov. A small number remain first-come, first-served. CamperWatch\'s campground pages note the reservation policy for each site and link directly to the Recreation.gov booking page with your dates pre-filled.',
  },
  {
    q: 'How far in advance do national park campgrounds open for reservations?',
    a: 'Recreation.gov releases most national park campground reservations either 6 months in advance (rolling daily) or on a specific date each year. Yosemite, Zion, Grand Canyon, and Glacier typically release 6 months out rolling — meaning January 15 reservations open on July 15, exactly at 7am Pacific. Setting a phone alarm and booking the moment they open is the most reliable strategy.',
  },
]

export default function NationalParkCampgrounds() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <NavBar />

      <section className="bg-[#0b1510] pt-24 pb-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700/60
                          rounded-full px-4 py-1.5 text-green-300 text-xs font-semibold
                          tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live availability data
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
            National park campgrounds<br />
            <span className="text-green-400">with live availability</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Real-time Recreation.gov availability for {federalCampgrounds.length} national park campgrounds
            across the US. Get notified when sold-out sites open. Find private alternatives when parks are full.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/alerts"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400
                         text-white font-bold px-8 py-4 rounded-2xl transition-all text-sm shadow-lg shadow-green-900/40">
              Get availability alerts — free <ArrowRight size={16} />
            </Link>
            <Link href="/search"
              className="inline-flex items-center justify-center gap-2 border border-green-800
                         hover:border-green-600 text-green-300 font-semibold px-8 py-4 rounded-2xl text-sm transition-all">
              Search all campgrounds
            </Link>
          </div>
        </div>
      </section>

      {/* Campground grid by state */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3">
              {federalCampgrounds.length} campgrounds
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              Browse by state
            </h2>
          </div>

          <div className="space-y-12">
            {sortedStates.map(state => (
              <div key={state}>
                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" /> {state}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grouped[state].map(c => (
                    <Link key={c.slug} href={`/campground/${c.slug}`}
                      className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-green-200
                                 hover:shadow-md transition-all flex flex-col gap-3">
                      <div>
                        <div className="font-bold text-gray-900 text-sm group-hover:text-green-700 transition-colors leading-tight mb-1">
                          {c.name}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin size={10} /> {c.location}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="font-semibold">{c.rating}</span>
                          <span className="text-gray-300">·</span>
                          <span>{c.review_count?.toLocaleString()} reviews</span>
                        </div>
                        <div className="text-xs font-semibold text-green-700">
                          ${c.price_per_night}/night
                        </div>
                      </div>
                      <div className="text-[10px] text-green-600 font-semibold bg-green-50 border border-green-100
                                      rounded-lg px-2 py-1 inline-block self-start">
                        Live availability →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-14">
            National park campground booking — your questions answered
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
            Get notified when sold-out parks open up
          </h2>
          <p className="text-gray-400 mb-10">
            Free availability alerts. Set your park, dates, and site type. We scan every 10 minutes.
          </p>
          <Link href="/alerts"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white
                       font-bold px-10 py-4 rounded-2xl transition-colors text-base shadow-lg shadow-green-900/40">
            Set a free alert <ArrowRight size={18} />
          </Link>
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
