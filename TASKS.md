# Roze Déco — Front-end Build Tasks

## Phase 1 — Foundation ✅
- [x] Scaffold Next.js 16 (App Router, TypeScript, Tailwind v4, Cache Components)
- [x] Brand design system: black & white palette, Cormorant Garamond + Jost, buttons & utilities (`src/app/globals.css`)
- [x] Official logo (black / white PNGs in `public/brand/`, `Logo` component, app icon)
- [x] Remote image config + curated placeholder photography (Unsplash)
- [x] Dummy data: 6 categories, 32 products (`src/lib/data.ts`), orders, customers, messages, stats (`src/lib/admin-data.ts`)

## Phase 2 — Storefront ✅
- [x] Global layout: announcement bar, sticky header with mega-menu + mobile drawer, footer with newsletter
- [x] Home: hero, value strip, categories, signature pieces, story, dining banner, new arrivals, testimonials, showroom CTA
- [x] About Us: story, values, craftsmanship, timeline, team, CTA
- [x] Shop index (`/shop`) — all products with category filter
- [x] Category pages (`/shop/[category]`) — filters (price, material, colour, availability, new/sale), sorting, grid density, active-filter chips, mobile filter drawer
- [x] Product detail (`/product/[slug]`): gallery, finishes, quantity, tabs, related items
- [x] Contact: topic-aware form (UI only), showroom details, map placeholder, FAQ
- [x] 404 page + loading skeletons

## Phase 3 — Admin (UI only, not connected) ✅
- [x] Admin layout: sidebar + top bar (`/admin`)
- [x] Dashboard: KPIs, monthly revenue chart, sales by category, recent orders, top sellers, low stock, new messages
- [x] Products list (search / filter / bulk select) + edit & create form
- [x] Orders list (status tabs, search) + order detail with progress tracker
- [x] Customers list with tiers
- [x] Messages inbox (contact form submissions)
- [x] Settings

## Phase 4 — Polish
- [x] Production build passes, lint clean
- [x] Desktop visual review
- [x] Mobile review at 390px (storefront + admin) and fixes
- [ ] Re-check admin product form, inbox & settings on a real phone (browser froze during review)

## Next up (to discuss)
- [ ] Replace placeholder photos with real product photography
- [x] Real brand info: About story (founded 2020, made in Lebanon), email, phone, Instagram (`src/lib/brand.ts`)
- [ ] Delivery / returns policy, address or showroom (if any), real product catalogue & prices
- [ ] Connect backend / CMS (products, orders, contact form) + admin authentication
- [ ] Cart drawer, checkout & payments
- [ ] Wishlist, search
- [ ] SEO (sitemap, Open Graph images), analytics
