import { NextRequest, NextResponse } from 'next/server'

const RIDB_BASE = 'https://ridb.recreation.gov/api/v1'

/**
 * GET /api/ridb/reservations?facilityId=232454&months=12
 *
 * Fetches historical reservation data for a facility from RIDB,
 * then computes demand intelligence:
 *   - total reservations in window
 *   - avg nights per stay
 *   - busiest months
 *   - most common party size
 *   - peak/shoulder/off-season classification
 */
export async function GET(req: NextRequest) {
  const apiKey = process.env.RIDB_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'RIDB_API_KEY not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(req.url)
  const facilityId = searchParams.get('facilityId')
  if (!facilityId) {
    return NextResponse.json({ error: 'Missing facilityId' }, { status: 400 })
  }

  // Pull last 12 months of reservations
  const now = new Date()
  const dateFrom = new Date(now)
  dateFrom.setFullYear(dateFrom.getFullYear() - 1)
  const fmt = (d: Date) => d.toISOString().split('T')[0]

  // RIDB reservations endpoint: paginate up to 500 records
  let allReservations: any[] = []
  let page = 0
  const limit = 50

  try {
    while (page < 10) { // max 500 records (10 pages × 50)
      const params = new URLSearchParams({
        dateFrom: fmt(dateFrom),
        dateTo: fmt(now),
        limit: String(limit),
        page: String(page),
      })
      const res = await fetch(`${RIDB_BASE}/reservations?${params}`, {
        headers: { apikey: apiKey, accept: 'application/json' },
        next: { revalidate: 3600 }, // cache 1 hour
      })
      if (!res.ok) break
      const json = await res.json()
      const records: any[] = json.data ?? []

      // Filter to this facility only
      const facilityRecords = records.filter(
        (r: any) => r.FacilityID === facilityId || r.LegacyFacilityID === facilityId
      )
      allReservations = allReservations.concat(facilityRecords)

      if (records.length < limit) break
      page++
    }

    if (allReservations.length === 0) {
      return NextResponse.json({ facilityId, total: 0, message: 'No reservation data found for this facility' })
    }

    // Compute demand intelligence
    const monthCounts: Record<string, number> = {}
    let totalNights = 0
    let totalPeople = 0
    const equipmentCounts: Record<string, number> = {}

    for (const r of allReservations) {
      const nights = parseInt(r.Nights) || 0
      const people = parseInt(r.NumberOfPeople) || 0
      totalNights += nights
      totalPeople += people

      if (r.StartDate) {
        const month = r.StartDate.slice(0, 7) // YYYY-MM
        monthCounts[month] = (monthCounts[month] || 0) + 1
      }

      if (r.EquipmentDescription) {
        const eq = r.EquipmentDescription
        equipmentCounts[eq] = (equipmentCounts[eq] || 0) + 1
      }
    }

    const total = allReservations.length
    const avgNights = total > 0 ? Math.round((totalNights / total) * 10) / 10 : 0
    const avgPeople = total > 0 ? Math.round((totalPeople / total) * 10) / 10 : 0

    // Top months by booking count
    const sortedMonths = Object.entries(monthCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([month, count]) => ({ month, count }))

    // Top equipment
    const topEquipment = Object.entries(equipmentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }))

    // Peak season = top 3 months, shoulder = next 3
    const topMonthNames = sortedMonths.slice(0, 3).map(m => {
      const d = new Date(m.month + '-01')
      return d.toLocaleString('en-US', { month: 'long' })
    })

    return NextResponse.json({
      facilityId,
      total,
      avgNights,
      avgPeople,
      peakMonths: topMonthNames,
      monthlyBreakdown: sortedMonths,
      topEquipment,
    })
  } catch (err) {
    console.error('RIDB reservations error:', err)
    return NextResponse.json({ error: 'Failed to fetch reservation data' }, { status: 500 })
  }
}
