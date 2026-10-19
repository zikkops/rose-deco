"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { orders, type OrderStatus } from "@/lib/admin-data";
import { formatPrice } from "@/lib/data";

const tabs: ("All" | OrderStatus)[] = ["All", "Pending", "Processing", "In production", "Shipped", "Delivered", "Cancelled"];

export function OrdersTable() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [q, setQ] = useState("");
  const rows = orders.filter(
    (o) =>
      (tab === "All" || o.status === tab) &&
      (!q || `${o.id} ${o.customer}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="card-admin overflow-hidden">
      <div className="flex gap-5 overflow-x-auto border-b border-sand/60 px-4 text-sm whitespace-nowrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 py-3 ${tab === t ? "border-accent text-ink" : "border-transparent text-stone hover:text-ink"}`}
          >
            {t}
            <span className="ml-1.5 text-xs text-stone">
              {t === "All" ? orders.length : orders.filter((o) => o.status === t).length}
            </span>
          </button>
        ))}
      </div>
      <div className="border-b border-sand/60 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="input-admin pl-9" placeholder="Search by order # or customer…" />
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
              <th className="px-4 py-2.5 font-normal">Payment</th>
              <th className="px-4 py-2.5 font-normal">Status</th>
              <th className="px-4 py-2.5 text-right font-normal">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/50">
            {rows.map((o) => (
              <tr key={o.id} className="hover:bg-linen/30">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-accent">{o.id}</Link>
                </td>
                <td className="px-4 py-3 text-taupe">{o.date}</td>
                <td className="px-4 py-3">
                  {o.customer}
                  <p className="text-xs text-stone">{o.city}</p>
                </td>
                <td className="px-4 py-3 text-taupe">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td className="px-4 py-3 text-taupe">{o.payment}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3 text-right tabular-nums">{formatPrice(o.total)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-stone">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
