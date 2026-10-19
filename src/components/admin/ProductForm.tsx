"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { categories, type Product } from "@/lib/data";

const materials = ["Leather", "Velvet", "Bouclé", "Linen", "Solid Oak", "Walnut", "Marble", "Brass", "Ceramic", "Lacquer"];

// UI only — "Save" shows a toast; wire to the API later.
export function ProductForm({ product }: { product?: Product }) {
  const [images, setImages] = useState(product?.images ?? []);
  const [finishes, setFinishes] = useState(product?.finishes ?? [{ name: "", hex: "#c79b6a" }]);
  const [details, setDetails] = useState(product?.details.join("\n") ?? "");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [toast, setToast] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <form onSubmit={save}>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="rounded-md border border-sand bg-white p-2 hover:border-ink" aria-label="Back">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl">{product ? product.name : "New product"}</h1>
            <p className="text-sm text-stone">{product ? `/${product.slug}` : "Create a new catalogue item"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {product && (
            <Link href={`/product/${product.slug}`} target="_blank" className="rounded-md border border-sand bg-white px-4 py-2 text-sm hover:border-ink">
              Preview
            </Link>
          )}
          <button type="submit" className="rounded-md bg-ink px-5 py-2 text-sm text-ivory hover:bg-accent-dark">
            {product ? "Save changes" : "Create product"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <section className="card-admin space-y-4 p-5">
            <h2 className="font-medium">General</h2>
            <div>
              <label className="label-admin" htmlFor="name">Product name</label>
              <input id="name" className="input-admin" defaultValue={product?.name} required />
            </div>
            <div>
              <label className="label-admin" htmlFor="desc">Description</label>
              <textarea id="desc" rows={4} className="input-admin resize-y" defaultValue={product?.description} />
            </div>
            <div>
              <label className="label-admin" htmlFor="details">Key details (one per line)</label>
              <textarea id="details" rows={4} className="input-admin resize-y" value={details} onChange={(e) => setDetails(e.target.value)} />
            </div>
          </section>

          <section className="card-admin p-5">
            <h2 className="mb-4 font-medium">Media</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {images.map((src, i) => (
                <div key={src} className="group relative aspect-square overflow-hidden rounded-lg bg-linen">
                  <Image src={src} alt="" fill sizes="160px" className="object-cover" />
                  {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-ink/80 px-1.5 text-[10px] text-ivory">Cover</span>}
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((x) => x !== src))}
                    className="absolute top-1 right-1 rounded-full bg-white/90 p-1 opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              <button type="button" className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-stone/50 text-xs text-stone hover:border-accent hover:text-accent">
                <ImagePlus className="size-5" strokeWidth={1.5} />
                Upload
              </button>
            </div>
          </section>

          <section className="card-admin p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium">Finishes & variants</h2>
              <button type="button" onClick={() => setFinishes([...finishes, { name: "", hex: "#cccccc" }])} className="flex items-center gap-1 text-xs text-accent hover:underline">
                <Plus className="size-3.5" /> Add finish
              </button>
            </div>
            <div className="space-y-2">
              {finishes.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={f.hex}
                    onChange={(e) => setFinishes(finishes.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)))}
                    className="size-9 shrink-0 cursor-pointer rounded border border-sand bg-white p-0.5"
                    aria-label="Swatch colour"
                  />
                  <input
                    className="input-admin"
                    placeholder="Finish name"
                    value={f.name}
                    onChange={(e) => setFinishes(finishes.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                  />
                  <input className="input-admin hidden w-32 sm:block" placeholder="SKU" defaultValue={product ? `${product.slug.slice(0, 3).toUpperCase()}-${i + 1}0${i}` : ""} />
                  <button type="button" onClick={() => setFinishes(finishes.filter((_, j) => j !== i))} className="p-2 text-stone hover:text-danger" aria-label="Remove finish">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="card-admin grid gap-4 p-5 sm:grid-cols-2">
            <h2 className="font-medium sm:col-span-2">Specifications</h2>
            <div>
              <label className="label-admin" htmlFor="dims">Dimensions</label>
              <input id="dims" className="input-admin" defaultValue={product?.dimensions} />
            </div>
            <div>
              <label className="label-admin" htmlFor="designer">Designer</label>
              <input id="designer" className="input-admin" defaultValue={product?.designer ?? "Studio Roze"} />
            </div>
            <div>
              <label className="label-admin" htmlFor="lead">Lead time</label>
              <input id="lead" className="input-admin" defaultValue={product?.leadTime} />
            </div>
            <div>
              <label className="label-admin" htmlFor="color">Primary colour</label>
              <input id="color" className="input-admin" defaultValue={product?.color} />
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="card-admin space-y-4 p-5">
            <h2 className="font-medium">Status</h2>
            <select className="input-admin" defaultValue="active" aria-label="Status">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <label className="flex items-center justify-between text-sm">
              Featured on homepage
              <input type="checkbox" defaultChecked={product?.isBestseller} className="accent-ink" />
            </label>
            <label className="flex items-center justify-between text-sm">
              Mark as new
              <input type="checkbox" defaultChecked={product?.isNew} className="accent-ink" />
            </label>
          </section>

          <section className="card-admin space-y-4 p-5">
            <h2 className="font-medium">Pricing</h2>
            <div>
              <label className="label-admin" htmlFor="price">Price (USD)</label>
              <input id="price" type="number" className="input-admin" defaultValue={product?.price} />
            </div>
            <div>
              <label className="label-admin" htmlFor="compare">Compare-at price</label>
              <input id="compare" type="number" className="input-admin" defaultValue={product?.compareAt} placeholder="Optional" />
            </div>
          </section>

          <section className="card-admin space-y-4 p-5">
            <h2 className="font-medium">Organisation</h2>
            <div>
              <label className="label-admin" htmlFor="cat">Category</label>
              <select id="cat" className="input-admin" defaultValue={product?.category ?? categories[0].slug}>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-admin" htmlFor="mat">Material</label>
              <select id="mat" className="input-admin" defaultValue={product?.material ?? materials[0]}>
                {materials.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </section>

          <section className="card-admin space-y-4 p-5">
            <h2 className="font-medium">Inventory</h2>
            <div className="flex rounded-md bg-linen p-1 text-sm">
              {[true, false].map((v) => (
                <button
                  type="button"
                  key={String(v)}
                  onClick={() => setInStock(v)}
                  className={`flex-1 rounded py-1.5 ${inStock === v ? "bg-white shadow-sm" : "text-stone"}`}
                >
                  {v ? "In stock" : "Made to order"}
                </button>
              ))}
            </div>
            {inStock && (
              <div>
                <label className="label-admin" htmlFor="qty">Quantity on hand</label>
                <input id="qty" type="number" className="input-admin" defaultValue={12} />
              </div>
            )}
          </section>
        </div>
      </div>

      <div
        className={`fixed right-6 bottom-6 z-50 rounded-lg bg-ink px-5 py-3 text-sm text-ivory shadow-xl transition-all ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        Saved (preview only — backend not connected)
      </div>
    </form>
  );
}
