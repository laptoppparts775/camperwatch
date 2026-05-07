import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: 'Terms of Service | CamperWatch',
  description: 'CamperWatch Terms of Service — rules for campers, campground owners, and use of the platform.',
  alternates: { canonical: 'https://camperwatch.org/terms' },
  robots: { index: true, follow: true },
}

const SECTIONS = [
  {
    id: 'overview',
    title: '1. Who we are and what this covers',
    body: `CamperWatch ("CamperWatch," "we," "our," or "us") operates the website camperwatch.org and related services, including campground discovery, direct booking, owner dashboards, availability alerts, iCal sync, and community features. These Terms of Service ("Terms") apply to all users — campers browsing or booking, campground owners listing their properties, and anyone visiting the site.

By creating an account or using CamperWatch, you agree to these Terms. If you're using CamperWatch on behalf of a business, organization, or tribal entity, you represent that you have authority to bind that entity.`,
  },
  {
    id: 'campers',
    title: '2. Campers — booking, payments, and your responsibilities',
    body: `When you book a campground through CamperWatch, you're entering a direct reservation agreement with the campground operator (the "Owner"). CamperWatch facilitates the transaction but is not a party to the rental agreement between you and the Owner.

Payment is processed by Stripe. Your card is charged at the time of booking. The total amount charged includes the campground nightly rate and a Stripe processing fee (2.9% + $0.30). CamperWatch retains 5% of the booking total as a platform fee from the Owner's payout — you are not charged any additional booking fee beyond the listed price.

You are responsible for: arriving within the check-in window communicated by the Owner; following the campground's rules including quiet hours, fire regulations, and pet policies; obtaining any required permits (including tribal recreation permits for federally or tribally managed lands); and leaving your site in the condition you found it.

Federal campground pages on CamperWatch display live availability data from Recreation.gov but bookings for federal campgrounds are completed on Recreation.gov directly. CamperWatch is not affiliated with Recreation.gov, the National Park Service, or the U.S. Forest Service.`,
  },
  {
    id: 'owners',
    title: '3. Campground owners — listing, commissions, and payouts',
    body: `By listing your campground on CamperWatch, you represent that you have legal authority to offer reservations for that property and that all information you provide is accurate and current.

CamperWatch charges a 5% commission on every booking we facilitate. This fee is deducted from your payout at the time of each booking. There is no monthly fee, no setup cost, and no long-term contract. You may remove your listing at any time, subject to honoring existing confirmed reservations.

Payouts are processed through Stripe Connect Express. You are responsible for completing Stripe's KYC (Know Your Customer) verification before accepting payments. Payout timing is subject to Stripe's standard payout schedule (typically 2 business days after a booking is completed). CamperWatch is not responsible for delays caused by Stripe or your financial institution.

You own your guest data. CamperWatch will not sell, share, or use your guest contact information for marketing purposes without your consent. You may contact your guests directly for repeat-booking outreach using data you collect through the platform.

You are responsible for complying with all applicable laws including lodging taxes, business licensing, health and safety regulations, and — for tribal land operators — all applicable tribal, federal, and state laws.`,
  },
  {
    id: 'prohibited',
    title: '4. Prohibited conduct',
    body: `You may not use CamperWatch to: create fake listings or fraudulent bookings; circumvent the platform to avoid paying commissions on bookings we introduced; harass, threaten, or discriminate against other users or campground operators; upload content that infringes intellectual property rights; attempt to reverse-engineer, scrape, or copy CamperWatch's data, code, or systems; or use the platform for any unlawful purpose.

Violations may result in immediate account suspension and, where appropriate, referral to law enforcement.`,
  },
  {
    id: 'content',
    title: '5. Content you post',
    body: `By submitting photos, reviews, trip logs, community posts, or other content to CamperWatch, you grant us a non-exclusive, royalty-free, worldwide license to display, reproduce, and distribute that content in connection with operating the platform. You retain ownership of your content.

You represent that your content is accurate, does not infringe third-party rights, and does not contain false or defamatory statements about campgrounds, owners, or other users.

CamperWatch reserves the right to remove content that violates these Terms or that we determine, in our sole discretion, is harmful to the platform or its users.`,
  },
  {
    id: 'availability',
    title: '6. Availability data and accuracy',
    body: `Federal campground availability data is sourced in real time from Recreation.gov's public API and is provided for informational purposes only. CamperWatch does not guarantee the accuracy or completeness of this data. Always verify availability directly on Recreation.gov before making travel plans.

Private campground availability is sourced from owner-managed calendars on CamperWatch. Availability shown reflects the owner's last update and may not account for phone bookings or other reservations made outside the platform.

Campground information including amenities, pricing, photos, and site details is provided by owners or sourced from public records. We make reasonable efforts to keep this accurate but cannot guarantee it. Always confirm details directly with the campground before arrival.`,
  },
  {
    id: 'liability',
    title: '7. Limitation of liability',
    body: `CamperWatch is a technology platform connecting campers with campground operators. We are not responsible for the condition, safety, or quality of any campground listed on the platform. We are not responsible for personal injury, property damage, or any other loss arising from your use of a campground.

TO THE MAXIMUM EXTENT PERMITTED BY LAW, CAMPERWATCH'S TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING FROM USE OF THE PLATFORM SHALL NOT EXCEED THE GREATER OF: (A) THE TOTAL FEES PAID BY YOU TO CAMPERWATCH IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) $100.

WE PROVIDE THE PLATFORM "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.`,
  },
  {
    id: 'disputes',
    title: '8. Disputes between campers and owners',
    body: `Disputes about reservations, property damage, or refunds are primarily between you and the campground owner. CamperWatch may, at our discretion, assist in mediating disputes but is under no obligation to do so and makes no guarantee of any particular outcome.

If you believe a campground owner has acted fraudulently or in bad faith, contact us at hello@camperwatch.org. We will investigate and may take action including suspending the owner's account and facilitating a refund through Stripe where appropriate.`,
  },
  {
    id: 'changes',
    title: '9. Changes to these Terms',
    body: `We may update these Terms from time to time. We will notify registered users of material changes via email. Continued use of CamperWatch after changes take effect constitutes acceptance of the updated Terms. The current version of these Terms is always available at camperwatch.org/terms.`,
  },
  {
    id: 'governing',
    title: '10. Governing law',
    body: `These Terms are governed by the laws of the State of Nevada, without regard to conflict of law principles. Any dispute not resolved through good-faith negotiation shall be submitted to binding arbitration in Reno, Nevada under JAMS rules, except that either party may seek injunctive relief in a court of competent jurisdiction.`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* Header */}
      <div style={{ background: '#0b1a10' }} className="px-5 py-14">
        <div className="max-w-3xl mx-auto">
          <p className="text-emerald-400/60 text-xs font-medium uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-3xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-white/50 text-sm">Last updated: May 6, 2026 · Questions? <a href="mailto:hello@camperwatch.org" className="text-emerald-400 hover:text-emerald-300">hello@camperwatch.org</a></p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 py-12">
        {/* Quick nav */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-10 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">On this page</p>
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
          <Link href="/privacy" className="text-emerald-700 hover:text-emerald-900">Privacy Policy →</Link>
          <Link href="/cancellation" className="text-emerald-700 hover:text-emerald-900">Cancellation Policy →</Link>
          <Link href="/contact" className="text-emerald-700 hover:text-emerald-900">Contact us →</Link>
        </div>
      </div>
    </div>
  )
}
