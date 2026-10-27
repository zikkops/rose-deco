import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/catalog";
import { Logo } from "@/components/Logo";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-ivory/80">
      <div className="container-lux grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo variant="white" height={72} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            Distinctive home accessories and occasional furniture, thoughtfully
            designed and produced in Lebanon since {brand.founded}.
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
            <p className="eyebrow mb-5 text-accent-light">Categories</p>
            <ul className="space-y-3 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className="hover:text-ivory">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-accent-light">Roze Déco</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-ivory">Our Story</Link></li>
              <li><Link href="/about#craft" className="hover:text-ivory">Our Approach</Link></li>
              <li><Link href="/contact#faq" className="hover:text-ivory">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-accent-light">Contact</p>
            <ul className="space-y-3 text-sm">
              <li><a href={`mailto:${brand.email}`} className="break-all hover:text-ivory">{brand.email}</a></li>
              <li><a href={brand.phoneHref} className="hover:text-ivory">{brand.phone}</a></li>
              <li><a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">{brand.instagram}</a></li>
              <li><Link href="/contact" className="hover:text-ivory">Contact form</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-lux flex flex-col items-center justify-between gap-3 py-6 text-xs text-ivory/50 sm:flex-row">
          <p>© 2026 Roze Déco. Designed & produced in Lebanon.</p>
          <div className="flex gap-6">
            <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">Instagram</a>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
