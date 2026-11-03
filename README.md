# Tokenhood

Meme and token micro-sites paid in $HOOD. Next.js (App Router) + Tailwind + wagmi/viem/RainbowKit.

## Run locally
```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev
```

## Deploy
Push to GitHub; Vercel builds automatically. Add every variable from `.env.example` in
Vercel > Project > Settings > Environment Variables.

- **Database:** create a Supabase project, run `supabase/schema.sql`, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Without them, published pages live in memory and disappear on redeploy.
- **Subdomains:** add `*.tokenhood.online` as a domain in Vercel (needs wildcard DNS / Vercel nameservers). `middleware.ts` rewrites `name.tokenhood.online` to `/p/name`.

## How payment is verified
1. The browser sends a `transfer` of the template fee from the payer to the treasury (`useHoodPayment`).
2. The payer signs `Tokenhood: publish "<slug>" with payment <txHash>`.
3. `POST /api/pages` re-validates the draft, checks the signature, reads the receipt on Base, and requires a `$HOOD Transfer(payer -> treasury) >= fee`. Each tx hash can publish one page.

## Next steps
Server-side votes (signed by wallet), moderation/reporting, image storage (Supabase Storage instead of data URLs), editing published pages.
