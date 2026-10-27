// Catalogue model + seed data. In the demo, the admin edits a copy of this
// stored in the browser (see store.ts); the seed is what a fresh visitor sees.

export const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
};

export type ColorVariant = {
  id: string;
  name: string;
  hex: string;
  quantity: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  details: string[];
  dimensions: string;
  material: string;
  images: string[];
  colors: ColorVariant[];
  featured: boolean;
  isNew: boolean;
  active: boolean;
  createdAt: number;
};

/** How long an out-of-stock piece takes before it can ship. */
export const MADE_TO_ORDER_LEAD = "about 2 weeks";

export const categories: Category[] = [
  {
    slug: "home-decor",
    name: "Home Décor",
    tagline: "Objects with character",
    description: "Vases, candle holders and sculptural objects that bring personality to every shelf and surface.",
    image: img("1759936236914-e8b1ac061030"),
  },
  {
    slug: "side-tables",
    name: "Side Tables",
    tagline: "Small, statement pieces",
    description: "Occasional tables in bold colours and honest materials — next to a sofa, a bed or an armchair.",
    image: img("1611486212557-88be5ff6f941"),
  },
  {
    slug: "coffee-tables",
    name: "Coffee Tables",
    tagline: "The centre of the room",
    description: "Coffee tables in wood, glass and metal, designed to anchor a living space.",
    image: img("1713184367696-507ea9fe27b9"),
  },
  {
    slug: "cushions",
    name: "Cushions",
    tagline: "Texture and colour",
    description: "Cushions in rich textures and colours to layer onto sofas, beds and benches.",
    image: img("1538577880403-f9998e75dd06"),
  },
  {
    slug: "games",
    name: "Games",
    tagline: "Play, beautifully",
    description: "Backgammon, chess and table games designed to be left out on display.",
    image: img("1743571029574-e70b76511c78"),
  },
  {
    slug: "poufs",
    name: "Poufs",
    tagline: "Extra seating, extra style",
    description: "Woven, velvet and leather poufs — a footrest, a seat or a side table when you need it.",
    image: img("1787300597601-e26b4b0f4753"),
  },
  {
    slug: "bling",
    name: "Bling",
    tagline: "A touch of gold",
    description: "Gold and brass accents, figurines and objets that catch the light.",
    image: img("1646775814000-e2bbb1a42be3"),
  },
];

const c = (name: string, hex: string, quantity: number): ColorVariant => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  hex,
  quantity,
});

type Seed = Omit<Product, "id" | "images" | "active" | "createdAt" | "featured" | "isNew"> & {
  images: string[];
  featured?: boolean;
  isNew?: boolean;
};

let order = 0;
const p = (s: Seed): Product => ({
  ...s,
  id: s.slug,
  images: s.images.map((id) => img(id)),
  featured: s.featured ?? false,
  isNew: s.isNew ?? false,
  active: true,
  createdAt: Date.UTC(2026, 9, 1) + order++ * 3600_000,
});

export const seedProducts: Product[] = [
  // ——— Home Décor
  p({
    slug: "dune-ceramic-vase",
    name: "Dune Ceramic Vase",
    category: "home-decor",
    price: 65,
    description: "A rounded, hand-finished ceramic vase with a soft matte glaze — beautiful on its own or with dried stems.",
    details: ["Hand-finished ceramic", "Matte glaze", "Watertight"],
    dimensions: "Ø 24 × H 30 cm",
    material: "Ceramic",
    images: ["1612196808214-b8e1d6145a8c"],
    colors: [c("Ivory", "#efe9df", 6), c("Black", "#1a1a1a", 0)],
    featured: true,
  }),
  p({
    slug: "halo-sculpted-vase",
    name: "Halo Sculpted Vase",
    category: "home-decor",
    price: 75,
    description: "A sculptural vase with an open centre — a modern objet that doubles as a vase for dried flowers.",
    details: ["Ceramic", "Sculptural open form", "For dried flowers"],
    dimensions: "W 18 × H 26 cm",
    material: "Ceramic",
    images: ["1759936236914-e8b1ac061030"],
    colors: [c("Sand", "#e6dccd", 3), c("Terracotta", "#b9643f", 2)],
    isNew: true,
  }),
  p({
    slug: "noir-glass-vase",
    name: "Noir Glass Vase",
    category: "home-decor",
    price: 45,
    description: "Smoked glass in a slim, elegant silhouette. Perfect for a single stem or a few dried grasses.",
    details: ["Smoked glass", "Slim bottle shape"],
    dimensions: "Ø 9 × H 22 cm",
    material: "Glass",
    images: ["1623244307563-f9ade3df13c0"],
    colors: [c("Smoke", "#4a4a4a", 0)],
  }),
  p({
    slug: "lueur-candle-holder",
    name: "Lueur Candle Holder",
    category: "home-decor",
    price: 35,
    description: "A ribbed glass holder that throws a warm, flickering glow across the table.",
    details: ["Ribbed glass", "Fits tealights & votives"],
    dimensions: "Ø 9 × H 11 cm",
    material: "Glass",
    images: ["1767692965523-094a310db890"],
    colors: [c("Amber", "#c98a3c", 10), c("Clear", "#e9ecee", 4)],
  }),

  // ——— Side Tables
  p({
    slug: "nido-nesting-tables",
    name: "Nido Nesting Tables",
    category: "side-tables",
    price: 290,
    description: "A set of three nesting tables in warm wood — use them together or spread them around the room.",
    details: ["Set of 3", "Solid wood", "Nesting design"],
    dimensions: "Largest: W 45 × D 35 × H 45 cm",
    material: "Wood",
    images: ["1611486212355-d276af4581c0"],
    colors: [c("Walnut", "#6b4a32", 2)],
    featured: true,
  }),
  p({
    slug: "lettre-c-side-table",
    name: "Lettre C Side Table",
    category: "side-tables",
    price: 240,
    description: "A C-shaped side table that slides over the sofa arm, with an open shelf for books and magazines.",
    details: ["Solid wood", "Slides over sofa arms", "Lower shelf"],
    dimensions: "W 45 × D 35 × H 60 cm",
    material: "Wood",
    images: ["1611486212557-88be5ff6f941"],
    colors: [c("Natural", "#c79b6a", 0), c("Walnut", "#6b4a32", 1)],
  }),
  p({
    slug: "cubo-side-table",
    name: "Cubo Side Table",
    category: "side-tables",
    price: 195,
    description: "A bold, lacquered cube — a pop of colour that works as a side table, stool or display plinth.",
    details: ["Lacquered metal", "Indoor use", "Multi-purpose"],
    dimensions: "W 40 × D 40 × H 40 cm",
    material: "Metal",
    images: ["1752061159819-f290b8f48b08"],
    colors: [c("Orange", "#d9742b", 5), c("Black", "#1a1a1a", 3), c("White", "#f4f4f4", 0)],
    isNew: true,
  }),
  p({
    slug: "orbe-pedestal-table",
    name: "Orbe Pedestal Table",
    category: "side-tables",
    price: 220,
    description: "A slim pedestal table with a soft-edged top, sized perfectly beside a lounge chair.",
    details: ["Powder-coated base", "Rounded top"],
    dimensions: "Ø 40 × H 55 cm",
    material: "Metal",
    images: ["1759262151001-3f8841d02ce1"],
    colors: [c("Graphite", "#4a4a4c", 4)],
  }),

  // ——— Coffee Tables
  p({
    slug: "verre-coffee-table",
    name: "Verre Coffee Table",
    category: "coffee-tables",
    price: 650,
    description: "Clear glass on a polished chrome frame — light, reflective and timeless.",
    details: ["Tempered glass top", "Polished chrome frame"],
    dimensions: "W 90 × D 90 × H 38 cm",
    material: "Glass",
    images: ["1718049719673-70ee6f6dfa28"],
    colors: [c("Chrome", "#c9ccd0", 1)],
    featured: true,
  }),
  p({
    slug: "atelier-glass-wood-table",
    name: "Atelier Coffee Table",
    category: "coffee-tables",
    price: 590,
    description: "A glass-topped coffee table with a wooden storage shelf below, framed in matte black metal.",
    details: ["Glass top", "Wooden lower shelf", "Black metal frame"],
    dimensions: "W 110 × D 60 × H 45 cm",
    material: "Wood",
    images: ["1647967527216-adea2f078e07"],
    colors: [c("Oak & Black", "#b48a5e", 0)],
  }),
  p({
    slug: "brut-live-edge-table",
    name: "Brut Live-Edge Table",
    category: "coffee-tables",
    price: 480,
    description: "A solid slab with a natural live edge on slim hairpin legs — every piece is one of a kind.",
    details: ["Solid wood slab", "Natural live edge", "Hairpin legs"],
    dimensions: "W 100 × D 55 × H 42 cm",
    material: "Wood",
    images: ["1581428982868-e410dd047a90"],
    colors: [c("Natural", "#c79b6a", 2)],
  }),
  p({
    slug: "galet-organic-table",
    name: "Galet Organic Table",
    category: "coffee-tables",
    price: 720,
    description: "A pebble-shaped coffee table with soft, organic curves that make the room feel calmer.",
    details: ["Organic shape", "Wood veneer"],
    dimensions: "W 120 × D 70 × H 35 cm",
    material: "Wood",
    images: ["1713184367696-507ea9fe27b9"],
    colors: [c("Walnut", "#6b4a32", 1), c("Natural", "#c79b6a", 0)],
    isNew: true,
  }),

  // ——— Cushions
  p({
    slug: "soleil-cushion",
    name: "Soleil Cushion",
    category: "cushions",
    price: 45,
    description: "A textured woven cushion in a warm mustard tone — instant sunshine on any sofa.",
    details: ["Woven cotton cover", "Feather-blend insert", "Removable cover"],
    dimensions: "45 × 45 cm",
    material: "Cotton",
    images: ["1553114552-c4ece3a33c93"],
    colors: [c("Mustard", "#d6a336", 12), c("Ivory", "#efe9df", 8)],
    featured: true,
  }),
  p({
    slug: "tresse-cushion",
    name: "Tressé Cushion",
    category: "cushions",
    price: 50,
    description: "A basket-weave cushion with a rich, tactile finish that pairs beautifully with plain linen.",
    details: ["Basket-weave cover", "Feather-blend insert"],
    dimensions: "50 × 50 cm",
    material: "Cotton",
    images: ["1592789705501-f9ae4278a9c9"],
    colors: [c("Caramel", "#b8864b", 0), c("Black", "#1a1a1a", 5)],
  }),
  p({
    slug: "boheme-cushion-set",
    name: "Bohème Cushion Set",
    category: "cushions",
    price: 110,
    description: "A curated set of three cushions in complementary tones and textures, ready to style.",
    details: ["Set of 3", "Mixed textures", "Removable covers"],
    dimensions: "45 × 45 cm each",
    material: "Cotton",
    images: ["1538577880403-f9998e75dd06"],
    colors: [c("Blush Mix", "#d9b3a6", 3)],
    isNew: true,
  }),
  p({
    slug: "lin-lumbar-cushion",
    name: "Lin Lumbar Cushion",
    category: "cushions",
    price: 40,
    description: "A long lumbar cushion in washed linen — simple, soft and endlessly versatile.",
    details: ["Washed linen", "Hidden zip"],
    dimensions: "30 × 60 cm",
    material: "Linen",
    images: ["1763694333990-aa6860e6da63"],
    colors: [c("Oat", "#d9cdb8", 6), c("Sage", "#a3ad92", 0)],
  }),

  // ——— Games
  p({
    slug: "tawleh-backgammon",
    name: "Tawleh Backgammon Set",
    category: "games",
    price: 240,
    description: "A handcrafted backgammon (tawleh) set with inlaid details — made to be played and displayed.",
    details: ["Inlaid wood", "Full set of checkers & dice", "Folding case"],
    dimensions: "Open: 50 × 50 cm",
    material: "Wood",
    images: ["1743571029574-e70b76511c78"],
    colors: [c("Walnut", "#6b4a32", 2), c("Ebony", "#2a221d", 0)],
    featured: true,
  }),
  p({
    slug: "classique-chess-set",
    name: "Classique Chess Set",
    category: "games",
    price: 180,
    description: "A wooden chess board with weighted, hand-turned pieces in two contrasting woods.",
    details: ["Wooden board", "Weighted pieces", "Felt-lined base"],
    dimensions: "40 × 40 cm",
    material: "Wood",
    images: ["1695480542225-bc22cac128d0"],
    colors: [c("Natural", "#c79b6a", 4)],
  }),
  p({
    slug: "marbre-chess-set",
    name: "Marbre Chess Set",
    category: "games",
    price: 260,
    description: "Black and white marble with sculpted pieces — a statement for a coffee table.",
    details: ["Marble board", "Sculpted pieces"],
    dimensions: "35 × 35 cm",
    material: "Marble",
    images: ["1606594914778-09d99f53ecf7"],
    colors: [c("Black & White", "#3a3a3a", 0)],
    isNew: true,
  }),
  p({
    slug: "damier-board",
    name: "Damier Checkers Board",
    category: "games",
    price: 95,
    description: "A bold checkered board in two-tone wood that works for checkers — or as wall art.",
    details: ["Two-tone wood", "Checkers included"],
    dimensions: "40 × 40 cm",
    material: "Wood",
    images: ["1640954244104-2429acf756b8"],
    colors: [c("Black & Oak", "#1a1a1a", 6)],
  }),

  // ——— Poufs
  p({
    slug: "tricot-knitted-pouf",
    name: "Tricot Knitted Pouf",
    category: "poufs",
    price: 140,
    description: "A chunky knitted pouf — a cosy footrest, extra seat or soft side table.",
    details: ["Chunky knit cover", "Firm filling"],
    dimensions: "Ø 50 × H 35 cm",
    material: "Cotton",
    images: ["1503278034495-2865fce44a95"],
    colors: [c("Cocoa", "#7a5640", 5), c("Cream", "#efe9df", 0)],
    featured: true,
  }),
  p({
    slug: "jute-pouf",
    name: "Jute Pouf",
    category: "poufs",
    price: 120,
    description: "Hand-braided natural jute with a sturdy core — earthy texture for any room.",
    details: ["Hand-braided jute", "Sturdy core"],
    dimensions: "Ø 45 × H 40 cm",
    material: "Jute",
    images: ["1787300597601-e26b4b0f4753"],
    colors: [c("Natural", "#c9a877", 7)],
  }),
  p({
    slug: "velours-cube-pouf",
    name: "Velours Cube Pouf",
    category: "poufs",
    price: 175,
    description: "A plush velvet cube with clean edges, in deep jewel tones.",
    details: ["Cotton velvet", "Solid base"],
    dimensions: "W 45 × D 45 × H 42 cm",
    material: "Velvet",
    images: ["1747204864511-4ec0d3350f19"],
    colors: [c("Emerald", "#2f5d50", 0), c("Blush", "#d8b4a6", 2)],
    isNew: true,
  }),
  p({
    slug: "cuir-round-pouf",
    name: "Cuir Round Pouf",
    category: "poufs",
    price: 210,
    description: "A low, wide leather pouf with a soft top — generous enough to use as a coffee table.",
    details: ["Leather", "Low profile"],
    dimensions: "Ø 70 × H 35 cm",
    material: "Leather",
    images: ["1764349109513-437ffb751893"],
    colors: [c("Cognac", "#a8693f", 1)],
  }),

  // ——— Bling
  p({
    slug: "or-hammered-vases",
    name: "Or Hammered Vases",
    category: "bling",
    price: 95,
    description: "A pair of hammered gold vases that catch and scatter the light.",
    details: ["Set of 2", "Hammered metal", "Gold finish"],
    dimensions: "H 20 / 28 cm",
    material: "Metal",
    images: ["1580064141068-f42c18d153f5"],
    colors: [c("Gold", "#c9a24a", 4), c("Silver", "#c9ccd0", 0)],
    featured: true,
  }),
  p({
    slug: "crabe-gold-figurine",
    name: "Crabe Gold Figurine",
    category: "bling",
    price: 85,
    description: "A playful polished-gold crab figurine — a conversation piece for shelves and tables.",
    details: ["Polished finish", "Solid base"],
    dimensions: "W 25 × H 15 cm",
    material: "Metal",
    images: ["1646775814000-e2bbb1a42be3"],
    colors: [c("Gold", "#c9a24a", 3)],
    isNew: true,
  }),
  p({
    slug: "plume-gold-leaf",
    name: "Plume Gold Leaf",
    category: "bling",
    price: 55,
    description: "A white ceramic feather edged in gold — delicate, elegant and perfect for a console.",
    details: ["Ceramic", "Gold-leaf edge"],
    dimensions: "W 22 × H 12 cm",
    material: "Ceramic",
    images: ["1792269245164-07189e66026f"],
    colors: [c("White & Gold", "#efe9df", 0)],
  }),
  p({
    slug: "filigrane-gold-bowl",
    name: "Filigrane Gold Bowl",
    category: "bling",
    price: 70,
    description: "An open filigree bowl in gold — for keys, fruit or simply to admire.",
    details: ["Filigree metal", "Gold finish"],
    dimensions: "Ø 30 × H 12 cm",
    material: "Metal",
    images: ["1634185906003-309ce9f20c26"],
    colors: [c("Gold", "#c9a24a", 5)],
  }),
];

export const lifestyle = {
  hero: img("1618220179428-22790b461013", 2000),
  heroAlt: img("1616046229478-9901c5536a45", 2000),
  living: img("1615873968403-89e068629265", 1600),
  bright: img("1600210492486-724fe5c67fb0", 1600),
  lounge: img("1615529182904-14819c35db37", 1600),
  bedroom: img("1615874959474-d609969a20ed", 1600),
  studio: img("1615875605825-5eb9bb5d52ac", 1600),
  shelves: img("1594026112284-02bb6f3352fe", 1600),
  showroom: img("1586023492125-27b2c045efd7", 1600),
  games: img("1748130110932-a15df790f831", 1600),
};

export const getCategory = (slug: string) => categories.find((x) => x.slug === slug);

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

// ——— Stock helpers
export const totalStock = (p: Product) => p.colors.reduce((s, c) => s + c.quantity, 0);
export const isReadyNow = (p: Product) => p.colors.some((c) => c.quantity > 0);
export const colorReady = (c: ColorVariant) => c.quantity > 0;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Remote images we can run through next/image optimisation. */
export const canOptimize = (src: string) =>
  src.startsWith("https://images.unsplash.com/") || src.startsWith("https://ik.imagekit.io/");
