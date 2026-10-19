"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MoreHorizontal, Search } from "lucide-react";
import { stockOf } from "@/lib/admin-data";
import { categories, formatPrice, products } from "@/lib/data";

export function ProductsTable() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(
    () =>
      products.filter((p) => {
        if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
        if (cat !== "all" && p.category !== cat) return false;
        if (status === "in" && !p.inStock) return false;
        if (status === "mto" && p.inStock) return false;
        return true;
      }),
    [q, cat, status],
  );

  return (
    <div className="card-admin overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-sand/60 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="input-admin pl-9" placeholder="Search products…" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="input-admin sm:w-52" aria-label="Category">
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-admin sm:w-44" aria-label="Availability">
          <option value="all">All availability</option>
          <option value="in">In stock</option>
          <option value="mto">Made to order</option>
        </select>
      </div>

      {selected.length > 0 && (
        <div className="flex items-center gap-4 bg-accent-light/40 px-4 py-2 text-sm">
          {selected.length} selected
          <button className="text-accent-dark hover:underline">Mark as featured</button>
          <button className="text-accent-dark hover:underline">Archive</button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-linen/50 text-left text-xs text-stone">
            <tr>
              <th className="w-10 px-4 py-2.5">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  className="accent-ink"
                  checked={selected.length === rows.length && rows.length > 0}
                  onChange={(e) => setSelected(e.target.checked ? rows.map((r) => r.slug) : [])}
                />
              </th>
              <th className="px-4 py-2.5 font-normal">Product</th>
              <th className="px-4 py-2.5 font-normal">Category</th>
              <th className="px-4 py-2.5 font-normal">Material</th>
              <th className="px-4 py-2.5 font-normal">Stock</th>
              <th className="px-4 py-2.5 text-right font-normal">Price</th>
              <th className="w-10 px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/50">
            {rows.map((p) => {
              const stock = stockOf(p.slug);
              return (
                <tr key={p.slug} className="hover:bg-linen/30">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${p.name}`}
                      className="accent-ink"
                      checked={selected.includes(p.slug)}
                      onChange={() =>
                        setSelected((s) => (s.includes(p.slug) ? s.filter((x) => x !== p.slug) : [...s, p.slug]))
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.slug}`} className="flex items-center gap-3">
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-linen">
                        <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium hover:text-accent">{p.name}</p>
                        <p className="text-xs text-stone">
                          {p.isNew && "New · "}
                          {p.isBestseller && "Bestseller · "}
                          {p.finishes.length} finishes
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-taupe">{categories.find((c) => c.slug === p.category)?.name}</td>
                  <td className="px-4 py-3 text-taupe">{p.material}</td>
                  <td className="px-4 py-3">
                    {p.inStock ? (
                      <span className={stock <= 5 ? "text-warning" : "text-success"}>{stock} in stock</span>
                    ) : (
                      <span className="text-stone">Made to order</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-stone">
                    <button aria-label="More actions" className="hover:text-ink"><MoreHorizontal className="size-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-sand/60 px-4 py-3 text-xs text-stone">
        <span>Showing {rows.length} of {products.length} products</span>
        <div className="flex gap-1">
          <button className="rounded border border-sand px-2.5 py-1" disabled>Previous</button>
          <button className="rounded border border-sand px-2.5 py-1" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
