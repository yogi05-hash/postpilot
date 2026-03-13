import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  // Redirect to Ayrshare dashboard to connect social accounts
  // Free plan: users connect accounts directly in Ayrshare dashboard
  return NextResponse.redirect('https://app.ayrshare.com/dashboard/social-accounts')
}
