import Link from 'next/link'
import HomeSearch from '@/components/HomeSearch'
import { campgrounds } from '@/lib/data'

// SERVER COMPONENT — no JS bundle overhead, instant render, perfect LCP
// Hero uses inline SVG mountain silhouette — zero image fetch latency
// Only HomeSearch is client-side (isolated, small bundle)

const FEATURED = campgrounds.slice(0, 6)

const STATS = [
  { n: '21', label: 'Campgrounds' },
  { n: '9', label: 'States' },
  { n: '100+', label: 'Verified Reviews' },
  { n: '0', label: 'Hidden Fees' },
]

const WHY = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Verified Intel',
    desc: 'Real issues and real solutions — sourced from Yelp, Reddit, The Dyrt, Recreation.gov. No fabricated content.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Loop & Site Guides',
    desc: 'Best sites by number, loops ranked, what to avoid — information that\'s normally scattered across 20 Reddit threads.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Booking Intel',
    desc: 'Exact times to book, which loop to request, insider hacks that actually work — not generic advice.',
  },
]

export default function HomePage() {
  return (
    <main className="bg-[#0e1a13] min-h-screen overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 md:px-10"
        style={{ background: 'linear-gradient(to bottom, rgba(14,26,19,0.95) 0%, transparent 100%)' }}>
        <Link href="/" className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-amber-400 fill-current">
            <path d="M12 2L4 20h16L12 2zm0 4l5.5 12H6.5L12 6z" opacity=".3"/>
            <path d="M12 2L6.5 18h11L12 2z"/>
          </svg>
          <span className="font-display text-lg font-bold text-white tracking-tight">CamperWatch</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/search" className="text-sm text-stone-300 hover:text-white transition-colors hidden sm:block">Browse</Link>
          <Link href="/community" className="text-sm text-stone-300 hover:text-white transition-colors hidden sm:block">Community</Link>
          <Link href="/auth/login" className="text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 px-4 py-1.5 rounded-full transition-colors">Sign in</Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      {/* LCP element: inline SVG — zero network latency */}
      <section className="relative min-h-[100svh] flex flex-col justify-end pb-0 overflow-hidden">

        {/* Sky gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #0a1f2e 0%, #0f2d1a 45%, #1a3d20 75%, #0e1a13 100%)'
        }} />

        {/* Stars — pure CSS, no images */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <div className="stars-field" />
        </div>

        {/* Mountain silhouette — inline SVG, LCP safe */}
        <div className="absolute bottom-0 left-0 right-0" aria-hidden>
          <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ display: 'block' }}>
            {/* Back range */}
            <path d="M0 420 L0 280 L120 180 L240 240 L360 140 L480 200 L560 120 L640 170 L720 80 L800 160 L880 100 L960 180 L1080 130 L1200 200 L1320 150 L1440 220 L1440 420 Z"
              fill="#0f2219" />
            {/* Snow caps */}
            <path d="M560 120 L580 135 L600 125 L620 140 L640 170 L620 165 L600 140 L580 150 L560 120Z"
              fill="rgba(255,255,255,0.08)" />
            <path d="M720 80 L745 100 L770 90 L800 160 L775 150 L750 115 L725 105 L720 80Z"
              fill="rgba(255,255,255,0.06)" />
            {/* Mid range */}
            <path d="M0 420 L0 320 L80 260 L180 300 L300 220 L420 280 L500 200 L580 250 L660 180 L740 240 L820 170 L920 230 L1020 190 L1140 260 L1280 210 L1380 270 L1440 240 L1440 420 Z"
              fill="#0d1e14" />
            {/* Tree line silhouette */}
            <path d="M0 420 L0 370 L20 350 L30 370 L45 340 L55 365 L70 335 L85 360 L100 330 L115 358 L130 328 L145 355 L160 325 L175 352 L190 322 L205 350 L220 342 L230 362 L245 330 L260 358 L275 325 L290 355 L305 323 L320 350 L340 380 L360 345 L375 372 L390 342 L405 368 L420 338 L435 365 L450 332 L465 360 L480 355 L495 370 L510 340 L525 365 L540 332 L555 358 L570 328 L585 355 L600 322 L615 352 L630 320 L645 348 L660 315 L675 345 L690 312 L705 342 L720 372 L735 345 L750 368 L765 338 L780 362 L795 330 L810 358 L825 325 L840 355 L855 322 L870 350 L885 318 L900 348 L915 315 L930 342 L945 310 L960 340 L975 365 L990 338 L1005 362 L1020 330 L1035 358 L1050 325 L1065 355 L1080 322 L1095 350 L1110 318 L1125 348 L1140 315 L1155 345 L1170 312 L1185 342 L1200 360 L1215 335 L1230 362 L1245 330 L1260 358 L1275 328 L1290 355 L1305 325 L1320 352 L1335 322 L1350 350 L1365 320 L1380 348 L1395 318 L1410 345 L1425 315 L1440 342 L1440 420 Z"
              fill="#0e1a13" />
          </svg>
        </div>

        {/* Moon */}
        <div className="absolute top-24 right-16 md:right-32 w-12 h-12 md:w-16 md:h-16 rounded-full opacity-70" aria-hidden
          style={{ background: 'radial-gradient(circle at 35% 35%, #fff8e1, #fde68a)', boxShadow: '0 0 40px 8px rgba(253,230,138,0.15)' }} />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-5 pb-36 md:pb-48 pt-32 md:pt-20 animate-hero">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 md:mb-8"
            style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-300">21 Campgrounds Nationwide</span>
          </div>

          {/* Headline — Playfair Display, weight contrast */}
          <h1 className="font-display text-[2.6rem] leading-[1.05] md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-6 max-w-4xl">
            The campsite<br />
            <span className="text-amber-400">intel</span> you couldn't{' '}
            <span className="italic font-normal text-stone-300">find</span><br />
            anywhere else.
          </h1>

          {/* Subhead */}
          <p className="text-stone-400 text-base md:text-lg max-w-lg mb-10 md:mb-12 leading-relaxed">
            Best sites by number. Loop guides. Real booking strategies.
            Verified reviews from Yelp, Reddit & The Dyrt — in one place.
          </p>

          {/* Search widget */}
          <div className="w-full max-w-2xl animate-search">
            <HomeSearch />
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-xs text-stone-500">
            <span className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> No account required to browse</span>
            <span className="hidden sm:block w-px h-3 bg-stone-700" />
            <span className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> Free — no booking fees added</span>
            <span className="hidden sm:block w-px h-3 bg-stone-700" />
            <span className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> All data sourced from official sites</span>
          </div>
        </div>

        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #0e1a13)' }} />
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <section className="bg-[#0e1a13] py-10 md:py-14 px-5">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-stone-800">
          {STATS.map(s => (
            <div key={s.label} className="text-center md:px-6">
              <div className="font-display text-4xl md:text-5xl font-bold text-amber-400 mb-1">{s.n}</div>
              <div className="text-xs uppercase tracking-widest text-stone-500 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-5 max-w-5xl mx-auto">
        <div className="mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3">Why CamperWatch</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-xl">
            What Recreation.gov<br />
            <span className="text-stone-400 font-normal italic">doesn't tell you.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {WHY.map((w, i) => (
            <div key={w.title} className="group relative p-6 rounded-2xl border border-stone-800 bg-stone-950/40 hover:border-amber-500/30 hover:bg-stone-900/60 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-400 mb-4"
                style={{ background: 'rgba(251,191,36,0.08)' }}>
                {w.icon}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-stone-600 font-semibold mb-2">0{i + 1}</div>
              <h3 className="font-display text-lg font-bold text-white mb-2">{w.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED CAMPGROUNDS ────────────────────────────── */}
      <section className="py-16 md:py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10 md:mb-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">Featured</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Top campgrounds</h2>
            </div>
            <Link href="/search" className="text-sm text-stone-400 hover:text-amber-400 transition-colors font-medium hidden md:block">
              View all 21 →
            </Link>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 md:hidden snap-x snap-mandatory scrollbar-hide -mx-5 px-5">
            {FEATURED.map(c => <CampCard key={c.slug} camp={c} />)}
          </div>

          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-3 gap-5">
            {FEATURED.map(c => <CampCard key={c.slug} camp={c} />)}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/search"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 px-6 py-3 rounded-full transition-colors">
              Browse all campgrounds →
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTEL FEATURE CALLOUT ───────────────────────────── */}
      <section className="py-16 md:py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #1a3d20 0%, #0f2d1a 50%, #0a1a22 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Decorative gradient orb */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #fbbf24, transparent 70%)' }} aria-hidden />

            <div className="relative p-8 md:p-14 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-4">Site Intelligence</p>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                  "Site #D141 at Moraine Park.<br />
                  <span className="text-stone-300 font-normal italic">Why? Here's exactly why."</span>
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-8">
                  Every campground has best sites, worst sites, loop personalities, and booking traps.
                  We surface all of it — sourced from thousands of real camper reviews.
                </p>
                <Link href="/campground/moraine-park-rmnp"
                  className="inline-flex items-center gap-2 text-sm font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 px-6 py-3 rounded-full transition-colors">
                  See site guide →
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { site: '#D141', label: 'Moraine Park RMNP', detail: 'Jaw-dropping Longs Peak view + elk meadow', tag: '⭐ Best in park' },
                  { site: '#28', label: 'Nevada Beach, Tahoe', detail: '3 years to book — worth every attempt', tag: '🔥 Most wanted' },
                  { site: '#208', label: 'Upper Pines, Yosemite', detail: 'Tree canopy, close to Happy Isles trail', tag: '✓ Community pick' },
                ].map(item => (
                  <div key={item.site} className="flex items-start gap-4 p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="font-display text-xl font-bold text-amber-400 flex-shrink-0 w-12">{item.site}</div>
                    <div className="min-w-0">
                      <div className="text-xs text-stone-500 mb-0.5">{item.label}</div>
                      <div className="text-sm text-white font-medium truncate">{item.detail}</div>
                    </div>
                    <div className="text-xs text-stone-400 flex-shrink-0 hidden sm:block">{item.tag}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl md:text-7xl mb-6" aria-hidden>🏕️</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Your next site is<br />waiting for you.
          </h2>
          <p className="text-stone-400 mb-10 text-base md:text-lg">
            21 campgrounds. 9 states. Zion to Glacier. Yosemite to Grand Canyon.
          </p>
          <Link href="/search"
            className="inline-flex items-center gap-3 text-base font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 px-8 py-4 rounded-full transition-colors shadow-xl shadow-amber-400/20">
            Browse all campgrounds →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-stone-900 py-10 px-5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400 fill-current">
              <path d="M12 2L6.5 18h11L12 2z"/>
            </svg>
            <span className="font-display font-bold text-white">CamperWatch</span>
          </div>
          <p className="text-xs text-stone-600 text-center">© 2026 CamperWatch · All data sourced from official operator websites · No affiliation with Recreation.gov or NPS</p>
          <div className="flex gap-5 text-xs text-stone-500">
            <Link href="/community" className="hover:text-white transition-colors">Community</Link>
            <Link href="/add-campsite" className="hover:text-white transition-colors">Add campsite</Link>
            <Link href="/auth/signup" className="hover:text-white transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

// Camp card component — server rendered
function CampCard({ camp }: { camp: typeof campgrounds[0] }) {
  const img = (camp.images as any[])[0]
  return (
    <Link href={`/campground/${camp.slug}`}
      className="group flex-shrink-0 w-64 md:w-auto snap-start rounded-2xl overflow-hidden relative block"
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Image */}
      <div className="h-40 md:h-48 relative overflow-hidden bg-stone-900">
        <img
          src={`${img.url.split('?')[0]}?w=400&q=70&auto=format&fit=crop`}
          alt={img.alt}
          width={400} height={200}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-white"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            {camp.state}
          </span>
        </div>
        {camp.available && (
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" title="Sites available" />
        )}
      </div>
      {/* Info */}
      <div className="p-4" style={{ background: 'rgba(14,26,19,0.95)' }}>
        <h3 className="font-display font-bold text-white text-sm leading-tight mb-1 group-hover:text-amber-400 transition-colors">{camp.name}</h3>
        <p className="text-stone-500 text-xs mb-3 truncate">{camp.location}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-amber-400 font-bold text-sm">${camp.price_per_night}</span>
            <span className="text-stone-600 text-xs">/night</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-stone-400">
            <svg className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {camp.rating}
          </div>
        </div>
      </div>
    </Link>
  )
}
