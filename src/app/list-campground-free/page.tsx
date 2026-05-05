import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { CheckCircle, ArrowRight, Clock, Users, BarChart3, Calendar, Shield, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'List Your Campground Online Free | CamperWatch',
  description: 'List your campground on CamperWatch for free. No setup fee, no monthly cost. We charge 5% only when we send you a booking. Takes 10 minutes to go live.',
  alternates: { canonical: 'https://camperwatch.org/list-campground-free' },
  openGraph: {
    title: 'List Your Campground Free — Go Live Today | CamperWatch',
    description: 'No monthly fee. No setup cost. 5% only on bookings we send. 10 minutes to go live.',
    images: [{ url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const steps = [
  { n: '01', title: 'Create your listing', body: 'Add your campground name, location, photos, amenities, and a description. Our AI can help fill in the details.', time: '~5 min' },
  { n: '02', title: 'Add your sites and pricing', body: 'Create individual bookable sites with per-night pricing. Set seasonal rules and block dates you\'re unavailable.', time: '~3 min' },
  { n: '03', title: 'Connect Stripe for payouts', body: 'Link your bank account via Stripe. Takes 2 minutes. You\'ll receive payouts within 2 business days of each booking.', time: '~2 min' },
  { n: '04', title: 'Go live', body: 'Your campground appears on CamperWatch immediately and in our national park overflow results when nearby parks sell out.', time: 'Instant' },
]

const included = [
  { icon: <Calendar size={18} />, title: 'Visual availability calendar', body: 'Block dates, set pricing, show live availability to campers.' },
  { icon: <Users size={18} />, title: 'Guest data — yours forever', body: 'Name, email, phone with every booking. Repeat guests can book direct after year 1.' },
  { icon: <BarChart3 size={18} />, title: 'Booking dashboard', body: 'See upcoming stays, revenue, and occupancy at a glance.' },
  { icon: <Zap size={18} />, title: 'iCal two-way sync', body: 'Import your Hipcamp or Airbnb calendar. Export your CamperWatch bookings. No double bookings.' },
  { icon: <Shield size={18} />, title: 'Stripe-powered payments', body: 'Secure payment processing. Payouts to your bank in 2 business days.' },
  { icon: <Clock size={18} />, title: 'National park overflow traffic', body: 'When Yosemite, Zion, and Glacier sell out, your campground appears as the alternative.' },
]

const faqs = [
  {
    q: 'Is it really free to list my campground on CamperWatch?',
    a: 'Yes. There is no setup fee, no monthly fee, and no contract. CamperWatch charges 5% only when we send you a booking that completes. If you get zero bookings from CamperWatch in a month, you pay zero.',
  },
  {
    q: 'How does CamperWatch get campers to find my listing?',
    a: 'CamperWatch indexes federal campground availability from Recreation.gov. When Yosemite, Zion, Grand Canyon, or other national parks sell out for a given date, CamperWatch shows nearby private campgrounds — including yours — as alternatives. This is traffic you cannot buy through ads.',
  },
  {
    q: 'Can I list my campground on CamperWatch and Hipcamp at the same time?',
    a: 'Yes. CamperWatch imports your Hipcamp iCal feed to prevent double bookings, and exports your CamperWatch bookings back to Hipcamp. You can run both simultaneously.',
  },
  {
    q: 'What information do I get about each booking?',
    a: 'Every CamperWatch booking gives you the guest\'s full name, email address, and phone number. This contact information is yours permanently — repeat guests can book directly with you after their first stay.',
  },
  {
    q: 'How quickly can I get my campground listed?',
    a: 'Most campground owners complete the full listing — photos, sites, pricing, and Stripe connection — in under 10 minutes. Your listing goes live on CamperWatch immediately.',
  },
]

export default function ListCampgroundFree() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <NavBar />

      <section className="bg-[#0b1510] pt-24 pb-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700/60
                          rounded-full px-4 py-1.5 text-green-300 text-xs font-semibold
                          tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Free campground listing
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
            List your campground online.<br />
            <span className="text-green-400">Free. 10 minutes. Live today.</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            No setup fee. No monthly cost. CamperWatch charges{' '}
            <strong className="text-white">5% only on bookings we actually send you.</strong>{' '}
            National park overflow traffic finds your campground when the big parks sell out.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link href="/owner/onboard"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400
                         text-white font-bold px-8 py-4 rounded-2xl transition-all text-sm shadow-lg shadow-green-900/40">
              List your campground free <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            {['No credit card required', 'No monthly fee', '5% only on bookings we send', 'Cancel any time'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                <CheckCircle size={11} className="text-green-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3">Setup process</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              4 steps to your first booking
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map(({ n, title, body, time }) => (
              <div key={n} className="bg-gray-50 rounded-3xl p-7 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-green-200 font-mono">{n}</span>
                  <span className="text-xs text-green-600 font-semibold bg-green-50 border border-green-100 px-2 py-1 rounded-full">{time}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3">What&apos;s included</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to take bookings online
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {included.map(({ icon, title, body }) => (
              <div key={title} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
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

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-14">
            Common questions about listing for free
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
            Ready to take your first online booking?
          </h2>
          <p className="text-gray-400 mb-10">Free to list. 5% only when we send you a booking. Live in 10 minutes.</p>
          <Link href="/owner/onboard"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white
                       font-bold px-10 py-4 rounded-2xl transition-colors text-base shadow-lg shadow-green-900/40">
            List your campground free <ArrowRight size={18} />
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
