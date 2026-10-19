"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, LayoutGrid, Grid3x3, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { categories, type Product } from "@/lib/data";

type Sort = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

const sortLabels: Record<Sort, string> = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
};

const priceBands = [
  { id: "u1000", label: "Under $1,000", min: 0, max: 999 },
  { id: "1-3k", label: "$1,000 – $3,000", min: 1000, max: 3000 },
  { id: "3-6k", label: "$3,000 – $6,000", min: 3001, max: 6000 },
  { id: "6k", label: "Over $6,000", min: 6001, max: Infinity },
];

type Filters = {
  categories: string[];
  prices: string[];
  materials: string[];
  colors: string[];
  availability: "all" | "in-stock" | "made-to-order";
  onlyNew: boolean;
  onlySale: boolean;
};

const empty: Filters = {
  categories: [],
  prices: [],
  materials: [],
  colors: [],
  availability: "all",
  onlyNew: false,
  onlySale: false,
};

const toggle = (list: string[], v: string) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

export function ProductBrowser({
  products,
  showCategoryFilter = false,
}: {
  products: Product[];
  showCategoryFilter?: boolean;
}) {
  const [filters, setFilters] = useState<Filters>(empty);
  const [sort, setSort] = useState<Sort>("featured");
  const [cols, setCols] = useState<3 | 4>(3);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  const materials = useMemo(
    () => [...new Set(products.map((p) => p.material))].sort(),
    [products],
  );
  const colors = useMemo(() => {
    const m = new Map<string, string>();
    products.forEach((p) => m.set(p.color, p.colorHex));
    return [...m.entries()];
  }, [products]);

  const results = useMemo(() => {
    const list = products.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (
        filters.prices.length &&
        !priceBands.some(
          (b) => filters.prices.includes(b.id) && p.price >= b.min && p.price <= b.max,
        )
      )
        return false;
      if (filters.materials.length && !filters.materials.includes(p.material)) return false;
      if (filters.colors.length && !filters.colors.includes(p.color)) return false;
      if (filters.availability === "in-stock" && !p.inStock) return false;
      if (filters.availability === "made-to-order" && p.inStock) return false;
      if (filters.onlyNew && !p.isNew) return false;
      if (filters.onlySale && !p.compareAt) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    if (sort === "featured")
      sorted.sort((a, b) => Number(!!b.isBestseller) - Number(!!a.isBestseller));
    return sorted;
  }, [products, filters, sort]);

  const chips: { label: string; clear: () => void }[] = [
    ...filters.categories.map((c) => ({
      label: categories.find((x) => x.slug === c)?.name ?? c,
      clear: () => setFilters((f) => ({ ...f, categories: toggle(f.categories, c) })),
    })),
    ...filters.prices.map((id) => ({
      label: priceBands.find((b) => b.id === id)!.label,
      clear: () => setFilters((f) => ({ ...f, prices: toggle(f.prices, id) })),
    })),
    ...filters.materials.map((m) => ({
      label: m,
      clear: () => setFilters((f) => ({ ...f, materials: toggle(f.materials, m) })),
    })),
    ...filters.colors.map((c) => ({
      label: c,
      clear: () => setFilters((f) => ({ ...f, colors: toggle(f.colors, c) })),
    })),
    ...(filters.availability !== "all"
      ? [{
          label: filters.availability === "in-stock" ? "In stock" : "Made to order",
          clear: () => setFilters((f) => ({ ...f, availability: "all" as const })),
        }]
      : []),
    ...(filters.onlyNew
      ? [{ label: "New", clear: () => setFilters((f) => ({ ...f, onlyNew: false })) }]
      : []),
    ...(filters.onlySale
      ? [{ label: "On sale", clear: () => setFilters((f) => ({ ...f, onlySale: false })) }]
      : []),
  ];

  const panel = (
    <div className="space-y-1">
      {showCategoryFilter && (
        <FilterGroup title="Category">
          {categories.map((c) => (
            <Check
              key={c.slug}
              label={c.name}
              count={products.filter((p) => p.category === c.slug).length}
              checked={filters.categories.includes(c.slug)}
              onChange={() =>
                setFilters((f) => ({ ...f, categories: toggle(f.categories, c.slug) }))
              }
            />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Price">
        {priceBands.map((b) => (
          <Check
            key={b.id}
            label={b.label}
            count={products.filter((p) => p.price >= b.min && p.price <= b.max).length}
            checked={filters.prices.includes(b.id)}
            onChange={() => setFilters((f) => ({ ...f, prices: toggle(f.prices, b.id) }))}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Material">
        {materials.map((m) => (
          <Check
            key={m}
            label={m}
            count={products.filter((p) => p.material === m).length}
            checked={filters.materials.includes(m)}
            onChange={() => setFilters((f) => ({ ...f, materials: toggle(f.materials, m) }))}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Colour">
        <div className="flex flex-wrap gap-2.5 pt-1">
          {colors.map(([name, hex]) => {
            const active = filters.colors.includes(name);
            return (
              <button
                key={name}
                title={name}
                aria-label={name}
                aria-pressed={active}
                onClick={() => setFilters((f) => ({ ...f, colors: toggle(f.colors, name) }))}
                className={`size-7 rounded-full border transition ${
                  active
                    ? "ring-1 ring-ink ring-offset-2 ring-offset-ivory"
                    : "border-ink/15 hover:scale-110"
                }`}
                style={{ backgroundColor: hex }}
              />
            );
          })}
        </div>
      </FilterGroup>
      <FilterGroup title="Availability">
        {(
          [
            ["all", "All pieces"],
            ["in-stock", "In stock"],
            ["made-to-order", "Made to order"],
          ] as const
        ).map(([v, l]) => (
          <label key={v} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm">
            <input
              type="radio"
              name="availability"
              checked={filters.availability === v}
              onChange={() => setFilters((f) => ({ ...f, availability: v }))}
              className="size-3.5 accent-ink"
            />
            {l}
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Highlights">
        <Check
          label="New arrivals"
          checked={filters.onlyNew}
          onChange={() => setFilters((f) => ({ ...f, onlyNew: !f.onlyNew }))}
        />
        <Check
          label="On sale"
          checked={filters.onlySale}
          onChange={() => setFilters((f) => ({ ...f, onlySale: !f.onlySale }))}
        />
      </FilterGroup>
    </div>
  );

  return (
    <div className="container-lux pb-24">
      {/* Toolbar */}
      <div className="sticky top-[72px] z-20 -mx-5 flex items-center justify-between gap-4 border-y border-sand/70 bg-ivory/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setDrawer(true)}
            className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase lg:hidden"
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.5} />
            Filter {chips.length > 0 && `(${chips.length})`}
          </button>
          <p className="hidden text-xs tracking-[0.2em] text-stone uppercase lg:block">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <label className="relative flex items-center gap-2 text-xs tracking-[0.15em] uppercase">
            <span className="hidden text-stone sm:inline">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="cursor-pointer appearance-none bg-transparent pr-5 tracking-[0.15em] uppercase outline-none"
            >
              {Object.entries(sortLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 size-3.5" />
          </label>
          <div className="hidden items-center gap-2 border-l border-sand pl-5 lg:flex">
            <button
              aria-label="3 columns"
              onClick={() => setCols(3)}
              className={cols === 3 ? "text-ink" : "text-stone"}
            >
              <LayoutGrid className="size-4" strokeWidth={1.5} />
            </button>
            <button
              aria-label="4 columns"
              onClick={() => setCols(4)}
              className={cols === 4 ? "text-ink" : "text-stone"}
            >
              <Grid3x3 className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-[150px] max-h-[calc(100vh-170px)] overflow-y-auto pr-2">
            {panel}
          </div>
        </aside>

        <div>
          {chips.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button
                  key={c.label}
                  onClick={c.clear}
                  className="flex items-center gap-1.5 border border-sand bg-white/60 px-3 py-1.5 text-xs hover:border-ink"
                >
                  {c.label}
                  <X className="size-3" />
                </button>
              ))}
              <button
                onClick={() => setFilters(empty)}
                className="ml-2 text-xs text-accent underline underline-offset-4"
              >
                Clear all
              </button>
            </div>
          )}

          {results.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <p className="font-serif text-3xl">No pieces match your selection</p>
              <p className="mt-3 text-sm text-taupe">
                Try removing a filter or two to see more of the collection.
              </p>
              <button onClick={() => setFilters(empty)} className="btn-outline mt-8">
                Reset filters
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 gap-x-4 gap-y-12 lg:gap-x-6 ${
                cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
              }`}
            >
              {results.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${drawer ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-ink/40 transition-opacity ${drawer ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawer(false)}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-ivory transition-transform duration-300 ${
            drawer ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-sand px-6 py-5">
            <p className="font-serif text-2xl">Filters</p>
            <button onClick={() => setDrawer(false)} aria-label="Close filters">
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">{panel}</div>
          <div className="grid grid-cols-2 gap-3 border-t border-sand p-4">
            <button onClick={() => setFilters(empty)} className="btn-outline px-4">
              Clear
            </button>
            <button onClick={() => setDrawer(false)} className="btn-dark px-4">
              Show {results.length}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-sand/70 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-xs tracking-[0.2em] uppercase"
      >
        {title}
        <ChevronDown
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function Check({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-1.5 text-sm">
      <span className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="size-3.5 accent-ink"
        />
        {label}
      </span>
      {count !== undefined && <span className="text-xs text-stone">{count}</span>}
    </label>
  );
}

