import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Owner Dashboard',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function OwnerDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
