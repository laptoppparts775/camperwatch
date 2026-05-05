import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { CheckCircle, XCircle, ArrowRight, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Campspot Alternative for Campground Owners | CamperWatch',
  description: 'Campspot charges $99–$299/mo plus transaction fees. CamperWatch charges 5% only on bookings we send — no monthly fee, no setup cost, no contract. Compare side by side.',
  alternates: { canonical: 'https://camperwatch.org/campspot-alternative' },
  openGraph: {
    title: 'Campspot Alternative — No Monthly Fee | CamperWatch',
    description: 'Skip the $99–$299/mo Campspot fee. Pay 5% only when we send you a booking.',
    images: [{ url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const rows = [
  { topic: 'Monthly software fee', campspot: '$99–$299/mo regardless of bookings', cw: '$0/mo — always', bad: true },
  { topic: 'Commission per booking', campspot: 'Monthly fee + transaction fees on top', cw: '5% only on bookings we send', bad: true },
  { topic: 'Setup / onboarding fee', campspot: 'Setup fees may apply', cw: 'Free — live in 10 minutes', bad: true },
  { topic: 'You own guest data', campspot: 'Yes — guest data in your dashboard', cw: 'Yes — name, email, phone every booking', bad: false },
  { topic: 'iCal sync (no double bookings)', campspot: 'Yes — OTA sync available', cw: 'Yes — import from Hipcamp, Airbnb, Campspot', bad: false },
  { topic: 'Camper discovery traffic', campspot: 'Campspot marketplace + your own site', cw: 'CamperWatch + national park overflow traffic', bad: false },
  { topic: 'Cancel / no contract', campspot: 'Annual contracts may apply', cw: 'No contract — cancel any time', bad: true },
]

const faqs = [
  {
    q: 'How does CamperWatch compare to Campspot for small campgrounds?',
    a: 'Campspot is a full property management system priced for established campgrounds doing significant volume — monthly fees start around $99 and scale up. CamperWatch is a better fit for independent campground owners who want online booking without paying a monthly retainer. You pay 5% only on bookings CamperWatch sends you. If you get zero bookings from us in a month, you pay zero.',
  },
  {
    q: 'Can I use both Campspot and CamperWatch at the same time?',
    a: 'Yes. CamperWatch exports a live .ics calendar URL and can import your Campspot iCal feed, so your availability stays in sync and there are no double bookings.',
  },
  {
    q: 'Does CamperWatch have a site map feature like Campspot?',
    a: 'CamperWatch has a visual availability calendar and individual site management. An interactive drag-and-drop site map is on the roadmap. For campgrounds needing advanced PMS features like utility metering or long-term stays, a full PMS platform may be a better fit alongside CamperWatch.',
  },
  {
    q: 'What does 5% commission mean exactly?',
    a: 'When a camper finds your campground on CamperWatch and completes a booking, we take 5% of the booking total. Stripe processes the payment and deposits the remaining 95% to your connected bank account. There is no monthly fee, no setup fee, no minimum volume.',
  },
]

export default function CampspotAlternative() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <NavBar />

      <section className="bg-[#0b1510] pt-24 pb-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700/60
                          rounded-full px-4 py-1.5 text-green-300 text-xs font-semibold
                          tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Campspot alternative
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
            Skip the{' '}
            <span className="text-red-400">$99–$299/mo</span>{' '}
            Campspot fee.
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            CamperWatch charges <strong className="text-white">5% only on bookings we send you.</strong>{' '}
            No monthly fee. No contract. Live in 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/owner/onboard"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400
                         text-white font-bold px-8 py-4 rounded-2xl transition-all text-sm shadow-lg shadow-green-900/40">
              List your campground free <ArrowRight size={16} />
            </Link>
            <a href="tel:+17753452268"
              className="inline-flex items-center justify-center gap-2 border border-green-800
                         hover:border-green-600 text-green-300 font-semibold px-8 py-4 rounded-2xl text-sm transition-all">
              <Phone size={15} /> Talk to us first
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">Campspot vs CamperWatch</h2>
          </div>
          <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-widest border-b border-gray-100">
              <div className="p-5 bg-gray-50 text-gray-400" />
              <div className="p-5 bg-blue-50 text-blue-600 text-center border-l border-gray-100">Campspot</div>
              <div className="p-5 bg-green-50 text-green-700 text-center border-l border-gray-100">CamperWatch</div>
            </div>
            {rows.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                <div className="p-5 text-sm text-gray-700 font-medium">{row.topic}</div>
                <div className="p-5 border-l border-gray-100 text-center">
                  <span className={`text-sm font-semibold ${row.bad ? 'text-red-500' : 'text-gray-600'}`}>
                    {row.bad && <XCircle size={13} className="inline mr-1 -mt-0.5" />}{row.campspot}
                  </span>
                </div>
                <div className="p-5 border-l border-gray-100 text-center">
                  <span className="text-sm font-semibold text-green-700">
                    <CheckCircle size={13} className="inline mr-1 -mt-0.5" />{row.cw}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">
            * Campspot pricing based on publicly available plan information. Actual pricing may vary by plan and campground size.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-14">
            Questions from owners considering the switch
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
            No monthly fee. Pay only when we send you a booking.
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
