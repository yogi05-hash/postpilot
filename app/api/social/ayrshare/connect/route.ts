import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase-server'
import { createUserProfile, getSocialConnectUrl } from '@/lib/ayrshare'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  const service = createServiceClient()

  // Check if user already has an Ayrshare profile
  const { data: profile } = await service
    .from('postpilot_profiles')
    .select('ayrshare_profile_key')
    .eq('id', user.id)
    .single()

  let profileKey = profile?.ayrshare_profile_key

  // Create profile if needed
  if (!profileKey) {
    profileKey = await createUserProfile(user.id, user.email ?? '')
    if (!profileKey) return NextResponse.json({ error: 'Failed to create Ayrshare profile' }, { status: 500 })
    await service.from('postpilot_profiles').update({ ayrshare_profile_key: profileKey }).eq('id', user.id)
  }

  // Get hosted connect URL
  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings?connected=social`
  const connectUrl  = await getSocialConnectUrl(profileKey, redirectUrl)

  if (!connectUrl) return NextResponse.json({ error: 'Failed to generate connect URL' }, { status: 500 })
  return NextResponse.redirect(connectUrl)
}
