import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'List Your Campground — Free Owner Portal',
  description: 'List your campground on CamperWatch in 3 quick steps. Free to list, verified and published in 48 hours. Reach campers actively searching for their next trip.',
  keywords: ['list campground', 'add campground', 'campground owner portal', 'list RV park', 'submit campground'],
  openGraph: {
    title: 'List Your Campground — CamperWatch',
    description: 'Free to list. Verified in 48 hours. Reach thousands of campers searching for their next trip.',
    url: 'https://camperwatch.org/add-campsite',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'CamperWatch' }],
  },
  twitter: { card: 'summary_large_image', title: 'List Your Campground — CamperWatch', description: 'Free to list. Verified in 48 hours.', images: ['/og-image.jpg'] },
  alternates: { canonical: 'https://camperwatch.org/add-campsite' },
}

export default function AddCampsiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
