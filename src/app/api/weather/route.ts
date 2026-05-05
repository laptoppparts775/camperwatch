import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const NWS = 'https://api.weather.gov'
const UA = 'CamperWatch/1.0 (camperwatch.org)'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function fetchNWS(lat: number, lng: number) {
  const pointRes = await fetch(`${NWS}/points/${lat},${lng}`, {
    headers: { 'User-Agent': UA, 'Accept': 'application/geo+json' },
    signal: AbortSignal.timeout(8000),
  })
  if (!pointRes.ok) throw new Error(`NWS points ${pointRes.status}`)
  const point = await pointRes.json()
  const { forecast: forecastUrl } = point.properties

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

  return { periods, alerts }
}

async function fetchOpenMeteo(lat: number, lng: number) {
  // UV index + wind gusts — not available in NWS API
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=uv_index_max,windgusts_10m_max,precipitation_probability_max&temperature_unit=fahrenheit&timezone=auto&forecast_days=7`
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
  if (!res.ok) return null
  const data = await res.json()
  const daily = data.daily || {}
  return {
    dates: daily.time || [],
    uvIndex: daily.uv_index_max || [],
    windGusts: daily.windgusts_10m_max || [],
    precipProb: daily.precipitation_probability_max || [],
  }
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

  const { data: cached } = await getSupabase()
    .from('weather_cache')
    .select('data, fetched_at')
    .eq('lat', latR)
    .eq('lng', lngR)
    .single()

  if (cached) {
    const ageMs = Date.now() - new Date(cached.fetched_at).getTime()
    if (ageMs < 60 * 60 * 1000) {
      return NextResponse.json({ ...cached.data, cacheAgeMin: Math.round(ageMs / 60000) },
        { headers: { 'Cache-Control': 'public, max-age=900' } })
    }
  }

  try {
    const [nws, openMeteo] = await Promise.allSettled([
      fetchNWS(lat, lng),
      fetchOpenMeteo(lat, lng),
    ])

    const nwsData = nws.status === 'fulfilled' ? nws.value : { periods: [], alerts: [] }
    const omData = openMeteo.status === 'fulfilled' ? openMeteo.value : null

    const result = {
      periods: nwsData.periods,
      alerts: nwsData.alerts,
      uvIndex: omData?.uvIndex ?? [],
      windGusts: omData?.windGusts ?? [],
      precipProb: omData?.precipProb ?? [],
      uvDates: omData?.dates ?? [],
      source: 'nws+openmeteo',
      fetchedAt: new Date().toISOString(),
    }

    await getSupabase().from('weather_cache').upsert(
      { lat: latR, lng: lngR, data: result, fetched_at: new Date().toISOString() },
      { onConflict: 'lat,lng' }
    )

    return NextResponse.json(result, { headers: { 'Cache-Control': 'public, max-age=900' } })
  } catch (err: any) {
    if (cached) return NextResponse.json({ ...cached.data, stale: true })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
