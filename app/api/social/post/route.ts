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

  // Post to LinkedIn via ugcPosts API
  const authorUrn = `urn:li:person:${account.account_id}`
  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization':              `Bearer ${account.access_token}`,
      'Content-Type':               'application/json',
      'X-Restli-Protocol-Version':  '2.0.0',
    },
    body: JSON.stringify({
      author:         authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary:    { text: post.content },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    const msg = data.message ?? data.status ?? 'LinkedIn posting failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // Mark as posted
  await supabase.from('postpilot_posts').update({ status: 'posted' }).eq('id', postId)
  return NextResponse.json({ ok: true, postId: data.id })
}
