"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Minus, Plus, Ruler, ShieldCheck, Star, Truck } from "lucide-react";
import { formatPrice, type Product } from "@/lib/data";

export function ProductDetail({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [finish, setFinish] = useState(product.finishes[0].name);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"details" | "dimensions" | "delivery">("details");
  const [added, setAdded] = useState(false);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      {/* Gallery */}
      <div className="lg:col-span-7">
        <div className="relative aspect-[4/5] overflow-hidden bg-linen sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image
            key={product.images[active]}
            src={product.images[active]}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="animate-fade-up object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                className={`relative aspect-square w-20 overflow-hidden bg-linen transition sm:w-24 ${
                  active === i ? "ring-1 ring-ink ring-offset-2 ring-offset-ivory" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow">{product.designer}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight font-light lg:text-5xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-xs text-taupe">
            <div className="flex text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-3.5"
                  fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            {product.rating.toFixed(1)} · {product.reviews} reviews
          </div>
          <div className="mt-6 flex items-baseline gap-3">
            <p className="text-2xl">{formatPrice(product.price)}</p>
            {product.compareAt && (
              <p className="text-stone line-through">{formatPrice(product.compareAt)}</p>
            )}
          </div>
          <p className="mt-1 text-xs text-stone">
            or 12 interest-free payments of {formatPrice(Math.round(product.price / 12))}
          </p>

          <p className="mt-8 leading-relaxed text-taupe">{product.description}</p>

          <div className="mt-8">
            <p className="text-xs tracking-[0.2em] uppercase">
              Finish — <span className="text-taupe normal-case tracking-normal">{finish}</span>
            </p>
            <div className="mt-3 flex gap-3">
              {product.finishes.map((f) => (
                <button
                  key={f.name}
                  title={f.name}
                  aria-label={f.name}
                  onClick={() => setFinish(f.name)}
                  className={`size-9 rounded-full border border-ink/10 transition ${
                    finish === f.name ? "ring-1 ring-ink ring-offset-2 ring-offset-ivory" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: f.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <div className="flex items-center border border-sand">
              <button className="px-3 py-3.5" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">
                <Minus className="size-3.5" />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button className="px-3 py-3.5" onClick={() => setQty(qty + 1)} aria-label="Increase">
                <Plus className="size-3.5" />
              </button>
            </div>
            <button
              className="btn-dark flex-1 px-4 whitespace-nowrap"
              onClick={() => {
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
            >
              {added ? "Added to bag ✓" : product.inStock ? "Add to bag" : "Order now"}
            </button>
            <button className="border border-sand px-4 hover:border-ink" aria-label="Add to wishlist">
              <Heart className="size-4" strokeWidth={1.5} />
            </button>
          </div>
          <p className={`mt-3 text-xs ${product.inStock ? "text-success" : "text-warning"}`}>
            ● {product.leadTime}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 border-y border-sand py-5 text-center text-[11px] text-taupe">
            <div className="flex flex-col items-center gap-2">
              <Truck className="size-5 text-accent" strokeWidth={1.2} />
              White-glove delivery
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="size-5 text-accent" strokeWidth={1.2} />
              10-year warranty
            </div>
            <div className="flex flex-col items-center gap-2">
              <Ruler className="size-5 text-accent" strokeWidth={1.2} />
              Free fabric swatches
            </div>
          </div>

          <div className="mt-6">
            <div className="flex gap-6 border-b border-sand text-xs tracking-[0.2em] uppercase">
              {(["details", "dimensions", "delivery"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`-mb-px pb-3 ${tab === t ? "border-b border-ink" : "text-stone"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="py-5 text-sm leading-relaxed text-taupe">
              {tab === "details" && (
                <ul className="space-y-2">
                  {product.details.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="text-accent">—</span>
                      {d}
                    </li>
                  ))}
                  <li className="flex gap-3">
                    <span className="text-accent">—</span>Material: {product.material}
                  </li>
                </ul>
              )}
              {tab === "dimensions" && (
                <p>
                  {product.dimensions}
                  <br />
                  <span className="text-xs text-stone">
                    Need a different size? Many pieces can be made to bespoke dimensions — ask our team.
                  </span>
                </p>
              )}
              {tab === "delivery" && (
                <p>
                  Our two-person team delivers, unpacks and places your piece
                  in the room of your choice, then removes all packaging.
                  Returns are accepted within 30 days on in-stock items.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
