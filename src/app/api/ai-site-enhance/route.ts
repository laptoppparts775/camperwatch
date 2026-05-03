import { NextResponse } from 'next/server'

/**
 * 1.7.5 + 1.7.6 — AI auto-fill for individual sites
 *
 * Two modes:
 *   mode='description'      — generate site_description from keywords + parent context
 *   mode='welcome_message'  — generate guest welcome / arrival instructions
 *
 * Reads ANTHROPIC_API_KEY from env. Returns 503 with a helpful message if missing
 * so the UI can show "AI is not configured yet" rather than failing silently.
 */

type Body = {
  mode: 'description' | 'welcome_message'
  // common context
  site_name?: string
  site_type?: string
  parent_campground_name?: string
  // for description
  keywords?: string
  amenities?: string
  // for welcome_message
  check_in?: string
  check_out?: string
  house_rules?: string
  pet_policy?: string
}

const PROMPT_DESCRIPTION = (b: Body) => `You write short, honest, specific campsite descriptions that help real campers decide.

Write a 2-3 sentence description for one specific bookable SITE inside a larger campground. Avoid hype. Be concrete. Mention what kind of camper would love it.

Site name: ${b.site_name || 'unnamed'}
Site type: ${b.site_type || 'tent'}
Inside campground: ${b.parent_campground_name || 'unknown'}
Amenities at this site: ${b.amenities || 'not specified'}
Owner's keywords / vibe: ${b.keywords || 'not provided'}

Return ONLY a single string. No JSON, no quotes, no preamble. Just the description text.`

const PROMPT_WELCOME = (b: Body) => `You write friendly, useful arrival messages that go in a booking confirmation email.

Write a short welcome / arrival-instructions message (3-5 sentences) for a guest who just booked this site. Tone: warm but practical. Include a placeholder where the owner can paste a gate code, lock combo, or directions. Mention check-in/out times if given.

Site name: ${b.site_name || 'your site'}
Inside campground: ${b.parent_campground_name || 'our campground'}
Check-in: ${b.check_in || 'not set'}
Check-out: ${b.check_out || 'not set'}
House rules: ${b.house_rules || 'standard quiet hours'}
Pet policy: ${b.pet_policy || 'not specified'}

Return ONLY the message text. No JSON, no preamble. Use [GATE CODE] as a literal placeholder for the owner to fill in.`

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

  if (body.mode !== 'description' && body.mode !== 'welcome_message') {
    return NextResponse.json({ success: false, error: 'Invalid mode' }, { status: 400 })
  }

  const prompt = body.mode === 'description'
    ? PROMPT_DESCRIPTION(body)
    : PROMPT_WELCOME(body)

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
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error:', response.status, errText)
      return NextResponse.json({
        success: false,
        error: `AI request failed (${response.status})`,
      }, { status: 502 })
    }

    const data = await response.json()
    const text = (data.content?.[0]?.text || '').trim()
    if (!text) {
      return NextResponse.json({ success: false, error: 'AI returned empty response' }, { status: 502 })
    }
    return NextResponse.json({ success: true, text })
  } catch (err) {
    console.error('ai-site-enhance error:', err)
    return NextResponse.json({ success: false, error: 'AI request failed' }, { status: 500 })
  }
}
