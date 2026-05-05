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
  const lat = parseFloat(searchParams.get('lat') || '')
  const lng = parseFloat(searchParams.get('lng') || '')
  if (isNaN(lat) || isNaN(lng)) return NextResponse.json({ error: 'lat/lng required' }, { status: 400 })

  const today = new Date().toISOString().slice(0, 10)
  const key = `${Math.round(lat * 100) / 100}_${Math.round(lng * 100) / 100}_${today}`

  const { data: cached } = await getSupabase()
    .from('sunrise_cache')
    .select('data, fetched_at')
    .eq('id', key)
    .single()

  if (cached) {
    return NextResponse.json(cached.data, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  }

  try {
    // Fetch today + tomorrow
    const [todayRes, tomorrowRes] = await Promise.all([
      fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0&date=${today}`, { signal: AbortSignal.timeout(6000) }),
      fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0&date=tomorrow`, { signal: AbortSignal.timeout(6000) }),
    ])

    const [todayData, tomorrowData] = await Promise.all([
      todayRes.ok ? todayRes.json() : null,
      tomorrowRes.ok ? tomorrowRes.json() : null,
    ])

    const parseTime = (isoStr: string, tz: string) => {
      if (!isoStr) return null
      return new Date(isoStr).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz
      })
    }

    // Use browser timezone on client — serve UTC times, client formats
    const data = {
      today: {
        sunrise: todayData?.results?.sunrise,
        sunset: todayData?.results?.sunset,
        solarNoon: todayData?.results?.solar_noon,
        dayLength: todayData?.results?.day_length,
        civilTwilightBegin: todayData?.results?.civil_twilight_begin,
        civilTwilightEnd: todayData?.results?.civil_twilight_end,
      },
      tomorrow: {
        sunrise: tomorrowData?.results?.sunrise,
        sunset: tomorrowData?.results?.sunset,
      },
      date: today,
      fetchedAt: new Date().toISOString(),
    }

    await getSupabase().from('sunrise_cache').upsert(
      { id: key, data, fetched_at: new Date().toISOString() },
      { onConflict: 'id' }
    )

    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  } catch (err: any) {
    if (cached) return NextResponse.json((cached as any).data)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
