"use client";

import { useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { isReadyNow } from "@/lib/catalog";
import { useProductsState } from "@/lib/store";
import { CardsSkeleton } from "./Skeletons";

/** A row of product cards picked from the live catalogue. */
export function ProductRail({ kind, limit = 4 }: { kind: "featured" | "new" | "ready"; limit?: number }) {
  const { items, loaded } = useProductsState();
  const list = useMemo(() => {
    const products = items.filter((p) => p.active);
    const pick =
      kind === "featured"
        ? products.filter((p) => p.featured)
        : kind === "new"
          ? products.filter((p) => p.isNew).sort((a, b) => b.createdAt - a.createdAt)
          : products.filter(isReadyNow);
    return pick.slice(0, limit);
  }, [items, kind, limit]);

  if (!loaded) return <CardsSkeleton count={limit > 4 ? 8 : 4} />;
  if (list.length === 0) return <p className="py-12 text-center text-sm text-stone">New pieces coming soon.</p>;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
      {list.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
