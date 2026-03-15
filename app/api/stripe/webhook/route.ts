import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const mailer = nodemailer.createTransport({
  host: 'smtppro.zoho.in', port: 465, secure: true,
  auth: { user: 'hello@bilabs.ai', pass: process.env.ZOHO_APP_PASSWORD },
})

async function sendPaymentEmails(userEmail: string) {
  // Welcome to Pro — user
  await mailer.sendMail({
    from: '"Ram Yogi at PostPilot" <hello@bilabs.ai>',
    to: userEmail,
    subject: '🎉 You\'re now on PostPilot Pro!',
    html: `
      <div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;background:#070711;color:#fff;padding:40px;border-radius:16px;">
        <h1 style="font-size:24px;font-weight:800;margin-bottom:8px;">You're on Pro 🎉</h1>
        <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;margin-bottom:24px;">
          Your PostPilot Pro subscription is now active. Unlimited posts, all platforms, every week.
        </p>
        <p style="color:rgba(255,255,255,0.8);font-size:15px;line-height:1.6;margin-bottom:24px;">
          <strong>What's unlocked:</strong><br><br>
          ✅ Unlimited AI-generated posts<br>
          ✅ LinkedIn auto-posting<br>
          ✅ Full post history<br>
          ✅ Priority support
        </p>
        <a href="https://postpilot.online/dashboard" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;text-decoration:none;padding:13px 28px;border-radius:9px;font-weight:700;font-size:15px;margin-bottom:32px;">
          Go to dashboard →
        </a>
        <p style="color:rgba(255,255,255,0.4);font-size:13px;">
          Questions? Reply to this email — I read every one.<br><br>
          Ram Yogi<br>Founder, PostPilot
        </p>
      </div>
    `,
  })
  // Notify Yogi
  await mailer.sendMail({
    from: '"PostPilot" <hello@bilabs.ai>',
    to: 'hello@bilabs.ai',
    subject: `💰 New Pro subscriber: ${userEmail}`,
    text: `New paying customer!\n\nEmail: ${userEmail}\nPlan: Pro (£14/month)\nTime: ${new Date().toISOString()}\n\nCheck Stripe dashboard for details.`,
  })
}

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
      // Get user email and send payment confirmation emails
      const { data: { user } } = await supabase.auth.admin.getUserById(userId)
      if (user?.email) {
        await sendPaymentEmails(user.email).catch(console.error)
      }
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
