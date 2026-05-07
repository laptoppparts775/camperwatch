import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import Footer from '@/components/Footer'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e1a13',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://camperwatch.org'),
  title: { default: 'CamperWatch — Find & Book Campgrounds Across the US', template: '%s | CamperWatch' },
  description: 'Search and compare campgrounds across the US in one place. Real availability, transparent pricing, verified pro tips from real campers.',
  keywords: ['Lake Tahoe campgrounds', 'Nevada campgrounds', 'camping near Reno', 'Nevada Beach campground', 'campground booking', 'RV parks Nevada'],
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  openGraph: {
    type: 'website', locale: 'en_US', url: 'https://camperwatch.org', siteName: 'CamperWatch',
    title: 'CamperWatch — Find & Book Campgrounds Across the US',
    description: 'Search all campgrounds in one place. Transparent pricing, real availability, insider tips from a community of campers.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'CamperWatch' }],
  },
  twitter: { card: 'summary_large_image', title: 'CamperWatch', description: 'Find and book campgrounds across the US.', images: ['/og-image.jpg'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  alternates: { canonical: 'https://camperwatch.org' },
  verification: { google: 'h6pogfvV7Tbf7S6N07VGk-Y6OGbGPoegf-lpTRcgtzM' },
  category: 'travel',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // WebSite schema with SearchAction — enables sitelinks search box in Google
  const websiteSchema = {
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: 'CamperWatch', url: 'https://camperwatch.org',
    description: 'Find and compare campgrounds across the US with real availability and community tips.',
    potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: 'https://camperwatch.org/search?q={search_term_string}' }, 'query-input': 'required name=search_term_string' }
  }

  // Organization schema — anchors entity recognition for AI Overviews + Knowledge Graph
  // sameAs is empty for now; populate as social/Wikipedia/Crunchbase profiles come online.
  const orgSchema = {
    '@context': 'https://schema.org', '@type': 'Organization',
    '@id': 'https://camperwatch.org/#organization',
    name: 'CamperWatch',
    url: 'https://camperwatch.org',
    logo: { '@type': 'ImageObject', url: 'https://camperwatch.org/og-image.jpg', width: 1200, height: 630 },
    description: 'National campground directory covering federal, state, and private campgrounds across the United States — verified data, insider booking strategies, and community-sourced site guides.',
    foundingDate: '2026',
    areaServed: { '@type': 'Country', name: 'United States' },
    knowsAbout: ['camping', 'campgrounds', 'RV parks', 'national parks', 'state parks', 'campsite booking', 'outdoor recreation'],
    sameAs: [],
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: 'hello@camperwatch.org', availableLanguage: ['English'] },
  }

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
        />
      </head>
      <body style={{overflowX:"hidden"}}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
