import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const state = searchParams.get('state')
  const storedState = req.cookies.get('li_oauth_state')?.value

  if (!code || state !== storedState) return NextResponse.redirect(new URL('/dashboard/settings?error=linkedin_auth_failed', req.url))

  // Exchange code for token
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      redirect_uri:  process.env.NEXT_PUBLIC_BASE_URL + '/api/social/linkedin/callback',
      client_id:     process.env.LINKEDIN_CLIENT_ID ?? '',
      client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? '',
    }),
  })
  const tokens = await tokenRes.json()
  if (!tokens.access_token) return NextResponse.redirect(new URL('/dashboard/settings?error=linkedin_token_failed', req.url))

  // Get LinkedIn profile
  const meRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  })
  const me = await meRes.json()
  const name = me.name ?? me.given_name ?? 'LinkedIn User'

  const service = createServiceClient()
  await service.from('postpilot_social_accounts').upsert({
    user_id:       user.id,
    platform:      'linkedin',
    access_token:  tokens.access_token,
    refresh_token: tokens.refresh_token ?? null,
    expires_at:    tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null,
    account_name:  name,
    account_id:    me.sub ?? null,
    updated_at:    new Date().toISOString(),
  }, { onConflict: 'user_id,platform' })

  const redirectUrl = new URL('/dashboard/settings', req.url)
  redirectUrl.searchParams.set('connected', 'linkedin')
  const res = NextResponse.redirect(redirectUrl)
  res.cookies.delete('li_oauth_state')
  return res
}
