import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductBrowser } from "@/components/site/ProductBrowser";
import { categories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Categories",
  description: "Home décor, side tables, coffee tables, cushions, games, poufs and bling — designed and produced in Lebanon.",
};

export default function CategoriesPage() {
  return (
    <>
      <section className="container-lux pt-12 pb-10 lg:pt-16">
        <nav className="text-xs text-stone">
          <Link href="/" className="hover:text-ink">Home</Link> / <span className="text-ink">Categories</span>
        </nav>
        <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h1 className="font-serif text-5xl font-light lg:text-7xl">Categories</h1>
          <p className="max-w-md text-sm leading-relaxed text-taupe">
            Distinctive home accessories and occasional furniture. Pieces marked
            <strong className="font-medium text-ink"> Ready now </strong>
            ship right away; out-of-stock pieces can still be ordered and are
            ready in about 2 weeks.
          </p>
        </div>
      </section>

      <section className="container-lux pb-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7 lg:gap-4">
          {categories.map((c) => (
            <Link key={c.slug} href={`/categories/${c.slug}`} className="group">
              <div className="relative aspect-square overflow-hidden bg-linen">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 14vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 flex items-center justify-between font-serif text-lg leading-tight">
                {c.name}
                <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" strokeWidth={1.5} />
              </p>
              <p className="text-xs text-stone">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-lux pb-4">
        <h2 className="font-serif text-3xl font-light lg:text-4xl">All pieces</h2>
      </section>
      <ProductBrowser />
    </>
  );
}
