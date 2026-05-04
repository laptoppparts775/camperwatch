import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import {
  DollarSign, Users, BarChart3, Calendar, CheckCircle,
  ArrowRight, Phone, Shield, Zap, TrendingUp, Star
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'List Your Campground Free | CamperWatch for Owners',
  description: 'Campers find you when Yosemite, Zion and Tahoe are full. List free, keep your guests, pay 5% only on bookings we send. No monthly fee.',
  alternates: { canonical: 'https://camperwatch.org/for-campsite-owners' },
  openGraph: {
    title: 'List Your Campground Free | CamperWatch',
    description: 'No monthly fee. No double-charging your guests. 5% only when we send you a booking.',
    images: [{ url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80', width: 1200, height: 630 }],
  },
}

/* ── Verified Unsplash photo IDs (all return 200) ── */
const PHOTOS = {
  hero:      'photo-1533873984035-25970ab07461', // forest road at dusk
  heroMob:   'photo-1445308394109-4ec2920981b1', // campfire dusk portrait
  split1:    'photo-1504280390367-361c6d9f38f4', // RV sites pines golden hour
  split2:    'photo-1559521783-1d1599583485',     // tent site mountain view
  split3:    'photo-1506905925346-21bda4d32df4',  // mountain lake reflection
  card1:     'photo-1523987355523-c7b5b0dd90a7',  // aerial forest campsite
  card2:     'photo-1469474968028-56623f02e42e',  // campground at sunrise
  card3:     'photo-1464822759023-fed622ff2c3b',  // mountain tent at night
}

function u(id: string, w = 1200, q = 80) {
  return `https://images.unsplash.com/${id}?w=${w}&q=${q}&fit=crop&auto=format`
}

const monthly = 3000
const hipcampPct = 12.5
const cwPct = 5
const hipcampFee = monthly * hipcampPct / 100
const cwFee = monthly * cwPct / 100
const annualSaving = Math.round((hipcampFee - cwFee) * 12)

export default function ForCampsiteOwners() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <NavBar />

      {/* ══════════════════════════════════════════════════════
          HERO — full-bleed image, desktop split / mobile stack
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col lg:flex-row">

        {/* LEFT: copy */}
        <div className="relative z-10 flex flex-col justify-center
                        px-6 pt-16 pb-10 sm:px-10
                        lg:w-[52%] lg:px-16 lg:py-24 xl:px-24
                        bg-[#0b1510]">

          {/* Mobile: show image behind the text via absolute */}
          <div className="absolute inset-0 lg:hidden">
            <Image
              src={u(PHOTOS.heroMob, 800)}
              alt="Campfire at dusk"
              fill
              className="object-cover object-center opacity-25"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b1510]/80 via-[#0b1510]/60 to-[#0b1510]/90" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700/60
                            rounded-full px-4 py-1.5 text-green-300 text-xs font-semibold
                            tracking-widest uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Now listing — Western US
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]
                           font-bold leading-[1.1] text-white mb-6">
              Campers find you<br />
              <span className="text-green-400">when the parks<br className="hidden sm:block" /> are full.</span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              When Yosemite, Zion, and Tahoe sell out, your campground appears as the
              alternative. List free. Keep your guests. Pay <strong className="text-white">5% only when
              we send you a booking.</strong> No monthly fee. Ever.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { n: '5%', label: 'Commission only on bookings we send' },
                { n: '$0', label: 'Monthly fee — always' },
                { n: '100%', label: 'Guest data stays yours' },
              ].map(({ n, label }) => (
                <div key={n}>
                  <div className="text-2xl font-bold text-green-400">{n}</div>
                  <div className="text-xs text-gray-400 mt-0.5 max-w-[120px]">{label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/owner/onboard"
                className="inline-flex items-center justify-center gap-2
                           bg-green-500 hover:bg-green-400 text-white
                           font-bold px-7 py-4 rounded-2xl transition-all
                           text-sm shadow-lg shadow-green-900/40 hover:shadow-green-500/30"
              >
                List your campground free <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+17753452268"
                className="inline-flex items-center justify-center gap-2
                           border border-green-800 hover:border-green-600
                           text-green-300 hover:text-green-200
                           font-semibold px-7 py-4 rounded-2xl transition-all text-sm"
              >
                <Phone size={15} /> Talk to us first
              </a>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-8">
              {['No setup fee', 'No contract', '10-min setup', 'Cancel any time'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle size={11} className="text-green-600" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: hero image — desktop only */}
        <div className="hidden lg:block lg:w-[48%] relative">
          <Image
            src={u(PHOTOS.hero, 1400)}
            alt="Forest campground at golden hour"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Left-to-right gradient blending with the dark panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1510]/40 via-transparent to-transparent" />

          {/* Floating stat card */}
          <div className="absolute bottom-10 left-8 bg-white/10 backdrop-blur-md border border-white/20
                          rounded-2xl p-5 text-white max-w-[220px]">
            <div className="text-3xl font-bold text-green-400 mb-1">
              ${annualSaving.toLocaleString()}
            </div>
            <div className="text-xs text-gray-200 leading-relaxed">
              Typical annual saving vs Hipcamp on $3k/mo in bookings
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW YOU GET DISCOVERED — image + text split cards
      ══════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3">The model</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              How campers find you
            </h2>
          </div>

          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
            {[
              {
                img: PHOTOS.split1,
                step: '01',
                title: 'Camper searches for Yosemite',
                body: 'Millions search for national park availability. They land on CamperWatch for real-time Recreation.gov data.',
                icon: <Users size={18} />,
              },
              {
                img: PHOTOS.split2,
                step: '02',
                title: 'Federal park is sold out',
                body: '"Sold out? Here are private campgrounds open this weekend within 30 miles." Your listing appears right there.',
                icon: <TrendingUp size={18} />,
              },
              {
                img: PHOTOS.split3,
                step: '03',
                title: 'They book directly with you',
                body: 'Booking happens on CamperWatch. You get their name, email, phone. We take 5%. You own the relationship forever.',
                icon: <DollarSign size={18} />,
              },
            ].map(({ img, step, title, body, icon }) => (
              <div key={step} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="relative h-48 sm:h-52">
                  <Image src={u(img, 600)} alt={title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="w-7 h-7 bg-green-500 rounded-xl flex items-center justify-center text-white">
                      {icon}
                    </div>
                    <span className="text-white/60 text-xs font-mono font-bold">{step}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEE COMPARISON — high contrast, mobile-friendly
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3">The math</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Honest fee comparison
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Based on $3,000/mo in bookings. Hipcamp commission verified from their own help page.
            </p>
          </div>

          {/* Mobile: stacked cards */}
          <div className="lg:hidden space-y-3">
            {[
              { label: 'Commission rate', hipcamp: '10–12.5% per booking', cw: '5% per booking' },
              { label: 'Guest service fee', hipcamp: 'Yes — added on top', cw: 'None. Ever.' },
              { label: 'Monthly fee', hipcamp: '$0', cw: '$0' },
              { label: 'You keep (monthly)', hipcamp: `$${(monthly - hipcampFee).toFixed(0)}`, cw: `$${(monthly - cwFee).toFixed(0)}` },
              { label: 'You own guest data', hipcamp: 'No', cw: 'Yes' },
              { label: 'Annual difference', hipcamp: `-$${(hipcampFee * 12).toLocaleString()}`, cw: `Save $${annualSaving.toLocaleString()}/yr` },
            ].map(({ label, hipcamp, cw }, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 p-4 bg-gray-50 rounded-2xl text-sm">
                <span className="text-gray-600 font-medium text-xs">{label}</span>
                <span className="text-red-500 font-semibold text-xs text-right">{hipcamp}</span>
                <span className="text-green-700 font-bold text-xs text-right">{cw}</span>
              </div>
            ))}
            <div className="flex gap-2 text-xs mt-2">
              <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full">Hipcamp →</span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-bold">CamperWatch →</span>
            </div>
          </div>

          {/* Desktop: full table */}
          <div className="hidden lg:block rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-widest border-b border-gray-100">
              <div className="p-5 bg-gray-50 text-gray-400">On $3,000/mo bookings</div>
              <div className="p-5 bg-red-50 text-red-500 text-center border-l border-gray-100">Hipcamp</div>
              <div className="p-5 bg-green-50 text-green-700 text-center border-l border-gray-100">CamperWatch</div>
            </div>
            {[
              { label: 'Commission rate', h: '10–12.5%', hs: 'per booking', c: '5%', cs: 'per booking' },
              { label: 'Guest service fee', h: 'Yes — added on top', hs: 'makes your site look expensive', c: 'None', cs: 'guests pay your price exactly' },
              { label: 'Monthly fee', h: '$0', hs: null, c: '$0', cs: null },
              { label: 'You keep (monthly)', h: `$${(monthly - hipcampFee).toFixed(0)}`, hs: `after ${hipcampPct}% commission`, c: `$${(monthly - cwFee).toFixed(0)}`, cs: 'after 5% commission' },
              { label: 'You own guest data', h: 'No', hs: 'Hipcamp owns the relationship', c: 'Yes', cs: 'name, email, phone — yours' },
              { label: 'Repeat bookings', h: 'Commission every time', hs: null, c: 'Book direct — free after year 1', cs: null },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 border-t border-gray-100 ${i % 2 ? 'bg-gray-50/40' : ''}`}>
                <div className="p-5 text-sm text-gray-700 font-medium flex items-center">{row.label}</div>
                <div className="p-5 text-center border-l border-gray-100">
                  <div className="text-sm font-bold text-red-500">{row.h}</div>
                  {row.hs && <div className="text-[10px] text-red-300 mt-0.5">{row.hs}</div>}
                </div>
                <div className="p-5 text-center border-l border-gray-100">
                  <div className="text-sm font-bold text-green-700">{row.c}</div>
                  {row.cs && <div className="text-[10px] text-green-500 mt-0.5">{row.cs}</div>}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-3 border-t-2 border-green-200 bg-green-50">
              <div className="p-5 text-sm font-bold text-gray-800">Annual saving</div>
              <div className="p-5 text-center border-l border-green-100">
                <div className="text-sm font-bold text-red-500">${(hipcampFee * 12).toLocaleString()} paid to Hipcamp</div>
              </div>
              <div className="p-5 text-center border-l border-green-100">
                <div className="text-sm font-bold text-green-700">Save ~${annualSaving.toLocaleString()}/yr</div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            * Hipcamp host commission verified at hipcamp.com/host (10–12.5% + separate guest service fee). CamperWatch rate is 5% — no lock-in.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHAT'S INCLUDED — photo card grid
      ══════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3">What you get</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Everything included, free
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Calendar size={20} />, title: 'Availability calendar', body: 'Visual calendar to block dates, set pricing, and show live availability. Works on mobile.' },
              { icon: <Users size={20} />, title: 'Your guests, your data', body: "Every booking: name, email, phone go to you. Repeat guests book direct — no commission year 2." },
              { icon: <BarChart3 size={20} />, title: 'Booking dashboard', body: 'Upcoming stays, revenue, occupancy, guest contact — one clean dashboard.' },
              { icon: <Star size={20} />, title: 'Curated listing page', body: 'Real photos, insider tips, site-level intelligence. Not a bare directory listing.' },
              { icon: <Shield size={20} />, title: 'No hidden guest fees', body: "Guests pay your price. We don't add a service fee on top. Your price is the price." },
              { icon: <Zap size={20} />, title: 'Overflow from national parks', body: 'Shown as an alternative when nearby federal parks sell out. Traffic you cannot buy.' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0 text-green-700 mt-0.5">
                  {icon}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm mb-1.5">{title}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHO IT'S FOR — full-bleed dark section with image
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={u(PHOTOS.card2, 1600)}
            alt="Campground at sunrise"
            fill
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-[#0b1510]/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-5 py-20 sm:py-28">
          <div className="text-center mb-12">
            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">Who this is for</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Built for independent owners
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {[
              { yes: true,  label: 'Independent RV parks and campgrounds — Western US' },
              { yes: true,  label: 'Owners on Hipcamp who want to reduce commission costs' },
              { yes: true,  label: 'Campgrounds taking phone reservations who want online booking' },
              { yes: true,  label: 'Multi-site owners who want one dashboard for everything' },
              { yes: false, label: 'Corporate chains or franchise campgrounds (KOA, Thousand Trails)' },
              { yes: false, label: 'Owners who want to hide availability from camper searches' },
            ].map(({ yes, label }) => (
              <div key={label}
                className={`flex items-start gap-3 p-4 rounded-2xl border
                  ${yes
                    ? 'border-green-800/60 bg-green-900/25'
                    : 'border-gray-700/40 bg-gray-800/20'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold
                  ${yes ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-500'}`}>
                  {yes ? '✓' : '✗'}
                </div>
                <span className={`text-sm ${yes ? 'text-green-100' : 'text-gray-500'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA — clean, confident
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Ready to list?
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mb-10 leading-relaxed">
            Takes 10 minutes. No credit card. Your campground can be live and
            discoverable by campers today.
          </p>

          <Link
            href="/owner/onboard"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700
                       text-white font-bold px-10 py-4 rounded-2xl transition-colors
                       text-base shadow-lg shadow-green-900/20"
          >
            List your campground free <ArrowRight size={18} />
          </Link>

          <div className="mt-6 text-sm text-gray-400">
            Questions?{' '}
            <a href="mailto:hello@camperwatch.org" className="text-green-600 hover:underline">
              hello@camperwatch.org
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-10">
            {['No setup fee', 'No monthly contract', '5% only on bookings we send', 'Cancel any time', 'Keep all guest data'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                <CheckCircle size={11} className="text-green-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
