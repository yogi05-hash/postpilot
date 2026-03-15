import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.in',
  port: 465,
  secure: true,
  auth: { user: 'hello@bilabs.ai', pass: process.env.ZOHO_APP_PASSWORD },
})

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })

    // Notify Yogi
    await transporter.sendMail({
      from: '"PostPilot" <hello@bilabs.ai>',
      to: 'hello@bilabs.ai',
      subject: `🎉 New PostPilot signup: ${email}`,
      text: `Someone just signed up for PostPilot!\n\nEmail: ${email}\nTime: ${new Date().toISOString()}\n\nCheck Supabase for details.`,
    })

    // Welcome email to user
    await transporter.sendMail({
      from: '"Ram Yogi at PostPilot" <hello@bilabs.ai>',
      to: email,
      subject: 'Welcome to PostPilot 🚀',
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #070711; color: #fff; padding: 40px; border-radius: 16px;">
          <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">Welcome to PostPilot 🚀</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            You're in. Your 7-day free trial starts now.
          </p>
          <p style="color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Here's what to do next:<br><br>
            ✅ <strong>Complete your business profile</strong> — takes 2 minutes<br>
            ✅ <strong>Connect your LinkedIn</strong> so posts can go live automatically<br>
            ✅ <strong>Generate your first week of posts</strong> and see what AI can do
          </p>
          <a href="https://postpilot.online/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #2563eb); color: #fff; text-decoration: none; padding: 13px 28px; border-radius: 9px; font-weight: 700; font-size: 15px; margin-bottom: 32px;">
            Go to dashboard →
          </a>
          <p style="color: rgba(255,255,255,0.4); font-size: 13px; line-height: 1.6;">
            Any questions? Just reply to this email — I read every one.<br><br>
            Ram Yogi<br>
            Founder, PostPilot
          </p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('notify-signup error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
