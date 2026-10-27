"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, ImagePlus, Link2, Plus, Trash2, X } from "lucide-react";
import { QtyStepper } from "./QtyStepper";
import { StockPill } from "./StatusBadge";
import { SmartImage } from "@/components/SmartImage";
import { categories, slugify, type ColorVariant, type Product } from "@/lib/catalog";
import { imageUploadReady, uploadProductImage } from "@/lib/image";
import { deleteProduct, releaseImages, saveProduct, uid, useProductsState } from "@/lib/store";

export function ProductEditor() {
  const id = useSearchParams().get("id");
  const { items: products, loaded } = useProductsState();
  const product = id ? products.find((p) => p.id === id) : undefined;

  if (id && !product) {
    if (!loaded) return <div className="h-96 animate-pulse rounded-xl bg-linen" />;
    return (
      <div className="card-admin p-10 text-center">
        <p className="font-serif text-2xl">Product not found</p>
        <Link href="/admin/products" className="mt-4 inline-block text-sm underline">Back to products</Link>
      </div>
    );
  }
  // Remount the form when switching products so state re-initialises.
  return <EditorForm key={product?.id ?? "new"} initial={product} existing={products} />;
}

function EditorForm({ initial, existing }: { initial?: Product; existing: Product[] }) {
  const router = useRouter();
  const isNew = !initial;
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? categories[0].slug);
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [details, setDetails] = useState(initial?.details.join("\n") ?? "");
  const [dimensions, setDimensions] = useState(initial?.dimensions ?? "");
  const [material, setMaterial] = useState(initial?.material ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [colors, setColors] = useState<ColorVariant[]>(initial?.colors ?? [{ id: uid(), name: "", hex: "#c9a877", quantity: 0 }]);
  const [active, setActive] = useState(initial?.active ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [isNewTag, setIsNewTag] = useState(initial?.isNew ?? true);
  const [urlInput, setUrlInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  // Photos uploaded in this editing session — deleted from the host if removed before saving.
  const uploaded = useRef<string[]>([]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      for (const f of [...files]) {
        const url = await uploadProductImage(f);
        uploaded.current.push(url);
        setImages((imgs) => [...imgs, url]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const move = (i: number, d: -1 | 1) =>
    setImages((imgs) => {
      const j = i + d;
      if (j < 0 || j >= imgs.length) return imgs;
      const next = [...imgs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const updateColor = (i: number, patch: Partial<ColorVariant>) =>
    setColors((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const priceNum = Number(price);
    if (!name.trim()) return setError("Please add a product name.");
    if (!Number.isFinite(priceNum) || priceNum <= 0) return setError("Please add a valid price.");
    const cleanColors = colors
      .filter((c) => c.name.trim())
      .map((c) => ({ ...c, name: c.name.trim(), id: c.id || uid() }));
    if (cleanColors.length === 0) return setError("Add at least one colour (with a name).");

    let slug = initial?.slug ?? slugify(name);
    if (!initial) {
      const base = slug || "product";
      let n = 2;
      while (existing.some((p) => p.slug === slug)) slug = `${base}-${n++}`;
    }

    const product: Product = {
      id: initial?.id ?? `p-${uid()}`,
      slug,
      name: name.trim(),
      category,
      price: priceNum,
      description: description.trim(),
      details: details.split("\n").map((d) => d.trim()).filter(Boolean),
      dimensions: dimensions.trim(),
      material: material.trim(),
      images,
      colors: cleanColors,
      featured,
      isNew: isNewTag,
      active,
      createdAt: initial?.createdAt ?? Date.now(),
    };

    setBusy(true);
    try {
      await saveProduct(product);
      // Clean up photos that were removed (saved before, or uploaded in this session)
      const removed = [...(initial?.images ?? []), ...uploaded.current].filter((u) => !images.includes(u));
      uploaded.current = [];
      void releaseImages(removed, product.id);
    } catch (err) {
      console.error(err);
      return setError("Could not save — check your connection and that you are logged in as an admin.");
    } finally {
      setBusy(false);
    }
    if (isNew) router.replace(`/admin/products/edit?id=${encodeURIComponent(product.id)}`);
    flash("Saved — live on the website");
  };

  return (
    <form onSubmit={save}>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="rounded-md border border-sand bg-white p-2 hover:border-ink" aria-label="Back to products">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl">{isNew ? "New product" : initial.name}</h1>
            <p className="text-sm text-stone">{isNew ? "Add a new item to the shop" : `/product/${initial.slug}`}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <Link href={`/product/${initial.slug}`} target="_blank" className="flex items-center gap-1.5 rounded-md border border-sand bg-white px-4 py-2 text-sm hover:border-ink">
              <ExternalLink className="size-3.5" /> View on site
            </Link>
          )}
          <button type="submit" disabled={busy} className="rounded-md bg-ink px-5 py-2 text-sm text-ivory hover:bg-accent-dark disabled:opacity-50">
            {isNew ? "Create product" : "Save changes"}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>}

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          <section className="card-admin space-y-4 p-5">
            <h2 className="font-medium">Details</h2>
            <div>
              <label className="label-admin" htmlFor="name">Product name *</label>
              <input id="name" className="input-admin" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jute Pouf" />
            </div>
            <div>
              <label className="label-admin" htmlFor="desc">Description</label>
              <textarea id="desc" rows={3} className="input-admin resize-y" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <label className="label-admin" htmlFor="details">Key details (one per line)</label>
              <textarea id="details" rows={3} className="input-admin resize-y" value={details} onChange={(e) => setDetails(e.target.value)} placeholder={"Hand-braided jute\nSturdy core"} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-admin" htmlFor="dims">Dimensions</label>
                <input id="dims" className="input-admin" value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="Ø 45 × H 40 cm" />
              </div>
              <div>
                <label className="label-admin" htmlFor="material">Material</label>
                <input id="material" className="input-admin" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Wood, Ceramic, Velvet…" />
              </div>
            </div>
          </section>

          <section className="card-admin p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium">Images</h2>
              <span className="text-xs text-stone">First image is the cover</span>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {images.map((src, i) => (
                <div key={src.slice(-40) + i} className="group relative aspect-square overflow-hidden rounded-lg bg-linen">
                  <SmartImage src={src} alt="" fill sizes="160px" className="object-cover" />
                  {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-ink/80 px-1.5 text-[10px] text-ivory">Cover</span>}
                  <div className="absolute inset-x-1 top-1 flex justify-between">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-full bg-white/90 p-1 disabled:opacity-30" aria-label="Move left">
                        <ArrowLeft className="size-3" />
                      </button>
                      <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="rounded-full bg-white/90 p-1 disabled:opacity-30" aria-label="Move right">
                        <ArrowRight className="size-3" />
                      </button>
                    </div>
                    <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="rounded-full bg-white/90 p-1" aria-label="Remove image">
                      <X className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-stone/50 text-xs text-stone hover:border-ink hover:text-ink"
              >
                <ImagePlus className="size-5" strokeWidth={1.5} />
                {busy ? "Uploading…" : "Upload"}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone" />
                <input className="input-admin pl-9" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="…or paste an image link (https://…)" />
              </div>
              <button
                type="button"
                className="rounded-md border border-sand px-3 text-sm hover:border-ink"
                onClick={() => {
                  if (/^https?:\/\//.test(urlInput.trim())) {
                    setImages([...images, urlInput.trim()]);
                    setUrlInput("");
                  } else setError("Image links must start with http:// or https://");
                }}
              >
                Add
              </button>
            </div>
            <p className="mt-2 text-xs text-stone">
              {imageUploadReady()
                ? "Photos are resized and uploaded to image hosting automatically."
                : "Image upload isn’t connected yet — paste image links for now."}
            </p>
          </section>

          <section className="card-admin p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-medium">Colours &amp; stock</h2>
                <p className="text-xs text-stone">Quantity 0 shows as &ldquo;Out of stock&rdquo; — customers can still order (ships in ~2 weeks).</p>
              </div>
              <button type="button" onClick={() => setColors([...colors, { id: uid(), name: "", hex: "#cccccc", quantity: 0 }])} className="flex shrink-0 items-center gap-1 text-xs underline-offset-4 hover:underline">
                <Plus className="size-3.5" /> Add colour
              </button>
            </div>
            <div className="space-y-2">
              {colors.map((c, i) => (
                <div key={c.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-sand/70 p-2 sm:flex-nowrap">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => updateColor(i, { hex: e.target.value })}
                    className="size-9 shrink-0 cursor-pointer rounded border border-sand bg-white p-0.5"
                    aria-label="Swatch colour"
                  />
                  <input className="input-admin min-w-0 flex-1" placeholder="Colour name (e.g. Natural)" value={c.name} onChange={(e) => updateColor(i, { name: e.target.value })} />
                  <QtyStepper value={c.quantity} onChange={(v) => updateColor(i, { quantity: v })} label={`${c.name || "colour"} quantity`} />
                  <span className="hidden sm:inline"><StockPill ready={c.quantity > 0} /></span>
                  <button type="button" onClick={() => setColors(colors.filter((_, j) => j !== i))} className="p-2 text-stone hover:text-danger" aria-label="Remove colour">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              {colors.length === 0 && <p className="text-sm text-stone">No colours yet.</p>}
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-4">
          <section className="card-admin space-y-4 p-5">
            <h2 className="font-medium">Pricing &amp; category</h2>
            <div>
              <label className="label-admin" htmlFor="price">Price (USD) *</label>
              <input id="price" type="number" min={0} step="1" className="input-admin" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label className="label-admin" htmlFor="cat">Category</label>
              <select id="cat" className="input-admin" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="card-admin space-y-3 p-5">
            <h2 className="font-medium">Visibility</h2>
            <Toggle label="Show on website" checked={active} onChange={setActive} />
            <Toggle label="Feature on home page" checked={featured} onChange={setFeatured} />
            <Toggle label="Show “New” tag" checked={isNewTag} onChange={setIsNewTag} />
          </section>

          {!isNew && (
            <section className="card-admin p-5">
              <h2 className="font-medium">Delete product</h2>
              <p className="mt-1 text-xs text-stone">Removes it from the site and deletes its photos from image hosting (unless another product uses them). Tip: turn off “Show on website” to hide it temporarily instead.</p>
              {confirmDelete ? (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await deleteProduct(initial.id);
                        router.push("/admin/products");
                      } catch {
                        setError("Could not delete the product. Please try again.");
                      }
                    }}
                    className="rounded-md bg-danger px-3 py-2 text-sm text-white"
                  >
                    Yes, delete
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-md border border-sand px-3 py-2 text-sm">Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="mt-3 rounded-md border border-danger/40 px-3 py-2 text-sm text-danger hover:bg-danger/5">
                  Delete product
                </button>
              )}
            </section>
          )}
        </div>
      </div>

      <div
        role="status"
        className={`fixed right-6 bottom-6 z-50 rounded-lg bg-ink px-5 py-3 text-sm text-ivory shadow-xl transition-all ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {toast}
      </div>
    </form>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-sm">
      {label}
      <span className="relative inline-flex items-center">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="h-5 w-9 rounded-full bg-sand transition peer-checked:bg-ink" />
        <span className="absolute left-0.5 size-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
      </span>
    </label>
  );
}
