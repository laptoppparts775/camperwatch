import type { Metadata, Viewport } from 'next'
import './globals.css'

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
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://camperwatch.org' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: 'CamperWatch', url: 'https://camperwatch.org',
    description: 'Find and compare campgrounds across the US with real availability and community tips.',
    potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: 'https://camperwatch.org/search?q={search_term_string}' }, 'query-input': 'required name=search_term_string' }
  }
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
        />
      </head>
      <body style={{overflowX:"hidden"}}>
        {children}
        {/* AvantLink verification — can be removed after approval */}
        <script type="text/javascript" src="http://classic.avantlink.com/affiliate_app_confirm.php?mode=js&authResponse=708e6a85f4f902db1e70f5b47da3cf6010769e42"></script>
      </body>
    </html>
  )
}
