import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const state = searchParams.get('state')

  const storedState    = req.cookies.get('tw_oauth_state')?.value
  const codeVerifier   = req.cookies.get('tw_code_verifier')?.value

  if (!code || state !== storedState || !codeVerifier) {
    return NextResponse.redirect(new URL('/dashboard/settings?error=twitter_auth_failed', req.url))
  }

  // Exchange code for token
  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.NEXT_PUBLIC_BASE_URL + '/api/social/twitter/callback',
      code_verifier: codeVerifier,
    }),
  })
  const tokens = await tokenRes.json()
  if (!tokens.access_token) return NextResponse.redirect(new URL('/dashboard/settings?error=twitter_token_failed', req.url))

  // Get Twitter username
  const meRes = await fetch('https://api.twitter.com/2/users/me', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  })
  const me = await meRes.json()
  const handle = me.data?.username ?? 'unknown'

  // Store in Supabase using service role (bypasses RLS for upsert)
  const service = createServiceClient()
  await service.from('postpilot_social_accounts').upsert({
    user_id:       user.id,
    platform:      'twitter',
    access_token:  tokens.access_token,
    refresh_token: tokens.refresh_token ?? null,
    expires_at:    tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null,
    account_name:  `@${handle}`,
    account_id:    me.data?.id ?? null,
    updated_at:    new Date().toISOString(),
  }, { onConflict: 'user_id,platform' })

  const redirectUrl = new URL('/dashboard/settings', req.url)
  redirectUrl.searchParams.set('connected', 'twitter')
  const res = NextResponse.redirect(redirectUrl)
  res.cookies.delete('tw_code_verifier')
  res.cookies.delete('tw_oauth_state')
  return res
}
