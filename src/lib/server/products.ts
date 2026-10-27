import { cacheLife } from "next/cache";

// Server-side, read-only access to the public `products` collection (Firestore REST API),
// used for build-time product pages and SEO metadata. The storefront itself reads live data client-side.

const BASE = "https://firestore.googleapis.com/v1/projects/rose-deco/databases/(default)/documents";
const API_KEY = "AIzaSyBOdq0HFbfm8uwFaDtDZQr1myPiuidBF0I";

type Field = { stringValue?: string; booleanValue?: boolean };
type Doc = { fields?: Record<string, Field> };

export type ProductMeta = { slug: string; name: string; description: string; image?: string; active: boolean };

async function fetchProductMeta(): Promise<ProductMeta[]> {
  const params = new URLSearchParams({ pageSize: "500", key: API_KEY });
  for (const f of ["slug", "name", "description", "active"]) params.append("mask.fieldPaths", f);
  const res = await fetch(`${BASE}/products?${params}`);
  if (!res.ok) throw new Error(`Firestore REST ${res.status}`);
  const json = (await res.json()) as { documents?: Doc[] };
  return (json.documents ?? []).map((d) => ({
    slug: d.fields?.slug?.stringValue ?? "",
    name: d.fields?.name?.stringValue ?? "",
    description: d.fields?.description?.stringValue ?? "",
    active: d.fields?.active?.booleanValue ?? true,
  })).filter((p) => p.slug);
}

/** Cached list of products (refreshes hourly) — safe to call from generateMetadata / generateStaticParams. */
export async function getProductMetaList(): Promise<ProductMeta[]> {
  "use cache";
  cacheLife("hours");
  try {
    return await fetchProductMeta();
  } catch (e) {
    console.error("[products] could not load product list", e);
    return [];
  }
}
