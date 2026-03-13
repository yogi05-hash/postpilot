import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase-server'
import { getConnectedAccounts } from '@/lib/ayrshare'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()
  const { data: profile } = await service
    .from('postpilot_profiles')
    .select('ayrshare_profile_key')
    .eq('id', user.id)
    .single()

  if (!profile?.ayrshare_profile_key) return NextResponse.json({ platforms: [] })

  const platforms = await getConnectedAccounts(profile.ayrshare_profile_key)
  return NextResponse.json({ platforms, profileKey: profile.ayrshare_profile_key })
}
