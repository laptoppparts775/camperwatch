import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// NIFC (National Interagency Fire Center) — no API key needed
// Returns active wildfire incidents within ~150km of coordinates
async function fetchFires(lat: number, lng: number) {
  // Bounding box ~1.5 degrees (~150km) around point
  const d = 1.5
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`

  const url = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Incident_Locations_Current/FeatureServer/0/query` +
    `?where=1%3D1` +
    `&outFields=IncidentName,IncidentTypeCategory,DailyAcres,PercentContained,POOState,ModifiedOnDateTime_dt,X,Y` +
    `&geometry=${encodeURIComponent(bbox)}` +
    `&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects` +
    `&outSR=4326&f=json&resultRecordCount=10`

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`NIFC ${res.status}`)
  const data = await res.json()

  return (data.features || [])
    .filter((f: any) => f.attributes?.IncidentTypeCategory === 'WF') // Wildfire only
    .map((f: any) => {
      const a = f.attributes
      const coords = f.geometry || {}
      // Rough distance in miles
      const dx = (coords.x - lng) * 54.6
      const dy = (coords.y - lat) * 69.0
      const distMi = Math.round(Math.sqrt(dx * dx + dy * dy))
      return {
        name: a.IncidentName,
        acres: a.DailyAcres ? Math.round(a.DailyAcres) : null,
        contained: a.PercentContained,
        state: a.POOState,
        distanceMi: distMi,
        updatedAt: a.ModifiedOnDateTime_dt,
      }
    })
    .sort((a: any, b: any) => a.distanceMi - b.distanceMi)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  if (isNaN(lat) || isNaN(lng)) return NextResponse.json({ error: 'lat/lng required' }, { status: 400 })

  const key = `${Math.round(lat * 10) / 10}_${Math.round(lng * 10) / 10}`

  // 2hr cache — NIFC data refreshes every few hours
  let cached: any = null
  try {
    const { data } = await getSupabase()
      .from('fires_cache')
      .select('data, fetched_at')
      .eq('cache_key', key)
      .single()
    cached = data
  } catch {}

  if (cached) {
    const ageMs = Date.now() - new Date(cached.fetched_at).getTime()
    if (ageMs < 2 * 60 * 60 * 1000) {
      return NextResponse.json(cached.data, { headers: { 'Cache-Control': 'public, max-age=3600' } })
    }
  }

  try {
    const fires = await fetchFires(lat, lng)
    const result = { fires, fetchedAt: new Date().toISOString() }

    await getSupabase().from('fires_cache').upsert(
      { cache_key: key, data: result, fetched_at: new Date().toISOString() },
      { onConflict: 'cache_key' }
    )

    return NextResponse.json(result, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  } catch (err: any) {
    if (cached) return NextResponse.json(cached.data)
    return NextResponse.json({ fires: [], error: err.message })
  }
}
