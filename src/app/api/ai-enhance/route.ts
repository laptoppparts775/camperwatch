import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { name, description, amenities, site_types, state, address } = await req.json()

  const prompt = `You are an expert at writing compelling campground listings that attract real campers.

Write an enhanced listing for this campground:
- Name: ${name}
- Location: ${address}, ${state}
- Site types: ${site_types?.join(', ')}
- Amenities: ${amenities?.join(', ')}
- Owner description: ${description || 'Not provided'}

Return ONLY valid JSON, no markdown:
{"tagline":"One punchy sentence under 12 words","description":"2-3 paragraphs. Honest, specific, experiential. What type of camper will love this?","pro_tips":["3-5 insider tips a real camper would appreciate"],"best_for":["3-4 labels like Families, RV travelers, Couples, Dog owners"],"target_audience":"One sentence on the ideal camper"}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const data = await response.json()
    const text = data.content?.[0]?.text || '{}'
    const result = JSON.parse(text.replace(/```json|```/g, '').trim())
    return NextResponse.json({ success: true, result, tokens: data.usage?.output_tokens || 0 })
  } catch {
    return NextResponse.json({ success: false, error: 'Enhancement failed' }, { status: 500 })
  }
}
