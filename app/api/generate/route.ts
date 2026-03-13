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

    const prompt = `You are a world-class social media strategist. Generate 7 posts for the following business:

Business: ${business.name}
Description: ${business.description}
Target audience: ${business.audience}
Niche: ${business.niche}
Tone: ${business.tone}

Generate exactly 7 posts in this JSON format. Make them genuinely compelling, specific, and valuable - not generic. Use current trends and real insights:

{
  "posts": [
    {"platform": "twitter", "content": "post content here (max 280 chars, punchy, no hashtag spam)"},
    {"platform": "linkedin", "content": "post content here (professional, 150-200 words, thought leadership)"},
    {"platform": "instagram", "content": "post content here (engaging caption, 100-150 words, 3-5 relevant hashtags)"},
    {"platform": "twitter", "content": "second twitter post"},
    {"platform": "linkedin", "content": "second linkedin post"},
    {"platform": "twitter", "content": "third twitter post - a thread starter"},
    {"platform": "instagram", "content": "second instagram post"}
  ]
}

Return ONLY the JSON, no other text.`

    const message = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
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
