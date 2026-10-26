import type { Metadata } from "next";
import { ProductView } from "@/components/site/ProductView";
import { seedProducts } from "@/lib/catalog";

// Seed products are prerendered; products added in the demo admin render on demand.
export function generateStaticParams() {
  return seedProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = seedProducts.find((x) => x.slug === slug);
  return { title: p?.name ?? "Product", description: p?.description };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  return <ProductView slug={slug} />;
}
