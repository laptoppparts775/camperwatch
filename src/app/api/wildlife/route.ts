import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  if (isNaN(lat) || isNaN(lng)) return NextResponse.json({ error: 'lat/lng required' }, { status: 400 })

  const key = `${Math.round(lat * 100) / 100}_${Math.round(lng * 100) / 100}`

  // 24hr cache
  const { data: cached } = await getSupabase()
    .from('wildlife_cache')
    .select('data, fetched_at')
    .eq('id', key)
    .single()

  if (cached) {
    const ageMs = Date.now() - new Date(cached.fetched_at).getTime()
    if (ageMs < 24 * 60 * 60 * 1000) {
      return NextResponse.json(cached.data, { headers: { 'Cache-Control': 'public, max-age=3600' } })
    }
  }

  try {
    // Fetch mammals, birds, and reptiles/amphibians separately for richer data
    const [mammalsRes, birdsRes, recentRes] = await Promise.all([
      fetch(`https://api.inaturalist.org/v1/observations?lat=${lat}&lng=${lng}&radius=8&iconic_taxa=Mammalia&quality_grade=research&per_page=10&order_by=observed_on&order=desc`, { signal: AbortSignal.timeout(8000) }),
      fetch(`https://api.inaturalist.org/v1/observations?lat=${lat}&lng=${lng}&radius=8&iconic_taxa=Aves&quality_grade=research&per_page=10&order_by=observed_on&order=desc`, { signal: AbortSignal.timeout(8000) }),
      fetch(`https://api.inaturalist.org/v1/observations?lat=${lat}&lng=${lng}&radius=5&quality_grade=research&per_page=5&order_by=observed_on&order=desc`, { signal: AbortSignal.timeout(8000) }),
    ])

    const [mammalsData, birdsData, recentData] = await Promise.all([
      mammalsRes.ok ? mammalsRes.json() : { results: [] },
      birdsRes.ok ? birdsRes.json() : { results: [] },
      recentRes.ok ? recentRes.json() : { results: [] },
    ])

    const formatObs = (obs: any[]) => obs.map((o: any) => ({
      name: o.species_guess || o.taxon?.preferred_common_name || o.taxon?.name,
      scientific: o.taxon?.name,
      observedOn: o.observed_on,
      photo: o.photos?.[0]?.url?.replace('square', 'small'),
      iconic: o.taxon?.iconic_taxon_name,
    })).filter(o => o.name)

    // Deduplicate by name, keep most recent
    const allMammals = formatObs(mammalsData.results || [])
    const allBirds = formatObs(birdsData.results || [])
    const recent = formatObs(recentData.results || [])

    // Unique species
    const seen = new Set<string>()
    const uniqueMammals = allMammals.filter(o => { if (seen.has(o.name)) return false; seen.add(o.name); return true })
    seen.clear()
    const uniqueBirds = allBirds.filter(o => { if (seen.has(o.name)) return false; seen.add(o.name); return true })

    const data = {
      lat, lng,
      mammals: uniqueMammals.slice(0, 8),
      birds: uniqueBirds.slice(0, 8),
      recentSightings: recent.slice(0, 5),
      totalMammals: mammalsData.total_results || 0,
      totalBirds: birdsData.total_results || 0,
      fetchedAt: new Date().toISOString(),
    }

    await getSupabase().from('wildlife_cache').upsert(
      { id: key, data, fetched_at: new Date().toISOString() },
      { onConflict: 'id' }
    )

    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  } catch (err: any) {
    if (cached) return NextResponse.json(cached.data)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
