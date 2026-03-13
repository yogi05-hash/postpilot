# PostPilot — Product Hunt Launch Assets

## TAGLINE (60 chars max)
AI writes and posts your social content in 30 seconds

## SHORT DESCRIPTION (260 chars max)
PostPilot generates a week of LinkedIn, Twitter, and Instagram posts for your business, lets you review and approve each one, then posts them live with one click. No copy-pasting. No switching tabs. Your brand voice, every day.

## LONG DESCRIPTION
PostPilot is an AI-powered social content scheduler built for small business owners who know they should be posting consistently but never actually do.

**The problem:** You open LinkedIn. Stare at the blank post box. Close the tab. Repeat every day.

**What PostPilot does:**
1. You tell it what your business does, who you target, and your brand tone (takes 2 minutes)
2. Hit "Generate" — AI writes 7 platform-specific posts for LinkedIn, Twitter, and Instagram
3. Review each post in the dashboard — approve the ones you like, reject the rest
4. Click "Post to LinkedIn" — it goes live instantly. No new tab. No copy-pasting.

**Built for:**
- Agency owners who need to show up consistently
- Recruiters, mortgage brokers, and B2B service businesses
- Anyone who's tried Buffer/Hootsuite and found it too complex or too expensive

**Pricing:** £14/month Pro. Cancel anytime.

**What's live:**
- AI content generation (Claude AI, your brand voice)
- LinkedIn direct OAuth posting
- Twitter/X posting
- Instagram caption generation + hashtags
- Content calendar view
- Approve/reject workflow

---

## MAKER COMMENT (for launch day)
Hey Product Hunt! 👋

I built PostPilot because I was paying £300/month for a social media manager to do something AI could handle in 30 seconds.

The workflow: you fill in your business profile once → hit Generate → get 7 posts written in your brand voice → review them → click Post. Done.

No scheduling complexity. No 40-tab dashboards. Just: generate, approve, post.

It's £14/month Pro. Less than Netflix.

Would love your honest feedback — what would make this actually useful for YOUR business? I'm building in public and shipping updates fast.

🚀 postpilot-lovat.vercel.app

---

## PRODUCT HUNT TOPICS
- Artificial Intelligence
- Social Media Marketing
- Productivity
- SaaS
- Marketing

## FIRST COMMENT / REPLY TEMPLATE
Thanks for checking out PostPilot! 🙏

The one thing I'd love feedback on: what platform do you wish was easier to stay consistent on — LinkedIn, Twitter, or Instagram?

Building the analytics dashboard next (so you can see which posts are actually getting engagement).

---

## SCREENSHOTS NEEDED (in order)
1. Landing page hero — clean dark UI with headline
2. Dashboard — list of 7 posts with approve/reject buttons
3. Settings page — LinkedIn "Connected ✓" state
4. Post going live — "🚀 Post to LinkedIn" button → "✅ Posted!" state
5. Calendar view — posts grouped by day

---

## LAUNCH CHECKLIST
- [ ] Swap STRIPE_SECRET_KEY to live key
- [ ] Remove /api/debug route
- [ ] Add LinkedIn developer app credentials (LINKEDIN_CLIENT_ID + LINKEDIN_CLIENT_SECRET)
- [ ] Test full LinkedIn OAuth flow end-to-end
- [ ] Update homepage to link to /launch page
- [ ] Take Product Hunt screenshots
- [ ] Submit to Product Hunt (schedule for 12:01am PST Tuesday/Wednesday)
- [ ] Post launch tweet from @bilabs.ai
- [ ] Post launch LinkedIn post from Yogi's profile
- [ ] Reply to every Product Hunt comment within 1 hour
