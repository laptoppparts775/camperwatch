import { campgrounds, Campground } from '@/lib/data'
import { notFound } from 'next/navigation'
import CampgroundClient from './CampgroundClient'
import CampgroundSchema from '@/components/seo/CampgroundSchema'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return campgrounds.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const camp = campgrounds.find(c => c.slug === params.slug)
  if (!camp) return {}
  const images = camp.images as Array<{url: string}>
  return {
    title: `${camp.name} — Camping Near Lake Tahoe`,
    description: `${camp.description?.slice(0, 155)}...`,
    openGraph: {
      title: camp.name,
      description: camp.description?.slice(0, 155),
      images: images?.[0] ? [{ url: images[0].url }] : [],
    },
    alternates: { canonical: `https://camperwatch.org/campground/${camp.slug}` },
  }
}

export default function CampgroundPage({ params }: { params: { slug: string } }) {
  const camp = campgrounds.find(c => c.slug === params.slug)
  if (!camp) notFound()
  return (
    <>
      <CampgroundSchema camp={camp} />
      <CampgroundClient camp={camp} />
    </>
  )
}
