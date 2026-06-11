# ScoutFile — self-serve skill storefront

A single-product Next.js site: futuristic landing page → Stripe Checkout ($299) → verified, gated download of your skill package.

## How it works

1. Visitor clicks **Buy & download** → `/api/checkout` creates a Stripe Checkout Session and redirects to Stripe's hosted payment page.
2. After payment, Stripe redirects to `/success?session_id=...`.
3. The success page verifies the session server-side (must be `paid`) and shows the download button.
4. `/api/download` re-verifies the session with Stripe before streaming the zip from `/private`. No payment, no file.

## Setup (15 minutes)

### 1. Put your real product in
Replace `private/scoutfile-skill-package.zip` (currently a placeholder) with your actual package:
- the skill file (.md)
- brief templates
- install guide
- customization playbook

Keep the filename, or change `fileName` in `config/site.js`.

### 2. Edit `config/site.js`
Brand name, price, support email, domain — all in one file. If you change `priceUSD`, change `priceCents` to match (price × 100).

### 3. Stripe
- Create a Stripe account → grab your **secret key** (Developers → API keys).
- Copy `.env.example` to `.env` and set `STRIPE_SECRET_KEY=sk_test_...`
- Test locally with card `4242 4242 4242 4242`, any future date, any CVC.

### 4. Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

### 5. Deploy to Vercel
```bash
npm i -g vercel
vercel
```
Then in the Vercel dashboard → Project → Settings → Environment Variables, add:
- `STRIPE_SECRET_KEY` = your **live** key (`sk_live_...`) for production

Redeploy. Point your domain at the project (Vercel → Domains).

### 6. Go-live checklist
- [ ] Real product zip in `/private`
- [ ] `supportEmail` updated in `config/site.js`
- [ ] Live Stripe key set in Vercel env vars
- [ ] One real test purchase with a live card (refund yourself after)
- [ ] Stripe receipt emails enabled (Stripe → Settings → Emails)

## Notes

- **Download links are re-verified every time** — sharing the success URL only works for a paid session, and you can refund/blocklist abusers in Stripe.
- The `/private` folder is bundled with the serverless function via `outputFileTracingIncludes` in `next.config.mjs` — don't move it.
- Promotion codes are enabled in checkout (`allow_promotion_codes`), so you can create discount codes in Stripe for warm leads without touching code.
- Max practical file size on Vercel serverless responses is ~4.5MB. If your package is bigger, host the zip on Vercel Blob or S3 and swap the download route to redirect to a signed URL — happy to wire that if needed.
