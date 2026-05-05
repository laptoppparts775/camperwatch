import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// All federal campgrounds with RIDB facility IDs
const FACILITIES = [
  { slug: 'zephyr-cove',              facilityId: '10300216' },
  { slug: 'nevada-beach',             facilityId: '232768' },
  { slug: 'fallen-leaf',              facilityId: '232769' },
  { slug: 'mount-rose',               facilityId: '232186' },
  { slug: 'watchman-campground',      facilityId: '232445' },
  { slug: 'colter-bay-grand-teton',   facilityId: '258830' },
  { slug: 'moraine-park-rmnp',        facilityId: '232463' },
  { slug: 'upper-pines-yosemite',     facilityId: '232447' },
  { slug: 'sol-duc-olympic',          facilityId: '251906' },
  { slug: 'apgar-glacier',            facilityId: '10171274' },
  { slug: 'mather-grand-canyon',      facilityId: '232490' },
  { slug: 'south-campground-zion',    facilityId: '272266' },
  { slug: 'blackwoods-acadia',        facilityId: '232508' },
  { slug: 'elkmont-smoky-mountains',  facilityId: '232487' },
  { slug: 'assateague-island-oceanside', facilityId: '232507' },
  { slug: 'mazama-crater-lake',       facilityId: '10337002' },
  { slug: 'jumbo-rocks-joshua-tree',  facilityId: '272300' },
  { slug: 'st-mary-glacier',          facilityId: '232492' },
  { slug: 'big-meadows-shenandoah',   facilityId: '232459' },
]

const REC_GOV = 'https://www.recreation.gov/api/camps/availability/campground'

async function fetchAndProcess(facilityId: string, month: string) {
  const startDate = encodeURIComponent(`${month}T00:00:00.000Z`)
  const url = `${REC_GOV}/${facilityId}/month?start_date=${startDate}`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CamperWatch/1.0)',
      'Accept': 'application/json',
    },
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const data = await res.json()
  const campsites: Record<string, any> = data.campsites ?? {}

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
  }
}

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized triggers
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Sync current month + next month
  const now = new Date()
  const months = [
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`,
    (() => {
      const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-01`
    })(),
  ]

  const results = { synced: 0, errors: 0, skipped: 0 }

  for (const { facilityId } of FACILITIES) {
    for (const month of months) {
      try {
        const processed = await fetchAndProcess(facilityId, month)

        const { error } = await getSupabase()
          .from('availability_cache')
          .upsert({
            facility_id: facilityId,
            month,
            data: processed,
            fetched_at: new Date().toISOString(),
          }, { onConflict: 'facility_id,month' })

        if (error) {
          console.error(`Supabase upsert error ${facilityId}/${month}:`, error)
          results.errors++
        } else {
          results.synced++
        }

        // Small delay to avoid hammering rec.gov
        await new Promise(r => setTimeout(r, 200))
      } catch (err) {
        console.error(`Fetch error ${facilityId}/${month}:`, err)
        results.errors++
      }
    }
  }

  return NextResponse.json({
    ok: true,
    ...results,
    facilities: FACILITIES.length,
    months: months.length,
    timestamp: new Date().toISOString(),
  })
}
