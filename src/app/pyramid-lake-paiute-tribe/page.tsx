import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { ArrowRight, MapPin, Phone, Mail, Star, Fish, Zap, Trees, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pyramid Lake Paiute Tribe RV Parks — Book Direct | CamperWatch',
  description: 'Pyramid Lake Paiute Tribe operates 3 RV parks near Reno, NV: Pyramid Lake Marina (full hookups, $45/night), Big Bend Riverside ($45/night), and I-80 Smokeshop (permits + camping, $30/night). Book directly — no middleman.',
  alternates: { canonical: 'https://camperwatch.org/pyramid-lake-paiute-tribe' },
  openGraph: {
    title: 'Pyramid Lake Paiute Tribe RV Parks — 3 Parks, Book Direct',
    description: '3 tribal RV parks 30–35 miles from Reno. Full hookups from $45/night. Pyramid Lake fishing permits, fireworks, Truckee River camping. Book directly with the tribe.',
    url: 'https://camperwatch.org/pyramid-lake-paiute-tribe',
    type: 'website',
    siteName: 'CamperWatch',
    images: [{ url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200&q=80&fit=crop', width: 1200, height: 630, alt: 'Pyramid Lake Nevada ancient lake turquoise water desert camping' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pyramid Lake Paiute Tribe RV Parks — Book Direct',
    description: '3 tribal RV parks near Reno, NV. Full hookups from $45/night. No middleman.',
    images: ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1200&q=80&fit=crop'],
  },
}

const PARKS = [
  {
    slug: 'pyramid-lake-marina',
    name: 'Pyramid Lake Marina & RV Park',
    shortName: 'Pyramid Lake Marina',
    location: 'Sutcliffe, NV',
    miles: '35 mi from Reno',
    badge: 'Lakefront',
    badgeClass: 'bg-sky-100 text-sky-800',
    accentClass: 'bg-sky-600',
    price: 45,
    priceHigh: 65,
    rating: 4.2,
    reviews: 305,
    phone: '(775) 444-5463',
    tel: '7754445463',
    img: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=900&q=85&fit=crop',
    imgAlt: 'Pyramid Lake Nevada ancient turquoise desert lake tufa formations — tribal RV park full hookups',
    headline: 'Full hookups on Nevada\u2019s most spectacular ancient lake',
    why: 'Pyramid Lake is a 4,000-year-old desert lake on Paiute tribal land \u2014 one of the most dramatic landscapes in the American West. The Pyramid rock formation rises 300 feet from vivid turquoise water. World-renowned for Lahontan cutthroat trout fishing, the largest American White Pelican colony in North America, and sunsets that repeat visitors call unmatched anywhere in Nevada.',
    specs: [
      { label: 'Sites', value: '25 full hookup RV sites' },
      { label: 'Electric', value: '30 amp & 50 amp' },
      { label: 'Rig length', value: 'Pull-thru to 50 ft' },
      { label: 'Season', value: 'Year-round' },
      { label: 'Permits', value: 'Required \u2014 buy at marina or online' },
    ],
    highlights: ['30 & 50 amp electric', 'Pull-thru to 50 ft', 'Water & sewer hookups', 'Marina store on-site', 'Boat launch & beach', 'Lahontan trout fishing', 'White Pelican colony', 'Pet friendly'],
    insider: 'The Lahontan cutthroat trout season opens October 1 \u2014 book weeks ahead. Afternoon winds are strong; set up camp before noon.',
    icon: Fish,
  },
  {
    slug: 'big-bend-rv-park',
    name: 'Big Bend RV Park',
    shortName: 'Big Bend',
    location: 'Wadsworth, NV',
    miles: '30 mi from Reno',
    badge: 'Riverside',
    badgeClass: 'bg-emerald-100 text-emerald-800',
    accentClass: 'bg-emerald-600',
    price: 45,
    priceHigh: 55,
    rating: 4.3,
    reviews: 48,
    phone: '(775) 575-2185',
    tel: '7755752185',
    img: 'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=900&q=85&fit=crop',
    imgAlt: 'Paved RV sites shade trees grass Big Bend RV Park Wadsworth Nevada Truckee River full hookups',
    headline: 'Paved, shaded, full-hookup sites on the Truckee River',
    why: 'Shade is rare in the Nevada desert. Big Bend is the exception \u2014 mature trees, grass, and the Truckee River alongside every site. Paved level pads handle any rig size. Right off I-80 Wadsworth exit, it\u2019s the best-positioned overnight or base camp on the entire Reno corridor. Ideal staging ground for Pyramid Lake or Burning Man.',
    specs: [
      { label: 'Sites', value: 'Full hookup RV sites (all paved)' },
      { label: 'Electric', value: '30 amp & 50 amp' },
      { label: 'Weekly rate', value: '$270/week ($313.95 with tax)' },
      { label: 'Extras', value: 'Horse boarding available' },
      { label: 'Access', value: 'I-80 Wadsworth exit \u2014 easy pull-in' },
    ],
    highlights: ['30 & 50 amp electric', 'Paved level sites', 'Real shade trees', 'Truckee River trail', 'Horse boarding', 'On-site laundry', 'Showers', 'I-80 direct access'],
    insider: 'Request a river-side site \u2014 quieter and shadier. Books up fast during Burning Man week (late August). Horse boarding needs a call-ahead.',
    icon: Trees,
  },
  {
    slug: 'i80-smokeshop-campground',
    name: 'I-80 Smokeshop Campground',
    shortName: 'I-80 Smokeshop',
    location: 'Wadsworth, NV',
    miles: '30 mi from Reno',
    badge: '4.7 \u2605 Store',
    badgeClass: 'bg-amber-100 text-amber-800',
    accentClass: 'bg-amber-500',
    price: 30,
    priceHigh: 40,
    rating: 4.7,
    reviews: 480,
    phone: '(775) 575-2181',
    tel: '7755752181',
    img: 'https://images.unsplash.com/photo-1559521783-1d1599583485?w=900&q=85&fit=crop',
    imgAlt: 'Nevada desert I-80 corridor Wadsworth Paiute tribal store fireworks permits propane campground',
    headline: 'Pyramid Lake permits, fireworks & the highest-rated stop on I-80 Nevada',
    why: '4.7 stars from 480+ reviews. The I-80 Smokeshop sells tribal fishing, camping, boating, and jet ski permits for Pyramid Lake \u2014 plus legal fireworks, propane, gasoline, groceries, and authentic Paiute crafts. One of the only places in Nevada where serious consumer fireworks are sold year-round (tribal land exemption). Staff knows Pyramid Lake conditions better than any website.',
    specs: [
      { label: 'Rating', value: '4.7 stars \u00b7 480+ Google reviews' },
      { label: 'Hours', value: '7 days \u00b7 6 am \u2013 9 pm (extended for Burning Man)' },
      { label: 'Permits', value: 'Pyramid Lake fishing, camping, boating, jet ski' },
      { label: 'Camping', value: 'RV & tent sites, $30\u2013$40/night' },
      { label: 'Extras', value: 'Propane refill & exchange, gasoline, fireworks' },
    ],
    highlights: ['Pyramid Lake permits', 'Legal fireworks (tribal land)', 'Propane refill & exchange', 'Gasoline on-site', 'Authentic Paiute crafts', 'Groceries & supplies', 'Open 7 days', 'Burning Man supply stop'],
    insider: 'Buy your Pyramid Lake permit here rather than at the ranger station \u2014 longer hours and staff will brief you on current lake conditions and fishing regulations.',
    icon: Zap,
  },
]

const FAQS = [
  {
    q: 'What RV parks does the Pyramid Lake Paiute Tribe operate?',
    a: 'The Pyramid Lake Paiute Tribe operates three RV parks in Northern Nevada: Pyramid Lake Marina & RV Park (25 full-hookup sites in Sutcliffe, NV, $45\u2013$65/night), Big Bend RV Park (full-hookup paved sites on the Truckee River in Wadsworth, NV, $45\u2013$55/night), and the I-80 Smokeshop Campground (RV and tent camping with on-site permit sales, $30\u2013$40/night). All three are within 35 miles of Reno.',
  },
  {
    q: 'Do I need a permit to camp at Pyramid Lake?',
    a: 'Yes. A tribal recreation permit is required for all activities at Pyramid Lake \u2014 camping, fishing, boating, swimming, and day use. Purchase at pyramidlake.us, the I-80 Smokeshop (open 7 days, 6am\u20139pm), or the Sutcliffe Marina store. Day use starts at $22.',
  },
  {
    q: 'How far are the Pyramid Lake Paiute Tribe parks from Reno?',
    a: 'Pyramid Lake Marina is 35 miles (about 40 minutes) north of Reno via NV-445. Big Bend RV Park and I-80 Smokeshop Campground are both in Wadsworth, NV, about 30 miles (35 minutes) east of Reno off I-80. Big Bend and the Smokeshop are 2 miles apart.',
  },
  {
    q: 'Can I fish for Lahontan cutthroat trout at Pyramid Lake?',
    a: 'Yes. Pyramid Lake is world-renowned for Lahontan cutthroat trout, with fish regularly exceeding 10 lbs and occasional trophy fish over 20 lbs. A tribal fishing permit is required \u2014 purchase at pyramidlake.us, the I-80 Smokeshop, or the Sutcliffe Marina store. Season opens October 1 with peak fishing November through March.',
  },
  {
    q: 'Does Pyramid Lake Marina have full hookups for RVs?',
    a: 'Yes. Pyramid Lake Marina & RV Park has 25 full-hookup RV sites with water, sewer, and 30 and 50 amp electric. Pull-through sites accommodate rigs up to 50 feet. On-site coin laundry, showers, and marina store. Rates start at $45/night.',
  },
  {
    q: 'Where can I buy fireworks legally near Reno, Nevada?',
    a: 'The I-80 Smokeshop in Wadsworth, NV (operated by the Pyramid Lake Paiute Tribe) sells consumer fireworks year-round. Tribal land is exempt from Nevada\u2019s fireworks restrictions. Located at 1000 Smokeshop Circle, Wadsworth, NV, off I-80 exit 43/46, open 7 days 6am\u20139pm.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TouristDestination',
      name: 'Pyramid Lake Paiute Tribe RV Parks',
      description: 'Three RV parks operated by the Pyramid Lake Paiute Tribe in Northern Nevada within 35 miles of Reno: Pyramid Lake Marina, Big Bend RV Park, and I-80 Smokeshop Campground.',
      url: 'https://camperwatch.org/pyramid-lake-paiute-tribe',
      touristType: ['RV Travelers', 'Anglers', 'Campers', 'Burning Man Attendees'],
      includesAttraction: PARKS.map(p => ({
        '@type': 'LodgingBusiness',
        name: p.name,
        url: `https://camperwatch.org/campground/${p.slug}`,
        telephone: p.phone,
        address: { '@type': 'PostalAddress', addressLocality: p.location.replace(', NV', ''), addressRegion: 'NV', addressCountry: 'US' },
        priceRange: `$${p.price}\u2013$${p.priceHigh}/night`,
        aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews, bestRating: 5 },
      })),
    },
    {
      '@type': 'Organization',
      name: 'Pyramid Lake Paiute Tribe \u2014 Realty Department',
      url: 'https://plpt.nsn.us',
      telephone: '(775) 575-2185',
      email: 'prealty@plpt.nsn.us',
      address: { '@type': 'PostalAddress', streetAddress: 'P.O. Box 993', addressLocality: 'Wadsworth', addressRegion: 'NV', postalCode: '89442', addressCountry: 'US' },
      sameAs: ['https://plpt.nsn.us', 'https://pyramidlake.us'],
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
    {
      '@type': 'WebPage',
      url: 'https://camperwatch.org/pyramid-lake-paiute-tribe',
      name: 'Pyramid Lake Paiute Tribe RV Parks \u2014 Book Direct | CamperWatch',
      description: 'Pyramid Lake Paiute Tribe operates 3 RV parks near Reno NV. Full hookups from $45/night. Book directly.',
      isPartOf: { '@type': 'WebSite', url: 'https://camperwatch.org' },
      breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'CamperWatch', item: 'https://camperwatch.org' },
        { '@type': 'ListItem', position: 2, name: 'Pyramid Lake Paiute Tribe Parks', item: 'https://camperwatch.org/pyramid-lake-paiute-tribe' },
      ]},
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.speakable-intro', 'h1', '.park-headline'] },
    },
  ],
}

export default function PLPTPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── MOBILE HERO (hidden md+) ── */}
      <section className="md:hidden relative">
        <div className="relative w-full overflow-hidden" style={{ height: '58vw', minHeight: 230, maxHeight: 370 }}>
          <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=900&q=85&fit=crop" alt="Pyramid Lake Nevada ancient turquoise desert lake Paiute tribal land" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(11,26,16,0.9) 100%)' }} />
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/15 border border-white/25 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-white text-xs font-medium tracking-wide">Pyramid Lake Paiute Tribe</span>
          </div>
        </div>
        <div className="bg-[#0b1a10] px-5 pt-6 pb-8">
          <h1 className="text-[1.75rem] font-bold text-white leading-tight mb-3 speakable-intro">
            Three Tribal Parks.<br />Book Direct.
          </h1>
          <p className="text-white/65 text-sm leading-relaxed mb-5">
            The Pyramid Lake Paiute Tribe operates three distinct parks within 35 miles of Reno — full hookups on Nevada&apos;s most ancient desert lake, shaded riverside sites on the Truckee River, and the highest-rated I-80 supply stop in Nevada. From $45/night. No middleman.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['3 parks near Reno', 'From $45/night', 'Full hookups', 'Fishing permits on-site'].map(s => (
              <span key={s} className="text-xs text-white/70 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full">{s}</span>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/campground/pyramid-lake-marina" className="flex items-center justify-center gap-2 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold text-sm px-5 py-3.5 rounded-full transition-colors">
              View Pyramid Lake Marina <ArrowRight size={15} />
            </Link>
            <a href="tel:7755752185" className="flex items-center justify-center gap-2 border border-white/20 text-white/75 text-sm px-5 py-3 rounded-full hover:bg-white/10 transition-colors">
              <Phone size={13} /> Call (775) 575-2185
            </a>
          </div>
        </div>
      </section>

      {/* ── DESKTOP HERO 60/40 split (hidden below md) ── */}
      <section className="hidden md:flex min-h-[92vh]">
        <div className="relative w-[60%] shrink-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1400&q=85&fit=crop" alt="Pyramid Lake Nevada ancient turquoise desert lake tufa formations Paiute tribal RV parks" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0) 55%, rgba(11,26,16,0.65) 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 px-10 pb-10 pt-20" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
            <div className="flex gap-8">
              {[{ v: '4,000+', l: 'Years of Paiute stewardship' }, { v: '475k ac', l: 'Reservation' }, { v: '3', l: 'Parks near Reno' }].map(s => (
                <div key={s.l}><div className="text-2xl font-bold text-white">{s.v}</div><div className="text-white/55 text-xs mt-0.5">{s.l}</div></div>
              ))}
            </div>
          </div>
          <div className="absolute top-8 left-10 flex items-center gap-2 bg-black/30 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="text-white/85 text-xs font-medium tracking-widest uppercase">Pyramid Lake Paiute Tribe</span>
          </div>
        </div>
        <div className="flex-1 bg-[#0b1a10] flex flex-col justify-center px-10 xl:px-16 py-20">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5 speakable-intro">
            Three Parks.<br />One Tribe.<br />No Middleman.
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-8 max-w-sm">
            Three distinct RV parks on Paiute tribal land within 35 miles of Reno. Full hookups from $45/night. Book directly with the tribe.
          </p>
          <div className="space-y-3 mb-8">
            {PARKS.map(p => (
              <Link key={p.slug} href={`/campground/${p.slug}`} className="flex items-center justify-between group bg-white/8 hover:bg-white/12 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 transition-all">
                <div>
                  <div className="text-white text-sm font-semibold group-hover:text-emerald-300 transition-colors">{p.shortName}</div>
                  <div className="text-white/40 text-xs mt-0.5">{p.location} &middot; {p.miles} &middot; from ${p.price}/night</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 text-amber-400"><Star size={11} className="fill-amber-400" /><span className="text-xs font-semibold">{p.rating}</span></div>
                  <ArrowRight size={14} className="text-white/30 group-hover:text-white/70 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
          <a href="tel:7755752185" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"><Phone size={13} /> (775) 575-2185 &middot; Realty Dept.</a>
        </div>
      </section>

      {/* ── PARK CARDS ── */}
      <section className="max-w-5xl mx-auto px-5 py-14 sm:py-20">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Choose your park</h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl">Each park has a different character. Pick by vibe \u2014 or combine them into a multi-stop Northern Nevada trip.</p>
        </div>
        <div className="space-y-10 sm:space-y-14">
          {PARKS.map((park, i) => {
            const Icon = park.icon
            return (
              <article key={park.slug} className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className={`flex flex-col lg:flex-row`}>
                  <div className={`relative shrink-0 lg:w-80 xl:w-96 overflow-hidden ${i % 2 === 1 ? 'lg:order-2' : ''}`} style={{ minHeight: 240 }}>
                    <img src={park.img} alt={park.imgAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ minHeight: 240 }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${park.badgeClass}`}>{park.badge}</span></div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/55 rounded-lg px-2.5 py-1">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-white text-xs font-semibold">{park.rating}</span>
                      <span className="text-white/55 text-xs">({park.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="flex-1 p-6 sm:p-8 flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-7 h-7 rounded-lg ${park.accentClass} flex items-center justify-center shrink-0`}><Icon size={14} className="text-white" /></div>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} /> {park.location} &middot; {park.miles}</p>
                      <div className="ml-auto text-right shrink-0"><span className="text-xl font-bold text-gray-900">${park.price}</span><span className="text-xs text-gray-400">/night</span></div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 park-headline">{park.name}</h3>
                    <p className="text-sm text-emerald-700 font-medium mb-3">{park.headline}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{park.why}</p>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-2 mb-4 text-xs">
                      {park.specs.map(s => (
                        <div key={s.label} className="flex gap-1.5"><span className="text-gray-400 shrink-0">{s.label}:</span><span className="text-gray-700 font-medium">{s.value}</span></div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {park.highlights.map(h => (<span key={h} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2 py-1 rounded-md">{h}</span>))}
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5">
                      <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Insider tip &middot; </span>
                      <span className="text-xs text-amber-700">{park.insider}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-50 mt-auto">
                      <a href={`tel:${park.tel}`} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"><Phone size={13} /> {park.phone}</a>
                      <Link href={`/campground/${park.slug}`} className="inline-flex items-center gap-2 bg-[#0b1a10] hover:bg-[#1b4332] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">View &amp; Book <ArrowRight size={13} /></Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── DISTANCES ── */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-5 py-12 sm:py-14">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Where are the parks?</h2>
          <p className="text-gray-500 text-sm mb-7">All three parks are within 35 miles of downtown Reno. Big Bend and the I-80 Smokeshop are 2 miles apart \u2014 easy to combine in one stop.</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            {[
              { from: 'Reno, NV', to: 'Pyramid Lake Marina', dist: '35 mi', time: '~40 min', dir: 'North via NV-445' },
              { from: 'Reno, NV', to: 'Big Bend & Smokeshop', dist: '30 mi', time: '~35 min', dir: 'East via I-80' },
              { from: 'Big Bend', to: 'I-80 Smokeshop', dist: '2 mi', time: '~4 min', dir: 'Adjacent on I-80' },
            ].map(d => (
              <div key={d.to} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="text-xs text-gray-400 mb-2">{d.from} &rarr; {d.to}</div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">{d.dist}</div>
                <div className="text-sm text-gray-500">{d.time} &middot; {d.dir}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-sm text-gray-600 leading-relaxed">
            <strong className="text-gray-900">Pro trip idea:</strong> Stop at the I-80 Smokeshop first (buy Pyramid Lake permits, propane, fireworks), overnight at Big Bend (full hookups, Truckee River), then drive 30 minutes north to Pyramid Lake Marina for 2&ndash;3 nights of fishing and photography.
          </div>
        </div>
      </section>

      {/* ── ABOUT THE TRIBE ── */}
      <section className="max-w-5xl mx-auto px-5 py-14 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-3 py-1 mb-5">
              <span className="text-amber-700 text-xs font-medium uppercase tracking-wide">About the tribe</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Pyramid Lake Paiute Tribe</h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-sm">The Pyramid Lake Paiute Tribe has stewarded the shores of Pyramid Lake for over 4,000 years. Their 475,000-acre reservation \u2014 entirely enclosing Nevada&apos;s largest natural lake \u2014 is one of the most ecologically and culturally significant landscapes in the American West.</p>
            <p className="text-gray-600 leading-relaxed mb-4 text-sm">Pyramid Lake is an ancient remnant of Lake Lahontan, which once covered 8,000 square miles of the Great Basin. The Lahontan cutthroat trout fishery \u2014 nearly extinct in the 1940s and restored through decades of tribal conservation \u2014 is now world-class, producing fish over 20 lbs. The American White Pelican colony is the largest in North America.</p>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm">The Realty Department manages the tribe&apos;s commercial landholdings to generate economic opportunities for tribal members. Revenue from the parks directly supports tribal services and the community in Nixon, NV.</p>
            <div className="space-y-2">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">Tribal resources</p>
              {[{ label: 'Tribal website', href: 'https://plpt.nsn.us' }, { label: 'Permits & recreation', href: 'https://pyramidlake.us' }, { label: 'Realty Department', href: 'https://plpt.nsn.us/plpt-realty-office/' }].map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 transition-colors">
                  <ExternalLink size={12} /> {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=85&fit=crop" alt="Camping at Pyramid Lake Nevada Paiute Reservation RV park full hookups" className="w-full h-full object-cover" />
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5">
              <h3 className="font-bold text-sky-900 mb-2 text-sm">Tribal permits required at Pyramid Lake</h3>
              <p className="text-sky-800 text-xs leading-relaxed mb-3">All activities at Pyramid Lake require a tribal recreation permit. Purchase at pyramidlake.us, the I-80 Smokeshop (6am&ndash;9pm daily), or the Sutcliffe Marina store.</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[{ type: 'Day use', price: '$22' }, { type: 'Camping', price: 'from $30' }, { type: 'Fishing', price: '$26/day' }, { type: 'Boating', price: '$26/day' }].map(p => (
                  <div key={p.type} className="bg-white rounded-lg px-3 py-2 flex justify-between items-center border border-sky-100">
                    <span className="text-sky-700">{p.type}</span><span className="font-bold text-sky-900">{p.price}</span>
                  </div>
                ))}
              </div>
              <a href="https://pyramidlake.us" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs text-sky-700 font-semibold hover:text-sky-900 transition-colors">Buy permits at pyramidlake.us <ExternalLink size={11} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ (open HTML \u2014 not collapsed, AEO requirement) ── */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 py-14 sm:py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently asked questions</h2>
          <div className="space-y-5">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">{q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="bg-[#0b1a10]">
        <div className="max-w-5xl mx-auto px-5 py-14 sm:py-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Questions? Call the Realty Department</h2>
          <p className="text-white/45 text-sm mb-8">Gabriel Lopez-Shaw &middot; Property Manager &middot; Mon&ndash;Fri 8:00 am&ndash;4:30 pm</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:7755752185" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/18 border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"><Phone size={14} /> (775) 575-2185</a>
            <a href="mailto:prealty@plpt.nsn.us" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/18 border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"><Mail size={14} /> prealty@plpt.nsn.us</a>
          </div>
          <p className="text-white/30 text-xs mt-6">P.O. Box 993 &middot; Wadsworth, NV 89442</p>
        </div>
      </section>
    </div>
  )
}
