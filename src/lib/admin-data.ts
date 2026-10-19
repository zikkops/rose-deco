// Dummy back-office data. Nothing here is persisted — it exists to preview the admin UI.
import { products } from "./data";

export type OrderStatus = "Pending" | "Processing" | "In production" | "Shipped" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: { slug: string; qty: number; finish: string }[];
  total: number;
  status: OrderStatus;
  payment: "Paid" | "Deposit" | "Refunded";
  city: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  city: string;
  orders: number;
  spent: number;
  joined: string;
  tier: "Client" | "VIP" | "Trade";
};

export type Message = {
  id: string;
  name: string;
  email: string;
  topic: string;
  preview: string;
  date: string;
  unread: boolean;
};

const priceOf = (slug: string) => products.find((p) => p.slug === slug)?.price ?? 0;

const mk = (
  id: string,
  customer: string,
  email: string,
  date: string,
  items: Order["items"],
  status: OrderStatus,
  payment: Order["payment"],
  city: string,
): Order => ({
  id,
  customer,
  email,
  date,
  items,
  total: items.reduce((s, i) => s + priceOf(i.slug) * i.qty, 0),
  status,
  payment,
  city,
});

export const orders: Order[] = [
  mk("RD-10482", "Charlotte Moreau", "charlotte.m@example.com", "2026-10-13", [{ slug: "esme-velvet-sofa", qty: 1, finish: "Emerald" }, { slug: "terra-vase-collection", qty: 1, finish: "Stone" }], "Pending", "Paid", "London"),
  mk("RD-10481", "Omar Khalil", "omar.k@example.com", "2026-10-13", [{ slug: "ondine-dining-table", qty: 1, finish: "Natural Oak" }, { slug: "arlo-dining-chair", qty: 6, finish: "Camel" }], "Processing", "Paid", "Dubai"),
  mk("RD-10480", "Sofia Ricci", "sofia.r@example.com", "2026-10-12", [{ slug: "isabeau-tufted-bed", qty: 1, finish: "Ivory" }, { slug: "elio-nightstand", qty: 2, finish: "White & Oak" }], "In production", "Deposit", "Milan"),
  mk("RD-10479", "James Whitfield", "j.whitfield@example.com", "2026-10-11", [{ slug: "ember-copper-pendant-trio", qty: 1, finish: "Copper" }], "Shipped", "Paid", "New York"),
  mk("RD-10478", "Nour Haddad", "nour.h@example.com", "2026-10-10", [{ slug: "marlow-modular-sofa", qty: 1, finish: "Ivory" }], "In production", "Deposit", "Beirut"),
  mk("RD-10477", "Amélie Laurent", "amelie.l@example.com", "2026-10-09", [{ slug: "lune-lounge-chair", qty: 2, finish: "Sage" }], "Delivered", "Paid", "Paris"),
  mk("RD-10476", "Hannah Becker", "hannah.b@example.com", "2026-10-08", [{ slug: "rivoli-sideboard", qty: 1, finish: "Ochre" }, { slug: "calla-pendant", qty: 2, finish: "Rose" }], "Shipped", "Paid", "Berlin"),
  mk("RD-10475", "Lucas Ferreira", "lucas.f@example.com", "2026-10-07", [{ slug: "valentina-leather-sofa", qty: 1, finish: "Cognac" }], "Delivered", "Paid", "Lisbon"),
  mk("RD-10474", "Maya Chen", "maya.c@example.com", "2026-10-06", [{ slug: "pomme-bistro-table", qty: 1, finish: "Ivory" }, { slug: "bastien-bar-stool", qty: 3, finish: "Noir" }], "Delivered", "Paid", "Singapore"),
  mk("RD-10473", "Studio Atrium (Trade)", "projects@atrium.example.com", "2026-10-05", [{ slug: "aurelio-cognac-sofa", qty: 2, finish: "Amber" }, { slug: "cassian-leather-armchair", qty: 4, finish: "Tan" }], "In production", "Deposit", "Doha"),
  mk("RD-10472", "Elena Petrova", "elena.p@example.com", "2026-10-03", [{ slug: "odette-tufted-chair", qty: 1, finish: "Blush" }], "Cancelled", "Refunded", "Vienna"),
  mk("RD-10471", "Karim Saleh", "karim.s@example.com", "2026-10-02", [{ slug: "arc-reading-lamp", qty: 1, finish: "Black" }, { slug: "lior-side-table", qty: 1, finish: "Rose" }], "Delivered", "Paid", "Riyadh"),
];

export const customers: Customer[] = [
  { id: "C-2041", name: "Charlotte Moreau", email: "charlotte.m@example.com", city: "London", orders: 4, spent: 18420, joined: "2023-03-14", tier: "VIP" },
  { id: "C-2040", name: "Omar Khalil", email: "omar.k@example.com", city: "Dubai", orders: 3, spent: 22180, joined: "2024-01-22", tier: "VIP" },
  { id: "C-2039", name: "Sofia Ricci", email: "sofia.r@example.com", city: "Milan", orders: 2, spent: 9640, joined: "2024-06-02", tier: "Client" },
  { id: "C-2038", name: "Studio Atrium", email: "projects@atrium.example.com", city: "Doha", orders: 11, spent: 96300, joined: "2022-09-30", tier: "Trade" },
  { id: "C-2037", name: "James Whitfield", email: "j.whitfield@example.com", city: "New York", orders: 1, spent: 1450, joined: "2026-09-18", tier: "Client" },
  { id: "C-2036", name: "Nour Haddad", email: "nour.h@example.com", city: "Beirut", orders: 2, spent: 12100, joined: "2025-02-11", tier: "Client" },
  { id: "C-2035", name: "Amélie Laurent", email: "amelie.l@example.com", city: "Paris", orders: 5, spent: 15830, joined: "2023-11-05", tier: "VIP" },
  { id: "C-2034", name: "Hannah Becker", email: "hannah.b@example.com", city: "Berlin", orders: 1, spent: 4670, joined: "2026-08-27", tier: "Client" },
  { id: "C-2033", name: "Maison Lumière Hotels", email: "buying@lumiere.example.com", city: "Monaco", orders: 7, spent: 142900, joined: "2022-04-19", tier: "Trade" },
  { id: "C-2032", name: "Lucas Ferreira", email: "lucas.f@example.com", city: "Lisbon", orders: 2, spent: 8120, joined: "2025-07-08", tier: "Client" },
];

export const messages: Message[] = [
  { id: "M-311", name: "Isabelle Grant", email: "isabelle.g@example.com", topic: "Place an order", preview: "Hello, I'd love to order the Marlow sofa in bouclé — could you confirm the price and delivery time?", date: "2026-10-14 09:12", unread: true },
  { id: "M-310", name: "Daniel Okafor", email: "daniel.o@example.com", topic: "Product enquiry", preview: "Is the Ondine dining table available in a 260 cm length? We're hoping to seat ten.", date: "2026-10-13 18:40", unread: true },
  { id: "M-309", name: "Atelier Noor", email: "studio@noor.example.com", topic: "Collaboration", preview: "We're an interior design studio working on a boutique hotel project and would love to collaborate…", date: "2026-10-13 11:05", unread: true },
  { id: "M-308", name: "Rachel Kim", email: "rachel.k@example.com", topic: "Order & delivery", preview: "Could you confirm the delivery window for order RD-10474? I'll be travelling the week of the 20th.", date: "2026-10-12 15:22", unread: false },
  { id: "M-307", name: "Tom Hughes", email: "tom.h@example.com", topic: "Design consultation", preview: "We've just moved into a new apartment and need help furnishing the living and dining area…", date: "2026-10-11 10:47", unread: false },
];

export const monthlyRevenue = [
  { month: "Nov", value: 182400 },
  { month: "Dec", value: 246900 },
  { month: "Jan", value: 158300 },
  { month: "Feb", value: 171200 },
  { month: "Mar", value: 205800 },
  { month: "Apr", value: 219400 },
  { month: "May", value: 238100 },
  { month: "Jun", value: 226700 },
  { month: "Jul", value: 197500 },
  { month: "Aug", value: 188900 },
  { month: "Sep", value: 254300 },
  { month: "Oct", value: 141600 },
];

export const salesByCategory = [
  { name: "Sofas & Sectionals", value: 812400 },
  { name: "Bedroom", value: 486200 },
  { name: "Tables", value: 402900 },
  { name: "Chairs & Armchairs", value: 351700 },
  { name: "Décor & Storage", value: 214300 },
  { name: "Lighting", value: 163600 },
];

export const kpis = [
  { label: "Revenue (30 days)", value: "$254,300", delta: "+12.4%", up: true },
  { label: "Orders", value: "68", delta: "+8.1%", up: true },
  { label: "Avg. order value", value: "$3,740", delta: "+3.9%", up: true },
  { label: "Conversion rate", value: "2.8%", delta: "−0.3%", up: false },
];

export const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-800 ring-amber-200",
  Processing: "bg-sky-50 text-sky-800 ring-sky-200",
  "In production": "bg-violet-50 text-violet-800 ring-violet-200",
  Shipped: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  Delivered: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Cancelled: "bg-stone-100 text-stone-600 ring-stone-200",
};

// Dummy stock levels per product (would come from inventory system)
export const stockOf = (slug: string) => {
  const n = [...slug].reduce((s, c) => s + c.charCodeAt(0), 0);
  return products.find((p) => p.slug === slug)?.inStock ? (n % 23) + 1 : 0;
};
