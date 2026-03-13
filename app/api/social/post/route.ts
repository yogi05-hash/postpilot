import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, platform } = await req.json()

  // Get the post content
  const { data: post } = await supabase.from('postpilot_posts').select('content,status').eq('id', postId).eq('user_id', user.id).single()
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Get social account token
  const service = createServiceClient()
  const { data: account } = await service.from('postpilot_social_accounts').select('access_token,account_name').eq('user_id', user.id).eq('platform', platform).single()
  if (!account?.access_token) return NextResponse.json({ error: `${platform} not connected` }, { status: 400 })

  try {
    if (platform === 'twitter') {
      const res = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${account.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: post.content.slice(0, 280) }),
      })
      const data = await res.json()
      if (!res.ok) return NextResponse.json({ error: data.detail || data.title || 'Twitter error' }, { status: 500 })
      // Mark as posted
      await supabase.from('postpilot_posts').update({ status: 'posted' }).eq('id', postId)
      return NextResponse.json({ ok: true, tweet_id: data.data?.id })
    }

    if (platform === 'linkedin') {
      // Get LinkedIn user ID
      const { data: acct } = await service.from('postpilot_social_accounts').select('account_id').eq('user_id', user.id).eq('platform', 'linkedin').single()
      const authorUrn = `urn:li:person:${acct?.account_id}`
      const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${account.access_token}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
        body: JSON.stringify({
          author: authorUrn,
          lifecycleState: 'PUBLISHED',
          specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text: post.content }, shareMediaCategory: 'NONE' } },
          visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
        }),
      })
      const data = await res.json()
      if (!res.ok) return NextResponse.json({ error: data.message || 'LinkedIn error' }, { status: 500 })
      await supabase.from('postpilot_posts').update({ status: 'posted' }).eq('id', postId)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Platform not supported for direct posting' }, { status: 400 })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
