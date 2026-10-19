// Dummy catalogue data. Replace with CMS / database queries when the backend is connected.

export const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
};

export type Material =
  | "Leather"
  | "Velvet"
  | "Bouclé"
  | "Linen"
  | "Solid Oak"
  | "Walnut"
  | "Marble"
  | "Brass"
  | "Ceramic"
  | "Lacquer";

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  material: Material;
  color: string;
  colorHex: string;
  finishes: { name: string; hex: string }[];
  images: string[];
  description: string;
  details: string[];
  dimensions: string;
  leadTime: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviews: number;
  designer: string;
};

export const categories: Category[] = [
  {
    slug: "sofas",
    name: "Sofas & Sectionals",
    tagline: "The heart of the home",
    description:
      "Deep seats, hand-tailored upholstery and frames built from kiln-dried hardwood — sofas made to be sunk into for decades.",
    image: img("1540574163026-643ea20ade25"),
  },
  {
    slug: "chairs",
    name: "Chairs & Armchairs",
    tagline: "Sculptural seating",
    description:
      "From statement lounge chairs to refined dining seats, each piece balances comfort with a sculptor's eye for form.",
    image: img("1567538096630-e0c55bd6374c"),
  },
  {
    slug: "tables",
    name: "Tables",
    tagline: "Gather, dine, display",
    description:
      "Dining, console and occasional tables in solid timbers, stone and lacquer, finished entirely by hand.",
    image: img("1577140917170-285929fb55b7"),
  },
  {
    slug: "bedroom",
    name: "Bedroom",
    tagline: "Quiet luxury for rest",
    description:
      "Upholstered beds, channel-tufted headboards and bedside companions for a sanctuary that feels effortless.",
    image: img("1582582621959-48d27397dc69"),
  },
  {
    slug: "lighting",
    name: "Lighting",
    tagline: "Sculpted in light",
    description:
      "Pendants, floor and table lamps in spun metal and brass that cast a warm, flattering glow.",
    image: img("1540932239986-30128078f3c5"),
  },
  {
    slug: "decor",
    name: "Décor & Storage",
    tagline: "The finishing touch",
    description:
      "Sideboards, cabinets, shelving and objets that bring order and character to every room.",
    image: img("1618219908412-a29a1bb7b86e"),
  },
];

const p = (x: Omit<Product, "images"> & { images: string[] }): Product => ({
  ...x,
  images: x.images.map((id) => img(id)),
});

export const products: Product[] = [
  // ——— Sofas
  p({
    slug: "valentina-leather-sofa",
    name: "Valentina Leather Sofa",
    category: "sofas",
    price: 6450,
    material: "Leather",
    color: "Cognac",
    colorHex: "#a8693f",
    finishes: [
      { name: "Cognac", hex: "#a8693f" },
      { name: "Espresso", hex: "#4a3226" },
      { name: "Sand", hex: "#cdb79a" },
    ],
    images: ["1540574163026-643ea20ade25", "1556228453-efd6c1ff04f6"],
    description:
      "A low-slung silhouette wrapped in full-grain Italian leather that softens and develops a rich patina with every year of use.",
    details: [
      "Full-grain aniline leather",
      "Kiln-dried beech hardwood frame",
      "Feather-wrapped high-resilience foam cushions",
      "Solid walnut legs",
    ],
    dimensions: "W 228 × D 96 × H 78 cm",
    leadTime: "Ships in 2–3 weeks",
    inStock: true,
    isBestseller: true,
    rating: 4.9,
    reviews: 128,
    designer: "Roze Déco",
  }),
  p({
    slug: "aurelio-cognac-sofa",
    name: "Aurelio Sofa",
    category: "sofas",
    price: 7200,
    material: "Leather",
    color: "Amber",
    colorHex: "#b8642c",
    finishes: [
      { name: "Amber", hex: "#b8642c" },
      { name: "Noir", hex: "#1f1a17" },
    ],
    images: ["1549187774-b4e9b0445b41", "1615873968403-89e068629265"],
    description:
      "Clean architectural lines meet buttery semi-aniline leather. Slim track arms keep the profile light while the seat stays generous.",
    details: [
      "Semi-aniline leather",
      "Blackened steel base",
      "Removable seat cushions",
      "Made in Lebanon",
    ],
    dimensions: "W 240 × D 98 × H 74 cm",
    leadTime: "Made to order — 8 weeks",
    inStock: false,
    isNew: true,
    rating: 4.8,
    reviews: 42,
    designer: "Roze Déco",
  }),
  p({
    slug: "esme-velvet-sofa",
    name: "Esme Velvet Sofa",
    category: "sofas",
    price: 5890,
    compareAt: 6600,
    material: "Velvet",
    color: "Emerald",
    colorHex: "#2f5d50",
    finishes: [
      { name: "Emerald", hex: "#2f5d50" },
      { name: "Blush", hex: "#d8b4a6" },
      { name: "Midnight", hex: "#27304a" },
    ],
    images: ["1555041469-a586c61ea9bc", "1550581190-9c1c48d21d6c"],
    description:
      "Jewel-toned cotton velvet, channel-stitched cushions and tapered legs — a modern take on mid-century glamour.",
    details: [
      "Performance cotton velvet",
      "Channel-stitched back cushions",
      "Solid oak tapered legs",
      "Stain-resistant finish",
    ],
    dimensions: "W 210 × D 90 × H 80 cm",
    leadTime: "Ships in 1–2 weeks",
    inStock: true,
    isBestseller: true,
    rating: 4.9,
    reviews: 211,
    designer: "Roze Déco",
  }),
  p({
    slug: "marlow-modular-sofa",
    name: "Marlow Modular Sofa",
    category: "sofas",
    price: 8900,
    material: "Bouclé",
    color: "Mocha",
    colorHex: "#9b7b62",
    finishes: [
      { name: "Mocha", hex: "#9b7b62" },
      { name: "Ivory", hex: "#ede6da" },
    ],
    images: ["1578500494198-246f612d3b3d", "1616486338812-3dadae4b4ace"],
    description:
      "Configure your perfect lounge. Generous modules in textured bouclé that can be rearranged as life — and rooms — change.",
    details: [
      "Wool-blend bouclé",
      "Interlocking modules",
      "Down-blend cushioning",
      "Hidden plinth base",
    ],
    dimensions: "W 320 × D 105 × H 70 cm (3-piece)",
    leadTime: "Made to order — 10 weeks",
    inStock: true,
    isNew: true,
    rating: 4.7,
    reviews: 36,
    designer: "Roze Déco",
  }),
  p({
    slug: "sienna-lounge-sofa",
    name: "Sienna Lounge Sofa",
    category: "sofas",
    price: 4750,
    material: "Linen",
    color: "Terracotta",
    colorHex: "#c3562f",
    finishes: [
      { name: "Terracotta", hex: "#c3562f" },
      { name: "Olive", hex: "#6f7350" },
    ],
    images: ["1567016432779-094069958ea5"],
    description:
      "A cheerful, sun-baked hue on a sculpted, rounded frame. Washed Belgian linen gives it a relaxed, lived-in feel.",
    details: [
      "Belgian washed linen",
      "Rounded sculpted arms",
      "Removable covers",
      "Solid ash frame",
    ],
    dimensions: "W 198 × D 92 × H 82 cm",
    leadTime: "Ships in 2–3 weeks",
    inStock: true,
    rating: 4.6,
    reviews: 58,
    designer: "Roze Déco",
  }),
  p({
    slug: "celine-three-seater",
    name: "Céline Three-Seater",
    category: "sofas",
    price: 3980,
    material: "Linen",
    color: "Dove Grey",
    colorHex: "#a9adb0",
    finishes: [
      { name: "Dove Grey", hex: "#a9adb0" },
      { name: "Oat", hex: "#d9cdb8" },
    ],
    images: ["1484101403633-562f891dc89a", "1493663284031-b7e3aefcae8e"],
    description:
      "Understated and endlessly versatile, with a buttoned back and slim arms that suit apartments and family homes alike.",
    details: [
      "Linen-cotton blend",
      "Button-tufted back",
      "Pocket-sprung seat",
      "Oak legs",
    ],
    dimensions: "W 202 × D 88 × H 84 cm",
    leadTime: "Ships in 1 week",
    inStock: true,
    rating: 4.5,
    reviews: 87,
    designer: "Roze Déco",
  }),

  // ——— Chairs
  p({
    slug: "odette-tufted-chair",
    name: "Odette Tufted Chair",
    category: "chairs",
    price: 1890,
    material: "Bouclé",
    color: "Ivory",
    colorHex: "#efe9df",
    finishes: [
      { name: "Ivory", hex: "#efe9df" },
      { name: "Blush", hex: "#d8b4a6" },
    ],
    images: ["1567538096630-e0c55bd6374c"],
    description:
      "A petite, deeply tufted occasional chair with a scalloped back — a soft sculptural accent for bedrooms and dressing rooms.",
    details: [
      "Ivory bouclé upholstery",
      "Hand-tufted back",
      "Lacquered legs",
      "Seat height 44 cm",
    ],
    dimensions: "W 66 × D 64 × H 82 cm",
    leadTime: "Ships in 1–2 weeks",
    inStock: true,
    isNew: true,
    rating: 4.8,
    reviews: 64,
    designer: "Roze Déco",
  }),
  p({
    slug: "lune-lounge-chair",
    name: "Lune Lounge Chair",
    category: "chairs",
    price: 2250,
    material: "Velvet",
    color: "Sky",
    colorHex: "#9fb9d4",
    finishes: [
      { name: "Sky", hex: "#9fb9d4" },
      { name: "Sage", hex: "#a3ad92" },
      { name: "Rose", hex: "#d4a59a" },
    ],
    images: ["1634712282287-14ed57b9cc89", "1611967164521-abae8fba4668"],
    description:
      "Embracing curves and a generous seat make the Lune the chair you'll reach for with a book and a coffee every morning.",
    details: [
      "Soft cotton velvet",
      "Wraparound wing silhouette",
      "Solid beech legs",
      "Seat height 42 cm",
    ],
    dimensions: "W 78 × D 80 × H 86 cm",
    leadTime: "Ships in 2 weeks",
    inStock: true,
    isBestseller: true,
    rating: 4.9,
    reviews: 152,
    designer: "Roze Déco",
  }),
  p({
    slug: "arlo-dining-chair",
    name: "Arlo Dining Chair",
    category: "chairs",
    price: 640,
    material: "Solid Oak",
    color: "Stone Grey",
    colorHex: "#8e8b87",
    finishes: [
      { name: "Stone Grey", hex: "#8e8b87" },
      { name: "Camel", hex: "#b48a5e" },
    ],
    images: ["1598300042247-d088f8ab3a91"],
    description:
      "A gently curved back and upholstered seat on solid oak legs. Comfortable enough for long dinners that run late.",
    details: [
      "Solid white oak legs",
      "Wool-blend upholstery",
      "Sold individually",
      "Seat height 47 cm",
    ],
    dimensions: "W 52 × D 56 × H 92 cm",
    leadTime: "Ships in 1 week",
    inStock: true,
    rating: 4.6,
    reviews: 93,
    designer: "Roze Déco",
  }),
  p({
    slug: "nori-shell-chair",
    name: "Nori Shell Chair",
    category: "chairs",
    price: 2980,
    material: "Walnut",
    color: "Natural",
    colorHex: "#d9c3a2",
    finishes: [
      { name: "Natural Oak", hex: "#d9c3a2" },
      { name: "Walnut", hex: "#6b4a32" },
    ],
    images: ["1519947486511-46149fa0a254"],
    description:
      "Three legs, a winged plywood shell and a cushioned seat — an icon of modern design reinterpreted with luxurious detail.",
    details: [
      "Moulded veneer shell",
      "Removable leather cushions",
      "Hand-oiled finish",
      "Limited production",
    ],
    dimensions: "W 92 × D 82 × H 74 cm",
    leadTime: "Made to order — 6 weeks",
    inStock: false,
    rating: 4.9,
    reviews: 27,
    designer: "Roze Déco",
  }),
  p({
    slug: "cassian-leather-armchair",
    name: "Cassian Leather Armchair",
    category: "chairs",
    price: 1750,
    material: "Leather",
    color: "Tan",
    colorHex: "#a55f3d",
    finishes: [
      { name: "Tan", hex: "#a55f3d" },
      { name: "Black", hex: "#1f1a17" },
    ],
    images: ["1612372606404-0ab33e7187ee"],
    description:
      "A channel-stitched leather swivel chair that moves easily between a study and a dressing area.",
    details: [
      "Top-grain leather",
      "360° swivel base",
      "Gas-lift height adjustment",
      "Polished chrome base",
    ],
    dimensions: "W 62 × D 60 × H 82–92 cm",
    leadTime: "Ships in 1 week",
    inStock: true,
    rating: 4.5,
    reviews: 48,
    designer: "Roze Déco",
  }),
  p({
    slug: "bastien-bar-stool",
    name: "Bastien Bar Stool",
    category: "chairs",
    price: 520,
    material: "Solid Oak",
    color: "Noir",
    colorHex: "#1f1a17",
    finishes: [
      { name: "Noir", hex: "#1f1a17" },
      { name: "Ivory", hex: "#efe9df" },
    ],
    images: ["1581539250439-c96689b516dd"],
    description:
      "A moulded seat on a slender oak frame with a brass-capped footrest. Perfectly scaled for kitchen islands.",
    details: [
      "Moulded seat shell",
      "Solid oak legs",
      "Steel footrest",
      "Seat height 75 cm",
    ],
    dimensions: "W 46 × D 48 × H 102 cm",
    leadTime: "Ships in 1 week",
    inStock: true,
    rating: 4.4,
    reviews: 71,
    designer: "Roze Déco",
  }),

  // ——— Tables
  p({
    slug: "ondine-dining-table",
    name: "Ondine Dining Table",
    category: "tables",
    price: 4200,
    material: "Solid Oak",
    color: "Natural Oak",
    colorHex: "#c79b6a",
    finishes: [
      { name: "Natural Oak", hex: "#c79b6a" },
      { name: "Smoked Oak", hex: "#6b5240" },
    ],
    images: ["1577140917170-285929fb55b7", "1617806118233-18e1de247200"],
    description:
      "A solid oak dining table with softly chamfered edges, made to anchor family meals and long celebrations.",
    details: [
      "Solid European oak",
      "Seats 6–8",
      "Hard-wax oil finish",
      "Hand-finished in our atelier",
    ],
    dimensions: "W 220 × D 100 × H 75 cm",
    leadTime: "Made to order — 6 weeks",
    inStock: true,
    isBestseller: true,
    rating: 4.9,
    reviews: 102,
    designer: "Roze Déco",
  }),
  p({
    slug: "halden-console",
    name: "Halden Console",
    category: "tables",
    price: 2150,
    material: "Solid Oak",
    color: "Natural Oak",
    colorHex: "#c79b6a",
    finishes: [{ name: "Natural Oak", hex: "#c79b6a" }],
    images: ["1530018607912-eff2daa1bac4"],
    description:
      "A slim two-drawer console on hairpin legs — ideal for an entryway, behind a sofa or as a compact desk.",
    details: [
      "Solid oak top & drawers",
      "Blackened steel legs",
      "Soft-close drawers",
      "Depth only 40 cm",
    ],
    dimensions: "W 140 × D 40 × H 78 cm",
    leadTime: "Ships in 2 weeks",
    inStock: true,
    rating: 4.6,
    reviews: 39,
    designer: "Roze Déco",
  }),
  p({
    slug: "pomme-bistro-table",
    name: "Pomme Bistro Table",
    category: "tables",
    price: 1350,
    material: "Lacquer",
    color: "Ivory",
    colorHex: "#f2eee8",
    finishes: [
      { name: "Ivory", hex: "#f2eee8" },
      { name: "Noir", hex: "#1f1a17" },
    ],
    images: ["1533090481720-856c6e3c1fdc"],
    description:
      "A round high-gloss lacquer top on splayed oak legs. Seats four for breakfast, coffee or an intimate supper.",
    details: [
      "High-gloss lacquer top",
      "Solid beech legs",
      "Seats 4",
      "Ø 100 cm",
    ],
    dimensions: "Ø 100 × H 74 cm",
    leadTime: "Ships in 1 week",
    inStock: true,
    rating: 4.5,
    reviews: 55,
    designer: "Roze Déco",
  }),
  p({
    slug: "lior-side-table",
    name: "Lior Side Table",
    category: "tables",
    price: 680,
    material: "Lacquer",
    color: "White",
    colorHex: "#f6f4f0",
    finishes: [
      { name: "White", hex: "#f6f4f0" },
      { name: "Rose", hex: "#d4a59a" },
    ],
    images: ["1499933374294-4584851497cc"],
    description:
      "A tripod side table with dipped-oak feet — small enough for a bedside, charming enough to stand alone.",
    details: ["Lacquered top", "Oak tripod legs", "Ø 45 cm", "Easy assembly"],
    dimensions: "Ø 45 × H 55 cm",
    leadTime: "Ships in 3 days",
    inStock: true,
    isNew: true,
    rating: 4.7,
    reviews: 22,
    designer: "Roze Déco",
  }),
  p({
    slug: "ravel-round-table",
    name: "Ravel Round Table",
    category: "tables",
    price: 2600,
    material: "Walnut",
    color: "Walnut",
    colorHex: "#6b4a32",
    finishes: [{ name: "Walnut", hex: "#6b4a32" }],
    images: ["1487015307662-6ce6210680f1"],
    description:
      "A pedestal dining table in American black walnut with a sweeping three-leg base and a hand-rubbed oil finish.",
    details: [
      "American black walnut",
      "Pedestal base",
      "Seats 4–5",
      "Natural oil finish",
    ],
    dimensions: "Ø 120 × H 75 cm",
    leadTime: "Made to order — 6 weeks",
    inStock: false,
    rating: 4.8,
    reviews: 31,
    designer: "Roze Déco",
  }),

  // ——— Bedroom
  p({
    slug: "isabeau-tufted-bed",
    name: "Isabeau Tufted Bed",
    category: "bedroom",
    price: 5600,
    material: "Linen",
    color: "Ivory",
    colorHex: "#ede6da",
    finishes: [
      { name: "Ivory", hex: "#ede6da" },
      { name: "Fog", hex: "#b9b6b0" },
    ],
    images: ["1582582621959-48d27397dc69", "1505693416388-ac5ce068fe85"],
    description:
      "A grand, hand-tufted headboard in soft linen creates a statement focal point for a serene, hotel-inspired bedroom.",
    details: [
      "Hand-tufted headboard",
      "Washed linen upholstery",
      "Solid slatted base",
      "King & Super King",
    ],
    dimensions: "W 196 × L 220 × H 150 cm (King)",
    leadTime: "Made to order — 8 weeks",
    inStock: true,
    isBestseller: true,
    rating: 4.9,
    reviews: 119,
    designer: "Roze Déco",
  }),
  p({
    slug: "margaux-upholstered-bed",
    name: "Margaux Upholstered Bed",
    category: "bedroom",
    price: 4900,
    material: "Solid Oak",
    color: "Oak & Rust",
    colorHex: "#a3552e",
    finishes: [{ name: "Natural Oak", hex: "#c79b6a" }],
    images: ["1616627561839-074385245ff6"],
    description:
      "A low oak platform bed with a padded headboard — warm, grounded and quietly modern.",
    details: [
      "Solid oak frame",
      "Padded headboard",
      "Low 28 cm platform",
      "Queen & King",
    ],
    dimensions: "W 178 × L 214 × H 95 cm (Queen)",
    leadTime: "Ships in 3 weeks",
    inStock: true,
    rating: 4.7,
    reviews: 46,
    designer: "Roze Déco",
  }),
  p({
    slug: "solenne-bed-frame",
    name: "Solenne Bed Frame",
    category: "bedroom",
    price: 4300,
    material: "Velvet",
    color: "Charcoal",
    colorHex: "#4a4a4c",
    finishes: [
      { name: "Charcoal", hex: "#4a4a4c" },
      { name: "Taupe", hex: "#8a7b6e" },
    ],
    images: ["1631049307264-da0ec9d70304"],
    description:
      "Wide horizontal panels form a tailored, architectural headboard that frames the bed with calm confidence.",
    details: [
      "Panelled headboard",
      "Velvet upholstery",
      "Under-bed storage option",
      "King size",
    ],
    dimensions: "W 196 × L 216 × H 125 cm",
    leadTime: "Made to order — 7 weeks",
    inStock: true,
    rating: 4.6,
    reviews: 28,
    designer: "Roze Déco",
  }),
  p({
    slug: "ariane-channel-bed",
    name: "Ariane Channel Bed",
    category: "bedroom",
    price: 6800,
    material: "Bouclé",
    color: "Cloud",
    colorHex: "#e9e6e1",
    finishes: [{ name: "Cloud", hex: "#e9e6e1" }],
    images: ["1616594039964-ae9021a400a0"],
    description:
      "Plump vertical channels curve gently around the sleeper — an indulgent, cocooning bed in ultra-soft bouclé.",
    details: [
      "Channel-tufted bouclé",
      "Curved wraparound headboard",
      "Hidden legs",
      "King size",
    ],
    dimensions: "W 210 × L 228 × H 115 cm",
    leadTime: "Made to order — 10 weeks",
    inStock: false,
    isNew: true,
    rating: 5.0,
    reviews: 14,
    designer: "Roze Déco",
  }),
  p({
    slug: "elio-nightstand",
    name: "Elio Nightstand",
    category: "bedroom",
    price: 890,
    material: "Solid Oak",
    color: "White & Oak",
    colorHex: "#f2eee8",
    finishes: [
      { name: "White & Oak", hex: "#f2eee8" },
      { name: "Noir & Oak", hex: "#1f1a17" },
    ],
    images: ["1522771739844-6a9f6d5f14af"],
    description:
      "A single drawer and an open shelf on splayed oak legs — light, practical and beautifully proportioned.",
    details: [
      "Lacquered case",
      "Solid oak drawer front",
      "Soft-close drawer",
      "Sold individually",
    ],
    dimensions: "W 50 × D 40 × H 55 cm",
    leadTime: "Ships in 1 week",
    inStock: true,
    rating: 4.6,
    reviews: 77,
    designer: "Roze Déco",
  }),

  // ——— Lighting
  p({
    slug: "halo-floor-lamp",
    name: "Halo Floor Lamp",
    category: "lighting",
    price: 780,
    material: "Brass",
    color: "Graphite",
    colorHex: "#5b5d60",
    finishes: [
      { name: "Graphite", hex: "#5b5d60" },
      { name: "Brass", hex: "#a8865a" },
    ],
    images: ["1507473885765-e6ed057f782c"],
    description:
      "An adjustable task lamp with a generous dome shade, ideal beside a reading chair or desk.",
    details: [
      "Powder-coated steel",
      "Adjustable arm & shade",
      "E27 bulb (included)",
      "Dimmable",
    ],
    dimensions: "Ø 35 × H 150 cm",
    leadTime: "Ships in 3 days",
    inStock: true,
    rating: 4.5,
    reviews: 66,
    designer: "Roze Déco",
  }),
  p({
    slug: "calla-pendant",
    name: "Calla Pendant",
    category: "lighting",
    price: 460,
    material: "Brass",
    color: "Matte White",
    colorHex: "#e8e6e2",
    finishes: [
      { name: "Matte White", hex: "#e8e6e2" },
      { name: "Rose", hex: "#d4a59a" },
    ],
    images: ["1513506003901-1e6a229e2d15"],
    description:
      "A spun-aluminium dome that casts a soft pool of light — perfect in multiples above an island or table.",
    details: [
      "Spun aluminium shade",
      "Adjustable 2 m cable",
      "Ø 40 cm",
      "Dimmable",
    ],
    dimensions: "Ø 40 × H 28 cm",
    leadTime: "Ships in 3 days",
    inStock: true,
    rating: 4.6,
    reviews: 84,
    designer: "Roze Déco",
  }),
  p({
    slug: "ember-copper-pendant-trio",
    name: "Ember Pendant Trio",
    category: "lighting",
    price: 1450,
    material: "Brass",
    color: "Copper",
    colorHex: "#b87333",
    finishes: [
      { name: "Copper", hex: "#b87333" },
      { name: "Brass", hex: "#a8865a" },
    ],
    images: ["1540932239986-30128078f3c5"],
    description:
      "A cluster of burnished copper bells hung at staggered heights for a warm, dramatic glow.",
    details: [
      "Burnished copper",
      "Set of three",
      "Adjustable drop heights",
      "Ceiling canopy included",
    ],
    dimensions: "Ø 28 cm each",
    leadTime: "Ships in 1 week",
    inStock: true,
    isBestseller: true,
    rating: 4.9,
    reviews: 98,
    designer: "Roze Déco",
  }),
  p({
    slug: "arc-reading-lamp",
    name: "Arc Reading Lamp",
    category: "lighting",
    price: 1120,
    material: "Brass",
    color: "Black",
    colorHex: "#1f1a17",
    finishes: [{ name: "Black", hex: "#1f1a17" }],
    images: ["1524758631624-e2822e304c36"],
    description:
      "A cantilevered arm and slim conical shade reach gracefully over a sofa or lounge chair.",
    details: [
      "Weighted marble base",
      "Pivoting arm",
      "LED compatible",
      "Foot dimmer",
    ],
    dimensions: "W 120 × H 180 cm",
    leadTime: "Ships in 1 week",
    inStock: true,
    isNew: true,
    rating: 4.7,
    reviews: 19,
    designer: "Roze Déco",
  }),
  p({
    slug: "lumen-linear-pendant",
    name: "Lumen Pendant",
    category: "lighting",
    price: 690,
    material: "Brass",
    color: "Ivory",
    colorHex: "#efe9df",
    finishes: [{ name: "Ivory", hex: "#efe9df" }],
    images: ["1524484485831-a92ffc0de03f"],
    description:
      "A wide, shallow shade that floods a dining table or desk with diffused, glare-free light.",
    details: ["Powder-coated steel", "Ø 45 cm", "Opal diffuser", "Dimmable"],
    dimensions: "Ø 45 × H 18 cm",
    leadTime: "Ships in 3 days",
    inStock: true,
    rating: 4.4,
    reviews: 33,
    designer: "Roze Déco",
  }),

  // ——— Décor & Storage
  p({
    slug: "terra-vase-collection",
    name: "Terra Vase Collection",
    category: "decor",
    price: 340,
    material: "Ceramic",
    color: "Stone",
    colorHex: "#a5a29d",
    finishes: [{ name: "Stone", hex: "#a5a29d" }],
    images: ["1565193566173-7a0ee3dbe261"],
    description:
      "Three hand-thrown stoneware vessels with a raw, matte glaze — beautiful empty or holding dried stems.",
    details: [
      "Hand-thrown stoneware",
      "Set of three",
      "Watertight interior",
      "Each piece unique",
    ],
    dimensions: "H 22 / 30 / 38 cm",
    leadTime: "Ships in 3 days",
    inStock: true,
    isBestseller: true,
    rating: 4.8,
    reviews: 143,
    designer: "Roze Déco",
  }),
  p({
    slug: "rivoli-sideboard",
    name: "Rivoli Sideboard",
    category: "decor",
    price: 3750,
    material: "Walnut",
    color: "Ochre",
    colorHex: "#c9a24a",
    finishes: [
      { name: "Ochre", hex: "#c9a24a" },
      { name: "Walnut", hex: "#6b4a32" },
    ],
    images: ["1618219908412-a29a1bb7b86e", "1618220179428-22790b461013"],
    description:
      "Fluted cane-effect doors and a slim walnut frame make the Rivoli a sculptural piece as much as storage.",
    details: [
      "Walnut veneer frame",
      "Fluted doors",
      "Adjustable shelves",
      "Brass pulls",
    ],
    dimensions: "W 180 × D 45 × H 75 cm",
    leadTime: "Made to order — 6 weeks",
    inStock: true,
    isNew: true,
    isBestseller: true,
    rating: 4.8,
    reviews: 24,
    designer: "Roze Déco",
  }),
  p({
    slug: "alba-wall-cabinet",
    name: "Alba Wall Cabinet",
    category: "decor",
    price: 1980,
    material: "Solid Oak",
    color: "Limed Oak",
    colorHex: "#cbbba3",
    finishes: [{ name: "Limed Oak", hex: "#cbbba3" }],
    images: ["1595428774223-ef52624120d2"],
    description:
      "A tall wall-mounted cabinet with open cubbies for books, linen and treasured objects.",
    details: [
      "Limed oak veneer",
      "Wall-mounted",
      "8 open compartments",
      "Fixings included",
    ],
    dimensions: "W 50 × D 30 × H 190 cm",
    leadTime: "Ships in 2 weeks",
    inStock: true,
    rating: 4.5,
    reviews: 18,
    designer: "Roze Déco",
  }),
  p({
    slug: "mira-sideboard",
    name: "Mira Sideboard",
    category: "decor",
    price: 2850,
    compareAt: 3200,
    material: "Lacquer",
    color: "White & Oak",
    colorHex: "#f2eee8",
    finishes: [{ name: "White & Oak", hex: "#f2eee8" }],
    images: ["1556020685-ae41abfc9365"],
    description:
      "A crisp lacquered sideboard with a warm oak top — styled here with our round brass mirror.",
    details: [
      "Lacquered doors",
      "Solid oak top",
      "Push-to-open doors",
      "Cable management",
    ],
    dimensions: "W 160 × D 45 × H 70 cm",
    leadTime: "Ships in 1 week",
    inStock: true,
    rating: 4.6,
    reviews: 41,
    designer: "Roze Déco",
  }),
  p({
    slug: "atelier-bookshelf",
    name: "Atelier Bookshelf",
    category: "decor",
    price: 1680,
    material: "Solid Oak",
    color: "Natural Oak",
    colorHex: "#c79b6a",
    finishes: [{ name: "Natural Oak", hex: "#c79b6a" }],
    images: ["1532372320572-cda25653a26d"],
    description:
      "Softly radiused corners and solid timber shelves — a low bookcase that doubles as a display plinth.",
    details: [
      "Solid oak",
      "Rounded edges",
      "Two fixed shelves",
      "Hand-oiled finish",
    ],
    dimensions: "W 90 × D 35 × H 80 cm",
    leadTime: "Ships in 2 weeks",
    inStock: false,
    rating: 4.7,
    reviews: 29,
    designer: "Roze Déco",
  }),
];

export const lifestyle = {
  hero: img("1618220179428-22790b461013", 2000),
  heroAlt: img("1616046229478-9901c5536a45", 2000),
  living: img("1615873968403-89e068629265", 1600),
  bright: img("1600210492486-724fe5c67fb0", 1600),
  dining: img("1617806118233-18e1de247200", 1600),
  lounge: img("1615529182904-14819c35db37", 1600),
  bedroom: img("1615874959474-d609969a20ed", 1600),
  hotel: img("1590490360182-c33d57733427", 1600),
  studio: img("1615875605825-5eb9bb5d52ac", 1600),
  workspace: img("1600494603989-9650cf6ddd3d", 1600),
  showroom: img("1586023492125-27b2c045efd7", 1600),
  shelves: img("1594026112284-02bb6f3352fe", 1600),
};

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const getProduct = (slug: string) =>
  products.find((x) => x.slug === slug);

export const getProductsByCategory = (slug: string) =>
  products.filter((x) => x.category === slug);

export const featuredProducts = () =>
  products.filter((x) => x.isBestseller).slice(0, 8);

export const newArrivals = () => products.filter((x) => x.isNew);

export const relatedProducts = (product: Product, count = 4) =>
  products
    .filter((x) => x.category === product.category && x.slug !== product.slug)
    .slice(0, count);

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
