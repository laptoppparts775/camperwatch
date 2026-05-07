import { campgrounds } from '@/lib/data'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://camperwatch.org'

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/community`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/add-campsite`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/hipcamp-alternative`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/campspot-alternative`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/list-campground-free`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/campground-booking-software`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/national-park-campgrounds`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/pyramid-lake-paiute-tribe`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/cancellation`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const campgroundPages: MetadataRoute.Sitemap = campgrounds.map(c => ({
    url: `${base}/campground/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...campgroundPages]
}
