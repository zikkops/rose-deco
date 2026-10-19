# Roze Deco

Front-end for the Roze Deco luxury furniture & décor store — Next.js 16 (App Router), TypeScript, Tailwind CSS v4.

> All data is dummy data and the admin is UI-only. Nothing is persisted yet.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Pages

| Storefront | Admin |
|---|---|
| `/` Home | `/admin` Dashboard |
| `/about` About Us | `/admin/products` + `/admin/products/[slug]`, `/admin/products/new` |
| `/shop` All products | `/admin/orders` + `/admin/orders/[id]` |
| `/shop/[category]` Category with filters | `/admin/customers` |
| `/product/[slug]` Product detail | `/admin/messages` |
| `/contact` Contact | `/admin/settings` |

## Where things live

- `src/lib/data.ts` — categories, products, image helpers (swap for CMS/DB queries)
- `src/lib/admin-data.ts` — dummy orders, customers, messages, stats
- `src/app/(site)/` — storefront routes (shared header/footer layout)
- `src/app/admin/` — back-office routes
- `src/components/site/`, `src/components/admin/` — UI components
- `src/app/globals.css` — brand tokens (colours, fonts) and shared utilities

Placeholder images are loaded from Unsplash (allowed in `next.config.ts`).

See `TASKS.md` for progress and next steps.
