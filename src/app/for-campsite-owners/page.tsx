import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import {
  DollarSign, Users, BarChart3, Calendar, CheckCircle,
  ArrowRight, Phone, Star, Shield, Zap, TrendingUp
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'List Your Campground Free | CamperWatch for Owners',
  description: 'List your campground on CamperWatch free. Campers find you when federal parks are full. You keep your guests, your data, and 95% of every booking. No monthly fees.',
  alternates: { canonical: 'https://camperwatch.org/for-campsite-owners' },
  openGraph: {
    title: 'List Your Campground Free | CamperWatch',
    description: 'No monthly fee. No double-charging your guests. 5% only when we send you a booking.',
  },
}

const HIPCAMP_PCT = 12.5
const CW_PCT = 5

function FeeComparison() {
  const monthly = 3000
  const hipcampFee = monthly * (HIPCAMP_PCT / 100)
  const cwFee = monthly * (CW_PCT / 100)
  const saving = hipcampFee - cwFee
  const annualSaving = saving * 12

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-widest">
        <div className="p-4 bg-gray-50 text-gray-400 flex items-end">On $3,000/mo bookings</div>
        <div className="p-4 bg-red-50 text-red-600 text-center">Hipcamp</div>
        <div className="p-4 bg-green-50 text-green-700 text-center">CamperWatch</div>
      </div>

      {[
        { label: 'Monthly fee', hipcamp: '$0', cw: '$0', hipcampSub: null, cwSub: null },
        { label: 'Commission rate', hipcamp: '10–12.5%', cw: '5%', hipcampSub: 'per booking', cwSub: 'per booking' },
        { label: 'Guest service fee', hipcamp: 'Yes — guests pay extra', cw: 'None', hipcampSub: 'makes your site look expensive', cwSub: 'guests pay exactly your price' },
        { label: 'You keep (monthly)', hipcamp: `$${(monthly - hipcampFee).toLocaleString()}`, cw: `$${(monthly - cwFee).toLocaleString()}`, hipcampSub: `after ${HIPCAMP_PCT}% commission`, cwSub: `after 5% commission` },
        { label: 'You own guest data', hipcamp: 'No', cw: 'Yes', hipcampSub: 'Hipcamp owns the relationship', cwSub: 'name, email, phone — yours' },
        { label: 'Repeat bookings', hipcamp: 'Pay again', cw: 'Free after year 1', hipcampSub: 'Hipcamp takes a cut every time', cwSub: 'repeat guests book direct' },
      ].map((row, i) => (
        <div key={i} className={`grid grid-cols-3 border-t border-gray-100 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
          <div className="p-4 text-sm text-gray-600 font-medium flex items-center">{row.label}</div>
          <div className="p-4 text-center border-l border-gray-100">
            <div className={`text-sm font-bold ${row.hipcamp === 'No' || row.hipcamp.includes('Yes') ? 'text-red-500' : 'text-red-700'}`}>{row.hipcamp}</div>
            {row.hipcampSub && <div className="text-[10px] text-red-400 mt-0.5">{row.hipcampSub}</div>}
          </div>
          <div className="p-4 text-center border-l border-gray-100">
            <div className={`text-sm font-bold ${row.cw === 'None' || row.cw === 'Yes' || row.cw.includes('Free') ? 'text-green-600' : 'text-green-700'}`}>{row.cw}</div>
            {row.cwSub && <div className="text-[10px] text-green-500 mt-0.5">{row.cwSub}</div>}
          </div>
        </div>
      ))}

      {/* Saving callout */}
      <div className="grid grid-cols-3 border-t-2 border-green-200 bg-green-50">
        <div className="p-4 text-sm font-bold text-gray-700 flex items-center">Annual saving</div>
        <div className="p-4 text-center border-l border-green-200">
          <div className="text-sm font-bold text-red-600">${(hipcampFee * 12).toLocaleString()} paid to Hipcamp</div>
        </div>
        <div className="p-4 text-center border-l border-green-200">
          <div className="text-sm font-bold text-green-700">Save ~${annualSaving.toLocaleString()}/yr vs Hipcamp</div>
        </div>
      </div>
    </div>
  )
}

export default function ForCampsiteOwners() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#0e1a13] text-white overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #166534 0%, transparent 50%), radial-gradient(circle at 80% 20%, #14532d 0%, transparent 50%)' }} />

        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-green-900/60 border border-green-700 rounded-full px-4 py-1.5 text-green-300 text-xs font-semibold tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Now accepting campground listings — Western US
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Campers find you<br />
              <span className="text-green-400">when the parks are full.</span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl">
              List your campground on CamperWatch free. When Yosemite, Zion, or Tahoe are sold out,
              your sites appear as the alternative. You own your guests. We take 5% only when
              we send you a booking. No monthly fee. Ever.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/owner/onboard"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-2xl transition-colors text-base"
              >
                List your campground free <ArrowRight size={18} />
              </Link>
              <a
                href="tel:+17753452268"
                className="inline-flex items-center justify-center gap-2 border border-green-700 hover:border-green-500 text-green-300 hover:text-green-200 font-semibold px-8 py-4 rounded-2xl transition-colors text-base"
              >
                <Phone size={16} /> Talk to us first
              </a>
            </div>

            <div className="flex flex-wrap gap-6 mt-10 text-sm text-gray-400">
              {['No setup fee', 'No monthly contract', '5% only on bookings we send you', 'You own your guest data'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-500" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW CAMPERS FIND YOU ──────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How you get discovered
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Federal parks drive the traffic. Your campground captures the overflow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              icon: <Users size={22} className="text-green-600" />,
              title: 'Camper searches for Yosemite',
              body: 'They land on CamperWatch looking for availability at Upper Pines or Mather. We show them live Recreation.gov data.',
            },
            {
              step: '02',
              icon: <TrendingUp size={22} className="text-green-600" />,
              title: 'Federal park is sold out',
              body: 'We show them your campground as a nearby alternative with real availability. "Sold out? Here are 3 private campgrounds open this weekend within 30 miles."',
            },
            {
              step: '03',
              icon: <DollarSign size={22} className="text-green-600" />,
              title: 'They book directly with you',
              body: 'The booking happens on CamperWatch. You get the guest\'s name, email, and phone. We take 5%. You keep the rest and own the relationship.',
            },
          ].map(({ step, icon, title, body }) => (
            <div key={step} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="absolute top-4 right-4 text-5xl font-bold text-gray-100 select-none leading-none">{step}</div>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                {icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEE COMPARISON ───────────────────────────────── */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The honest fee comparison
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Based on $3,000/month in bookings. Verified from Hipcamp's own help pages (10–12.5% host commission, plus a separate guest service fee).
            </p>
          </div>
          <FeeComparison />
          <p className="text-center text-xs text-gray-400 mt-4">
            * Hipcamp commission verified at hipcamp.com/host. CamperWatch 5% is our current rate with no lock-in — we'll always tell you before we change it.
          </p>
        </div>
      </section>

      {/* ── WHAT YOU GET ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What's included, free
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: <Calendar size={20} />, title: 'Availability calendar', body: 'Visual calendar to block dates, set pricing, and show live availability to campers.' },
            { icon: <Users size={20} />, title: 'Your guests, your data', body: 'Every booking gives you the guest\'s name, email, and phone. Book direct next time — no commission.' },
            { icon: <BarChart3 size={20} />, title: 'Booking dashboard', body: 'See upcoming stays, revenue, occupancy, and guest contact info in one place.' },
            { icon: <Star size={20} />, title: 'Curated listing page', body: 'A real campground page with photos, pro tips, and insider intel — not a bare directory listing.' },
            { icon: <Shield size={20} />, title: 'No double-charging guests', body: 'Guests pay exactly what you charge. No hidden service fee added on top. Your price is the price.' },
            { icon: <Zap size={20} />, title: 'Overflow traffic from federal parks', body: 'Shown as an alternative when nearby national/state parks are sold out. Traffic you can\'t buy.' },
          ].map(({ icon, title, body }) => (
            <div key={title} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center shrink-0 text-green-700">
                {icon}
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO THIS IS FOR ──────────────────────────────── */}
      <section className="bg-[#0e1a13] text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10 text-center">
            Who CamperWatch is built for
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { yes: true, label: 'Independent RV parks and campgrounds in the Western US' },
              { yes: true, label: 'Owners currently on Hipcamp who want to reduce commission costs' },
              { yes: true, label: 'Campgrounds taking phone reservations who want an online booking page' },
              { yes: true, label: 'Multi-site owners who want one dashboard for all their properties' },
              { yes: false, label: 'Corporate chains or franchise campgrounds (KOA, Thousand Trails)' },
              { yes: false, label: 'Owners who want to hide availability from direct camper searches' },
            ].map(({ yes, label }) => (
              <div key={label} className={`flex items-start gap-3 p-4 rounded-xl border ${yes ? 'border-green-800 bg-green-900/30' : 'border-gray-700 bg-gray-800/30'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${yes ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'}`}>
                  {yes ? '✓' : '✗'}
                </div>
                <span className={`text-sm ${yes ? 'text-green-100' : 'text-gray-400'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Ready to list?
        </h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Takes about 10 minutes. No credit card. Your campground can be live and discoverable
          by campers today.
        </p>

        <Link
          href="/owner/onboard"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-2xl transition-colors text-base"
        >
          List your campground free <ArrowRight size={18} />
        </Link>

        <div className="mt-6 text-sm text-gray-400">
          Questions? Call us:{' '}
          <a href="mailto:hello@camperwatch.org" className="text-green-600 hover:underline">
            hello@camperwatch.org
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-xs text-gray-400">
          {[
            'No setup fee',
            'No monthly contract',
            '5% only on bookings we send',
            'Cancel any time',
            'You keep guest data',
          ].map(t => (
            <span key={t} className="flex items-center gap-1">
              <CheckCircle size={12} className="text-green-500" /> {t}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
