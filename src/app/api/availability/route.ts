import { NextRequest, NextResponse } from 'next/server'

const REC_GOV = 'https://www.recreation.gov/api/camps/availability/campground'

/**
 * GET /api/availability?facilityId=232768&month=2026-06-01
 * Uses Recreation.gov public availability API — no API key required.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const facilityId = searchParams.get('facilityId')
  const month = searchParams.get('month') || new Date().toISOString().slice(0, 7) + '-01'

  if (!facilityId) {
    return NextResponse.json({ error: 'Missing facilityId' }, { status: 400 })
  }

  const startDate = encodeURIComponent(`${month}T00:00:00.000Z`)
  const url = `${REC_GOV}/${facilityId}/month?start_date=${startDate}`

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CamperWatch/1.0)',
        'Accept': 'application/json',
      },
      next: { revalidate: 900 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Recreation.gov returned ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    const campsites: Record<string, any> = data.campsites ?? {}

    let available = 0
    let reserved = 0
    const siteTypes: Record<string, number> = {}
    const loopSet = new Set<string>()

    for (const site of Object.values(campsites)) {
      const s = site as any
      const type = s.campsite_type || 'Unknown'
      siteTypes[type] = (siteTypes[type] || 0) + 1
      if (s.loop) loopSet.add(s.loop)
      for (const status of Object.values(s.availabilities || {})) {
        if (status === 'Available') available++
        else if (status === 'Reserved') reserved++
      }
    }

    return NextResponse.json({
      facilityId,
      month,
      totalSites: Object.keys(campsites).length,
      available,
      reserved,
      siteTypes,
      loops: Array.from(loopSet).filter(Boolean),
    })
  } catch (err) {
    console.error('Availability fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}
