import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { lifestyle } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story, values and craftsmanship behind Roze Déco.",
};

const values = [
  {
    n: "01",
    title: "Timeless over trend",
    text: "We design pieces that feel as right in twenty years as they do today — restrained silhouettes, honest materials, perfect proportions.",
  },
  {
    n: "02",
    title: "Crafted by hand",
    text: "Every frame is joined, every cushion filled and every seam stitched by artisans who have spent decades perfecting their trade.",
  },
  {
    n: "03",
    title: "Responsibly sourced",
    text: "FSC-certified timbers, traceable leathers and natural fibres. We work with suppliers we know by name and visit in person.",
  },
  {
    n: "04",
    title: "Made to last",
    text: "A 10-year frame warranty, re-upholstery services and replacement parts — because the most sustainable piece is the one you keep.",
  },
];

const team = [
  { name: "Rozalie Haddad", role: "Founder & Creative Director" },
  { name: "Léa Fontaine", role: "Head of Design" },
  { name: "Marco Bellini", role: "Master Upholsterer" },
  { name: "Kenji Aoki", role: "Lead Joiner" },
];

const timeline = [
  ["2008", "Rozalie opens a small upholstery studio with two craftsmen."],
  ["2012", "The first Roze Déco collection debuts — 14 pieces, all sold out."],
  ["2017", "Our atelier expands to a 4,000 m² workshop and flagship showroom."],
  ["2021", "Launch of the Trade Program for architects and interior designers."],
  ["2026", "Over 12,000 homes furnished across 30 countries."],
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="container-lux pt-16 pb-12 text-center lg:pt-24">
        <p className="eyebrow">About Roze Déco</p>
        <h1 className="mx-auto mt-5 max-w-4xl font-serif text-5xl leading-[1.05] font-light lg:text-7xl">
          We believe a home should be <em>felt</em>, not just seen
        </h1>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-taupe">
          Roze Déco is a family-run house of furniture and interiors, creating
          heirloom pieces with quiet confidence and uncompromising craft.
        </p>
      </section>
      <section className="container-lux">
        <div className="relative h-[320px] overflow-hidden sm:h-auto sm:aspect-[21/9]">
          <Image
            src={lifestyle.heroAlt}
            alt="A Roze Déco living room"
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
            From a small studio to a house of design
          </h2>
        </div>
        <div className="space-y-6 leading-relaxed text-taupe lg:col-span-6 lg:col-start-7">
          <p>
            Roze Déco began in 2008 when our founder, Rozalie Haddad, opened a
            tiny upholstery studio with two master craftsmen and a single
            ambition: to make furniture that is as comfortable as it is
            beautiful, and that never goes out of style.
          </p>
          <p>
            Nearly two decades later, the studio has grown into an atelier of
            more than forty artisans — but the philosophy hasn&apos;t changed.
            Each piece is still built by hand, in small batches, using the same
            traditional techniques alongside thoughtful modern engineering.
          </p>
          <p>
            Today our collections live in homes, hotels and private residences
            around the world. We&apos;re proud that many of our clients come
            back to furnish their second, third — and sometimes their
            children&apos;s — homes.
          </p>
          <p className="font-serif text-2xl text-ink italic">— Rozalie Haddad, Founder</p>
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

      {/* Craft */}
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
          <p className="eyebrow">Craftsmanship</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight font-light lg:text-5xl">
            Over 60 hours of handwork in every sofa
          </h2>
          <ul className="mt-8 space-y-6">
            {[
              ["Frames", "Kiln-dried hardwood, dowelled, glued and corner-blocked for strength that lasts generations."],
              ["Upholstery", "Hand-tied springs, feather-wrapped cushions and patterns matched by eye at every seam."],
              ["Finishing", "Hand-rubbed oils and waxes applied in multiple coats, buffed between each one."],
            ].map(([t, d]) => (
              <li key={t} className="border-t border-sand pt-5">
                <p className="font-serif text-2xl">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-taupe">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-ink py-20 text-ivory lg:py-28">
        <div className="container-lux">
          <p className="eyebrow text-accent-light">Milestones</p>
          <h2 className="mt-4 font-serif text-4xl font-light lg:text-5xl">Our journey</h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {timeline.map(([year, text]) => (
              <div key={year} className="border-t border-ivory/20 pt-6">
                <p className="font-serif text-4xl text-accent-light">{year}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-lux py-20 lg:py-28">
        <div className="text-center">
          <p className="eyebrow">The people</p>
          <h2 className="mt-4 font-serif text-4xl font-light lg:text-5xl">Meet the atelier</h2>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.name}>
              <div className="flex aspect-[3/4] items-center justify-center bg-linen transition-colors hover:bg-accent-light/60">
                <span className="font-serif text-7xl font-light text-accent">
                  {m.name.split(" ").map((w) => w[0]).join("")}
                </span>
              </div>
              <p className="mt-4 font-serif text-xl">{m.name}</p>
              <p className="text-xs tracking-wider text-stone uppercase">{m.role}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-stone">
          Team portraits coming soon.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-accent-light/50 py-20 text-center">
        <div className="container-lux">
          <h2 className="mx-auto max-w-2xl font-serif text-4xl font-light lg:text-5xl">
            Let&apos;s create something beautiful together
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="btn-dark">Shop the collection</Link>
            <Link href="/contact" className="btn-outline">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
