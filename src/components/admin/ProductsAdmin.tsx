"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { ChevronDown, Pencil, Plus, Search } from "lucide-react";
import { PageHeader } from "./AdminShell";
import { EmptyCatalogBanner } from "./EmptyCatalogBanner";
import { QtyStepper } from "./QtyStepper";
import { StockPill } from "./StatusBadge";
import { SmartImage } from "@/components/SmartImage";
import { categories, formatPrice, getCategory, isReadyNow, totalStock } from "@/lib/catalog";
import { setColorQuantity, setProductActive, useProducts } from "@/lib/store";

export function ProductsAdmin() {
  const products = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [stock, setStock] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      products.filter((p) => {
        if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
        if (cat !== "all" && p.category !== cat) return false;
        if (stock === "ready" && !isReadyNow(p)) return false;
        if (stock === "out" && isReadyNow(p)) return false;
        if (stock === "hidden" && p.active) return false;
        return true;
      }),
    [products, q, cat, stock],
  );

  const outCount = products.filter((p) => !isReadyNow(p)).length;

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products · ${outCount} out of stock`}
        actions={
          <Link href="/admin/products/edit" className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-ivory hover:bg-accent-dark">
            <Plus className="size-4" /> Add product
          </Link>
        }
      />

      <EmptyCatalogBanner />
      <div className="card-admin overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-sand/60 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="input-admin pl-9" placeholder="Search products…" />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="input-admin sm:w-48" aria-label="Category">
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select value={stock} onChange={(e) => setStock(e.target.value)} className="input-admin sm:w-44" aria-label="Stock">
            <option value="all">All stock</option>
            <option value="ready">Ready now</option>
            <option value="out">Out of stock</option>
            <option value="hidden">Hidden from site</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-linen/50 text-left text-xs text-stone">
              <tr>
                <th className="px-4 py-2.5 font-normal">Product</th>
                <th className="px-4 py-2.5 font-normal">Category</th>
                <th className="px-4 py-2.5 font-normal">Price</th>
                <th className="px-4 py-2.5 font-normal">Stock</th>
                <th className="px-4 py-2.5 font-normal">On site</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {rows.map((p) => {
                const open = openId === p.id;
                return (
                  <Fragment key={p.id}>
                    <tr className={open ? "bg-linen/30" : "hover:bg-linen/20"}>
                      <td className="px-4 py-3">
                        <Link href={`/admin/products/edit?id=${encodeURIComponent(p.id)}`} className="flex items-center gap-3">
                          <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-linen">
                            <SmartImage src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />
                          </div>
                          <div>
                            <p className="font-medium hover:underline">{p.name}</p>
                            <div className="mt-1 flex gap-1">
                              {p.colors.map((c) => (
                                <span key={c.id} title={`${c.name}: ${c.quantity}`} className="size-2.5 rounded-full border border-ink/10" style={{ backgroundColor: c.hex }} />
                              ))}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-taupe">{getCategory(p.category)?.name ?? p.category}</td>
                      <td className="px-4 py-3 tabular-nums">{formatPrice(p.price)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setOpenId(open ? null : p.id)} className="flex items-center gap-2" aria-expanded={open}>
                          <StockPill ready={isReadyNow(p)} />
                          <span className="text-xs text-stone tabular-nums">{totalStock(p)} pcs</span>
                          <ChevronDown className={`size-3.5 text-stone transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" checked={p.active} onChange={(e) => setProductActive(p.id, e.target.checked)} aria-label={`Show ${p.name} on site`} />
                          <span className="h-5 w-9 rounded-full bg-sand transition peer-checked:bg-ink" />
                          <span className="absolute left-0.5 size-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
                        </label>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/products/edit?id=${encodeURIComponent(p.id)}`} className="inline-flex items-center gap-1.5 rounded-md border border-sand px-2.5 py-1.5 text-xs hover:border-ink">
                          <Pencil className="size-3.5" /> Edit
                        </Link>
                      </td>
                    </tr>
                    {open && (
                      <tr className="bg-linen/30">
                        <td colSpan={6} className="px-4 pb-4">
                          <div className="flex flex-wrap gap-3">
                            {p.colors.map((c) => (
                              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-sand bg-white px-3 py-2">
                                <span className="size-4 rounded-full border border-ink/10" style={{ backgroundColor: c.hex }} />
                                <span className="text-sm">{c.name}</span>
                                <QtyStepper value={c.quantity} onChange={(v) => setColorQuantity(p.id, c.id, v)} label={`${c.name} quantity`} />
                                <StockPill ready={c.quantity > 0} />
                              </div>
                            ))}
                            {p.colors.length === 0 && <p className="text-sm text-stone">No colours yet — add them in Edit.</p>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-stone">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-sand/60 px-4 py-3 text-xs text-stone">
          Tip: click a stock tag to change quantities per colour. 0 = &ldquo;Out of stock&rdquo; on the site (still orderable, ships in ~2 weeks).
        </p>
      </div>
    </>
  );
}
