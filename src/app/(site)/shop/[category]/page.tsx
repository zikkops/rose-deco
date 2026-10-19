import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductBrowser } from "@/components/site/ProductBrowser";
import { categories, getCategory, getProductsByCategory } from "@/lib/data";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  return { title: c?.name ?? "Shop", description: c?.description };
}

export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const items = getProductsByCategory(c.slug);

  return (
    <>
      <section className="relative flex h-[46vh] min-h-[360px] items-end overflow-hidden">
        <Image src={c.image} alt={c.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/10" />
        <div className="container-lux relative pb-12 text-ivory">
          <nav className="text-xs text-ivory/70">
            <Link href="/" className="hover:text-ivory">Home</Link> /{" "}
            <Link href="/shop" className="hover:text-ivory">Shop</Link> /{" "}
            <span className="text-ivory">{c.name}</span>
          </nav>
          <h1 className="mt-4 font-serif text-5xl font-light lg:text-7xl">{c.name}</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/85">{c.description}</p>
        </div>
      </section>

      <section className="container-lux py-6">
        <div className="no-scrollbar flex gap-6 overflow-x-auto text-xs tracking-[0.2em] whitespace-nowrap uppercase">
          <Link href="/shop" className="py-2 text-stone hover:text-ink">All</Link>
          {categories.map((x) => (
            <Link
              key={x.slug}
              href={`/shop/${x.slug}`}
              className={`py-2 ${
                x.slug === c.slug ? "border-b border-ink text-ink" : "text-stone hover:text-ink"
              }`}
            >
              {x.name}
            </Link>
          ))}
        </div>
      </section>

      <ProductBrowser products={items} />
    </>
  );
}
