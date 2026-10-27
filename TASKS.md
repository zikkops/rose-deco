# Roze Déco — Build Tasks

## Done
- [x] Next.js 16 scaffold (App Router, TypeScript, Tailwind v4, Cache Components)
- [x] Black & white brand, official logo, real brand info (`src/lib/brand.ts`)
- [x] Pages: Home, About Us, Categories (+ one page per category with filters), Contact Us
- [x] Categories: Home Décor, Side Tables, Coffee Tables, Cushions, Games, Poufs, Bling
- [x] 28 starter products in Firestore with colours and per-colour quantities (to be replaced with the real catalogue)
- [x] Stock tags on every item: **Ready now** (qty > 0) / **Out of stock** (qty 0)
- [x] Out-of-stock items can still be ordered, with a "ready for shipment in about 2 weeks" warning on product page, bag and checkout
- [x] Bag (cart drawer) + checkout (cash on delivery) → order appears in admin, stock is reserved
- [x] Contact form → message appears in admin
- [x] Admin (`/admin`): dashboard, products (add / edit / delete, images, colours, quantities, show/hide, featured, new), orders (status, details), messages, settings (images, backup)
- [x] Demo login, demo import and hard-coded demo products removed — production setup

## Before going live
- [x] Firebase Firestore database connected (products, orders, messages) + security rules
- [x] Admin login with Firebase Authentication (public sign-up disabled)
- [ ] Publish updated `firestore.rules` (demo email removed) and delete the demo@rozedeco.com user in Firebase Auth
- [ ] Make sure the rozedecohq@gmail.com admin user exists in Firebase Auth
- [ ] Settings → Images → move product photos to ImageKit
- [x] ImageKit connected (keys in `.env.local`; add the same env vars on the hosting platform)
- [ ] Choose hosting (e.g. Vercel) + connect domain
- [ ] Order notifications (email / WhatsApp) to the shop
- [ ] Real product photos, names, prices and colours
- [ ] Delivery fees & policy, returns policy
- [ ] Upgrade Next.js (security advisory reported for 16.4.0)
- [ ] SEO: sitemap, Open Graph images; analytics
- [ ] Final mobile check on a real phone
