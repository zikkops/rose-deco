"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { categories } from "@/lib/catalog";
import { setCartOpen, useCartDetails } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { CartDrawer } from "./CartDrawer";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/categories", label: "Categories" },
  { href: "/contact", label: "Contact Us" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overHero = pathname === "/" && !scrolled;
  const { count } = useCartDetails();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setMegaOpen(false);
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <div className="bg-ink py-2 text-center text-[11px] tracking-[0.2em] text-ivory/90 uppercase">
        Designed &amp; produced in Lebanon
      </div>
      <header
        className={`sticky top-0 z-40 transition-colors duration-500 ${
          overHero
            ? "bg-transparent text-ivory"
            : "border-b border-sand/60 bg-ivory/95 text-ink backdrop-blur"
        } ${pathname === "/" ? "-mb-[73px]" : ""}`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="container-lux flex h-[72px] items-center justify-between gap-6">
          <button
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" strokeWidth={1.5} />
          </button>

          <Link href="/" aria-label="Roze Déco home" className="shrink-0">
            <Logo variant={overHero ? "white" : "black"} height={44} priority className="h-9 w-auto sm:h-11" />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setMegaOpen(item.href === "/categories")}
                className={`link-underline text-xs tracking-[0.2em] uppercase ${
                  isActive(item.href) ? "after:scale-x-100" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex w-6 items-center justify-end lg:w-auto">
            <button aria-label={`Bag, ${count} items`} className="relative" onClick={() => setCartOpen(true)}>
              <ShoppingBag className="size-5" strokeWidth={1.5} />
              {count > 0 && (
                <span className={`absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full text-[9px] ${overHero ? "bg-ivory text-ink" : "bg-ink text-ivory"}`}>
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mega menu */}
        <div
          className={`absolute inset-x-0 top-full hidden border-b border-sand/60 bg-ivory text-ink shadow-[0_20px_40px_-20px_rgba(31,26,23,0.15)] transition-all duration-300 lg:block ${
            megaOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <div className="container-lux grid grid-cols-7 gap-5 py-8">
            {categories.map((c) => (
              <Link key={c.slug} href={`/categories/${c.slug}`} className="group">
                <div className="aspect-[4/5] overflow-hidden bg-linen">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image.replace("w=1200", "w=400")}
                    alt=""
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 font-serif text-lg">{c.name}</p>
                <p className="text-xs text-stone">{c.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-ivory p-6 transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Logo height={40} />
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-3 font-serif text-2xl ${isActive(item.href) ? "text-accent" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t border-sand pt-6">
            <p className="eyebrow mb-3">Categories</p>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="block py-1.5 text-sm text-taupe"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CartDrawer />
    </>
  );
}
