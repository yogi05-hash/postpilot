import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
  const supabase = createServiceClient()
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { metadata?: { supabase_user_id?: string }; subscription?: string }
    if (session.metadata?.supabase_user_id) {
      await supabase.from('postpilot_profiles').update({ plan: 'pro', stripe_subscription_id: session.subscription }).eq('id', session.metadata.supabase_user_id)
    }
  }
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as { id: string }
    await supabase.from('postpilot_profiles').update({ plan: 'free', stripe_subscription_id: null }).eq('stripe_subscription_id', sub.id)
  }
  return NextResponse.json({ received: true })
}
