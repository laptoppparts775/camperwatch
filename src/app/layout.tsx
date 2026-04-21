import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://camperwatch.org'),
  title: { default: 'CamperWatch — Find & Book Lake Tahoe Campgrounds', template: '%s | CamperWatch' },
  description: 'Search and compare all Lake Tahoe campgrounds in one place. Real availability, transparent pricing, verified pro tips from real campers. Book Nevada Beach, Fallen Leaf, Camp Richardson and more.',
  keywords: ['Lake Tahoe campgrounds', 'camping Lake Tahoe', 'Nevada Beach campground', 'Camp Richardson', 'Fallen Leaf campground', 'Tahoe RV parks', 'campground booking'],
  authors: [{ name: 'CamperWatch' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://camperwatch.org',
    siteName: 'CamperWatch',
    title: 'CamperWatch — Find & Book Lake Tahoe Campgrounds',
    description: 'Search all Lake Tahoe campgrounds in one place. Transparent pricing, real availability, and insider tips from a community of campers.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'CamperWatch — Lake Tahoe Campground Search' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CamperWatch — Find & Book Lake Tahoe Campgrounds',
    description: 'Search all Lake Tahoe campgrounds in one place. Transparent pricing, real tips from real campers.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://camperwatch.org' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CamperWatch',
    url: 'https://camperwatch.org',
    description: 'Find and compare Lake Tahoe campgrounds with real availability, transparent pricing, and community tips.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://camperwatch.org/search?q={search_term_string}' },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
