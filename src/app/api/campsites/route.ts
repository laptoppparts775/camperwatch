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
  const facilityId = searchParams.get('facilityId')
  if (!facilityId) return NextResponse.json({ error: 'facilityId required' }, { status: 400 })

  // Check cache — 24hr TTL (site attributes rarely change)
  const { data: cached } = await getSupabase()
    .from('campsites_cache')
    .select('data, fetched_at')
    .eq('facility_id', facilityId)
    .single()

  if (cached) {
    const ageMs = Date.now() - new Date(cached.fetched_at).getTime()
    if (ageMs < 24 * 60 * 60 * 1000) {
      return NextResponse.json(cached.data, { headers: { 'Cache-Control': 'public, max-age=3600' } })
    }
  }

  try {
    // Fetch all campsites with attributes from RIDB
    const res = await fetch(
      `https://ridb.recreation.gov/api/v1/facilities/${facilityId}/campsites?limit=500`,
      {
        headers: {
          'accept': 'application/json',
          'apikey': process.env.RIDB_API_KEY || '',
        },
        signal: AbortSignal.timeout(15000),
      }
    )
    if (!res.ok) throw new Error(`RIDB ${res.status}`)
    const raw = await res.json()

    // Fetch official photos
    const mediaRes = await fetch(
      `https://ridb.recreation.gov/api/v1/facilities/${facilityId}/media?limit=20`,
      {
        headers: { 'accept': 'application/json', 'apikey': process.env.RIDB_API_KEY || '' },
        signal: AbortSignal.timeout(8000),
      }
    )
    const mediaRaw = mediaRes.ok ? await mediaRes.json() : { RECDATA: [] }

    const sites = (raw.RECDATA || []).map((s: any) => {
      const attrs: Record<string, string> = {}
      for (const a of s.ATTRIBUTES || []) attrs[a.AttributeName] = a.AttributeValue
      return {
        id: s.CampsiteID,
        name: s.CampsiteName,
        loop: s.Loop,
        type: s.CampsiteType,
        accessible: s.CampsiteAccessible,
        lat: s.CampsiteLatitude,
        lng: s.CampsiteLongitude,
        shade: attrs['Shade'] || null,
        maxPeople: attrs['Max Num of People'] ? parseInt(attrs['Max Num of People']) : null,
        maxVehicleLength: attrs['Max Vehicle Length'] ? parseInt(attrs['Max Vehicle Length']) : null,
        electric: attrs['Electrical Hookup'] || null,
        water: attrs['Water Hookup'] || null,
        sewer: attrs['Sewer Hookup'] || null,
        tentPad: attrs['Tent Pad'] || null,
        pullThrough: attrs['Driveway Entry'] === 'Pull-Through',
        surfaceType: attrs['Campfire Allowed'] || null,
      }
    })

    const photos = (mediaRaw.RECDATA || [])
      .filter((m: any) => m.MediaType === 'Image')
      .map((m: any) => ({ url: m.URL, title: m.Title, description: m.Description }))

    const data = {
      facilityId,
      totalSites: sites.length,
      sites,
      photos,
      fetchedAt: new Date().toISOString(),
    }

    await getSupabase().from('campsites_cache').upsert(
      { facility_id: facilityId, data, fetched_at: new Date().toISOString() },
      { onConflict: 'facility_id' }
    )

    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  } catch (err: any) {
    if (cached) return NextResponse.json(cached.data)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
