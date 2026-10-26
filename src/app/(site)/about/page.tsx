import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { lifestyle } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Roze Déco is a Lebanese design brand creating distinctive home accessories and occasional furniture, designed and produced in Lebanon.",
};

const values = [
  {
    n: "01",
    title: "Aesthetics",
    text: "Every piece starts with how it looks and feels in a room — considered proportions, colours and finishes that bring character to a space.",
  },
  {
    n: "02",
    title: "Originality",
    text: "We explore a variety of materials, colours and forms to create distinctive designs you won't find anywhere else.",
  },
  {
    n: "03",
    title: "Accessibility",
    text: "Good design should be within reach. We create pieces that bring personality to everyday spaces without compromise.",
  },
  {
    n: "04",
    title: "Made in Lebanon",
    text: "Every piece is thoughtfully designed and produced in Lebanon, working closely with local makers.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="container-lux pt-16 pb-12 text-center lg:pt-24">
        <p className="eyebrow">About Roze Déco</p>
        <h1 className="mx-auto mt-5 max-w-4xl font-serif text-5xl leading-[1.05] font-light lg:text-7xl">
          Bringing <em>character</em> to everyday spaces
        </h1>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-taupe">
          A Lebanese design brand rooted in a passion for interiors and
          contemporary living.
        </p>
      </section>
      <section className="container-lux">
        <div className="relative h-[320px] overflow-hidden sm:h-auto sm:aspect-[21/9]">
          <Image
            src={lifestyle.heroAlt}
            alt="An interior styled with Roze Déco pieces"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Story */}
      <section className="container-lux grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <p className="eyebrow">Our story</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight font-light lg:text-5xl">
            Designed and produced in Lebanon since {brand.founded}
          </h2>
        </div>
        <div className="space-y-6 leading-relaxed text-taupe lg:col-span-6 lg:col-start-7">
          <p>
            Founded in {brand.founded}, Roze Déco is a Lebanese design brand
            rooted in a passion for interiors and contemporary living.
          </p>
          <p>
            Exploring a variety of materials, colors, and forms, we create
            distinctive home accessories and occasional furniture designed to
            bring character and personality to everyday spaces.
          </p>
          <p>
            With a focus on aesthetics, originality, and accessibility, every
            piece is thoughtfully designed and produced in Lebanon.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-linen py-20 lg:py-28">
        <div className="container-lux">
          <p className="eyebrow">What we stand for</p>
          <h2 className="mt-4 font-serif text-4xl font-light lg:text-5xl">Our values</h2>
          <div className="mt-14 grid gap-px bg-sand sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.n} className="bg-linen p-8 lg:p-10">
                <p className="font-serif text-5xl text-accent">{v.n}</p>
                <h3 className="mt-6 font-serif text-2xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-taupe">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials, colours, forms */}
      <section id="craft" className="container-lux grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative mt-12 aspect-[3/4] overflow-hidden">
            <Image src={lifestyle.living} alt="" fill sizes="25vw" className="object-cover" />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image src={lifestyle.bedroom} alt="" fill sizes="25vw" className="object-cover" />
          </div>
        </div>
        <div>
          <p className="eyebrow">Our approach</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight font-light lg:text-5xl">
            Home accessories and occasional furniture with personality
          </h2>
          <ul className="mt-8 space-y-6">
            {[
              ["Materials", "We explore a wide range of materials to find the right one for each piece — and the character it brings."],
              ["Colours", "Colour is part of the design, chosen to give each piece its own presence in a room."],
              ["Forms", "Contemporary shapes designed to stand out on their own and sit naturally in everyday spaces."],
            ].map(([t, d]) => (
              <li key={t} className="border-t border-sand pt-5">
                <p className="font-serif text-2xl">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-taupe">{d}</p>
              </li>
            ))}
          </ul>
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
            New pieces, behind-the-scenes and our latest designs — on Instagram.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent-light/50 py-20 text-center">
        <div className="container-lux">
          <h2 className="mx-auto max-w-2xl font-serif text-4xl font-light lg:text-5xl">
            Let&apos;s create something beautiful together
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/categories" className="btn-dark">Browse categories</Link>
            <Link href="/contact" className="btn-outline">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
