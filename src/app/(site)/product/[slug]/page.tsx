import type { Metadata } from "next";
import { ProductView } from "@/components/site/ProductView";
import { getProductMetaList } from "@/lib/server/products";

// Products that exist at build time are prerendered; products added later render on demand.
// Cache Components needs at least one param, hence the placeholder for an empty catalogue.
export async function generateStaticParams() {
  const products = (await getProductMetaList()).filter((p) => p.active);
  return products.length ? products.map((p) => ({ slug: p.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getProductMetaList()).find((x) => x.slug === slug);
  return { title: p?.name ?? "Product", description: p?.description };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  return <ProductView slug={slug} />;
}
