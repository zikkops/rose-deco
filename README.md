# Roze Déco

Website for Roze Déco — a Lebanese design brand of home accessories and occasional furniture.
Next.js 16 (App Router), TypeScript, Tailwind CSS v4.

## Run

```bash
npm install
npm run dev     # http://localhost:3000  (admin: /admin)
npm run build
```

## Pages

| Storefront | Admin (demo) |
|---|---|
| `/` Home | `/admin` Dashboard |
| `/about` About Us | `/admin/products` — list, quick stock edit, show/hide |
| `/categories` All categories + all products | `/admin/products/edit` — add (no id) / edit (`?id=`) |
| `/categories/[slug]` Category with filters | `/admin/orders` |
| `/product/[slug]` Product | `/admin/messages` |
| `/contact` Contact Us | `/admin/settings` — export / reset demo data |
| `/checkout` Checkout (cash on delivery) | |

## Stock rule

Each product colour has a quantity. Quantity > 0 → **Ready now**. Quantity 0 → **Out of stock**, but still orderable with a warning that it needs about 2 weeks to be ready for shipment (`MADE_TO_ORDER_LEAD` in `src/lib/catalog.ts`).

## Demo backend

Admin login: **/admin/login** — username `demo`, password `roze2026` (shown under the login form). This is a browser-only check for the demo, not real security.


The admin is fully working but **saves to the browser's localStorage** (`src/lib/store.ts`), so changes are visible only in the same browser. Uploaded images are resized and stored as data URLs (`src/lib/image.ts`).

To go live, replace the functions in `store.ts` with API calls to a real backend (same data shapes) and move image uploads to proper storage. Use *Settings → Export data* to carry over anything the client entered.

## Where things live

- `src/lib/brand.ts` — contact details & brand story
- `src/lib/catalog.ts` — categories, product model, seed products, stock helpers
- `src/lib/store.ts` — demo data layer (products, cart, orders, messages)
- `src/app/(site)/` — storefront · `src/app/admin/` — admin
- `src/components/site/`, `src/components/admin/` — UI components
