import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Camper Community — Live Trip Reports & Alerts',
  description: 'Real-time alerts, trip reports, tips, and questions from campers. Bear sightings, fire restrictions, road closures, site availability — fresh from the ground.',
  keywords: ['camper community', 'camping tips', 'campground alerts', 'trip reports', 'bear sightings', 'fire restrictions'],
  openGraph: {
    title: 'Camper Community — CamperWatch',
    description: 'Real campers sharing real-time alerts, trip reports, and insider tips. Not reviews — live reports from people who were just there.',
    url: 'https://camperwatch.org/community',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'CamperWatch' }],
  },
  twitter: { card: 'summary_large_image', title: 'Camper Community — CamperWatch', description: 'Real-time alerts, trip reports, and insider tips from campers.', images: ['/og-image.jpg'] },
  alternates: { canonical: 'https://camperwatch.org/community' },
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
