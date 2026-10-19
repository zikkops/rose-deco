import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductBrowser } from "@/components/site/ProductBrowser";
import { categories, getProductsByCategory, products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop",
  description: "Explore the full Roze Déco collection of luxury furniture and décor.",
};

export default function ShopPage() {
  return (
    <>
      <section className="container-lux pt-12 pb-10 lg:pt-16">
        <nav className="text-xs text-stone">
          <Link href="/" className="hover:text-ink">Home</Link> / <span className="text-ink">Shop</span>
        </nav>
        <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h1 className="font-serif text-5xl font-light lg:text-7xl">The Collection</h1>
          <p className="max-w-md text-sm leading-relaxed text-taupe">
            Every piece in our collection is designed in-house and finished by
            hand. Browse by room, or refine the full collection below.
          </p>
        </div>
      </section>

      <section className="container-lux pb-16">
        <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className="group w-40 shrink-0 snap-start lg:w-auto"
            >
              <div className="relative aspect-square overflow-hidden bg-linen">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 16vw, 160px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 font-serif text-lg leading-tight">{c.name}</p>
              <p className="text-xs text-stone">
                {getProductsByCategory(c.slug).length} pieces
              </p>
            </Link>
          ))}
        </div>
      </section>

      <ProductBrowser products={products} showCategoryFilter />
    </>
  );
}
