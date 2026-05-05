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
  const parkCode = searchParams.get('parkCode')
  if (!parkCode) return NextResponse.json({ error: 'parkCode required' }, { status: 400 })

  // Check cache — 2hr TTL (NPS updates every 2hr)
  const { data: cached } = await getSupabase()
    .from('nps_alerts_cache')
    .select('data, fetched_at')
    .eq('park_code', parkCode)
    .single()

  if (cached) {
    const ageMs = Date.now() - new Date(cached.fetched_at).getTime()
    if (ageMs < 2 * 60 * 60 * 1000) {
      return NextResponse.json(cached.data, { headers: { 'Cache-Control': 'public, max-age=3600' } })
    }
  }

  const apiKey = process.env.NPS_API_KEY || 'DEMO_KEY'

  try {
    const [alertsRes, newsRes] = await Promise.all([
      fetch(`https://developer.nps.gov/api/v1/alerts?parkCode=${parkCode}&limit=10`, {
        headers: { 'X-Api-Key': apiKey },
        signal: AbortSignal.timeout(8000),
      }),
      fetch(`https://developer.nps.gov/api/v1/newsreleases?parkCode=${parkCode}&limit=3`, {
        headers: { 'X-Api-Key': apiKey },
        signal: AbortSignal.timeout(8000),
      }),
    ])

    const alertsData = alertsRes.ok ? await alertsRes.json() : { data: [] }
    const newsData = newsRes.ok ? await newsRes.json() : { data: [] }

    const alerts = (alertsData.data || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      category: a.category, // Danger, Caution, Information, Park Closure
      description: a.description?.slice(0, 300),
      url: a.url,
      lastIndexedDate: a.lastIndexedDate,
    }))

    const news = (newsData.data || []).map((n: any) => ({
      title: n.title,
      abstract: n.abstract?.slice(0, 200),
      releaseDate: n.releaseDate,
      url: n.url,
    }))

    const data = { parkCode, alerts, news, fetchedAt: new Date().toISOString() }

    await getSupabase().from('nps_alerts_cache').upsert(
      { park_code: parkCode, data, fetched_at: new Date().toISOString() },
      { onConflict: 'park_code' }
    )

    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  } catch (err: any) {
    if (cached) return NextResponse.json(cached.data)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
