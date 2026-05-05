import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { CheckCircle, XCircle, ArrowRight, DollarSign, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hipcamp Alternative for Campground Owners | CamperWatch',
  description: 'Tired of paying 10–12.5% commission to Hipcamp on every booking? CamperWatch charges 5% only when we send you a booking. No monthly fee. You keep your guest data.',
  alternates: { canonical: 'https://camperwatch.org/hipcamp-alternative' },
  openGraph: {
    title: 'Hipcamp Alternative for Campground Owners | CamperWatch',
    description: 'Pay 5% only on bookings we send — not 12.5% on every booking. Keep your guest data. No monthly fee.',
    images: [{ url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const monthly = 3000
const hipcampRate = 0.125
const cwRate = 0.05
const hipcampFee = monthly * hipcampRate
const cwFee = monthly * cwRate
const annualSaving = Math.round((hipcampFee - cwFee) * 12)

const comparisons = [
  {
    topic: 'Commission rate',
    hipcamp: '10–12.5% per booking',
    cw: '5% per booking',
    hipcampBad: true,
  },
  {
    topic: 'Monthly software fee',
    hipcamp: '$0/mo but you pay per booking',
    cw: '$0/mo — always',
    hipcampBad: false,
  },
  {
    topic: 'Guest service fee (on top of your price)',
    hipcamp: 'Yes — makes you look expensive',
    cw: 'None — guests pay your price exactly',
    hipcampBad: true,
  },
  {
    topic: 'You own guest email + phone',
    hipcamp: 'No — Hipcamp owns the relationship',
    cw: 'Yes — every booking gives you full contact info',
    hipcampBad: true,
  },
  {
    topic: 'Repeat guests book direct (no commission)',
    hipcamp: 'No — 12.5% every single time',
    cw: 'Yes — after year 1, repeat guests can book direct',
    hipcampBad: true,
  },
  {
    topic: 'Cancel your listing',
    hipcamp: 'Lose all your reviews and guest history',
    cw: 'Your data stays yours — export any time',
    hipcampBad: true,
  },
]

const faqs = [
  {
    q: 'How is CamperWatch different from Hipcamp for owners?',
    a: 'Hipcamp charges 10–12.5% commission on every booking and adds a separate guest service fee on top. CamperWatch charges 5% only on bookings we actually send you. We never add fees on top of your price, and every booking gives you the guest\'s name, email, and phone number — so repeat guests can book direct with zero commission.',
  },
  {
    q: 'Do I have to stop using Hipcamp to join CamperWatch?',
    a: 'No. You can run both at the same time. CamperWatch\'s iCal sync connects to your Hipcamp calendar so there are no double bookings. Over time, as repeat guests book direct through CamperWatch, your Hipcamp commission cost naturally decreases.',
  },
  {
    q: 'What does "5% only on bookings you send" mean?',
    a: 'We only earn when we earn you something. If a camper finds your listing on CamperWatch and books, we take 5% of that booking total. If you get zero bookings from us in a month, you pay zero. There is no monthly retainer, no setup fee, no minimum.',
  },
  {
    q: 'How long does setup take?',
    a: 'About 10 minutes to get your campground listed. Add your sites, set your pricing, connect your Stripe account for payouts. Your listing goes live same day.',
  },
  {
    q: 'Is CamperWatch available outside the Western US?',
    a: 'We started in the Western US and have expanded nationally. Owners in all 50 states can list — we have campgrounds in Montana, Virginia, Maine, Texas, and more.',
  },
]

export default function HipcampAlternative() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <NavBar />

      {/* HERO */}
      <section className="bg-[#0b1510] pt-24 pb-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700/60
                          rounded-full px-4 py-1.5 text-green-300 text-xs font-semibold
                          tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Hipcamp alternative for owners
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
            Stop paying Hipcamp{' '}
            <span className="text-green-400">12.5% per booking.</span>
          </h1>

          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            CamperWatch charges <strong className="text-white">5% only on bookings we send you.</strong>{' '}
            No monthly fee. No guest service fee on top of your price.
            You keep every guest&apos;s name, email, and phone number.
          </p>

          {/* Math callout */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white/5 border border-white/10
                          rounded-3xl px-8 py-6 mb-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">${hipcampFee.toFixed(0)}/mo</div>
              <div className="text-xs text-gray-400 mt-1">paid to Hipcamp on $3k/mo bookings</div>
            </div>
            <div className="text-gray-500 text-2xl font-light">→</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">${cwFee.toFixed(0)}/mo</div>
              <div className="text-xs text-gray-400 mt-1">with CamperWatch at 5%</div>
            </div>
            <div className="text-gray-500 text-2xl font-light">→</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">${annualSaving.toLocaleString()}/yr</div>
              <div className="text-xs text-gray-400 mt-1">saved annually</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/owner/onboard"
              className="inline-flex items-center justify-center gap-2
                         bg-green-500 hover:bg-green-400 text-white
                         font-bold px-8 py-4 rounded-2xl transition-all text-sm
                         shadow-lg shadow-green-900/40"
            >
              List your campground free <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+17753452268"
              className="inline-flex items-center justify-center gap-2
                         border border-green-800 hover:border-green-600
                         text-green-300 font-semibold px-8 py-4 rounded-2xl text-sm transition-all"
            >
              <Phone size={15} /> Talk to us first
            </a>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3">Side by side</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              Hipcamp vs CamperWatch — for owners
            </h2>
          </div>

          <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            {/* Header */}
            <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-widest border-b border-gray-100">
              <div className="p-5 bg-gray-50 text-gray-400"></div>
              <div className="p-5 bg-red-50 text-red-500 text-center border-l border-gray-100">Hipcamp</div>
              <div className="p-5 bg-green-50 text-green-700 text-center border-l border-gray-100">CamperWatch</div>
            </div>

            {comparisons.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                <div className="p-5 text-sm text-gray-700 font-medium flex items-start">{row.topic}</div>
                <div className="p-5 border-l border-gray-100 text-center">
                  <div className={`flex items-center justify-center gap-1.5 text-sm font-semibold ${row.hipcampBad ? 'text-red-500' : 'text-gray-600'}`}>
                    {row.hipcampBad && <XCircle size={14} className="shrink-0" />}
                    <span>{row.hipcamp}</span>
                  </div>
                </div>
                <div className="p-5 border-l border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-green-700">
                    <CheckCircle size={14} className="shrink-0" />
                    <span>{row.cw}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom save row */}
            <div className="grid grid-cols-3 border-t-2 border-green-200 bg-green-50">
              <div className="p-5 text-sm font-bold text-gray-800 flex items-center gap-2">
                <DollarSign size={15} className="text-green-600" /> Annual saving on $3k/mo
              </div>
              <div className="p-5 border-l border-green-100 text-center">
                <div className="text-sm font-bold text-red-500">${(hipcampFee * 12).toLocaleString()} paid to Hipcamp</div>
              </div>
              <div className="p-5 border-l border-green-100 text-center">
                <div className="text-sm font-bold text-green-700">Save ~${annualSaving.toLocaleString()}/yr</div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            * Hipcamp host commission rate sourced from hipcamp.com/host help pages (10–12.5% + separate guest service fee billed to campers).
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              List in 10 minutes. Pay nothing until we send you a booking.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'List your campground',
                body: 'Add your sites, photos, pricing, and availability. Takes about 10 minutes. No credit card required.',
              },
              {
                step: '02',
                title: 'Campers find you',
                body: 'When nearby national parks sell out, your campground appears as the alternative. Traffic you can\'t buy.',
              },
              {
                step: '03',
                title: 'You keep 95% + all guest data',
                body: 'We take 5%. You get the guest\'s name, email, phone. Repeat guests book direct — forever commission-free.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <div className="text-4xl font-bold text-green-200 mb-4 font-mono">{step}</div>
                <h3 className="font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — structured for Google rich results */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              Questions from owners switching from Hipcamp
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 text-base">{q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b1510] py-24 sm:py-32">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            Ready to cut your booking commission in half?
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-10 leading-relaxed">
            List free. Pay 5% only when we send you a booking.
            Your campground can be live today.
          </p>
          <Link
            href="/owner/onboard"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400
                       text-white font-bold px-10 py-4 rounded-2xl transition-colors text-base
                       shadow-lg shadow-green-900/40"
          >
            List your campground free <ArrowRight size={18} />
          </Link>
          <div className="flex flex-wrap justify-center gap-5 mt-8">
            {['No setup fee', 'No monthly fee', '5% only on bookings we send', 'Keep all guest data', 'Cancel any time'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle size={11} className="text-green-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ JSON-LD for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }),
        }}
      />
    </div>
  )
}
