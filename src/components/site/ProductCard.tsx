"use client";

import Link from "next/link";
import { useState } from "react";
import { SmartImage } from "@/components/SmartImage";
import { StockTag } from "./StockTag";
import { bundleLabel, colorImage, formatPrice, getCategory, isBundle, isReadyNow, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  // Hovering a colour swatch shows that colour's photo
  const [hoverImage, setHoverImage] = useState<string | null>(null);
  const [first, second] = product.images;
  const cover = hoverImage ?? first;
  const ready = isReadyNow(product);
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-linen">
        <SmartImage
          src={cover}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={`object-cover transition-all duration-700 group-hover:scale-105 ${second && !hoverImage ? "group-hover:opacity-0" : ""}`}
        />
        {second && !hoverImage && (
          <SmartImage
            src={second}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          <StockTag ready={ready} />
          {isBundle(product) && (
            <span className="bg-ink px-2.5 py-1 text-[10px] tracking-[0.18em] text-ivory uppercase">{bundleLabel(product)}</span>
          )}
          {product.isNew && (
            <span className="bg-ivory px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase">New</span>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-1 sm:mt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div>
          <h3 className="font-serif text-lg leading-tight sm:text-xl">{product.name}</h3>
          <p className="mt-1 text-xs text-stone">{getCategory(product.category)?.name}</p>
        </div>
        <p className="text-sm whitespace-nowrap">{formatPrice(product.price)}</p>
      </div>
      {product.colors.length > 0 && (
        <div className="mt-2 flex gap-1.5" onMouseLeave={() => setHoverImage(null)}>
          {product.colors.map((c) => (
            <span
              key={c.id}
              title={`${c.name} — ${c.quantity > 0 ? "ready now" : "out of stock"}`}
              onMouseEnter={() => c.image && setHoverImage(colorImage(product, c) ?? null)}
              className={`size-3 rounded-full border border-ink/10 ${c.quantity > 0 ? "" : "opacity-40"}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      )}
    </Link>
  );
}
