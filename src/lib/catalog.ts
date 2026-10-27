// Catalogue model, categories and helpers. Products themselves live in Firestore (see store.ts).

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
