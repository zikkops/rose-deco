import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductBrowser } from "@/components/site/ProductBrowser";
import { categories, getCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  return { title: c?.name ?? "Categories", description: c?.description };
}

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();

  return (
    <>
      <section className="relative flex h-[42vh] min-h-[340px] items-end overflow-hidden">
        <Image src={c.image} alt={c.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/10" />
        <div className="container-lux relative pb-12 text-ivory">
          <nav className="text-xs text-ivory/70">
            <Link href="/" className="hover:text-ivory">Home</Link> /{" "}
            <Link href="/categories" className="hover:text-ivory">Categories</Link> /{" "}
            <span className="text-ivory">{c.name}</span>
          </nav>
          <h1 className="mt-4 font-serif text-5xl font-light lg:text-7xl">{c.name}</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/85">{c.description}</p>
        </div>
      </section>

      <section className="container-lux py-6">
        <div className="no-scrollbar flex gap-6 overflow-x-auto text-xs tracking-[0.2em] whitespace-nowrap uppercase">
          <Link href="/categories" className="py-2 text-stone hover:text-ink">All</Link>
          {categories.map((x) => (
            <Link
              key={x.slug}
              href={`/categories/${x.slug}`}
              className={`py-2 ${x.slug === c.slug ? "border-b border-ink text-ink" : "text-stone hover:text-ink"}`}
            >
              {x.name}
            </Link>
          ))}
        </div>
      </section>

      <ProductBrowser category={c.slug} />
    </>
  );
}
