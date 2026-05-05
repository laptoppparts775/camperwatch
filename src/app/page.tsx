import Link from 'next/link'
import HomeSearch from '@/components/HomeSearch'
import { campgrounds } from '@/lib/data'
import NavBar from '@/components/NavBar'

const FEATURED = campgrounds.slice(0, 6)
const ALERTS = [
  { camp: 'Camp Richardson', msg: 'Fire restrictions lifted — wood fires now OK', time: '2h ago', type: 'good' },
  { camp: 'Nevada Beach', msg: 'Bear active near loop B. Store food in car.', time: '5h ago', type: 'warn' },
  { camp: 'Fallen Leaf', msg: 'Site #14 just opened up this weekend', time: '1h ago', type: 'good' },
]

export default function HomePage() {
  return (
    <main className="bg-[#0e1a13] min-h-screen" style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
      <NavBar dark />

      {/* ═══════════════════════════════════════════════
          DESKTOP HERO — Aspirational planner experience
          Psychology: FOMO + aspiration + trust building
          Hidden on mobile
      ═══════════════════════════════════════════════ */}
      <section className="hidden sm:flex relative flex-col justify-end" style={{ minHeight: '100svh', overflow: 'hidden' }}>
        {/* Sky gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #060d18 0%, #0a1f2e 30%, #0f2d1a 60%, #0e1a13 100%)'
        }} />
        <div className="absolute inset-0 stars-field" aria-hidden />

        {/* Moon */}
        <div className="absolute top-24 right-20 w-14 h-14 rounded-full pointer-events-none" aria-hidden
          style={{
            background: 'radial-gradient(circle at 35% 35%, #fff8e1, #fde68a)',
            boxShadow: '0 0 60px 12px rgba(253,230,138,0.12)',
            opacity: 0.7,
          }} />

        {/* Atmospheric glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(26,61,32,0.6), transparent)'
        }} />

        {/* Mountain SVG */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
            <path d="M0 420 L0 260 L120 165 L240 225 L360 128 L480 188 L560 110 L640 158 L720 72 L800 148 L880 92 L960 168 L1080 120 L1200 188 L1320 140 L1440 208 L1440 420 Z" fill="#0f2219" />
            <path d="M556 110 L576 128 L596 118 L616 132 L640 158 L618 152 L596 132 L576 142 L556 110Z" fill="rgba(255,255,255,0.06)" />
            <path d="M716 72 L740 90 L764 82 L800 148 L774 138 L748 108 L722 98 L716 72Z" fill="rgba(255,255,255,0.04)" />
            <path d="M0 420 L0 308 L80 250 L180 288 L300 210 L420 268 L500 190 L580 238 L660 170 L740 228 L820 162 L920 220 L1020 180 L1140 248 L1280 200 L1380 258 L1440 230 L1440 420 Z" fill="#0d1e14" />
            <path d="M0 420 L0 355 L25 335 L35 355 L50 325 L65 348 L80 318 L95 342 L110 312 L125 338 L145 308 L160 332 L180 302 L200 328 L220 318 L240 345 L260 312 L280 340 L300 308 L320 336 L340 372 L360 338 L380 362 L400 332 L420 358 L440 325 L460 352 L480 342 L500 362 L520 330 L540 356 L560 320 L580 348 L600 314 L620 342 L640 308 L660 338 L680 304 L700 334 L720 362 L740 335 L760 358 L780 326 L800 352 L820 318 L840 346 L860 312 L880 340 L900 306 L920 334 L940 300 L960 330 L980 356 L1000 328 L1020 352 L1040 318 L1060 346 L1080 312 L1100 340 L1120 306 L1140 336 L1160 302 L1180 332 L1200 350 L1220 325 L1240 352 L1260 318 L1280 346 L1300 314 L1320 342 L1340 310 L1360 338 L1380 306 L1400 334 L1420 304 L1440 330 L1440 420 Z"
              fill="#0e1a13" />
          </svg>
        </div>

        {/* Desktop hero content — split layout */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pb-24 pt-20 w-full">
          <div className="grid grid-cols-2 gap-16 items-end">
            {/* Left: headline + search */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
                style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                <span className="text-xs font-semibold tracking-widest uppercase text-amber-300">Federal + Private · All in one place</span>
              </div>

              <h1 className="font-display font-black text-white mb-6 leading-[0.95]"
                style={{ fontSize: 'clamp(3rem, 5.5vw, 5.5rem)', letterSpacing: '-0.02em' }}>
                Find your{' '}
                <span className="text-amber-400 italic">perfect</span>
                <br />campsite.
              </h1>

              <p className="text-stone-400 mb-8 leading-relaxed max-w-md" style={{ fontSize: '1.05rem' }}>
                Every federal park, private campground, and RV resort — searched together. Community intel from last night, not 2019.
              </p>

              <HomeSearch />

              <div className="flex items-center gap-6 mt-6" style={{ fontSize: '0.72rem', color: 'rgb(100,93,88)' }}>
                <span className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> No account to browse</span>
                <span className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> Free, no booking fees</span>
                <span className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> Official sources only</span>
              </div>
              <div className="mt-5">
                <a href="/alerts" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
                  🔔 Get notified when sold-out parks open up — free
                </a>
              </div>
            </div>

            {/* Right: live social proof — the "FOMO panel" */}
            <div className="space-y-3 mb-4">
              <div className="text-[10px] uppercase tracking-widest text-stone-600 font-semibold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live from the community
              </div>
              {ALERTS.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="text-lg flex-shrink-0">{a.type === 'warn' ? '⚠️' : '✅'}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-stone-500 mb-0.5">{a.camp}</div>
                    <div className="text-sm text-white font-medium leading-snug">{a.msg}</div>
                  </div>
                  <div className="text-[10px] text-stone-600 flex-shrink-0 whitespace-nowrap">{a.time}</div>
                </div>
              ))}
              <Link href="/community"
                className="block text-center text-xs text-stone-500 hover:text-amber-400 transition-colors pt-1">
                View all community alerts →
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #0e1a13)' }} />
      </section>

      {/* ═══════════════════════════════════════════════
          MOBILE HERO — Immediate utility experience
          Psychology: urgency + proximity + quick action
          Shown only on mobile
      ═══════════════════════════════════════════════ */}
      <section className="sm:hidden" style={{ background: '#0e1a13' }}>

        {/* Compact top bar with ambient night sky */}
        <div className="relative overflow-hidden" style={{ paddingTop: '2rem', paddingBottom: '2.5rem' }}>
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(160deg, #060d18 0%, #0f2d1a 60%, #0e1a13 100%)'
          }} />
          <div className="absolute inset-0 stars-field opacity-60" aria-hidden />

          {/* Small moon */}
          <div className="absolute top-6 right-6 w-8 h-8 rounded-full pointer-events-none" aria-hidden
            style={{
              background: 'radial-gradient(circle at 35% 35%, #fff8e1, #fde68a)',
              boxShadow: '0 0 20px 4px rgba(253,230,138,0.15)',
              opacity: 0.6,
            }} />

          <div className="relative z-10 px-5">
            {/* Tight urgent headline */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">31 campgrounds · Live availability</span>
            </div>
            <h1 className="font-display font-black text-white leading-[1.0] mb-2"
              style={{ fontSize: '2.1rem', letterSpacing: '-0.02em' }}>
              Find a site,<br />
              <span className="text-amber-400">book tonight.</span>
            </h1>
            <p className="text-stone-500 text-sm mb-5">Search federal parks, private camps, RV resorts.</p>

            {/* Search front and center */}
            <HomeSearch />
            <a href="/alerts" className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.15)' }}>
              🔔 Get notified when sold-out parks open up — free
            </a>
          </div>
        </div>

        {/* Quick-action buttons — thumb-friendly */}
        <div className="px-4 py-4" style={{ background: '#0b1610' }}>
          <div className="grid grid-cols-3 gap-2">
            {[
              { emoji: '📍', label: 'Near Me', href: '/search?near=true' },
              { emoji: '🔥', label: 'Available Now', href: '/search?available=true' },
              { emoji: '🐾', label: 'Pet Friendly', href: '/search?siteType=pet' },
            ].map(a => (
              <Link key={a.label} href={a.href}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-xl">{a.emoji}</span>
                <span className="text-[11px] font-semibold text-stone-300">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Live alerts strip — social proof + urgency */}
        <div className="px-4 pt-5 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Live from campers</span>
            </div>
            <Link href="/community" className="text-[11px] text-amber-400 font-semibold">See all →</Link>
          </div>
          <div className="space-y-2">
            {ALERTS.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-base flex-shrink-0">{a.type === 'warn' ? '⚠️' : '✅'}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-stone-600">{a.camp} · {a.time}</div>
                  <div className="text-xs text-stone-300 font-medium leading-snug truncate">{a.msg}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile campground scroll */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white">Top campgrounds</span>
            <Link href="/search" className="text-[11px] text-amber-400 font-semibold">View all →</Link>
          </div>
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-3 pb-2 snap-x snap-mandatory" style={{ width: 'max-content' }}>
              {FEATURED.map((c, i) => <CampCard key={c.slug} camp={c} priority={i === 0} />)}
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="px-4 pb-8 pt-2">
          <Link href="/auth/signup"
            className="block text-center font-bold text-stone-950 bg-amber-400 py-3.5 rounded-2xl text-sm">
            Join free — get campsite alerts
          </Link>
          <p className="text-center text-[11px] text-stone-600 mt-2">No spam. Only sites you care about.</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BELOW FOLD — Shared (desktop gets full version,
          mobile gets lighter version via responsive classes)
      ═══════════════════════════════════════════════ */}

      {/* STATS — desktop only, mobile already has inline context */}
      <section className="hidden sm:block bg-[#0e1a13] py-14 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-4 divide-x divide-stone-800">
          {[
            { n: '31', label: 'Campgrounds' },
            { n: '13', label: 'States' },
            { n: '100+', label: 'Verified reviews' },
            { n: '0', label: 'Hidden fees' },
          ].map(s => (
            <div key={s.label} className="text-center px-6">
              <div className="font-display font-bold text-amber-400 mb-1" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{s.n}</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY — desktop: 3 col cards. Mobile: hidden (mobile hero already communicates utility) */}
      <section className="hidden sm:block py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3">Why CamperWatch</p>
            <h2 className="font-display font-bold text-white leading-tight max-w-lg"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)' }}>
              What Recreation.gov{' '}
              <span className="text-stone-500 font-normal italic">doesn't tell you.</span>
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                n: '01',
                title: 'Every campground. One search.',
                desc: 'Federal parks, private campgrounds, RV resorts. Stop bouncing between apps — search them all and get routed to the right booking system in one tap.',
              },
              {
                n: '02',
                title: 'A community, not a directory.',
                desc: 'Real-time alerts from campers who were there last night. The "is site 14 shaded?" question answered by someone at the campground right now.',
              },
              {
                n: '03',
                title: 'Better deal for owners.',
                desc: 'Hipcamp takes 12.5%. We take 5%. Owners keep their guest relationship, manage from their phone, no tech required. List in 5 minutes.',
              },
            ].map(w => (
              <div key={w.n} className="p-6 rounded-2xl"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(14,26,19,0.6)' }}>
                <div className="text-[10px] uppercase tracking-widest text-stone-700 font-semibold mb-3">{w.n}</div>
                <h3 className="font-display text-lg font-bold text-white mb-3">{w.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CAMPGROUNDS — desktop grid */}
      <section className="hidden sm:block py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1.5">Featured</p>
              <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.25rem)' }}>Top campgrounds</h2>
            </div>
            <Link href="/search" className="text-sm text-stone-400 hover:text-amber-400 transition-colors font-medium">View all 31 →</Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {FEATURED.map((c, i) => <CampCard key={c.slug} camp={c} priority={i === 0} />)}
          </div>
        </div>
      </section>

      {/* INTEL CALLOUT — desktop only */}
      <section className="hidden sm:block py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #1a3d20 0%, #0f2d1a 50%, #0a1a22 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.12), transparent 70%)', transform: 'translate(30%, -30%)' }} aria-hidden />
            <div className="relative p-12 lg:p-14 grid grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3">Site Intelligence</p>
                <h3 className="font-display font-bold text-white mb-4 leading-tight"
                  style={{ fontSize: 'clamp(1.3rem, 3vw, 2.25rem)' }}>
                  "Site #D141 at Moraine Park.{' '}
                  <span className="text-stone-300 font-normal italic">Here's exactly why."</span>
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-7">
                  Every campground has best sites, worst sites, loop personalities, and booking traps. We surface all of it.
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
                  <div key={item.site} className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="font-display font-bold text-amber-400 flex-shrink-0 text-xl w-12">{item.site}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-stone-500 mb-0.5">{item.label}</div>
                      <div className="text-sm text-white font-medium leading-snug">{item.detail}</div>
                    </div>
                    <div className="text-[10px] text-stone-500 flex-shrink-0">{item.tag}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — desktop version */}
      <section className="hidden sm:block py-28 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-6xl mb-5" aria-hidden>🏕️</div>
          <h2 className="font-display font-bold text-white mb-4 leading-tight"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)' }}>
            Your next site is waiting.
          </h2>
          <p className="text-stone-400 mb-8">31 campgrounds. 13 states. Zion to Glacier. Yosemite to Grand Canyon.</p>
          <Link href="/search"
            className="inline-flex items-center gap-2 font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 px-8 py-4 rounded-full transition-colors"
            style={{ boxShadow: '0 8px 32px rgba(251,191,36,0.25)' }}>
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
