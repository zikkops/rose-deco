import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductDetail } from "@/components/site/ProductDetail";
import { getCategory, getProduct, lifestyle, products, relatedProducts } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return { title: p?.name ?? "Product", description: p?.description };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category)!;
  const related = relatedProducts(product);

  return (
    <>
      <div className="container-lux pt-8 pb-16 lg:pt-10">
        <nav className="mb-8 text-xs text-stone">
          <Link href="/" className="hover:text-ink">Home</Link> /{" "}
          <Link href="/shop" className="hover:text-ink">Shop</Link> /{" "}
          <Link href={`/shop/${category.slug}`} className="hover:text-ink">{category.name}</Link> /{" "}
          <span className="text-ink">{product.name}</span>
        </nav>
        <ProductDetail product={product} />
      </div>

      <section className="bg-linen">
        <div className="container-lux grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="relative aspect-[16/11] overflow-hidden">
            <Image src={lifestyle.lounge} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="lg:pl-10">
            <p className="eyebrow">Design service</p>
            <h2 className="mt-4 font-serif text-4xl font-light">Complimentary interior consultation</h2>
            <p className="mt-4 max-w-md leading-relaxed text-taupe">
              Not sure about the finish or the fit? Our designers will help
              you plan your space, order swatches and visualise the
              {" "}{product.name.split(" ")[0]} in your home.
            </p>
            <Link href="/contact" className="btn-outline mt-8">Book a consultation</Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-lux py-20">
          <h2 className="font-serif text-4xl font-light">You may also love</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
