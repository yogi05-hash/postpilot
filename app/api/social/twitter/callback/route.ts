import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/dashboard/settings?error=twitter_denied', req.url))
  }

  const storedState    = req.cookies.get('tw_oauth_state')?.value
  const codeVerifier   = req.cookies.get('tw_code_verifier')?.value
  if (!code || state !== storedState || !codeVerifier) {
    return NextResponse.redirect(new URL('/dashboard/settings?error=twitter_state', req.url))
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/social/twitter/callback`
  const credentials = Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')

  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type:'authorization_code', code, redirect_uri:redirectUri, code_verifier:codeVerifier }),
  })
  const tokens = await tokenRes.json()
  if (!tokens.access_token) {
    return NextResponse.redirect(new URL('/dashboard/settings?error=twitter_token', req.url))
  }

  // Get username
  const meRes = await fetch('https://api.twitter.com/2/users/me', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  const me = await meRes.json()
  const name = me.data?.username ?? me.data?.name ?? 'Twitter User'
  const sub  = me.data?.id ?? ''

  const service = createServiceClient()
  await service.from('postpilot_social_accounts').upsert({
    user_id:       user.id,
    platform:      'twitter',
    access_token:  tokens.access_token,
    refresh_token: tokens.refresh_token ?? null,
    expires_at:    tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null,
    account_name:  `@${name}`,
    account_id:    sub,
    updated_at:    new Date().toISOString(),
  }, { onConflict: 'user_id,platform' })

  const res = NextResponse.redirect(new URL('/dashboard/settings?connected=twitter', req.url))
  res.cookies.delete('tw_oauth_state')
  res.cookies.delete('tw_code_verifier')
  return res
}
