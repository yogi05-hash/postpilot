import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase-server'
import { postToSocials } from '@/lib/ayrshare'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, platform } = await req.json()

  // Get post content
  const { data: post } = await supabase
    .from('postpilot_posts')
    .select('content, status')
    .eq('id', postId)
    .eq('user_id', user.id)
    .single()
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Get Ayrshare profile key
  const service = createServiceClient()
  const { data: profile } = await service
    .from('postpilot_profiles')
    .select('ayrshare_profile_key')
    .eq('id', user.id)
    .single()

  if (!profile?.ayrshare_profile_key) {
    return NextResponse.json({ error: 'Social accounts not connected. Go to Settings → Connect accounts.' }, { status: 400 })
  }

  // Truncate for Twitter
  const content = platform === 'twitter' ? post.content.slice(0, 280) : post.content

  const result = await postToSocials(profile.ayrshare_profile_key, content, [platform])

  if (result.status === 'error' || result.errors?.length) {
    const msg = result.errors?.[0]?.message ?? result.message ?? 'Posting failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // Mark as posted
  await supabase.from('postpilot_posts').update({ status: 'posted' }).eq('id', postId)
  return NextResponse.json({ ok: true, id: result.id })
}
