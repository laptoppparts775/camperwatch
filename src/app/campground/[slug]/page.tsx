import { campgrounds, Campground } from '@/lib/data'
import { notFound } from 'next/navigation'
import CampgroundClient from './CampgroundClient'
import CampgroundSchema from '@/components/seo/CampgroundSchema'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export function generateStaticParams() {
  return campgrounds.map(c => ({ slug: c.slug }))
}

/**
 * 1.7.8 — Pull SEO keywords from this campground's active sites at build time.
 * Owners adding "lakefront" / "pet-friendly" to their sites strengthens the
 * parent page's ranking. Defensive: any failure falls back to static data.
 *
 * Caveat: this runs at build time only. New site keywords appear in metadata
 * after the next deploy.
 */
async function getSiteKeywords(slug: string): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []
  try {
    const sb = createClient(url, key)
    const { data, error } = await sb
      .from('campground_sites')
      .select('seo_keywords')
      .eq('campground_slug', slug)
      .eq('active', true)
    if (error || !data) return []
    const all: string[] = []
    for (const row of data) {
      const kws = (row as any).seo_keywords as string[] | null
      if (Array.isArray(kws)) all.push(...kws)
    }
    // Dedupe, lowercase, trim, drop empties
    const seen = new Set<string>()
    const out: string[] = []
    for (const raw of all) {
      const k = (raw || '').trim().toLowerCase()
      if (!k || seen.has(k)) continue
      seen.add(k)
      out.push(k)
    }
    return out
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const camp = campgrounds.find(c => c.slug === params.slug)
  if (!camp) return {}
  const images = camp.images as Array<{url: string}>

  // Gather site-level SEO keywords (1.7.8)
  const siteKeywords = await getSiteKeywords(params.slug)
  const baseKeywords: string[] = [
    camp.name,
    `camping ${camp.location || ''}`,
    `campground ${camp.location || ''}`,
  ].filter(Boolean) as string[]
  const keywords = [...baseKeywords, ...siteKeywords].slice(0, 20)

  return {
    title: `${camp.name} — Camping in ${(camp as any).region || camp.location}`,
    description: `${camp.description?.slice(0, 155)}...`,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
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
