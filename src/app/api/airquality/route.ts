import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const AQI_LEVELS = [
  { max: 50,  label: 'Good',            color: 'green',  desc: 'Air quality is satisfactory.' },
  { max: 100, label: 'Moderate',        color: 'yellow', desc: 'Acceptable. Some pollutants may affect very sensitive people.' },
  { max: 150, label: 'Unhealthy for sensitive groups', color: 'orange', desc: 'Members of sensitive groups may experience health effects.' },
  { max: 200, label: 'Unhealthy',       color: 'red',    desc: 'Everyone may begin to experience health effects.' },
  { max: 300, label: 'Very Unhealthy',  color: 'purple', desc: 'Health warnings of emergency conditions.' },
  { max: 500, label: 'Hazardous',       color: 'maroon', desc: 'Health alert: everyone may experience serious health effects.' },
]

function getAQILevel(aqi: number) {
  return AQI_LEVELS.find(l => aqi <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1]
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  if (isNaN(lat) || isNaN(lng)) return NextResponse.json({ error: 'lat/lng required' }, { status: 400 })

  const key = `${Math.round(lat * 100) / 100}_${Math.round(lng * 100) / 100}`

  // 1hr cache
  const { data: cached } = await supabase
    .from('airquality_cache')
    .select('data, fetched_at')
    .eq('id', key)
    .single()

  if (cached) {
    const ageMs = Date.now() - new Date(cached.fetched_at).getTime()
    if (ageMs < 60 * 60 * 1000) {
      return NextResponse.json(cached.data, { headers: { 'Cache-Control': 'public, max-age=1800' } })
    }
  }

  const apiKey = process.env.AIRNOW_API_KEY
  if (!apiKey) {
    // Return null gracefully — AirNow key not yet configured
    return NextResponse.json({ available: false, reason: 'AirNow API key not configured' })
  }

  try {
    const res = await fetch(
      `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${lat}&longitude=${lng}&distance=50&API_KEY=${apiKey}`,
      { signal: AbortSignal.timeout(8000) }
    )

    if (!res.ok) throw new Error(`AirNow ${res.status}`)
    const observations = await res.json()

    if (!observations?.length) {
      return NextResponse.json({ available: true, noData: true })
    }

    // Find overall AQI (highest)
    const overall = observations.reduce((best: any, obs: any) =>
      !best || obs.AQI > best.AQI ? obs : best, null)

    const level = getAQILevel(overall.AQI)

    const data = {
      available: true,
      aqi: overall.AQI,
      category: overall.Category?.Name || level.label,
      level: level.label,
      color: level.color,
      description: level.desc,
      pollutants: observations.map((o: any) => ({
        name: o.ParameterName,
        aqi: o.AQI,
        category: o.Category?.Name,
      })),
      reportingArea: overall.ReportingArea,
      stateCode: overall.StateCode,
      dateObserved: overall.DateObserved,
      hourObserved: overall.HourObserved,
      fetchedAt: new Date().toISOString(),
    }

    await supabase.from('airquality_cache').upsert(
      { id: key, data, fetched_at: new Date().toISOString() },
      { onConflict: 'id' }
    )

    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, max-age=1800' } })
  } catch (err: any) {
    if (cached) return NextResponse.json(cached.data)
    return NextResponse.json({ available: false, error: err.message })
  }
}
