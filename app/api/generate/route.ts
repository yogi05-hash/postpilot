import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { business } = await req.json()

    const prompt = `Social media strategist. Generate 7 posts for:
Business: ${business.name} — ${business.description}
Audience: ${business.audience} | Niche: ${business.niche} | Tone: ${business.tone}

Return ONLY valid JSON, no markdown, no backticks:
{"posts":[
{"platform":"twitter","content":"<280 chars, punchy hook, no hashtag spam>"},
{"platform":"linkedin","content":"<120 words, thought leadership, end with question>"},
{"platform":"instagram","content":"<80 words caption + 5 hashtags>"},
{"platform":"twitter","content":"<280 chars, bold claim or data point>"},
{"platform":"linkedin","content":"<120 words, practical tip>"},
{"platform":"twitter","content":"<280 chars, relatable pain point>"},
{"platform":"instagram","content":"<80 words, behind-the-scenes + 5 hashtags>"}
]}`

    // Use Anthropic API directly via fetch to avoid SDK timeout issues
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!anthropicRes.ok) {
      const err = await anthropicRes.json()
      return NextResponse.json({ error: err.error?.message ?? 'Anthropic error' }, { status: 500 })
    }

    const data = await anthropicRes.json()
    let text = data.content?.[0]?.text ?? ''

    // Strip markdown code fences if present
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()

    let parsed: { posts: { platform: string; content: string }[] }
    try {
      parsed = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response', raw: text.slice(0, 200) }, { status: 500 })
    }

    // Save to DB
    const { data: bizData } = await supabase
      .from('postpilot_businesses')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (bizData) {
      const postsToInsert = parsed.posts.map((p) => ({
        user_id: user.id,
        business_id: bizData.id,
        platform: p.platform,
        content: p.content,
        status: 'pending',
        week_of: new Date().toISOString().split('T')[0],
      }))
      await supabase.from('postpilot_posts').insert(postsToInsert)
    }

    return NextResponse.json(parsed)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
