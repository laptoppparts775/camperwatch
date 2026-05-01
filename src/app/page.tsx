import Link from 'next/link'
import HomeSearch from '@/components/HomeSearch'
import { campgrounds } from '@/lib/data'
import NavBar from '@/components/NavBar'

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
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: 'Every campground. One search.',
    desc: 'Federal parks (Recreation.gov), private campgrounds, RV resorts, state parks. Stop bouncing between apps — search them all here and get routed to the right booking system in one tap.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'A community, not a directory.',
    desc: 'Real-time alerts from campers who were there last night. Honest trip reports. The site 14 is shaded question answered by someone at the campground right now. Not a star rating from 2019.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'Better deal for owners.',
    desc: 'Hipcamp takes 15%. We take 10%. Owners keep their guest relationship, manage availability from their phone, and get their own booking page — no tech skills required. List in 5 minutes.',
  },
]

export default function HomePage() {
  return (
    <main className="bg-[#0e1a13] min-h-screen" style={{ overflowX: 'hidden', maxWidth: '100vw' }}>

      <NavBar dark />


      {/* HERO — inline SVG silhouette = zero LCP fetch */}
      <section className="relative flex flex-col justify-end" style={{ minHeight: '100svh', overflow: 'hidden' }}>

        {/* Sky */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #0a1f2e 0%, #0f2d1a 45%, #1a3d20 75%, #0e1a13 100%)'
        }} />

        {/* Stars — CSS radial gradients, no images */}
        <div className="absolute inset-0 stars-field" aria-hidden />

        {/* Moon — contained, no overflow */}
        <div className="absolute top-20 right-8 sm:top-24 sm:right-20 w-10 h-10 sm:w-14 sm:h-14 rounded-full pointer-events-none" aria-hidden
          style={{
            background: 'radial-gradient(circle at 35% 35%, #fff8e1, #fde68a)',
            boxShadow: '0 0 30px 6px rgba(253,230,138,0.15)',
            opacity: 0.65,
          }} />

        {/* Mountain SVG — contained within section */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 380" preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block', minWidth: '100%' }}>
            <path d="M0 380 L0 260 L120 165 L240 225 L360 128 L480 188 L560 110 L640 158 L720 72 L800 148 L880 92 L960 168 L1080 120 L1200 188 L1320 140 L1440 208 L1440 380 Z" fill="#0f2219" />
            <path d="M556 110 L576 128 L596 118 L616 132 L640 158 L618 152 L596 132 L576 142 L556 110Z" fill="rgba(255,255,255,0.07)" />
            <path d="M716 72 L740 90 L764 82 L800 148 L774 138 L748 108 L722 98 L716 72Z" fill="rgba(255,255,255,0.05)" />
            <path d="M0 380 L0 308 L80 250 L180 288 L300 210 L420 268 L500 190 L580 238 L660 170 L740 228 L820 162 L920 220 L1020 180 L1140 248 L1280 200 L1380 258 L1440 230 L1440 380 Z" fill="#0d1e14" />
            {/* Tree silhouette — simplified for performance */}
            <path d="M0 380 L0 355 L25 335 L35 355 L50 325 L65 348 L80 318 L95 342 L110 312 L125 338 L145 308 L160 332 L180 302 L200 328 L220 318 L240 345 L260 312 L280 340 L300 308 L320 336 L340 372 L360 338 L380 362 L400 332 L420 358 L440 325 L460 352 L480 342 L500 362 L520 330 L540 356 L560 320 L580 348 L600 314 L620 342 L640 308 L660 338 L680 304 L700 334 L720 362 L740 335 L760 358 L780 326 L800 352 L820 318 L840 346 L860 312 L880 340 L900 306 L920 334 L940 300 L960 330 L980 356 L1000 328 L1020 352 L1040 318 L1060 346 L1080 312 L1100 340 L1120 306 L1140 336 L1160 302 L1180 332 L1200 350 L1220 325 L1240 352 L1260 318 L1280 346 L1300 314 L1320 342 L1340 310 L1360 338 L1380 306 L1400 334 L1420 304 L1440 330 L1440 380 Z"
              fill="#0e1a13" />
          </svg>
        </div>

        {/* Hero content — centered, fully constrained */}
        <div className="relative z-10 flex flex-col items-center text-center w-full animate-hero"
          style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', paddingTop: '5rem', paddingBottom: '8rem' }}>

          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 sm:mb-7 max-w-full"
            style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" style={{ animation: 'pulse 2s infinite' }} />
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-amber-300 whitespace-nowrap">Federal + Private · All in one place</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-white mb-4 sm:mb-6 max-w-3xl w-full"
            style={{ fontSize: 'clamp(1.9rem, 7vw, 5.5rem)', lineHeight: 1.05, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            Search every campground.{' '}
            <span className="text-amber-400">Book in one place.</span>
          </h1>

          {/* Subhead */}
          <p className="text-stone-400 max-w-lg w-full mb-8 sm:mb-10 leading-relaxed"
            style={{ fontSize: 'clamp(0.875rem, 3vw, 1.125rem)' }}>
            Federal parks, private campgrounds, RV resorts — real availability, honest community reviews, and direct booking without the runaround.
          </p>

          {/* Search — full width, constrained */}
          <div className="w-full max-w-2xl animate-search">
            <HomeSearch />
          </div>

          {/* Trust signals — wraps gracefully */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-7 w-full"
            style={{ fontSize: '0.7rem', color: 'rgb(120,113,108)' }}>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-amber-400">✓</span> No account to browse
            </span>
            <span className="hidden sm:block w-px h-3 bg-stone-700 flex-shrink-0" />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-amber-400">✓</span> Free — no booking fees
            </span>
            <span className="hidden sm:block w-px h-3 bg-stone-700 flex-shrink-0" />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-amber-400">✓</span> Official sources only
            </span>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #0e1a13)' }} />
      </section>

      {/* STATS */}
      <section className="bg-[#0e1a13] py-10 sm:py-14 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:divide-x sm:divide-stone-800 sm:gap-0">
          {STATS.map(s => (
            <div key={s.label} className="text-center sm:px-6">
              <div className="font-display font-bold text-amber-400 mb-1" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)' }}>{s.n}</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="py-14 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 sm:mb-14">
            <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3">Why CamperWatch</p>
            <h2 className="font-display font-bold text-white leading-tight max-w-lg"
              style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>
              What Recreation.gov{' '}
              <span className="text-stone-400 font-normal" style={{ fontStyle: 'italic' }}>doesn't tell you.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {WHY.map((w, i) => (
              <div key={w.title} className="p-5 sm:p-6 rounded-2xl"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(14,26,19,0.6)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-400 mb-4"
                  style={{ background: 'rgba(251,191,36,0.08)' }}>
                  {w.icon}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-stone-700 font-semibold mb-2">0{i + 1}</div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-2">{w.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CAMPGROUNDS */}
      <section className="py-14 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1.5">Featured</p>
              <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.25rem)' }}>Top campgrounds</h2>
            </div>
            <Link href="/search" className="text-sm text-stone-400 hover:text-amber-400 transition-colors font-medium hidden sm:block flex-shrink-0 ml-4">View all 21 →</Link>
          </div>

          {/* Mobile: scroll — constrained with clip */}
          <div className="sm:hidden overflow-x-auto">
            <div className="flex gap-3 pb-3 snap-x snap-mandatory scrollbar-hide" style={{ paddingBottom: '0.75rem' }}>
              {FEATURED.map((c, i) => <CampCard key={c.slug} camp={c} priority={i === 0} />)}
            </div>
          </div>

          {/* Desktop: grid */}
          <div className="hidden sm:grid grid-cols-3 gap-4">
            {FEATURED.map((c, i) => <CampCard key={c.slug} camp={c} priority={i === 0} />)}
          </div>

          <div className="mt-7 text-center sm:hidden">
            <Link href="/search"
              className="inline-flex items-center gap-2 text-sm font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 px-6 py-3 rounded-full transition-colors">
              Browse all campgrounds →
            </Link>
          </div>
        </div>
      </section>

      {/* INTEL CALLOUT — contained, no negative positioning */}
      <section className="py-14 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #1a3d20 0%, #0f2d1a 50%, #0a1a22 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Orb — clipped inside overflow:hidden parent */}
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.15), transparent 70%)', transform: 'translate(30%, -30%)' }}
              aria-hidden />

            <div className="relative p-6 sm:p-12 lg:p-14 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3">Site Intelligence</p>
                <h3 className="font-display font-bold text-white mb-4 leading-tight"
                  style={{ fontSize: 'clamp(1.3rem, 4vw, 2.25rem)' }}>
                  "Site #D141 at Moraine Park.{' '}
                  <span className="text-stone-300 font-normal" style={{ fontStyle: 'italic' }}>Here's exactly why."</span>
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-7">
                  Every campground has best sites, worst sites, loop personalities, and booking traps.
                  We surface all of it — from thousands of real camper reviews.
                </p>
                <Link href="/campground/moraine-park-rmnp"
                  className="inline-flex items-center gap-2 text-sm font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 px-5 py-2.5 rounded-full transition-colors">
                  See site guide →
                </Link>
              </div>

              <div className="space-y-2.5">
                {[
                  { site: 'D141', label: 'Moraine Park RMNP', detail: 'Longs Peak view + elk meadow. Most praised in the park.', tag: '⭐ Best' },
                  { site: '#28', label: 'Nevada Beach, Tahoe', detail: '3 years to book — worth every attempt', tag: '🔥 Most wanted' },
                  { site: '#208', label: 'Upper Pines, Yosemite', detail: 'Tree canopy, close to Happy Isles', tag: '✓ Community pick' },
                ].map(item => (
                  <div key={item.site} className="flex items-center gap-3 p-3 sm:p-4 rounded-xl min-w-0"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="font-display font-bold text-amber-400 flex-shrink-0 text-base sm:text-xl w-10 sm:w-12">{item.site}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-stone-500 mb-0.5 truncate">{item.label}</div>
                      <div className="text-xs sm:text-sm text-white font-medium leading-snug">{item.detail}</div>
                    </div>
                    <div className="text-[10px] text-stone-500 flex-shrink-0 hidden md:block">{item.tag}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-28 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-4xl sm:text-6xl mb-5" aria-hidden>🏕️</div>
          <h2 className="font-display font-bold text-white mb-4 leading-tight"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 3rem)' }}>
            Your next site is waiting.
          </h2>
          <p className="text-stone-400 mb-8 text-sm sm:text-base">
            21 campgrounds. 9 states. Zion to Glacier. Yosemite to Grand Canyon.
          </p>
          <Link href="/search"
            className="inline-flex items-center gap-2 font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 px-7 py-3.5 rounded-full transition-colors shadow-xl"
            style={{ fontSize: 'clamp(0.875rem, 3vw, 1rem)', boxShadow: '0 8px 32px rgba(251,191,36,0.25)' }}>
            Browse all campgrounds →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-900 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-400 fill-current flex-shrink-0">
              <path d="M12 2L6.5 18h11L12 2z"/>
            </svg>
            <span className="font-display font-bold text-white text-sm">CamperWatch</span>
          </div>
          <p className="text-[11px] text-stone-700 max-w-xs sm:max-w-sm">
            © 2026 CamperWatch · Data from official operator websites · No affiliation with Recreation.gov or NPS
          </p>
          <div className="flex gap-5 text-xs text-stone-500 flex-shrink-0">
            <Link href="/community" className="hover:text-white transition-colors">Community</Link>
            <Link href="/add-campsite" className="hover:text-white transition-colors">Add campsite</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/auth/signup" className="hover:text-white transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

// Server-rendered card — no client JS
function CampCard({ camp, priority = false }: { camp: typeof campgrounds[0], priority?: boolean }) {
  const img = (camp.images as any[])[0]
  const src = `${img.url.split('?')[0]}?w=480&q=70&auto=format&fit=crop`
  return (
    <Link href={`/campground/${camp.slug}`}
      className="group flex-shrink-0 sm:flex-shrink snap-start rounded-xl overflow-hidden block relative w-56 sm:w-auto"
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="h-36 sm:h-44 relative overflow-hidden bg-stone-900">
        <img
          src={src}
          alt={img.alt}
          width={480} height={200}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'low'}
          decoding={priority ? 'sync' : 'async'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ display: 'block' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
            {camp.state}
          </span>
        </div>
        {camp.available && (
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-green-400"
            style={{ boxShadow: '0 0 6px 2px rgba(74,222,128,0.4)' }} />
        )}
      </div>
      <div className="p-3 sm:p-4" style={{ background: 'rgba(14,26,19,0.96)' }}>
        <h3 className="font-display font-bold text-white text-sm leading-tight mb-1 group-hover:text-amber-400 transition-colors line-clamp-1">{camp.name}</h3>
        <p className="text-stone-500 text-xs mb-3 truncate">{camp.location}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-amber-400 font-bold text-sm">${camp.price_per_night}</span>
            <span className="text-stone-600 text-xs">/night</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-stone-400">
            <svg className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            {camp.rating}
          </div>
        </div>
      </div>
    </Link>
  )
}
