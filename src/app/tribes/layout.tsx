import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Camping Tribes — Find Your People',
  description: 'Join camping tribes by interest: RV life, solo adventurers, family camping, national park chasers. Connect with campers who share your passion.',
  keywords: ['camping community', 'RV community', 'solo campers', 'family camping group', 'national park camping group'],
  openGraph: {
    title: 'Camping Tribes — CamperWatch',
    description: 'Join camping tribes by interest. RVers, solo adventurers, families, national park chasers.',
    url: 'https://camperwatch.org/tribes',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'CamperWatch' }],
  },
  twitter: { card: 'summary_large_image', title: 'Camping Tribes — CamperWatch', description: 'Join camping tribes by interest.', images: ['/og-image.jpg'] },
  alternates: { canonical: 'https://camperwatch.org/tribes' },
}

export default function TribesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
