"use client";

import { useState } from "react";
import { Database } from "lucide-react";
import { importDemoProducts, useProductsState } from "@/lib/store";

/** Shown when the products collection in Firestore is empty. */
export function EmptyCatalogBanner() {
  const { items, loaded, error } = useProductsState();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  if (error) return <p className="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger">Couldn&apos;t load products: {error}</p>;
  if (!loaded || items.length > 0) return null;

  return (
    <div className="mb-4 flex flex-col items-start gap-3 rounded-xl border border-dashed border-stone/50 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">Your catalogue is empty</p>
        <p className="text-sm text-stone">Add products one by one, or start from the 28 demo products and edit them.</p>
        {msg && <p className="mt-1 text-sm text-danger">{msg}</p>}
      </div>
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setMsg("");
          try {
            await importDemoProducts();
          } catch {
            setMsg("Import failed — please try again.");
          } finally {
            setBusy(false);
          }
        }}
        className="flex shrink-0 items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-ivory hover:bg-accent-dark disabled:opacity-60"
      >
        <Database className="size-4" /> {busy ? "Importing…" : "Import demo products"}
      </button>
    </div>
  );
}
