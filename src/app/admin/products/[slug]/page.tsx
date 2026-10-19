import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProduct, products } from "@/lib/data";

export const metadata = { title: "Edit product" };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function EditProductPage({ params }: PageProps<"/admin/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductForm product={product} />;
}
