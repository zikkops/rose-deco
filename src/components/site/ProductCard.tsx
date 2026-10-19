import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatPrice, type Product } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  const [first, second] = product.images;
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-linen">
        <Image
          src={first}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={`object-cover transition-all duration-700 group-hover:scale-105 ${
            second ? "group-hover:opacity-0" : ""
          }`}
        />
        {second && (
          <Image
            src={second}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.isNew && (
            <span className="bg-ivory px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase">
              New
            </span>
          )}
          {product.compareAt && (
            <span className="bg-accent px-2.5 py-1 text-[10px] tracking-[0.2em] text-white uppercase">
              Sale
            </span>
          )}
          {!product.inStock && (
            <span className="bg-ink/80 px-2.5 py-1 text-[10px] tracking-[0.2em] text-ivory uppercase">
              Made to order
            </span>
          )}
        </div>
        <span className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-ivory/90 opacity-0 transition-opacity group-hover:opacity-100">
          <Heart className="size-3.5" strokeWidth={1.5} />
        </span>
        <span className="absolute inset-x-3 bottom-3 translate-y-2 bg-ivory/95 py-2.5 text-center text-[10px] tracking-[0.2em] uppercase opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Quick view
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-1 sm:mt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div>
          <h3 className="font-serif text-lg leading-tight sm:text-xl">{product.name}</h3>
          <p className="mt-1 text-xs text-stone">
            {product.material} · {product.color}
          </p>
        </div>
        <div className="flex items-baseline gap-2 text-sm whitespace-nowrap sm:block sm:text-right">
          <p>{formatPrice(product.price)}</p>
          {product.compareAt && (
            <p className="text-xs text-stone line-through">
              {formatPrice(product.compareAt)}
            </p>
          )}
        </div>
      </div>
      <div className="mt-2 flex gap-1.5">
        {product.finishes.map((f) => (
          <span
            key={f.name}
            title={f.name}
            className="size-3 rounded-full border border-ink/10"
            style={{ backgroundColor: f.hex }}
          />
        ))}
      </div>
    </Link>
  );
}
