import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

function verifyStripeSignature(body: string, sig: string, secret: string): boolean {
  try {
    const parts   = sig.split(',').reduce((acc: Record<string, string>, part) => { const [k, v] = part.split('='); acc[k] = v; return acc }, {})
    const ts      = parts['t']
    const v1      = parts['v1']
    if (!ts || !v1) return false
    const payload = `${ts}.${body}`
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))
  } catch { return false }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature') ?? ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

  if (!verifyStripeSignature(body, sig, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)
  const supabase = createServiceClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId  = session.metadata?.supabase_user_id
    if (userId) {
      await supabase
        .from('postpilot_profiles')
        .update({ plan: 'pro', stripe_subscription_id: session.subscription })
        .eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object
    await supabase
      .from('postpilot_profiles')
      .update({ plan: 'free', stripe_subscription_id: null })
      .eq('stripe_subscription_id', sub.id)
  }

  return NextResponse.json({ received: true })
}
