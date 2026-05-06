import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { ArrowRight, MapPin, Phone, Mail, Star, Wifi, Zap, Droplets, Trees, Fish, Waves } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pyramid Lake Paiute Tribe — RV Parks & Campgrounds | CamperWatch',
  description: 'Three unique parks operated by the Pyramid Lake Paiute Tribe — lakefront full hookups at Pyramid Lake, shaded riverside sites at Big Bend, and easy I-80 access at Wadsworth. Book directly, no middleman.',
  alternates: { canonical: 'https://camperwatch.org/pyramid-lake-paiute-tribe' },
  openGraph: {
    title: 'Pyramid Lake Paiute Tribe Parks | CamperWatch',
    description: 'Book directly with the tribe. Three parks, one host, no commission platforms.',
    images: [{ url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const PARKS = [
  {
    slug: 'pyramid-lake-marina',
    name: 'Pyramid Lake Marina & RV Park',
    location: 'Sutcliffe, NV · 35 mi from Reno',
    tagline: 'Full hookups on the shores of Nevada\'s most spectacular lake',
    description: '25 full-hookup RV sites steps from the water. Pull-throughs to 50 ft. On-site marina store, boat launch, beach access, and world-class Lahontan cutthroat trout fishing. The most dramatic desert lake scenery in the American West.',
    price: 45,
    priceHigh: 65,
    rating: 4.2,
    reviews: 305,
    badge: 'Lakefront',
    badgeColor: 'bg-blue-100 text-blue-800',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80',
    imageAlt: 'Pyramid Lake Nevada turquoise water desert tufa formations',
    highlights: ['30 & 50 amp hookups', 'Pull-thru to 50 ft', 'Marina store on-site', 'Lahontan trout fishing', 'Beach access', 'Pet friendly'],
    phone: '(775) 444-5463',
    icons: [Zap, Droplets, Fish, Waves],
  },
  {
    slug: 'big-bend-rv-park',
    name: 'Big Bend RV Park',
    location: 'Wadsworth, NV · 30 mi from Reno',
    tagline: 'Shaded paved sites on the Truckee River',
    description: 'Paved full-hookup sites surrounded by grass and mature shade trees alongside the Truckee River. Walking trails, picnic areas, and real greenery — rare in the Nevada desert. Horse boarding available. Off I-80 Wadsworth exit.',
    price: 45,
    priceHigh: 55,
    rating: 4.3,
    reviews: 48,
    badge: 'Riverside',
    badgeColor: 'bg-green-100 text-green-800',
    image: 'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800&q=80',
    imageAlt: 'Paved RV sites with shade trees Truckee River Nevada Big Bend',
    highlights: ['30 & 50 amp hookups', 'Paved level sites', 'Truckee River trail', 'Shade trees & grass', 'Horse boarding', 'I-80 easy access'],
    phone: '(775) 575-2185',
    icons: [Zap, Droplets, Trees, Waves],
  },
  {
    slug: 'i80-smokeshop-campground',
    name: 'I-80 Smokeshop Campground',
    location: 'Wadsworth, NV · 30 mi from Reno',
    tagline: 'Pyramid Lake permits, fireworks, and easy highway access',
    description: '4.7-star tribal store selling Pyramid Lake fishing and camping permits, fireworks, propane, groceries, and authentic Paiute crafts. The essential stop before heading to Pyramid Lake or Burning Man. Campground on-site for overnight stays.',
    price: 30,
    priceHigh: 40,
    rating: 4.7,
    reviews: 480,
    badge: '4.7★ Store',
    badgeColor: 'bg-amber-100 text-amber-800',
    image: 'https://images.unsplash.com/photo-1559521783-1d1599583485?w=800&q=80',
    imageAlt: 'Nevada desert night sky I-80 campground Wadsworth Paiute tribal store',
    highlights: ['Pyramid Lake permits', 'Fireworks (tribal land)', 'Propane refill & exchange', 'Gasoline on-site', 'Paiute crafts & jewelry', 'Open 7 days 6am–9pm'],
    phone: '(775) 575-2181',
    icons: [Zap, Fish, Wifi, MapPin],
  },
]

const DISTANCES = [
  { from: 'Pyramid Lake Marina', to: 'Big Bend RV Park', dist: '30 mi', drive: '35 min' },
  { from: 'Big Bend RV Park', to: 'I-80 Smokeshop', dist: '2 mi', drive: '4 min' },
  { from: 'Pyramid Lake Marina', to: 'Reno', dist: '35 mi', drive: '40 min' },
]

export default function PLPTPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <NavBar />

      {/* ── HERO ── */}
      <section className="relative bg-[#0b1a10] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1600&q=80"
            alt="Pyramid Lake Nevada ancient tufa formations desert lake"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(11,26,16,0.5) 0%, rgba(11,26,16,0.95) 100%)' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20 text-center">
          {/* Tribal seal placeholder */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-white/80 text-xs font-medium tracking-wide uppercase">Pyramid Lake Paiute Tribe</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Three Parks.<br className="sm:hidden" /> One Tribe. No Middleman.
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            The Pyramid Lake Paiute Tribe operates three distinct parks across Northern Nevada — from lakefront full hookups on an ancient desert lake to shaded riverside sites and an essential I-80 supply stop. Book directly with the tribe.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-white/80 text-sm">
              📍 Northern Nevada
            </div>
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-white/80 text-sm">
              🏕️ 3 unique parks
            </div>
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-white/80 text-sm">
              ⚡ Full hookups available
            </div>
            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-white/80 text-sm">
              🎣 Pyramid Lake fishing permits
            </div>
          </div>

          <Link
            href="/campground/pyramid-lake-marina"
            className="inline-flex items-center gap-2 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
          >
            View all parks <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── PARK CARDS ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Parks</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Each park has a distinct character. Find the right one for your trip — or combine them into a multi-stop Northern Nevada adventure.</p>
        </div>

        <div className="space-y-8">
          {PARKS.map((park, i) => (
            <div key={park.slug} className="group rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="flex flex-col lg:flex-row">

                {/* Image */}
                <div className="lg:w-80 xl:w-96 shrink-0 relative overflow-hidden" style={{ minHeight: 240 }}>
                  <img
                    src={park.image}
                    alt={park.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ minHeight: 240 }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${park.badgeColor}`}>
                      {park.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 rounded-lg px-2.5 py-1 text-white text-xs flex items-center gap-1.5">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold">{park.rating}</span>
                    <span className="text-white/60">({park.reviews.toLocaleString()})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                          <MapPin size={11} /> {park.location}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900">{park.name}</h3>
                        <p className="text-sm text-[#2d6a4f] font-medium mt-0.5">{park.tagline}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-bold text-gray-900">${park.price}</div>
                        <div className="text-xs text-gray-400">per night</div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4">{park.description}</p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {park.highlights.map(h => (
                        <span key={h} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-50">
                    <a href={`tel:${park.phone}`} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      <Phone size={13} /> {park.phone}
                    </a>
                    <Link
                      href={`/campground/${park.slug}`}
                      className="inline-flex items-center gap-2 bg-[#0b1a10] hover:bg-[#1b4332] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                    >
                      View & Book <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DISTANCES ── */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Park distances</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {DISTANCES.map(d => (
              <div key={d.from + d.to} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="text-xs text-gray-400 mb-1">{d.from} → {d.to}</div>
                <div className="text-2xl font-bold text-gray-900">{d.dist}</div>
                <div className="text-sm text-gray-500">{d.drive} drive</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4">All three parks are within 35 miles of downtown Reno. Big Bend and I-80 Smokeshop are 2 miles apart — ideal as a two-stop I-80 corridor combo.</p>
        </div>
      </section>

      {/* ── ABOUT THE TRIBE ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-3 py-1 mb-4">
              <span className="text-amber-700 text-xs font-medium uppercase tracking-wide">About</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pyramid Lake Paiute Tribe</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Pyramid Lake Paiute Tribe has inhabited the shores of Pyramid Lake for over 4,000 years. Their 475,000-acre reservation — entirely enclosing Nevada&apos;s largest natural lake — is one of the most ecologically significant landscapes in the American West.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Realty Department manages the tribe&apos;s commercial landholdings to generate economic opportunities for tribal members. Revenue from the parks directly supports tribal services, programs, and the community in Nixon, Nevada.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              A tribal recreation permit is required for all activities at Pyramid Lake — camping, fishing, boating, swimming, and day use. Purchase online at{' '}
              <a href="https://pyramidlake.us" target="_blank" rel="noopener noreferrer" className="text-[#2d6a4f] underline underline-offset-2">pyramidlake.us</a>{' '}
              or at the I-80 Smokeshop or Sutcliffe Marina store.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://plpt.nsn.us"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-full transition-colors"
              >
                Tribal website <ArrowRight size={13} />
              </a>
              <a
                href="https://pyramidlake.us"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-full transition-colors"
              >
                Permits & recreation <ArrowRight size={13} />
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100" style={{ aspectRatio: '4/3' }}>
            <img
              src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"
              alt="Pyramid Lake Nevada Paiute Reservation desert lake camping"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="bg-[#0b1a10]">
        <div className="max-w-5xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Questions? Contact the Realty Department</h2>
          <p className="text-white/60 mb-8 text-sm">Gabriel Lopez-Shaw · Property Manager · Pyramid Lake Realty Department</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="tel:7755752185"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
            >
              <Phone size={15} /> (775) 575-2185
            </a>
            <a
              href="mailto:prealty@plpt.nsn.us"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
            >
              <Mail size={15} /> prealty@plpt.nsn.us
            </a>
          </div>
          <p className="text-white/40 text-xs mt-6">Mon – Fri · 8:00 am – 4:30 pm · P.O. Box 993, Wadsworth, NV 89442</p>
        </div>
      </section>

    </div>
  )
}
