import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase-server'

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

  // Get stored access token
  const service = createServiceClient()
  const { data: account } = await service
    .from('postpilot_social_accounts')
    .select('access_token, account_id')
    .eq('user_id', user.id)
    .eq('platform', platform)
    .single()

  if (!account?.access_token) {
    return NextResponse.json({
      error: `LinkedIn not connected. Go to Settings → Connect LinkedIn.`
    }, { status: 400 })
  }

  let res: Response
  let data: Record<string, unknown>

  if (platform === 'twitter') {
    // Twitter v2 tweet
    const text = post.content.slice(0, 280)
    res = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${account.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    data = await res.json() as Record<string, unknown>
    if (!res.ok) {
      const errData = data as { detail?: string; title?: string }
      return NextResponse.json({ error: errData.detail ?? errData.title ?? 'Twitter posting failed' }, { status: 500 })
    }
  } else {
    // LinkedIn ugcPosts
    const authorUrn = `urn:li:person:${account.account_id}`
    res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization':             `Bearer ${account.access_token}`,
        'Content-Type':              'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author:          authorUrn,
        lifecycleState:  'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary:    { text: post.content },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      }),
    })
    data = await res.json() as Record<string, unknown>
    if (!res.ok) {
      const errData = data as { message?: string; status?: string }
      return NextResponse.json({ error: errData.message ?? errData.status ?? 'LinkedIn posting failed' }, { status: 500 })
    }
  }

  // Mark as posted
  await supabase.from('postpilot_posts').update({ status: 'posted' }).eq('id', postId)
  return NextResponse.json({ ok: true, postId: data.id })
}
