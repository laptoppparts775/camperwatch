import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// USGS Earthquake Hazards Program — no API key
async function fetchQuakes(lat: number, lng: number) {
  // Last 30 days, M2.5+, within 200km
  const end = new Date().toISOString().slice(0, 10)
  const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson` +
    `&latitude=${lat}&longitude=${lng}&maxradiuskm=200` +
    `&minmagnitude=2.5&limit=10&orderby=time` +
    `&starttime=${start}&endtime=${end}`

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`USGS ${res.status}`)
  const data = await res.json()

  return (data.features || []).map((f: any) => {
    const p = f.properties
    const [qLng, qLat, depth] = f.geometry.coordinates
    const dx = (qLng - lng) * 54.6
    const dy = (qLat - lat) * 69.0
    const distMi = Math.round(Math.sqrt(dx * dx + dy * dy))
    return {
      mag: p.mag,
      place: p.place,
      time: new Date(p.time).toISOString(),
      depth: Math.round(depth),
      distanceMi: distMi,
      felt: p.felt,
      url: p.url,
    }
  })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  if (isNaN(lat) || isNaN(lng)) return NextResponse.json({ error: 'lat/lng required' }, { status: 400 })

  const key = `${Math.round(lat * 10) / 10}_${Math.round(lng * 10) / 10}`

  let cached: any = null
  try {
    const { data } = await getSupabase()
      .from('earthquakes_cache')
      .select('data, fetched_at')
      .eq('cache_key', key)
      .single()
    cached = data
  } catch {}

  if (cached) {
    const ageMs = Date.now() - new Date(cached.fetched_at).getTime()
    if (ageMs < 6 * 60 * 60 * 1000) { // 6hr cache
      return NextResponse.json(cached.data, { headers: { 'Cache-Control': 'public, max-age=3600' } })
    }
  }

  try {
    const quakes = await fetchQuakes(lat, lng)
    const result = { quakes, fetchedAt: new Date().toISOString() }

    await getSupabase().from('earthquakes_cache').upsert(
      { cache_key: key, data: result, fetched_at: new Date().toISOString() },
      { onConflict: 'cache_key' }
    )

    return NextResponse.json(result, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  } catch (err: any) {
    if (cached) return NextResponse.json(cached.data)
    return NextResponse.json({ quakes: [], error: err.message })
  }
}
