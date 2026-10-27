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
| `/contact` Contact Us | `/admin/settings` — store info, move images to ImageKit, backup |
| `/checkout` Checkout (cash on delivery) | |

## Stock rule

Each product colour has a quantity. Quantity > 0 → **Ready now**. Quantity 0 → **Out of stock**, but still orderable with a warning that it needs about 2 weeks to be ready for shipment (`MADE_TO_ORDER_LEAD` in `src/lib/catalog.ts`).

## Backend

- **Database:** Firebase Firestore, project `rose-deco` (free Spark plan, Frankfurt). Collections: `products`, `orders`, `messages`.
- **Admin login:** Firebase Authentication (email + password) at `/admin/login` (not linked from the public site). Only emails in `ADMIN_EMAILS` (`src/lib/firebase.ts`) **and** in `isAdmin()` in `firestore.rules` get access — currently `rozedecohq@gmail.com`. Public sign-up is disabled; add admins in Firebase console → Authentication → Users, then add their email in both places.
- **Security rules:** `firestore.rules` (published in the console). Anyone can read products, place an order and send a message; only admins can read/manage orders, messages and products.
- **Images:** uploaded from the admin to **ImageKit** (free plan, no card). Set `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` and `IMAGEKIT_PRIVATE_KEY` (see `.env.example`). Uploads are signed by `/api/upload-auth`, which only accepts logged-in admins. Firestore stores only the image URL.
- **Stock:** deducted when an order is moved out of “New” (confirmed), restored if a confirmed order is cancelled.
- **Bag:** stays in each visitor’s browser (localStorage).
- **Product pages** are prerendered at build time from the live `products` collection (`src/lib/server/products.ts`, cached hourly); products added later render on demand.

## Where things live

- `src/lib/brand.ts` — contact details & brand story
- `src/lib/catalog.ts` — categories, product model, seed products, stock helpers
- `src/lib/firebase.ts` — Firebase config, admin emails, demo account
- `src/lib/store.ts` — data layer (Firestore + Auth hooks, cart)
- `src/lib/image.ts` + `src/app/api/upload-auth/route.ts` — image upload (ImageKit)
- `src/app/(site)/` — storefront · `src/app/admin/` — admin
- `src/components/site/`, `src/components/admin/` — UI components
