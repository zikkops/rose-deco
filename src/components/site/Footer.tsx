import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/data";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-ivory/80">
      <div className="container-lux grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo variant="white" height={72} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            Handcrafted furniture and objects for homes that are made to be
            lived in. Designed in our atelier, finished by hand.
          </p>
          <form className="mt-8 max-w-sm">
            <p className="eyebrow mb-3 text-accent-light">The Journal</p>
            <div className="flex border-b border-ivory/30 focus-within:border-ivory">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent py-3 text-sm text-ivory outline-none placeholder:text-ivory/40"
              />
              <button type="button" aria-label="Subscribe">
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
          <div>
            <p className="eyebrow mb-5 text-accent-light">Shop</p>
            <ul className="space-y-3 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/shop/${c.slug}`} className="hover:text-ivory">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-accent-light">House</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-ivory">Our Story</Link></li>
              <li><Link href="/about#craft" className="hover:text-ivory">Craftsmanship</Link></li>
              <li><Link href="/contact" className="hover:text-ivory">Showroom</Link></li>
              <li><Link href="/contact" className="hover:text-ivory">Trade Program</Link></li>
              <li><Link href="/admin" className="hover:text-ivory">Admin (preview)</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-accent-light">Client Care</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="hover:text-ivory">Contact Us</Link></li>
              <li><Link href="/contact#faq" className="hover:text-ivory">Delivery & Returns</Link></li>
              <li><Link href="/contact#faq" className="hover:text-ivory">Care Guide</Link></li>
              <li><Link href="/contact#faq" className="hover:text-ivory">Warranty</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-lux flex flex-col items-center justify-between gap-3 py-6 text-xs text-ivory/50 sm:flex-row">
          <p>© 2026 Roze Déco. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Instagram</span>
            <span>Pinterest</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
