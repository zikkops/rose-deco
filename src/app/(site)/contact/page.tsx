import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/site/ContactForm";
import { lifestyle } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Visit the Roze Déco showroom, book a consultation or get in touch with our client care team.",
};

const faqs = [
  {
    q: "How does white-glove delivery work?",
    a: "Our two-person team will contact you to arrange a delivery slot, carry the piece to the room of your choice, assemble it and take away all packaging. It's complimentary on orders over $2,500.",
  },
  {
    q: "What is your returns policy?",
    a: "In-stock items can be returned within 30 days in their original condition. Made-to-order and bespoke pieces are crafted especially for you and are non-returnable.",
  },
  {
    q: "Can I order fabric and leather swatches?",
    a: "Yes — up to six swatches are free of charge and usually arrive within three working days.",
  },
  {
    q: "Do you offer a trade program?",
    a: "We work with architects, interior designers and hospitality groups worldwide. Trade members receive preferential pricing and a dedicated account manager.",
  },
  {
    q: "How should I care for my furniture?",
    a: "Each piece ships with a care guide. In general, avoid direct sunlight, rotate cushions regularly, and use a dry cloth on oiled timber surfaces.",
  },
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
          Whether you have a question about a piece, need help planning a room
          or want to book a private showroom appointment — our team is here.
        </p>
      </section>

      <section className="container-lux grid gap-16 pb-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={lifestyle.bright} alt="Roze Déco flagship showroom" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
          </div>
          <div className="space-y-6 text-sm">
            <div className="flex gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.2} />
              <div>
                <p className="font-serif text-xl">Flagship Showroom</p>
                <p className="mt-1 leading-relaxed text-taupe">
                  24 Rue du Faubourg<br />Design District, Beirut<br />Lebanon
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.2} />
              <div className="text-taupe">
                <p>Mon – Fri · 10:00 – 19:00</p>
                <p>Saturday · 11:00 – 18:00</p>
                <p>Sunday · By appointment</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.2} />
              <p className="text-taupe">+961 1 234 567</p>
            </div>
            <div className="flex gap-4">
              <Mail className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.2} />
              <p className="text-taupe">hello@rozedeco.com</p>
            </div>
          </div>
          <div className="border border-sand p-6">
            <p className="eyebrow">For professionals</p>
            <p className="mt-3 font-serif text-2xl">Trade & Hospitality</p>
            <p className="mt-2 text-sm leading-relaxed text-taupe">
              trade@rozedeco.com — preferential pricing, bespoke sizing and
              project support for designers and architects.
            </p>
          </div>
        </aside>
      </section>

      {/* Map placeholder */}
      <section className="relative h-[380px] overflow-hidden bg-linen">
        <svg className="absolute inset-0 size-full text-sand" aria-hidden>
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d="M-20 260 C 300 180, 520 340, 900 220 S 1500 120, 2200 260" stroke="#e3e3e3" strokeWidth="26" fill="none" />
          <path d="M600 -20 C 640 140, 560 260, 700 420" stroke="#e3e3e3" strokeWidth="18" fill="none" />
        </svg>
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="bg-ink px-5 py-3 text-center text-ivory shadow-xl">
            <p className="font-serif text-lg">Roze Déco</p>
            <p className="text-[10px] tracking-[0.2em] text-ivory/70 uppercase">Flagship Showroom</p>
          </div>
          <MapPin className="mt-1 size-8 fill-accent text-accent" strokeWidth={1} />
        </div>
        <p className="absolute right-4 bottom-3 text-[10px] text-stone">Interactive map coming soon</p>
      </section>

      {/* FAQ */}
      <section id="faq" className="container-lux grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-4">
          <p className="eyebrow">Client care</p>
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
