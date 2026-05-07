import Link from 'next/link'
import { TreePine, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react'

const EXPLORE = [
  { label: 'Search campgrounds', href: '/search' },
  { label: 'National park campgrounds', href: '/national-park-campgrounds' },
  { label: 'RV parks near Reno', href: '/campground/pyramid-lake-marina' },
  { label: 'Availability alerts', href: '/alerts' },
  { label: 'Community feed', href: '/community' },
  { label: 'Tribes & groups', href: '/tribes' },
]

const OWNERS = [
  { label: 'List your campground free', href: '/for-campsite-owners' },
  { label: 'Hipcamp alternative', href: '/hipcamp-alternative' },
  { label: 'Campspot alternative', href: '/campspot-alternative' },
  { label: 'Campground booking software', href: '/campground-booking-software' },
  { label: 'Owner dashboard', href: '/owner-dashboard' },
  { label: 'Add a campsite', href: '/add-campsite' },
]

const FEATURED = [
  { label: 'Pyramid Lake Paiute Tribe Parks', href: '/pyramid-lake-paiute-tribe', badge: 'New' },
  { label: 'Pyramid Lake Marina RV Park', href: '/campground/pyramid-lake-marina' },
  { label: 'Big Bend RV Park', href: '/campground/big-bend-rv-park' },
  { label: 'Watchman — Zion NP', href: '/campground/watchman-campground' },
  { label: 'Upper Pines — Yosemite', href: '/campground/upper-pines-yosemite' },
  { label: 'Elkmont — Smoky Mountains', href: '/campground/elkmont-smoky-mountains' },
]

const LEGAL = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cancellation Policy', href: '/cancellation' },
  { label: 'Contact us', href: '/contact' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#0b1a10', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      {/* ── Main grid ── */}
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <TreePine size={20} className="text-emerald-400" />
              <span className="font-bold text-white text-base">CamperWatch</span>
            </Link>
            <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Campground discovery and direct booking. Federal parks drive traffic.
              Private owners get bookings. Campers skip the middleman.
            </p>
            <div className="space-y-2">
              <a href="mailto:hello@camperwatch.org"
                className="flex items-center gap-2 text-xs transition-colors hover:text-emerald-300"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                <Mail size={12} /> hello@camperwatch.org
              </a>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                <MapPin size={12} /> Reno, NV · National
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Explore
            </p>
            <ul className="space-y-2.5">
              {EXPLORE.map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm transition-colors hover:text-emerald-300"
                    style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              For Owners
            </p>
            <ul className="space-y-2.5">
              {OWNERS.map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm transition-colors hover:text-emerald-300"
                    style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured parks */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Featured Parks
            </p>
            <ul className="space-y-2.5">
              {FEATURED.map(l => (
                <li key={l.href} className="flex items-center gap-2">
                  <Link href={l.href}
                    className="text-sm transition-colors hover:text-emerald-300"
                    style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {l.label}
                  </Link>
                  {l.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-900 text-emerald-300">
                      {l.badge}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © 2026 CamperWatch · Data sourced from official operator websites ·
            No affiliation with Recreation.gov, NPS, or USFS
          </p>
          <div className="flex items-center gap-5">
            {LEGAL.map(l => (
              <Link key={l.href} href={l.href}
                className="text-xs transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}
