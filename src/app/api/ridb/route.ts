import { NextRequest, NextResponse } from 'next/server'

const RIDB_BASE = 'https://ridb.recreation.gov/api/v1'

/**
 * Server-side proxy for RIDB API.
 * Keeps RIDB_API_KEY secret — never exposed to the client.
 *
 * Usage from client:
 *   GET /api/ridb?endpoint=facilities&query=tahoe&limit=5
 *   GET /api/ridb?endpoint=facilities/232455
 *   GET /api/ridb?endpoint=facilities/232455/campsites
 */
export async function GET(req: NextRequest) {
  const apiKey = process.env.RIDB_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'RIDB_API_KEY not configured' },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(req.url)
  const endpoint = searchParams.get('endpoint')
  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint param' }, { status: 400 })
  }

  // Forward all other params (query, limit, offset, state, activity, etc.)
  const forwardParams = new URLSearchParams()
  searchParams.forEach((value, key) => {
    if (key !== 'endpoint') forwardParams.set(key, value)
  })

  const ridbUrl = `${RIDB_BASE}/${endpoint}${forwardParams.toString() ? '?' + forwardParams.toString() : ''}`

  try {
    const res = await fetch(ridbUrl, {
      headers: {
        apikey: apiKey,
        accept: 'application/json',
      },
      // Cache responses for 5 minutes — availability data doesn't change instantly
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`RIDB API error ${res.status}: ${text}`)
      return NextResponse.json(
        { error: `RIDB returned ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('RIDB proxy error:', err)
    return NextResponse.json({ error: 'RIDB request failed' }, { status: 500 })
  }
}
