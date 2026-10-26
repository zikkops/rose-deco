"use client";

import Link from "next/link";
import { Clock, Package, Plus, ShoppingCart } from "lucide-react";
import { PageHeader } from "./AdminShell";
import { EmptyCatalogBanner } from "./EmptyCatalogBanner";
import { QtyStepper } from "./QtyStepper";
import { StatusBadge, StockPill } from "./StatusBadge";
import { SmartImage } from "@/components/SmartImage";
import { formatPrice, isReadyNow } from "@/lib/catalog";
import { setColorQuantity, useMessages, useOrders, useProducts } from "@/lib/store";

export function Dashboard() {
  const products = useProducts();
  const orders = useOrders();
  const messages = useMessages();

  const live = products.filter((p) => p.active);
  const ready = live.filter(isReadyNow).length;
  const openOrders = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.status));
  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const outColors = products.flatMap((p) => p.colors.filter((c) => c.quantity === 0).map((c) => ({ p, c }))).slice(0, 8);

  const kpis = [
    { label: "Products on site", value: live.length },
    { label: "Ready now", value: ready },
    { label: "Out of stock", value: live.length - ready },
    { label: "Open orders", value: openOrders.length },
    { label: "Sales (all orders)", value: formatPrice(revenue) },
  ];

  return (
    <>
      <PageHeader
        title="Welcome back"
        subtitle="Manage your products, stock and orders."
        actions={
          <Link href="/admin/products/edit" className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-ivory hover:bg-accent-dark">
            <Plus className="size-4" /> Add product
          </Link>
        }
      />

      <EmptyCatalogBanner />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <div key={k.label} className={`card-admin p-4 sm:p-5 ${i === 4 ? "col-span-2 lg:col-span-1" : ""}`}>
            <p className="text-xs text-stone">{k.label}</p>
            <p className="mt-2 font-serif text-2xl tabular-nums sm:text-3xl">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="card-admin overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between p-5">
            <h2 className="flex items-center gap-2 font-medium"><ShoppingCart className="size-4" /> Recent orders</h2>
            <Link href="/admin/orders" className="text-xs underline-offset-4 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="bg-linen/50 text-left text-xs text-stone">
                <tr>
                  <th className="px-5 py-2.5 font-normal">Order</th>
                  <th className="px-5 py-2.5 font-normal">Customer</th>
                  <th className="px-5 py-2.5 font-normal">Status</th>
                  <th className="px-5 py-2.5 text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/50">
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3 font-medium">
                      {o.number}
                      {o.items.some((i) => !i.readyNow) && <Clock className="ml-1.5 inline size-3 text-warning" aria-label="Includes a 2-week item" />}
                    </td>
                    <td className="px-5 py-3">{o.customer.name}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-right tabular-nums">{formatPrice(o.total)}</td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-stone">No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="card-admin p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-medium"><Package className="size-4" /> Out of stock</h2>
              <Link href="/admin/products" className="text-xs underline-offset-4 hover:underline">All products</Link>
            </div>
            <p className="mb-3 text-xs text-stone">Restock here — these colours currently show &ldquo;Out of stock&rdquo; on the site.</p>
            <ul className="space-y-3">
              {outColors.map(({ p, c }) => (
                <li key={p.id + c.id} className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-linen">
                    <SmartImage src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/products/edit?id=${encodeURIComponent(p.id)}`} className="block truncate text-sm hover:underline">{p.name}</Link>
                    <p className="flex items-center gap-1.5 text-xs text-stone">
                      <span className="size-2.5 rounded-full border border-ink/10" style={{ backgroundColor: c.hex }} /> {c.name}
                    </p>
                  </div>
                  <QtyStepper value={c.quantity} onChange={(v) => setColorQuantity(p.id, c.id, v)} label={`${p.name} ${c.name} quantity`} />
                </li>
              ))}
              {outColors.length === 0 && (
                <li className="flex items-center gap-2 text-sm text-stone"><StockPill ready /> Everything is in stock.</li>
              )}
            </ul>
          </div>

          <div className="card-admin p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-medium">Messages</h2>
              <Link href="/admin/messages" className="text-xs underline-offset-4 hover:underline">Inbox</Link>
            </div>
            {messages.slice(0, 3).map((m) => (
              <div key={m.id} className="border-t border-sand/50 py-2.5 first:border-0">
                <p className="text-sm">
                  {!m.read && <span className="mr-1.5 inline-block size-1.5 rounded-full bg-ink align-middle" />}
                  {m.name} <span className="text-xs text-stone">· {m.topic}</span>
                </p>
                <p className="truncate text-xs text-stone">{m.message}</p>
              </div>
            ))}
            {messages.length === 0 && <p className="text-sm text-stone">No messages yet.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
