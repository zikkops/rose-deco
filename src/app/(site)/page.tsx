import Image from "next/image";
import Link from "next/link";
import { ArrowRight, AtSign, Gem, MapPin, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { brand } from "@/lib/brand";
import {
  categories,
  featuredProducts,
  lifestyle,
  newArrivals,
} from "@/lib/data";

export default function HomePage() {
  const featured = featuredProducts();
  const arrivals = newArrivals().slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[92vh] min-h-[620px] items-end overflow-hidden">
        <Image
          src={lifestyle.hero}
          alt="Living room styled with Roze Déco pieces"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-ink/10 to-transparent" />
        <div className="container-lux relative pb-20 text-ivory lg:pb-28">
          <p className="eyebrow animate-fade-up text-accent-light">
            Autumn / Winter 2026 Collection
          </p>
          <h1 className="animate-fade-up mt-5 max-w-3xl font-serif text-5xl leading-[1.05] font-light [animation-delay:120ms] sm:text-6xl lg:text-8xl">
            The art of <em className="font-normal">living</em> beautifully
          </h1>
          <p className="animate-fade-up mt-6 max-w-lg text-base leading-relaxed text-ivory/85 [animation-delay:240ms]">
            Distinctive home accessories and occasional furniture, designed to
            bring character and personality to everyday spaces.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col gap-3 [animation-delay:360ms] sm:flex-row sm:gap-4">
            <Link href="/shop" className="btn-light">
              Explore the collection
            </Link>
            <Link
              href="/about"
              className="btn border border-ivory/60 text-ivory hover:bg-ivory hover:text-ink"
            >
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* Value strip */}
      <section className="border-b border-sand/70">
        <div className="container-lux grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {[
            { icon: MapPin, title: "Made in Lebanon", text: "Designed & produced locally" },
            { icon: Sparkles, title: "Original designs", text: "Pieces with personality" },
            { icon: Gem, title: "Accessible design", text: "Considered, within reach" },
            { icon: AtSign, title: brand.instagram, text: "Follow our latest pieces" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <Icon className="size-6 shrink-0 text-accent" strokeWidth={1.2} />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-stone">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-lux py-20 lg:py-28">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Shop by room</p>
            <h2 className="mt-3 font-serif text-4xl font-light lg:text-5xl">
              Curated for every space
            </h2>
          </div>
          <Link href="/shop" className="link-underline text-xs tracking-[0.2em] uppercase">
            View all categories
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className="group relative aspect-[4/5] overflow-hidden bg-linen lg:aspect-[5/4]"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-ivory sm:p-5 lg:p-7">
                <div>
                  <p className="hidden text-[10px] tracking-[0.25em] text-ivory/70 uppercase sm:block">
                    {c.tagline}
                  </p>
                  <h3 className="mt-1 font-serif text-xl leading-tight sm:text-2xl lg:text-3xl">{c.name}</h3>
                </div>
                <ArrowRight className="size-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" strokeWidth={1.5} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-linen py-20 lg:py-28">
        <div className="container-lux">
          <div className="text-center">
            <p className="eyebrow">Most loved</p>
            <h2 className="mt-3 font-serif text-4xl font-light lg:text-5xl">
              Signature pieces
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link href="/shop" className="btn-outline">
              Shop all pieces
            </Link>
          </div>
        </div>
      </section>

      {/* Story split */}
      <section className="container-lux grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={lifestyle.studio}
              alt="Roze Déco interior"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-4 -bottom-8 hidden w-48 border-8 border-ivory bg-ivory lg:block xl:-right-12 xl:w-60">
            <div className="relative aspect-square">
              <Image
                src={lifestyle.shelves}
                alt=""
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <div>
          <p className="eyebrow">Since {brand.founded}</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight font-light lg:text-6xl">
            Designed in <em>Lebanon</em>, made for everyday living
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-taupe">
            Roze Déco is a Lebanese design brand rooted in a passion for
            interiors and contemporary living. Exploring a variety of
            materials, colours and forms, we create home accessories and
            occasional furniture that bring character to everyday spaces.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-sand pt-8">
            {[
              ["01", "Aesthetics"],
              ["02", "Originality"],
              ["03", "Accessibility"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-serif text-4xl">{n}</p>
                <p className="mt-1 text-xs text-stone">{l}</p>
              </div>
            ))}
          </div>
          <Link href="/about" className="btn-dark mt-10">
            Discover our story
          </Link>
        </div>
      </section>

      {/* Full-bleed banner */}
      <section className="relative flex min-h-[560px] items-center overflow-hidden">
        <Image
          src={lifestyle.dining}
          alt="Dining room"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="container-lux relative text-center text-ivory">
          <p className="eyebrow text-accent-light">The Dining Edit</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-light lg:text-6xl">
            Tables made for long, unhurried evenings
          </h2>
          <Link href="/shop/tables" className="btn-light mt-10">
            Shop dining
          </Link>
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-lux py-20 lg:py-28">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Just landed</p>
            <h2 className="mt-3 font-serif text-4xl font-light lg:text-5xl">
              New arrivals
            </h2>
          </div>
          <Link href="/shop" className="link-underline text-xs tracking-[0.2em] uppercase">
            See everything new
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
          {arrivals.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Instagram */}
      <section className="bg-ink py-20 text-center text-ivory lg:py-24">
        <div className="container-lux">
          <p className="eyebrow text-accent-light">Follow along</p>
          <a
            href={brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-serif text-4xl font-light hover:opacity-80 lg:text-6xl"
          >
            {brand.instagram}
          </a>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ivory/70">
            New pieces and our latest designs, first on Instagram.
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container-lux grid items-center gap-10 py-20 lg:grid-cols-2 lg:py-28">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={lifestyle.showroom}
            alt="An interior styled with Roze Déco pieces"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="lg:pl-12">
          <p className="eyebrow">Get in touch</p>
          <h2 className="mt-4 font-serif text-4xl font-light lg:text-5xl">
            Found a piece you love?
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-taupe">
            Message us to place an order, ask about a design or request a
            custom colour or finish.
          </p>
          <ul className="mt-6 space-y-1.5 text-sm text-taupe">
            <li><a href={`mailto:${brand.email}`} className="link-underline">{brand.email}</a></li>
            <li><a href={brand.phoneHref} className="link-underline">{brand.phone}</a></li>
          </ul>
          <Link href="/contact" className="btn-dark mt-8">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
