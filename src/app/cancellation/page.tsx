import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | CamperWatch',
  description: 'CamperWatch cancellation and refund policy for campers and campground owners. Understand your rights before booking.',
  alternates: { canonical: 'https://camperwatch.org/cancellation' },
  robots: { index: true, follow: true },
}

const TIERS = [
  {
    name: 'Full refund',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    when: 'Cancel 14+ days before check-in',
    detail: '100% of the booking total refunded to your original payment method. Stripe processing fees (2.9% + $0.30) may not be refundable depending on your card issuer.',
  },
  {
    name: '50% refund',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    when: 'Cancel 7–13 days before check-in',
    detail: '50% of the booking total refunded. The remaining 50% is retained by the campground owner to cover lost booking opportunity.',
  },
  {
    name: 'No refund',
    color: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-500',
    when: 'Cancel less than 7 days before check-in',
    detail: 'No refund issued. The campground owner retains the full booking amount. CamperWatch\'s 5% platform fee is also non-refundable.',
  },
]

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <div style={{ background: '#0b1a10' }} className="px-5 py-14">
        <div className="max-w-3xl mx-auto">
          <p className="text-emerald-400/60 text-xs font-medium uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-3xl font-bold text-white mb-3">Cancellation & Refund Policy</h1>
          <p className="text-white/50 text-sm">Last updated: May 6, 2026 · Questions? <a href="mailto:hello@camperwatch.org" className="text-emerald-400 hover:text-emerald-300">hello@camperwatch.org</a></p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-12">

        {/* Default policy tiers */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">Default cancellation policy</h2>
        <p className="text-gray-500 text-sm mb-6">This is the default policy for all CamperWatch bookings unless the individual campground specifies otherwise at time of booking.</p>

        <div className="space-y-3 mb-10">
          {TIERS.map(t => (
            <div key={t.name} className={`rounded-2xl p-5 border ${t.color}`}>
              <div className="flex items-center gap-2.5 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${t.dot}`} />
                <span className="font-bold text-base">{t.name}</span>
                <span className="text-sm font-medium opacity-70 ml-1">— {t.when}</span>
              </div>
              <p className="text-sm leading-relaxed opacity-80 ml-5">{t.detail}</p>
            </div>
          ))}
        </div>

        {/* Owner-specific policies */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Owner-specific policies</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Individual campground owners may set their own cancellation policy, which will be clearly displayed on the campground page and during checkout before you confirm payment. Owner-specific policies override the default policy above.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Always review the cancellation policy shown at checkout before confirming your booking. Once you confirm and pay, you are bound by the policy in effect at time of booking.
          </p>
        </section>

        {/* How to cancel */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">How to cancel a booking</h2>
          <ol className="space-y-3">
            {[
              { step: '1', text: 'Log in to your CamperWatch account at camperwatch.org/auth/login' },
              { step: '2', text: 'Go to your profile and select "My Bookings"' },
              { step: '3', text: 'Find the booking you want to cancel and click "Cancel booking"' },
              { step: '4', text: 'Confirm the cancellation — you\'ll see the refund amount before confirming' },
              { step: '5', text: 'Refund (if applicable) is issued to your original payment method within 5–10 business days' },
            ].map(item => (
              <li key={item.step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {item.step}
                </span>
                <p className="text-sm text-gray-600">{item.text}</p>
              </li>
            ))}
          </ol>
          <p className="text-sm text-gray-500 mt-4">
            If you're unable to cancel through the platform, email <a href="mailto:hello@camperwatch.org" className="text-emerald-700 hover:text-emerald-900">hello@camperwatch.org</a> with your booking reference number.
          </p>
        </section>

        {/* Exceptional circumstances */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Exceptional circumstances</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            We review refund requests outside the standard policy on a case-by-case basis for documented emergencies including: death of an immediate family member, serious illness or medical emergency requiring hospitalization, natural disaster or government-ordered evacuation affecting the campground, or campground closure by the owner after booking.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            CamperWatch does not issue refunds for: bad weather that doesn't constitute an official emergency; change of plans; failure to obtain required permits (including tribal recreation permits); personal vehicle breakdowns or travel delays; or campgrounds that don't meet subjective expectations but are accurately described.
          </p>
        </section>

        {/* Federal campgrounds */}
        <section className="mb-10 rounded-2xl p-5 bg-sky-50 border border-sky-100">
          <h2 className="text-base font-bold text-sky-900 mb-2">Federal campgrounds (Recreation.gov)</h2>
          <p className="text-sm text-sky-800 leading-relaxed">
            Federal campground pages on CamperWatch link to Recreation.gov for booking. Recreation.gov's own cancellation policy applies to those reservations — not this policy. CamperWatch has no involvement in Recreation.gov bookings, payments, or refunds. Refer to recreation.gov/cancellations for their current policy.
          </p>
        </section>

        {/* Tribal permits */}
        <section className="mb-10 rounded-2xl p-5 border" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <h2 className="text-base font-bold text-emerald-900 mb-2">Pyramid Lake tribal recreation permits</h2>
          <p className="text-sm text-emerald-800 leading-relaxed">
            Tribal recreation permits purchased at pyramidlake.us or the I-80 Smokeshop are governed by the Pyramid Lake Paiute Tribe's own permit policies and are separate from CamperWatch bookings. CamperWatch is not responsible for and cannot refund tribal permits. Contact the Pyramid Lake Realty Department at (775) 575-2185 or prealty@plpt.nsn.us for permit-related refund inquiries.
          </p>
        </section>

        {/* Owners */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">For campground owners</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            When a camper cancels and is entitled to a refund, the refund is issued from the booking funds held by Stripe before they are paid out to you. If the booking has already been paid out and a refund is subsequently approved, CamperWatch will contact you to arrange recovery of the refund amount.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            You may set a custom cancellation policy for your properties in your owner dashboard. Custom policies are binding once displayed to campers at checkout. You cannot retroactively apply a stricter policy to existing bookings.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
          <Link href="/terms" className="text-emerald-700 hover:text-emerald-900">Terms of Service →</Link>
          <Link href="/privacy" className="text-emerald-700 hover:text-emerald-900">Privacy Policy →</Link>
          <Link href="/contact" className="text-emerald-700 hover:text-emerald-900">Contact us →</Link>
        </div>
      </div>
    </div>
  )
}
