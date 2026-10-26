"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Minus, Plus, Truck } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { ProductCard } from "./ProductCard";
import { StockTag } from "./StockTag";
import { MADE_TO_ORDER_LEAD, formatPrice, getCategory } from "@/lib/catalog";
import { addToCart, setCartOpen, useActiveProducts, useProduct } from "@/lib/store";

export function ProductView({ slug }: { slug: string }) {
  const product = useProduct(slug);
  const all = useActiveProducts();
  const [active, setActive] = useState(0);
  const [colorId, setColorId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"details" | "dimensions">("details");

  if (!product || !product.active) {
    return (
      <div className="container-lux flex flex-col items-center py-32 text-center">
        <p className="eyebrow">Not available</p>
        <h1 className="mt-4 font-serif text-5xl font-light">This piece couldn&apos;t be found</h1>
        <p className="mt-4 text-taupe">It may have been removed from the collection.</p>
        <Link href="/categories" className="btn-dark mt-10">Browse categories</Link>
      </div>
    );
  }

  const category = getCategory(product.category);
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const ready = !!color && color.quantity >= qty;
  const image = product.images[Math.min(active, product.images.length - 1)];
  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <>
      <div className="container-lux pt-8 pb-16 lg:pt-10">
        <nav className="mb-8 text-xs text-stone">
          <Link href="/" className="hover:text-ink">Home</Link> /{" "}
          <Link href="/categories" className="hover:text-ink">Categories</Link> /{" "}
          {category && (
            <>
              <Link href={`/categories/${category.slug}`} className="hover:text-ink">{category.name}</Link> /{" "}
            </>
          )}
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden bg-linen sm:aspect-[5/4] lg:aspect-[4/5]">
              <SmartImage key={image} src={image} alt={product.name} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="animate-fade-up object-cover" />
              <div className="absolute top-4 left-4">
                <StockTag ready={!!color && color.quantity > 0} />
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActive(i)}
                    className={`relative aspect-square w-20 overflow-hidden bg-linen transition sm:w-24 ${
                      active === i ? "ring-1 ring-ink ring-offset-2 ring-offset-ivory" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <SmartImage src={src} alt="" fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">{category?.name}</p>
              <h1 className="mt-3 font-serif text-4xl leading-tight font-light lg:text-5xl">{product.name}</h1>
              <p className="mt-5 text-2xl">{formatPrice(product.price)}</p>

              <p className="mt-6 leading-relaxed text-taupe">{product.description}</p>

              {color && (
                <div className="mt-8">
                  <p className="text-xs tracking-[0.2em] uppercase">
                    Colour — <span className="tracking-normal text-taupe normal-case">{color.name}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c.id}
                        title={`${c.name} — ${c.quantity > 0 ? "ready now" : "out of stock"}`}
                        aria-label={c.name}
                        onClick={() => {
                          setColorId(c.id);
                          setQty(1);
                        }}
                        className={`relative size-9 rounded-full border border-ink/10 transition ${
                          color.id === c.id ? "ring-1 ring-ink ring-offset-2 ring-offset-ivory" : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {c.quantity === 0 && (
                          <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-ivory bg-warning" />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-stone">
                    {color.quantity > 0
                      ? `${color.quantity} ready now in ${color.name}`
                      : `${color.name} is currently out of stock`}
                  </p>
                </div>
              )}

              {/* Made-to-order warning */}
              {color && !ready && (
                <div className="mt-6 flex gap-3 border border-warning/40 bg-warning/10 p-4 text-sm">
                  <Clock className="mt-0.5 size-4 shrink-0 text-warning" />
                  <p className="leading-relaxed">
                    {color.quantity === 0 ? (
                      <><strong className="font-medium">Out of stock — you can still order it.</strong> This piece needs {MADE_TO_ORDER_LEAD} to be ready for shipment.</>
                    ) : (
                      <><strong className="font-medium">Only {color.quantity} ready now.</strong> The rest of your order needs {MADE_TO_ORDER_LEAD} to be ready for shipment.</>
                    )}
                  </p>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <div className="flex items-center border border-sand">
                  <button className="px-3 py-3.5" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm">{qty}</span>
                  <button className="px-3 py-3.5" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <button
                  className="btn-dark flex-1 px-4 whitespace-nowrap"
                  disabled={!color}
                  onClick={() => {
                    if (!color) return;
                    addToCart(product.id, color.id, qty);
                    setCartOpen(true);
                  }}
                >
                  {ready ? "Add to bag" : "Order — ships in ~2 weeks"}
                </button>
              </div>

              <div className="mt-8 flex items-center gap-3 border-y border-sand py-4 text-xs text-taupe">
                <Truck className="size-5 text-accent" strokeWidth={1.2} />
                Designed &amp; produced in Lebanon · Cash on delivery
              </div>

              <div className="mt-6">
                <div className="flex gap-6 border-b border-sand text-xs tracking-[0.2em] uppercase">
                  {(["details", "dimensions"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`-mb-px pb-3 ${tab === t ? "border-b border-ink" : "text-stone"}`}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="py-5 text-sm leading-relaxed text-taupe">
                  {tab === "details" ? (
                    <ul className="space-y-2">
                      {product.details.map((d) => (
                        <li key={d} className="flex gap-3"><span>—</span>{d}</li>
                      ))}
                      {product.material && <li className="flex gap-3"><span>—</span>Material: {product.material}</li>}
                    </ul>
                  ) : (
                    <p>{product.dimensions || "Contact us for dimensions."}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-lux border-t border-sand py-20">
          <h2 className="font-serif text-4xl font-light">More {category?.name.toLowerCase()}</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
