import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: 'Privacy Policy | CamperWatch',
  description: 'CamperWatch Privacy Policy — what data we collect, how we use it, and your rights.',
  alternates: { canonical: 'https://camperwatch.org/privacy' },
  robots: { index: true, follow: true },
}

const SECTIONS = [
  {
    id: 'what-we-collect',
    title: '1. What data we collect',
    body: `Account data: When you create an account, we collect your email address, name, and password (stored as a secure hash). If you sign in with Google, we receive your name, email, and profile photo from Google.

Booking data: When you make a reservation, we collect your name, email, phone number, dates, number of guests, special requests, and payment method details. Payment card details are processed and stored by Stripe — CamperWatch never sees or stores your full card number.

Owner data: Campground owners provide contact information, payout email, bank account details (held by Stripe), and property information including pricing, photos, and site descriptions.

Usage data: We collect standard web analytics including pages visited, search queries, session duration, and referring URLs. We use this to improve the platform. We do not sell this data.

Availability alert data: If you set a campground availability alert, we store your email, the facility you're watching, and your target dates. We use this only to send you the alert.

Communications: If you contact us by email, we store that correspondence to respond to your inquiry.`,
  },
  {
    id: 'how-we-use',
    title: '2. How we use your data',
    body: `We use your data to: operate the platform and process bookings; send booking confirmations, reminders, and availability alerts you've requested; help campground owners manage their reservations (owners see guest name, email, phone, dates, and special requests for bookings at their properties); improve search results and platform features; prevent fraud and enforce our Terms of Service; and comply with legal obligations.

We do not use your data to: sell you advertising from third parties; build behavioral advertising profiles; or share your information with data brokers.`,
  },
  {
    id: 'who-sees',
    title: '3. Who sees your data',
    body: `Campground owners: When you make a booking, the owner receives your name, email, phone number, arrival/departure dates, number of guests, and special requests. This is necessary to fulfill your reservation.

Stripe: Payment processing is handled by Stripe, Inc. Stripe receives your payment details and processes payouts to owners. Stripe's privacy policy applies to data they collect: stripe.com/privacy.

Supabase: Our database is hosted by Supabase (Supabase Inc.). Your data is stored in their infrastructure under our account. They do not have access to your data for their own purposes.

Resend: Transactional emails (booking confirmations, alerts) are sent via Resend. They receive the recipient email address and email content necessary to deliver your messages.

Law enforcement: We may disclose information when required by law or in response to valid legal process.

We do not sell, rent, or trade your personal information to any third party for their marketing purposes.`,
  },
  {
    id: 'cookies',
    title: '4. Cookies and tracking',
    body: `We use session cookies necessary for authentication — keeping you logged in across pages. We do not use third-party advertising cookies or cross-site tracking pixels.

We use privacy-respecting analytics to understand how people use CamperWatch. This data is aggregated and does not identify individual users.

You can disable cookies in your browser settings, though this will prevent you from staying logged in.`,
  },
  {
    id: 'your-rights',
    title: '5. Your rights',
    body: `You have the right to: access the personal data we hold about you; correct inaccurate data; request deletion of your account and associated data; export your booking history and profile data; and opt out of non-essential communications.

To exercise any of these rights, email hello@camperwatch.org. We will respond within 30 days.

If you're in the European Economic Area, you have additional rights under GDPR including the right to lodge a complaint with your national data protection authority.

California residents: Under CCPA, you have the right to know what personal information we collect and how it's used, request deletion, and opt out of sale (we do not sell personal information).`,
  },
  {
    id: 'retention',
    title: '6. How long we keep your data',
    body: `Account data is retained for as long as your account is active. If you delete your account, we delete your profile data within 30 days, but may retain booking records for up to 7 years for tax and legal compliance purposes.

Availability alert data is deleted 90 days after an alert fires or is manually removed.

Usage logs are retained for 90 days for security and debugging purposes.`,
  },
  {
    id: 'children',
    title: '7. Children\'s privacy',
    body: `CamperWatch is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has created an account, contact us at hello@camperwatch.org and we will delete the account promptly.`,
  },
  {
    id: 'changes',
    title: '8. Changes to this policy',
    body: `We may update this Privacy Policy as the platform evolves. We will notify registered users of material changes via email at least 14 days before they take effect. The current version is always at camperwatch.org/privacy. The date at the top of this page reflects when it was last updated.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <div style={{ background: '#0b1a10' }} className="px-5 py-14">
        <div className="max-w-3xl mx-auto">
          <p className="text-emerald-400/60 text-xs font-medium uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-3xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-white/50 text-sm">Last updated: May 6, 2026 · Questions? <a href="mailto:hello@camperwatch.org" className="text-emerald-400 hover:text-emerald-300">hello@camperwatch.org</a></p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-12">
        {/* Summary box */}
        <div className="rounded-2xl p-5 mb-10 border border-emerald-100" style={{ background: '#f0fdf4' }}>
          <p className="text-sm font-semibold text-emerald-900 mb-2">The short version</p>
          <ul className="space-y-1.5 text-sm text-emerald-800">
            {[
              'We collect only what we need to run the platform and process your bookings',
              'We never sell your personal data to anyone',
              'Payment data is handled by Stripe — we never see your card number',
              'Campground owners see your booking details (name, email, phone, dates)',
              'You can request deletion of your account and data at any time',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick nav */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-10 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sections</p>
          <div className="grid sm:grid-cols-2 gap-1">
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`}
                className="text-sm text-emerald-700 hover:text-emerald-900 transition-colors py-0.5">
                {s.title}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {SECTIONS.map(s => (
            <section key={s.id} id={s.id}>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h2>
              {s.body.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">{para}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
          <Link href="/terms" className="text-emerald-700 hover:text-emerald-900">Terms of Service →</Link>
          <Link href="/cancellation" className="text-emerald-700 hover:text-emerald-900">Cancellation Policy →</Link>
          <Link href="/contact" className="text-emerald-700 hover:text-emerald-900">Contact us →</Link>
        </div>
      </div>
    </div>
  )
}
