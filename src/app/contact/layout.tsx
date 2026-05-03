import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact CamperWatch',
  description: 'Report a data error, share an insider tip, or partner with CamperWatch. Direct email: hello@camperwatch.org. We read every message.',
  openGraph: {
    title: 'Contact CamperWatch',
    description: 'Report a data error, share a tip, or partner with us.',
    url: 'https://camperwatch.org/contact',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'CamperWatch' }],
  },
  twitter: { card: 'summary_large_image', title: 'Contact CamperWatch', description: 'Report a data error, share a tip, or partner with us.', images: ['/og-image.jpg'] },
  alternates: { canonical: 'https://camperwatch.org/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
