import { NextRequest, NextResponse } from 'next/server'

const RIDB_BASE = 'https://ridb.recreation.gov/api/v1'

export async function GET(req: NextRequest) {
  const apiKey = process.env.RIDB_API_KEY // optional

  const { searchParams } = new URL(req.url)
  const facilityId = searchParams.get('facilityId')
  if (!facilityId) {
    return NextResponse.json({ error: 'Missing facilityId' }, { status: 400 })
  }

  const now = new Date()
  const dateFrom = new Date(now)
  dateFrom.setFullYear(dateFrom.getFullYear() - 1)
  const fmt = (d: Date) => d.toISOString().split('T')[0]

  const headers: Record<string, string> = { accept: 'application/json' }
  if (apiKey) headers['apikey'] = apiKey

  let allReservations: any[] = []
  let page = 0

  try {
    while (page < 10) {
      const params = new URLSearchParams({
        dateFrom: fmt(dateFrom),
        dateTo: fmt(now),
        limit: '50',
        page: String(page),
      })
      const res = await fetch(`${RIDB_BASE}/reservations?${params}`, {
        headers,
        next: { revalidate: 3600 },
      })
      if (!res.ok) break
      const json = await res.json()
      const records: any[] = json.data ?? []
      const facilityRecords = records.filter(
        (r: any) => r.FacilityID === facilityId || r.LegacyFacilityID === facilityId
      )
      allReservations = allReservations.concat(facilityRecords)
      if (records.length < 50) break
      page++
    }

    if (allReservations.length === 0) {
      return NextResponse.json({ facilityId, total: 0 })
    }

    const monthCounts: Record<string, number> = {}
    let totalNights = 0
    let totalPeople = 0
    const equipmentCounts: Record<string, number> = {}

    for (const r of allReservations) {
      totalNights += parseInt(r.Nights) || 0
      totalPeople += parseInt(r.NumberOfPeople) || 0
      if (r.StartDate) {
        const month = r.StartDate.slice(0, 7)
        monthCounts[month] = (monthCounts[month] || 0) + 1
      }
      if (r.EquipmentDescription) {
        equipmentCounts[r.EquipmentDescription] = (equipmentCounts[r.EquipmentDescription] || 0) + 1
      }
    }

    const total = allReservations.length
    const avgNights = total > 0 ? Math.round((totalNights / total) * 10) / 10 : 0
    const avgPeople = total > 0 ? Math.round((totalPeople / total) * 10) / 10 : 0

    const sortedMonths = Object.entries(monthCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([month, count]) => ({ month, count }))
    const peakMonths = sortedMonths.slice(0, 3).map(m => new Date(m.month + '-01').toLocaleString('en-US', { month: 'long' }))
    const topEquipment = Object.entries(equipmentCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([type, count]) => ({ type, count }))

    return NextResponse.json({ facilityId, total, avgNights, avgPeople, peakMonths, monthlyBreakdown: sortedMonths, topEquipment })
  } catch (err) {
    console.error('RIDB reservations error:', err)
    return NextResponse.json({ error: 'Failed to fetch reservation data' }, { status: 500 })
  }
}
