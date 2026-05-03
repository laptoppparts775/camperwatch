import type { Metadata } from 'next'
import { campgrounds } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Search Campgrounds Across the US',
  description: 'Search and filter 23+ campgrounds across federal parks, state parks, and private campgrounds. Filter by state, site type, price, pet-friendly, and amenities.',
  keywords: ['campground search', 'find campgrounds', 'campgrounds by state', 'RV park search', 'tent camping search', 'campground directory'],
  openGraph: {
    title: 'Search Campgrounds — CamperWatch',
    description: 'Filter campgrounds by state, site type, price, and amenities. Federal, state, and private — all in one search.',
    url: 'https://camperwatch.org/search',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'CamperWatch' }],
  },
  twitter: { card: 'summary_large_image', title: 'Search Campgrounds — CamperWatch', description: 'Filter campgrounds by state, site type, price, and amenities.', images: ['/og-image.jpg'] },
  alternates: { canonical: 'https://camperwatch.org/search' },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  // ItemList schema — crawlers can see all campgrounds even though the UI is fully client-rendered.
  // CollectionPage wraps it with breadcrumbs to anchor the page in the site graph.
  const baseUrl = 'https://camperwatch.org'
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}/search#collection`,
        name: 'Campground Directory',
        description: 'Search and filter campgrounds across the US — federal, state, and private.',
        url: `${baseUrl}/search`,
        isPartOf: { '@id': `${baseUrl}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'CamperWatch', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Search Campgrounds', item: `${baseUrl}/search` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'All Campgrounds',
        numberOfItems: campgrounds.length,
        itemListElement: campgrounds.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${baseUrl}/campground/${c.slug}`,
          name: c.name,
        })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      {children}
    </>
  )
}
