import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  const clientId = process.env.LINKEDIN_CLIENT_ID
  if (!clientId) return NextResponse.json({ error: 'LinkedIn app not configured' }, { status: 500 })

  const state = crypto.randomBytes(16).toString('hex')
  const res   = NextResponse.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL + '/api/social/linkedin/callback')}` +
    `&scope=openid%20profile%20w_member_social` +
    `&state=${state}`
  )
  res.cookies.set('li_oauth_state', state, { httpOnly: true, secure: true, maxAge: 600, path: '/' })
  return res
}
