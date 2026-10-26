"use client";

import { useEffect, useState } from "react";
import { Clock, Mail, MapPin, Phone, Search, X } from "lucide-react";
import { PageHeader } from "./AdminShell";
import { StatusBadge } from "./StatusBadge";
import { SmartImage } from "@/components/SmartImage";
import { formatPrice } from "@/lib/catalog";
import { deleteOrder, orderStatuses, updateOrderStatus, useOrders, type OrderStatus } from "@/lib/store";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Beirut" });

export function OrdersAdmin() {
  const orders = useOrders();
  const [tab, setTab] = useState<"All" | OrderStatus>("All");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const open = orders.find((o) => o.id === openId);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const rows = orders.filter(
    (o) =>
      (tab === "All" || o.status === tab) &&
      (!q || `${o.number} ${o.customer.name} ${o.customer.phone}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <>
      <PageHeader title="Orders" subtitle="Orders placed on the website (cash on delivery)" />

      <div className="card-admin overflow-hidden">
        <div className="no-scrollbar flex gap-5 overflow-x-auto border-b border-sand/60 px-4 text-sm whitespace-nowrap">
          {(["All", ...orderStatuses] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 py-3 ${tab === t ? "border-ink text-ink" : "border-transparent text-stone hover:text-ink"}`}
            >
              {t}
              <span className="ml-1.5 text-xs text-stone">{t === "All" ? orders.length : orders.filter((o) => o.status === t).length}</span>
            </button>
          ))}
        </div>
        <div className="border-b border-sand/60 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="input-admin pl-9" placeholder="Search order #, name or phone…" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-linen/50 text-left text-xs text-stone">
              <tr>
                <th className="px-4 py-2.5 font-normal">Order</th>
                <th className="px-4 py-2.5 font-normal">Date</th>
                <th className="px-4 py-2.5 font-normal">Customer</th>
                <th className="px-4 py-2.5 font-normal">Items</th>
                <th className="px-4 py-2.5 font-normal">Status</th>
                <th className="px-4 py-2.5 text-right font-normal">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {rows.map((o) => {
                const waiting = o.items.some((i) => !i.readyNow);
                return (
                  <tr key={o.id} onClick={() => setOpenId(o.id)} className="cursor-pointer hover:bg-linen/30">
                    <td className="px-4 py-3 font-medium">{o.number}</td>
                    <td className="px-4 py-3 text-taupe">{fmtDate(o.createdAt)}</td>
                    <td className="px-4 py-3">
                      {o.customer.name}
                      <p className="text-xs text-stone">{o.customer.city}</p>
                    </td>
                    <td className="px-4 py-3 text-taupe">
                      {o.items.reduce((s, i) => s + i.qty, 0)}
                      {waiting && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-warning">
                          <Clock className="size-3" /> 2-week item
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatPrice(o.total)}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-stone">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail panel */}
      <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-ink/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpenId(null)} />
        <aside className={`absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-white transition-transform duration-300 ${open ? "" : "translate-x-full"}`}>
          {open && (
            <>
              <div className="flex items-start justify-between border-b border-sand/60 p-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-3xl">{open.number}</h2>
                    <StatusBadge status={open.status} />
                  </div>
                  <p className="text-sm text-stone">{fmtDate(open.createdAt)} · {open.payment}</p>
                </div>
                <button onClick={() => setOpenId(null)} aria-label="Close"><X className="size-5" /></button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto p-5">
                <div>
                  <label className="label-admin" htmlFor="status">Update status</label>
                  <select id="status" className="input-admin" value={open.status} onChange={(e) => updateOrderStatus(open.id, e.target.value as OrderStatus)}>
                    {orderStatuses.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <p className="label-admin">Items</p>
                  <ul className="divide-y divide-sand/50 rounded-lg border border-sand/60">
                    {open.items.map((i, k) => (
                      <li key={k} className="flex items-center gap-3 p-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-linen">
                          <SmartImage src={i.image} alt="" fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1 text-sm">
                          <p className="font-medium">{i.name}</p>
                          <p className="flex items-center gap-1.5 text-xs text-stone">
                            <span className="size-2.5 rounded-full border border-ink/10" style={{ backgroundColor: i.colorHex }} />
                            {i.colorName} · Qty {i.qty}
                          </p>
                          {!i.readyNow && (
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-warning"><Clock className="size-3" /> Out of stock when ordered — ~2 weeks</p>
                          )}
                        </div>
                        <p className="text-sm tabular-nums">{formatPrice(i.price * i.qty)}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span className="tabular-nums">{formatPrice(open.total)}</span>
                  </div>
                </div>

                <div>
                  <p className="label-admin">Customer</p>
                  <div className="space-y-2 rounded-lg border border-sand/60 p-4 text-sm">
                    <p className="font-medium">{open.customer.name}</p>
                    <a href={`tel:${open.customer.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-taupe hover:text-ink"><Phone className="size-4" /> {open.customer.phone}</a>
                    {open.customer.email && <a href={`mailto:${open.customer.email}`} className="flex items-center gap-2 text-taupe hover:text-ink"><Mail className="size-4" /> {open.customer.email}</a>}
                    <p className="flex items-start gap-2 text-taupe"><MapPin className="mt-0.5 size-4 shrink-0" /> {open.customer.address}, {open.customer.city}</p>
                    {open.customer.notes && <p className="rounded-md bg-linen/60 p-2 text-xs text-taupe">“{open.customer.notes}”</p>}
                  </div>
                </div>
              </div>

              <div className="border-t border-sand/60 p-4">
                {confirmDelete ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        deleteOrder(open.id);
                        setOpenId(null);
                        setConfirmDelete(false);
                      }}
                      className="rounded-md bg-danger px-3 py-2 text-sm text-white"
                    >
                      Yes, delete order
                    </button>
                    <button onClick={() => setConfirmDelete(false)} className="rounded-md border border-sand px-3 py-2 text-sm">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(true)} className="text-sm text-danger hover:underline">Delete order</button>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
