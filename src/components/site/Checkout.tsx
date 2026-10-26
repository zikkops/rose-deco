"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Clock } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { MADE_TO_ORDER_LEAD, formatPrice } from "@/lib/catalog";
import { placeOrder, useCartDetails, type Order } from "@/lib/store";

export function Checkout() {
  const { items, subtotal, hasMadeToOrder } = useCartDetails();
  const [placed, setPlaced] = useState<Order | null>(null);

  if (placed) {
    const waiting = placed.items.filter((i) => !i.readyNow);
    return (
      <div className="container-lux flex flex-col items-center py-24 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-ink text-ivory">
          <Check className="size-6" />
        </span>
        <p className="eyebrow mt-8">Order {placed.number}</p>
        <h1 className="mt-4 font-serif text-5xl font-light">Thank you, {placed.customer.name.split(" ")[0]}</h1>
        <p className="mt-4 max-w-md leading-relaxed text-taupe">
          We&apos;ve received your order and will call you on {placed.customer.phone} to confirm delivery.
        </p>
        {waiting.length > 0 && (
          <p className="mt-6 flex max-w-md gap-2 border border-warning/40 bg-warning/10 p-4 text-left text-sm leading-relaxed">
            <Clock className="mt-0.5 size-4 shrink-0 text-warning" />
            {waiting.map((i) => i.name).join(", ")} {waiting.length === 1 ? "was" : "were"} out of stock and will be ready for shipment in {MADE_TO_ORDER_LEAD}.
          </p>
        )}
        <Link href="/categories" className="btn-dark mt-10">Continue browsing</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-lux flex flex-col items-center py-32 text-center">
        <h1 className="font-serif text-5xl font-light">Your bag is empty</h1>
        <Link href="/categories" className="btn-dark mt-10">Browse categories</Link>
      </div>
    );
  }

  return (
    <form
      className="container-lux grid gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const v = (k: string) => String(f.get(k) ?? "").trim();
        setPlaced(placeOrder({ name: v("name"), phone: v("phone"), email: v("email"), city: v("city"), address: v("address"), notes: v("notes") }));
        window.scrollTo({ top: 0 });
      }}
    >
      <div className="lg:col-span-7">
        <h1 className="font-serif text-5xl font-light">Checkout</h1>
        <p className="mt-3 text-sm text-taupe">Payment is cash on delivery. We&apos;ll call you to confirm your order and delivery time.</p>

        <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <input name="name" required className="input-lux" placeholder="Full name *" autoComplete="name" />
          <input name="phone" required type="tel" className="input-lux" placeholder="Phone number *" autoComplete="tel" />
          <input name="email" type="email" className="input-lux sm:col-span-2" placeholder="Email (optional)" autoComplete="email" />
          <input name="city" required className="input-lux" placeholder="City / area *" autoComplete="address-level2" />
          <input name="address" required className="input-lux" placeholder="Street, building, floor *" autoComplete="street-address" />
          <textarea name="notes" rows={3} className="input-lux resize-none sm:col-span-2" placeholder="Notes for delivery (optional)" />
        </div>
      </div>

      <aside className="lg:col-span-5">
        <div className="border border-sand bg-linen/50 p-6 lg:sticky lg:top-28">
          <p className="text-xs tracking-[0.2em] uppercase">Order summary</p>
          <ul className="mt-4 divide-y divide-sand">
            {items.map((i) => (
              <li key={i.productId + i.colorId} className="flex gap-4 py-4">
                <div className="relative size-16 shrink-0 overflow-hidden bg-linen">
                  <SmartImage src={i.product.images[0]} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <div className="flex justify-between gap-2">
                    <p className="font-serif text-lg leading-tight">{i.product.name}</p>
                    <p className="whitespace-nowrap">{formatPrice(i.lineTotal)}</p>
                  </div>
                  <p className="text-xs text-stone">{i.color.name} · Qty {i.qty}</p>
                  {i.readyNow ? (
                    <p className="mt-1 text-xs text-success">Ready now</p>
                  ) : (
                    <p className="mt-1 text-xs text-warning">Out of stock — ships in {MADE_TO_ORDER_LEAD}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {hasMadeToOrder && (
            <p className="mt-2 flex gap-2 border border-warning/40 bg-warning/10 p-3 text-xs leading-relaxed">
              <Clock className="mt-px size-3.5 shrink-0 text-warning" />
              Your order includes out-of-stock pieces. It will be ready for shipment in {MADE_TO_ORDER_LEAD}.
            </p>
          )}
          <div className="mt-4 flex justify-between border-t border-sand pt-4">
            <span>Total</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-stone">Delivery fee confirmed by phone.</p>
          <button type="submit" className="btn-dark mt-6 w-full">Place order</button>
        </div>
      </aside>
    </form>
  );
}
