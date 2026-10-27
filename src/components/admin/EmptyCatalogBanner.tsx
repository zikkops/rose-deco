"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useProductsState } from "@/lib/store";

/** Shown when products can't be loaded, or when the catalogue is empty. */
export function EmptyCatalogBanner() {
  const { items, loaded, error } = useProductsState();

  if (error) return <p className="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger">Couldn&apos;t load products: {error}</p>;
  if (!loaded || items.length > 0) return null;

  return (
    <div className="mb-4 flex flex-col items-start gap-3 rounded-xl border border-dashed border-stone/50 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">Your catalogue is empty</p>
        <p className="text-sm text-stone">Add your first product to show it on the website.</p>
      </div>
      <Link href="/admin/products/edit" className="flex shrink-0 items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-ivory hover:bg-accent-dark">
        <Plus className="size-4" /> Add product
      </Link>
    </div>
  );
}
