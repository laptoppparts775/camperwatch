import { NextRequest, NextResponse } from 'next/server'

const RIDB_BASE = 'https://ridb.recreation.gov/api/v1'

export async function GET(req: NextRequest) {
  const apiKey = process.env.RIDB_API_KEY // optional — public endpoints work without it

  const { searchParams } = new URL(req.url)
  const endpoint = searchParams.get('endpoint')
  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint param' }, { status: 400 })
  }

  const forwardParams = new URLSearchParams()
  searchParams.forEach((value, key) => {
    if (key !== 'endpoint') forwardParams.set(key, value)
  })

  const ridbUrl = `${RIDB_BASE}/${endpoint}${forwardParams.toString() ? '?' + forwardParams.toString() : ''}`
  const headers: Record<string, string> = { accept: 'application/json' }
  if (apiKey) headers['apikey'] = apiKey

  try {
    const res = await fetch(ridbUrl, {
      headers,
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`RIDB API error ${res.status}: ${text}`)
      return NextResponse.json({ error: `RIDB returned ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('RIDB proxy error:', err)
    return NextResponse.json({ error: 'RIDB request failed' }, { status: 500 })
  }
}
