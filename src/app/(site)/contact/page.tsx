import type { Metadata } from "next";
import Image from "next/image";
import { AtSign, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/site/ContactForm";
import { brand } from "@/lib/brand";
import { lifestyle } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Roze Déco by email, phone or on Instagram @roze.deco.",
};

const faqs = [
  {
    q: "Where are your pieces made?",
    a: "Every Roze Déco piece is thoughtfully designed and produced in Lebanon.",
  },
  {
    q: "How can I place an order?",
    a: `Message us by email, phone or on Instagram (${brand.instagram}) with the piece you're interested in and we'll take care of the rest.`,
  },
  {
    q: "Do you deliver?",
    a: "Yes — get in touch with your location and we'll share the delivery options and timing for your area.",
  },
  {
    q: "Can I request a custom colour or finish?",
    a: "Many of our pieces can be adapted. Send us a message with what you have in mind and we'll let you know what's possible.",
  },
];

const channels = [
  { icon: Mail, label: "Email", value: brand.email, href: `mailto:${brand.email}` },
  { icon: Phone, label: "Phone", value: brand.phone, href: brand.phoneHref },
  { icon: AtSign, label: "Instagram", value: brand.instagram, href: brand.instagramUrl, external: true },
  { icon: MapPin, label: "Based in", value: brand.origin },
];

export default function ContactPage() {
  return (
    <>
      <section className="container-lux pt-12 pb-16 text-center lg:pt-20">
        <p className="eyebrow">Get in touch</p>
        <h1 className="mx-auto mt-5 max-w-3xl font-serif text-5xl font-light lg:text-7xl">
          We&apos;d love to hear from you
        </h1>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-taupe">
          Have a question about a piece or want to place an order? Send us a
          message, give us a call or reach us on Instagram.
        </p>
      </section>

      <section className="container-lux grid gap-16 pb-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={lifestyle.bright} alt="An interior styled with Roze Déco pieces" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
          </div>
          <ul className="space-y-6 text-sm">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label} className="flex gap-4">
                <Icon className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.2} />
                <div>
                  <p className="text-[11px] tracking-[0.2em] text-stone uppercase">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="link-underline mt-1 inline-block font-serif text-xl"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 font-serif text-xl">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* Instagram band */}
      <section className="bg-ink py-16 text-center text-ivory lg:py-20">
        <div className="container-lux">
          <p className="eyebrow text-accent-light">Follow us</p>
          <a
            href={brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-serif text-4xl font-light hover:opacity-80 lg:text-6xl"
          >
            {brand.instagram}
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container-lux grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-4">
          <p className="eyebrow">Good to know</p>
          <h2 className="mt-4 font-serif text-4xl font-light lg:text-5xl">Frequently asked</h2>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-sand py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl">
                {f.q}
                <span className="text-2xl font-light text-accent transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-taupe">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
