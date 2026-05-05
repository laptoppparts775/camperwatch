import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const REC_GOV = 'https://www.recreation.gov/api/camps/availability/campground'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function fetchFromRecGov(facilityId: string, month: string) {
  const startDate = encodeURIComponent(`${month}T00:00:00.000Z`)
  const url = `${REC_GOV}/${facilityId}/month?start_date=${startDate}`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CamperWatch/1.0)',
      'Accept': 'application/json',
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) throw new Error(`Recreation.gov returned ${res.status}`)

  const raw = await res.json()
  const campsites: Record<string, any> = raw.campsites ?? {}

  const dailyAvailable: Record<string, number> = {}
  const dailyTotal: Record<string, number> = {}
  const siteTypes: Record<string, number> = {}
  const loopSet = new Set<string>()

  for (const site of Object.values(campsites)) {
    const s = site as any
    const type = s.campsite_type || 'Unknown'
    siteTypes[type] = (siteTypes[type] || 0) + 1
    if (s.loop) loopSet.add(s.loop)

    for (const [dateKey, status] of Object.entries(s.availabilities || {})) {
      const day = (dateKey as string).slice(0, 10)
      dailyTotal[day] = (dailyTotal[day] || 0) + 1
      if (status === 'Available') {
        dailyAvailable[day] = (dailyAvailable[day] || 0) + 1
      }
    }
  }

  return {
    facilityId,
    month,
    totalSites: Object.keys(campsites).length,
    dailyAvailable,
    dailyTotal,
    siteTypes,
    loops: Array.from(loopSet).filter(Boolean).sort(),
    source: 'live',
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const facilityId = searchParams.get('facilityId')
  const month = searchParams.get('month') || new Date().toISOString().slice(0, 7) + '-01'

  if (!facilityId) {
    return NextResponse.json({ error: 'Missing facilityId' }, { status: 400 })
  }

  try {
    // 1. Try Supabase cache first
    const { data: cached } = await supabase
      .from('availability_cache')
      .select('data, fetched_at')
      .eq('facility_id', facilityId)
      .eq('month', month)
      .single()

    if (cached) {
      const ageMs = Date.now() - new Date(cached.fetched_at).getTime()
      const ageMin = Math.round(ageMs / 60000)
      return NextResponse.json({
        ...cached.data,
        source: 'cache',
        cacheAgeMinutes: ageMin,
      }, {
        headers: { 'Cache-Control': 'public, max-age=60' }
      })
    }

    // 2. Cache miss — fetch live from recreation.gov
    const data = await fetchFromRecGov(facilityId, month)
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=60' }
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch availability' }, { status: 500 })
  }
}
