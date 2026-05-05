import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const NWS = 'https://api.weather.gov'
const UA = 'CamperWatch/1.0 (camperwatch.org)'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fetchNWS(lat: number, lng: number) {
  // Step 1: resolve NWS grid point
  const pointRes = await fetch(`${NWS}/points/${lat},${lng}`, {
    headers: { 'User-Agent': UA, 'Accept': 'application/geo+json' },
    signal: AbortSignal.timeout(8000),
  })
  if (!pointRes.ok) throw new Error(`NWS points ${pointRes.status}`)
  const point = await pointRes.json()
  const { forecast: forecastUrl, forecastHourly } = point.properties

  // Step 2: 7-day forecast
  const forecastRes = await fetch(forecastUrl, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(8000),
  })
  if (!forecastRes.ok) throw new Error(`NWS forecast ${forecastRes.status}`)
  const forecastData = await forecastRes.json()

  const periods = forecastData.properties.periods.slice(0, 14).map((p: any) => ({
    name: p.name,
    temp: p.temperature,
    unit: p.temperatureUnit,
    isDaytime: p.isDaytime,
    shortForecast: p.shortForecast,
    detailedForecast: p.detailedForecast,
    windSpeed: p.windSpeed,
    windDirection: p.windDirection,
    icon: p.icon,
    precipProbability: p.probabilityOfPrecipitation?.value ?? null,
  }))

  // Step 3: active alerts
  const alertsRes = await fetch(`${NWS}/alerts/active?point=${lat},${lng}`, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(6000),
  })
  const alertsData = alertsRes.ok ? await alertsRes.json() : { features: [] }
  const alerts = (alertsData.features || []).map((f: any) => ({
    event: f.properties.event,
    severity: f.properties.severity,
    headline: f.properties.headline,
    description: f.properties.description?.slice(0, 500),
    expires: f.properties.expires,
  }))

  return { periods, alerts, source: 'nws', fetchedAt: new Date().toISOString() }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 })
  }

  const latR = Math.round(lat * 1000) / 1000
  const lngR = Math.round(lng * 1000) / 1000

  // Check cache — 1 hour TTL for weather
  const { data: cached } = await supabase
    .from('weather_cache')
    .select('data, fetched_at')
    .eq('lat', latR)
    .eq('lng', lngR)
    .single()

  if (cached) {
    const ageMs = Date.now() - new Date(cached.fetched_at).getTime()
    if (ageMs < 60 * 60 * 1000) { // < 1 hour
      return NextResponse.json({ ...cached.data, cacheAgeMin: Math.round(ageMs / 60000) },
        { headers: { 'Cache-Control': 'public, max-age=900' } })
    }
  }

  try {
    const data = await fetchNWS(lat, lng)

    // Write to cache (upsert by coords)
    await supabase.from('weather_cache').upsert(
      { lat: latR, lng: lngR, data, fetched_at: new Date().toISOString() },
      { onConflict: 'lat,lng' }
    )

    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, max-age=900' } })
  } catch (err: any) {
    // Fall back to cached even if stale
    if (cached) return NextResponse.json({ ...cached.data, stale: true })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
