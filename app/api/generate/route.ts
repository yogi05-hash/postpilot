import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase-server'

export const maxDuration = 60 // allow up to 60s for Anthropic generation

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { business } = await req.json()

    const prompt = `Social media strategist. Generate 7 posts for:
Business: ${business.name} — ${business.description}
Audience: ${business.audience} | Niche: ${business.niche} | Tone: ${business.tone}

Return ONLY this JSON (no other text):
{"posts":[
{"platform":"twitter","content":"<280 chars, punchy hook, no hashtag spam>"},
{"platform":"linkedin","content":"<100 words, thought leadership, end with question>"},
{"platform":"instagram","content":"<80 words caption + 5 hashtags>"},
{"platform":"twitter","content":"<280 chars, data point or bold claim>"},
{"platform":"linkedin","content":"<100 words, practical tip>"},
{"platform":"twitter","content":"<280 chars, relatable pain point>"},
{"platform":"instagram","content":"<80 words behind-the-scenes + 5 hashtags>"}
]}`

    const message = await getAnthropic().messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(text)

    // Save to DB
    const { data: bizData } = await supabase
      .from('postpilot_businesses')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (bizData) {
      const postsToInsert = parsed.posts.map((p: { platform: string; content: string }) => ({
        user_id: user.id,
        business_id: bizData.id,
        platform: p.platform,
        content: p.content,
        status: 'pending',
        week_of: new Date().toISOString().split('T')[0]
      }))
      await supabase.from('postpilot_posts').insert(postsToInsert)
    }

    return NextResponse.json(parsed)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
