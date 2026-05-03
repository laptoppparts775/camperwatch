import { NextResponse } from 'next/server'

/**
 * 1.7.9 — AI vision: suggest amenity tags from site photos
 *
 * Owner has uploaded photos. They click "Suggest amenities from photos."
 * We call Claude Sonnet 4 vision with the image URLs and ask for a flat
 * JSON list of canonical amenity tags. Owner picks/rejects from chips.
 *
 * MANUAL trigger only — never auto-run on upload (per session decision:
 * keeps cost bounded + gives owner control).
 *
 * Cost guard: cap at 5 images per request.
 */

const MAX_IMAGES = 5

// Canonical tag list. Constrains the model to consistent vocabulary.
// Keep this aligned with what we display elsewhere on /book and /campground pages.
const ALLOWED_TAGS = [
  'Picnic table', 'Fire ring', 'Fire pit', 'BBQ grill', 'Shade trees',
  'Full sun', 'Lake view', 'Mountain view', 'River access', 'Beach access',
  'Privacy screen', 'Open layout', 'Pull-through', 'Back-in', 'Level pad',
  'Gravel pad', 'Grass pad', 'Concrete pad', 'Paved pad',
  'Electric hookup', 'Water hookup', 'Sewer hookup', 'Full hookup', '50-amp', '30-amp',
  'Picnic shelter', 'Tent pad', 'Hammock-friendly', 'Wheelchair accessible',
  'Near restroom', 'Near shower', 'Near playground', 'Pet-friendly',
  'Quiet section', 'Family section', 'Adult-only section',
] as const

const PROMPT = `You analyze photos of a single bookable campsite and propose amenity tags from a fixed vocabulary.

Look at the photos. Identify visible, concrete features of THIS campsite (not the surrounding campground). Be conservative — only suggest a tag if you can see clear visual evidence in at least one photo. Don't guess at things that aren't visible.

Output rules:
- Return ONLY valid JSON. No prose, no markdown, no code fences.
- Format: {"tags": ["Tag 1", "Tag 2", ...]}
- Use ONLY these exact tag strings: ${ALLOWED_TAGS.join(' | ')}
- Maximum 8 tags. Order by visual prominence.
- If the photos are too blurry/dark/non-relevant to tell, return {"tags": []}.

Now analyze the attached photos and return the JSON.`

type Body = { image_urls?: string[] }

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: 'AI is not configured yet. Set ANTHROPIC_API_KEY in Vercel.',
    }, { status: 503 })
  }

  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }

  const urls = Array.isArray(body.image_urls) ? body.image_urls.filter(u => typeof u === 'string' && u.startsWith('http')) : []
  if (urls.length === 0) {
    return NextResponse.json({
      success: false,
      error: 'Upload at least one photo first.',
    }, { status: 400 })
  }

  const imageUrls = urls.slice(0, MAX_IMAGES)

  // Build the multimodal content: each image followed by the text prompt
  const content: any[] = imageUrls.map(url => ({
    type: 'image',
    source: { type: 'url', url },
  }))
  content.push({ type: 'text', text: PROMPT })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic vision API error:', response.status, errText)
      return NextResponse.json({
        success: false,
        error: `AI request failed (${response.status})`,
      }, { status: 502 })
    }

    const data = await response.json()
    const text = (data.content?.[0]?.text || '').trim()

    // Parse JSON. Strip code fences if present (defensive — prompt says don't but models sometimes do).
    let cleaned = text.replace(/```json\s*/i, '').replace(/```\s*$/, '').trim()
    let parsed: any
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      console.error('AI vision returned non-JSON:', text)
      return NextResponse.json({
        success: false,
        error: 'AI response could not be parsed. Try again.',
      }, { status: 502 })
    }

    const rawTags: unknown = parsed?.tags
    if (!Array.isArray(rawTags)) {
      return NextResponse.json({ success: true, tags: [] })
    }

    // Filter to allowed vocabulary, dedupe, cap at 8
    const allowed = new Set<string>(ALLOWED_TAGS)
    const seen = new Set<string>()
    const finalTags: string[] = []
    for (const t of rawTags) {
      if (typeof t !== 'string') continue
      const trimmed = t.trim()
      if (!allowed.has(trimmed)) continue
      if (seen.has(trimmed)) continue
      seen.add(trimmed)
      finalTags.push(trimmed)
      if (finalTags.length >= 8) break
    }

    return NextResponse.json({ success: true, tags: finalTags })
  } catch (err) {
    console.error('ai-site-vision-amenities error:', err)
    return NextResponse.json({ success: false, error: 'AI request failed' }, { status: 500 })
  }
}
