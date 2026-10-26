"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Clock, Minus, Plus, X } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { MADE_TO_ORDER_LEAD, formatPrice } from "@/lib/catalog";
import { setCartOpen, setCartQty, useCartDetails, useCartOpen } from "@/lib/store";

export function CartDrawer() {
  const open = useCartOpen();
  const { items, subtotal, count, hasMadeToOrder } = useCartDetails();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setCartOpen(false)} />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory text-ink transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sand px-6 py-5">
          <p className="font-serif text-2xl">Your bag {count > 0 && <span className="text-base text-stone">({count})</span>}</p>
          <button onClick={() => setCartOpen(false)} aria-label="Close bag">
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-serif text-3xl">Your bag is empty</p>
            <Link href="/categories" onClick={() => setCartOpen(false)} className="btn-dark mt-8">Browse categories</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-sand overflow-y-auto px-6">
              {items.map((i) => (
                <li key={i.productId + i.colorId} className="flex gap-4 py-5">
                  <Link href={`/product/${i.product.slug}`} onClick={() => setCartOpen(false)} className="relative size-24 shrink-0 overflow-hidden bg-linen">
                    <SmartImage src={i.product.images[0]} alt="" fill sizes="96px" className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-3">
                      <p className="font-serif text-lg leading-tight">{i.product.name}</p>
                      <p className="text-sm whitespace-nowrap">{formatPrice(i.lineTotal)}</p>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-stone">
                      <span className="size-2.5 rounded-full border border-ink/10" style={{ backgroundColor: i.color.hex }} />
                      {i.color.name}
                    </p>
                    {i.readyNow ? (
                      <p className="mt-1 text-xs text-success">Ready now</p>
                    ) : (
                      <p className="mt-1 flex items-start gap-1 text-xs text-warning">
                        <Clock className="mt-px size-3 shrink-0" />
                        {i.color.quantity > 0 ? `Only ${i.color.quantity} ready now — the rest ships` : "Out of stock — ships"} in {MADE_TO_ORDER_LEAD}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-sand">
                        <button className="px-2.5 py-1.5" onClick={() => setCartQty(i.productId, i.colorId, i.qty - 1)} aria-label="Decrease">
                          <Minus className="size-3" />
                        </button>
                        <span className="w-7 text-center text-sm">{i.qty}</span>
                        <button className="px-2.5 py-1.5" onClick={() => setCartQty(i.productId, i.colorId, i.qty + 1)} aria-label="Increase">
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button onClick={() => setCartQty(i.productId, i.colorId, 0)} className="text-xs text-stone underline underline-offset-4 hover:text-ink">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-sand p-6">
              {hasMadeToOrder && (
                <p className="mb-4 flex gap-2 border border-warning/40 bg-warning/10 p-3 text-xs leading-relaxed">
                  <Clock className="mt-px size-3.5 shrink-0 text-warning" />
                  Some items are out of stock. Your order will be ready for shipment in {MADE_TO_ORDER_LEAD}.
                </p>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-taupe">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-stone">Delivery is confirmed by our team after you order.</p>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn-dark mt-5 w-full">
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
