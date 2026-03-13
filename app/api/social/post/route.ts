import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const AYRSHARE_KEY = () => process.env.AYRSHARE_API_KEY ?? ''

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, platform } = await req.json()

  // Get post content
  const { data: post } = await supabase
    .from('postpilot_posts')
    .select('content')
    .eq('id', postId)
    .eq('user_id', user.id)
    .single()
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Truncate for Twitter
  const content = platform === 'twitter' ? post.content.slice(0, 280) : post.content

  // Post via Ayrshare (uses connected accounts on the main profile)
  const res = await fetch('https://app.ayrshare.com/api/post', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AYRSHARE_KEY()}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      post:      content,
      platforms: [platform],
    }),
  })

  const data = await res.json()

  if (data.status === 'error' || (data.errors?.length && !data.postIds)) {
    const msg = data.errors?.[0]?.message ?? data.message ?? 'Posting failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // Mark as posted in DB
  await supabase.from('postpilot_posts').update({ status: 'posted' }).eq('id', postId)
  return NextResponse.json({ ok: true, id: data.id })
}
