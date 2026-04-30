import { Campground } from '@/lib/data'

export default function CampgroundSchema({ camp }: { camp: Campground }) {
  const images = camp.images as Array<{url: string, alt: string, title: string}>
  const proTips = (camp as any).pro_tips as string[] || []
  const baseUrl = 'https://camperwatch.org'

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Campground',
        '@id': `${baseUrl}/campground/${camp.slug}#campground`,
        name: camp.name,
        description: camp.description,
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['[data-speakable="true"]'],
        },
        url: `${baseUrl}/campground/${camp.slug}`,
        telephone: camp.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: (camp as any).address,
          addressLocality: camp.location,
          addressCountry: 'US'
        },
        geo: { '@type': 'GeoCoordinates', latitude: camp.lat, longitude: camp.lng },
        image: images.map(img => ({
          '@type': 'ImageObject',
          url: img.url,
          name: img.title,
          description: img.alt
        })),
        priceRange: `$${camp.price_per_night}–$${(camp as any).price_high || camp.price_per_night}`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: camp.rating,
          reviewCount: camp.review_count,
          bestRating: 5
        },
        amenityFeature: camp.amenities.map(a => ({
          '@type': 'LocationFeatureSpecification', name: a, value: true
        })),
        openingHours: camp.season,
        checkinTime: camp.check_in,
        checkoutTime: camp.check_out,
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How much does ${camp.name} cost per night?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${camp.name} costs $${camp.price_per_night}–$${(camp as any).price_high || camp.price_per_night} per night depending on site type and season.`
            }
          },
          {
            '@type': 'Question',
            name: `What is the cancellation policy at ${camp.name}?`,
            acceptedAnswer: { '@type': 'Answer', text: camp.cancellation_policy }
          },
          {
            '@type': 'Question',
            name: `What season is ${camp.name} open?`,
            acceptedAnswer: { '@type': 'Answer', text: `${camp.name} is open ${camp.season}.` }
          },
          {
            '@type': 'Question',
            name: `What types of sites are available at ${camp.name}?`,
            acceptedAnswer: { '@type': 'Answer', text: `${camp.name} offers ${camp.site_types.join(', ')} sites.` }
          },
          {
            '@type': 'Question',
            name: `What is the maximum RV length at ${camp.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: camp.max_rig_length ? `${camp.name} can accommodate RVs up to ${camp.max_rig_length} feet.` : `${camp.name} is best suited for tent camping and does not have designated RV hookup sites.`
            }
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'CamperWatch', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Search Campgrounds', item: `${baseUrl}/search` },
          { '@type': 'ListItem', position: 3, name: camp.name, item: `${baseUrl}/campground/${camp.slug}` }
        ]
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
