# BarX

Maker platform: shop + project kits + learn + engineering services.

V1 runs **without Supabase**. Catalog is seeded in `src/lib/catalog.ts`. Orders and quotes write to `data/*.json`.

## Run

```bash
npm install
cp .env/.env.local.example .env/.env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment setup

Use the placeholder files in the `.env/` folder as the template source:

- `.env/.env.example`
- `.env/.env.local.example`
- `.env/.env.production.example`

Copy the file you need and replace the placeholder values before deploying.

Real secrets should stay out of git. The project ignores `.env.local`, `.env.production`, and other runtime env files, but keeps the example templates tracked for setup.

## What works

- Homepage: “What are you building?”
- Shop + product pages (specs, docs, related projects, also-need)
- Smart cart suggestions
- Checkout (COD) → order tracking
- Account (local session)
- Project wizard + catalog-aware AI BOM builder
- Learn (ESP32 path with add-to-cart BOM)
- Students + services quotes
- Admin dashboard, orders, inventory

## Next

1. Create a Supabase project
2. Run `supabase/schema.sql`
3. Replace `src/lib/catalog.ts` reads and `src/lib/store.ts` with the JS client
4. Swap `src/lib/session.tsx` for Supabase Auth
5. Add Razorpay on `/checkout`

Admin is unauthenticated on purpose for the local demo — lock `/admin` when Auth is live.
