import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CamperWatch — Find & Book Campgrounds Across the US',
  description: 'Search and compare campgrounds in one place. Real-time availability, transparent pricing, easy booking.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
