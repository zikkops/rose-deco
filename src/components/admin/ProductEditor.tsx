"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, ImagePlus, Link2, Loader2, Plus, Trash2, X } from "lucide-react";
import { QtyStepper } from "./QtyStepper";
import { StockPill } from "./StatusBadge";
import { SmartImage } from "@/components/SmartImage";
import {
  bundleColors,
  categories,
  formatPrice,
  formatSize,
  isBundle,
  slugify,
  type BundlePiece,
  type ColorVariant,
  type Product,
  type Size,
  type SizeUnit,
} from "@/lib/catalog";
import { imageUploadReady, uploadProductImage } from "@/lib/image";
import { deleteProduct, releaseImages, saveProduct, uid, useProductsState } from "@/lib/store";

const timestamp = () => Date.now();

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
  const [size, setSize] = useState(() => {
    const s = initial?.size;
    const str = (v?: number) => (v ? String(v) : "");
    return {
      round: !!s?.diameter,
      unit: (s?.unit ?? "cm") as SizeUnit,
      width: str(s?.width),
      height: str(s?.height),
      depth: str(s?.depth),
      diameter: str(s?.diameter),
    };
  });
  const [isSet, setIsSet] = useState(!!initial && isBundle(initial));
  const [pieces, setPieces] = useState<BundlePiece[]>(initial?.bundle ?? []);
  const [material, setMaterial] = useState(initial?.material ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [colors, setColors] = useState<ColorVariant[]>(initial?.colors ?? [{ id: uid(), name: "", hex: "#c9a877", quantity: 0 }]);
  const [active, setActive] = useState(initial?.active ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [isNewTag, setIsNewTag] = useState(initial?.isNew ?? true);
  const [urlInput, setUrlInput] = useState("");
  const [busy, setBusy] = useState(false); // photo upload in progress
  // Photos being uploaded: local preview + progress (0–1), shown as loading tiles
  const [pending, setPending] = useState<{ id: string; preview: string; progress: number }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Unsaved-changes tracking: compare the form with what was last saved
  const snapshot = JSON.stringify({ name, category, price, description, details, dimensions, size, isSet, pieces, material, images, colors, active, featured, isNewTag });
  const [savedSnapshot, setSavedSnapshot] = useState(snapshot);
  const dirty = snapshot !== savedSnapshot;

  // Warn before closing / reloading the tab with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const fileRef = useRef<HTMLInputElement>(null);
  // Photos uploaded in this editing session — deleted from the host if removed before saving.
  const uploaded = useRef<string[]>([]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const queue = [...files].map((file) => ({ id: uid(), file, preview: URL.createObjectURL(file) }));
    if (fileRef.current) fileRef.current.value = "";
    setPending((p) => [...p, ...queue.map(({ id, preview }) => ({ id, preview, progress: 0 }))]);
    setBusy(true);
    setError("");
    // One at a time, so photos keep the order they were picked in
    for (const item of queue) {
      try {
        const url = await uploadProductImage(item.file, (progress) =>
          setPending((p) => p.map((x) => (x.id === item.id ? { ...x, progress } : x))),
        );
        uploaded.current.push(url);
        setImages((imgs) => [...imgs, url]);
      } catch (e) {
        setError(`${item.file.name}: ${e instanceof Error ? e.message : "Upload failed."}`);
      } finally {
        setPending((p) => p.filter((x) => x.id !== item.id));
        URL.revokeObjectURL(item.preview);
      }
    }
    setBusy(false);
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

  /** Pick the photo shown for a colour (set colours are stored on first use). */
  const setColorPhoto = (c: ColorVariant, image?: string) =>
    setColors((cs) =>
      cs.some((x) => x.id === c.id) ? cs.map((x) => (x.id === c.id ? { ...x, image } : x)) : [...cs, { ...c, quantity: 0, image }],
    );

  // Sets: the single products that can go in one, and the colours they share
  const singles = existing.filter((p) => !isBundle(p) && p.id !== initial?.id);
  const setColorList = isSet ? bundleColors({ bundle: pieces, colors }, existing) : [];
  const separatePrice = pieces.reduce((s, b) => s + (singles.find((p) => p.id === b.productId)?.price ?? 0) * b.qty, 0);
  const usedInSets = initial ? existing.filter((p) => p.bundle?.some((b) => b.productId === initial.id)) : [];

  const sizeValue = (v: string) => {
    const x = Number(v.replace(",", "."));
    return v.trim() && Number.isFinite(x) && x > 0 ? x : undefined;
  };
  const sizeOut: Size = size.round
    ? { unit: size.unit, diameter: sizeValue(size.diameter), height: sizeValue(size.height) }
    : { unit: size.unit, width: sizeValue(size.width), height: sizeValue(size.height), depth: sizeValue(size.depth) };
  const sizeText = formatSize(sizeOut);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const priceNum = Number(price);
    if (!name.trim()) return setError("Please add a product name.");
    if (!Number.isFinite(priceNum) || priceNum <= 0) return setError("Please add a valid price.");
    const photo = (src?: string) => (src && images.includes(src) ? src : undefined);
    const cleanPieces = pieces.filter((b) => singles.some((p) => p.id === b.productId)).map((b) => ({ ...b, qty: Math.max(1, b.qty) }));
    let cleanColors: ColorVariant[];
    if (isSet) {
      if (cleanPieces.length === 0) return setError("Choose the products that make up this set.");
      // Stock of a set comes from its pieces, so only the colour photos are stored here
      cleanColors = setColorList.map((c) => ({ ...c, quantity: 0, image: photo(c.image) }));
      if (cleanColors.length === 0)
        return setError("The pieces in this set have no colour in common — give their colours the same names.");
    } else {
      cleanColors = colors
        .filter((c) => c.name.trim())
        .map((c) => ({ ...c, name: c.name.trim(), id: c.id || uid(), image: photo(c.image) }));
      if (cleanColors.length === 0) return setError("Add at least one colour (with a name).");
    }

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
      size: sizeText ? sizeOut : undefined,
      bundle: isSet ? cleanPieces : undefined,
      material: material.trim(),
      images,
      colors: cleanColors,
      featured,
      isNew: isNewTag,
      active,
      createdAt: initial?.createdAt ?? timestamp(),
    };

    setSaving(true);
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
      setSaving(false);
    }
    setSavedSnapshot(snapshot);
    if (isNew) router.replace(`/admin/products/edit?id=${encodeURIComponent(product.id)}`);
    flash("Saved — live on the website");
  };

  return (
    <form onSubmit={save} className="pb-28">
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
            <div>
              <label className="label-admin" htmlFor="material">Material</label>
              <input id="material" className="input-admin" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Wood, Ceramic, Velvet…" />
            </div>
          </section>

          <section className="card-admin space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-medium">Size</h2>
              <div className="flex gap-2">
                <select className="input-admin w-auto py-1.5" value={size.round ? "round" : "rect"} onChange={(e) => setSize({ ...size, round: e.target.value === "round" })} aria-label="Shape">
                  <option value="rect">Width × Height × Depth</option>
                  <option value="round">Round (diameter)</option>
                </select>
                <select className="input-admin w-auto py-1.5" value={size.unit} onChange={(e) => setSize({ ...size, unit: e.target.value as SizeUnit })} aria-label="Unit">
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(size.round
                ? ([["diameter", "Diameter"], ["height", "Height"]] as const)
                : ([["width", "Width"], ["height", "Height"], ["depth", "Depth"]] as const)
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="label-admin" htmlFor={`size-${key}`}>{label} ({size.unit})</label>
                  <input
                    id={`size-${key}`}
                    type="number"
                    min={0}
                    step="any"
                    inputMode="decimal"
                    className="input-admin"
                    value={size[key]}
                    onChange={(e) => setSize({ ...size, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="label-admin" htmlFor="dims">Size notes (optional)</label>
              <input id="dims" className="input-admin" value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="e.g. Seat height 45 cm" />
            </div>
            <p className="text-xs text-stone">
              Shown on the website as: <span className="text-ink">{sizeText || "—"}</span>
            </p>
          </section>

          <section className="card-admin space-y-4 p-5">
            <div>
              <h2 className="font-medium">Set / bundle</h2>
              <p className="text-xs text-stone">
                Sell several pieces together, e.g. two side tables as a pair. The set shows in its category next to the single pieces, and its stock comes from them.
              </p>
            </div>
            <Toggle label="This product is a set of other products" checked={isSet} onChange={setIsSet} />
            {isSet && (
              <div className="space-y-2">
                {pieces.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-sand/70 p-2">
                    <select
                      className="input-admin min-w-0 flex-1"
                      value={b.productId}
                      onChange={(e) => setPieces(pieces.map((x, j) => (j === i ? { ...x, productId: e.target.value } : x)))}
                      aria-label="Product in this set"
                    >
                      <option value="">Choose a product…</option>
                      {singles.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <QtyStepper value={b.qty} onChange={(v) => setPieces(pieces.map((x, j) => (j === i ? { ...x, qty: Math.max(1, v) } : x)))} label="pieces" />
                    <button type="button" onClick={() => setPieces(pieces.filter((_, j) => j !== i))} className="p-2 text-stone hover:text-danger" aria-label="Remove piece">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setPieces([...pieces, { productId: "", qty: pieces.length ? 1 : 2 }])} className="flex items-center gap-1 text-xs underline-offset-4 hover:underline">
                  <Plus className="size-3.5" /> Add a piece
                </button>
                {separatePrice > 0 && (
                  <p className="text-xs text-stone">
                    Bought separately: {formatPrice(separatePrice)}
                    {Number(price) > 0 && Number(price) < separatePrice && <> · customers save {formatPrice(separatePrice - Number(price))}</>}
                  </p>
                )}
              </div>
            )}
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
              {pending.map((p) => (
                <div key={p.id} className="relative aspect-square overflow-hidden rounded-lg bg-linen" aria-busy="true" aria-label="Uploading photo">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local preview (blob: URL) */}
                  <img src={p.preview} alt="" className="size-full scale-105 object-cover opacity-60 blur-[2px]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-white/40">
                    <Loader2 className="size-6 animate-spin text-ink" strokeWidth={1.75} />
                    <span className="text-[11px] font-medium tabular-nums">
                      {p.progress > 0 ? `${Math.round(p.progress * 100)}%` : "Waiting…"}
                    </span>
                  </div>
                  <div className="absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full bg-white/80">
                    <div className="h-full rounded-full bg-ink transition-[width] duration-200" style={{ width: `${Math.round(p.progress * 100)}%` }} />
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

          {isSet ? (
            <section className="card-admin p-5">
              <div className="mb-4">
                <h2 className="font-medium">Colours &amp; stock</h2>
                <p className="text-xs text-stone">
                  A set comes in the colours all its pieces share (same colour name). Stock = how many full sets the pieces make — change it on the single products.
                </p>
              </div>
              <div className="space-y-2">
                {setColorList.map((c) => (
                  <div key={c.id} className="space-y-2 rounded-lg border border-sand/70 p-2">
                    <div className="flex items-center gap-2">
                      <span className="size-9 shrink-0 rounded border border-sand" style={{ backgroundColor: c.hex }} />
                      <span className="flex-1 text-sm">{c.name}</span>
                      <span className="text-xs text-stone tabular-nums">{c.quantity} {c.quantity === 1 ? "set" : "sets"}</span>
                      <StockPill ready={c.quantity > 0} />
                    </div>
                    <ColorPhotoPicker images={images} value={c.image} onChange={(src) => setColorPhoto(c, src)} />
                  </div>
                ))}
                {setColorList.length === 0 && (
                  <p className="text-sm text-stone">
                    {pieces.some((b) => b.productId) ? "These pieces have no colour in common yet." : "Choose the pieces above to see the colours."}
                  </p>
                )}
              </div>
            </section>
          ) : (
            <section className="card-admin p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-medium">Colours &amp; stock</h2>
                  <p className="text-xs text-stone">
                    Quantity 0 shows as &ldquo;Out of stock&rdquo; — customers can still order (ships in ~2 weeks). Pick a photo for each colour so the picture changes when customers choose it.
                  </p>
                </div>
                <button type="button" onClick={() => setColors([...colors, { id: uid(), name: "", hex: "#cccccc", quantity: 0 }])} className="flex shrink-0 items-center gap-1 text-xs underline-offset-4 hover:underline">
                  <Plus className="size-3.5" /> Add colour
                </button>
              </div>
              <div className="space-y-2">
                {colors.map((c, i) => (
                  <div key={c.id} className="space-y-2 rounded-lg border border-sand/70 p-2">
                    <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
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
                    <ColorPhotoPicker images={images} value={c.image} onChange={(src) => setColorPhoto(c, src)} />
                  </div>
                ))}
                {colors.length === 0 && <p className="text-sm text-stone">No colours yet.</p>}
              </div>
            </section>
          )}
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
              {usedInSets.length > 0 && (
                <p className="mt-2 text-xs text-warning">
                  It is part of {usedInSets.map((p) => p.name).join(", ")} — {usedInSets.length === 1 ? "that set" : "those sets"} can&apos;t be ordered without it.
                </p>
              )}
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

      {/* Floating save bar — always visible */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand/80 bg-white/95 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur lg:left-60">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div className="min-w-0 text-sm">
            {error ? (
              <p className="truncate text-danger">{error}</p>
            ) : dirty || isNew ? (
              <p className="flex items-center gap-2 font-medium text-warning">
                <span className="size-2 shrink-0 animate-pulse rounded-full bg-warning" />
                {isNew ? "New product — not saved yet" : "Unsaved changes"}
              </p>
            ) : (
              <p className="flex items-center gap-2 text-stone">
                <span className="size-2 shrink-0 rounded-full bg-success" /> All changes saved
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href="/admin/products" className="hidden rounded-md border border-sand px-4 py-2.5 text-sm hover:border-ink sm:block">
              Back to products
            </Link>
            <button
              type="submit"
              disabled={saving || busy || (!dirty && !isNew)}
              className="rounded-md bg-ink px-6 py-2.5 text-sm font-medium text-ivory hover:bg-accent-dark disabled:opacity-40"
            >
              {saving ? "Saving…" : busy ? "Uploading…" : isNew ? "Create product" : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      <div
        role="status"
        className={`fixed right-6 bottom-24 z-50 rounded-lg bg-ink px-5 py-3 text-sm text-ivory shadow-xl transition-all ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {toast}
      </div>
    </form>
  );
}

/** Choose which of the product's photos shows for a colour. Click again to go back to the cover. */
function ColorPhotoPicker({ images, value, onChange }: { images: string[]; value?: string; onChange: (src?: string) => void }) {
  if (images.length === 0) return <p className="text-xs text-stone">Upload photos above to pick one for this colour.</p>;
  const current = value && images.includes(value) ? value : undefined;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs text-stone">Photo</span>
      {images.map((src, i) => {
        const on = current === src;
        return (
          <button
            key={src.slice(-40) + i}
            type="button"
            onClick={() => onChange(on ? undefined : src)}
            aria-pressed={on}
            aria-label={`Use photo ${i + 1} for this colour`}
            className={`relative size-10 overflow-hidden rounded-md bg-linen transition ${on ? "ring-2 ring-ink ring-offset-1" : "opacity-50 hover:opacity-100"}`}
          >
            <SmartImage src={src} alt="" fill sizes="40px" className="object-cover" />
          </button>
        );
      })}
      {!current && <span className="ml-1 text-xs text-stone">Using the cover photo</span>}
    </div>
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
