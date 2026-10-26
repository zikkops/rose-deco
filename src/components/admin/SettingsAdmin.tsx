"use client";

import { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { PageHeader } from "./AdminShell";
import { brand } from "@/lib/brand";
import { MADE_TO_ORDER_LEAD } from "@/lib/catalog";
import { exportDemoData, resetDemoData, storageUsage, useHydrated, useOrders, useProducts } from "@/lib/store";

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-b border-sand/60 py-8 first:pt-0 lg:grid-cols-3">
      <div>
        <h2 className="font-medium">{title}</h2>
        <p className="mt-1 text-sm text-stone">{desc}</p>
      </div>
      <div className="card-admin space-y-3 p-5 lg:col-span-2">{children}</div>
    </section>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-wrap justify-between gap-2 border-b border-sand/50 pb-3 text-sm last:border-0 last:pb-0">
    <span className="text-stone">{label}</span>
    <span>{value}</span>
  </div>
);

export function SettingsAdmin() {
  const hydrated = useHydrated();
  // re-render when data changes so the storage figure stays current
  useProducts();
  useOrders();
  const [confirmReset, setConfirmReset] = useState(false);
  const [done, setDone] = useState("");

  const usedKb = hydrated ? Math.round(storageUsage() / 1024) : 0;

  return (
    <>
      <PageHeader title="Settings" subtitle="Store information and demo data" />

      <Section title="Store details" desc="Shown on the website. Ask your developer to change these for now.">
        <Row label="Store name" value={brand.name} />
        <Row label="Email" value={brand.email} />
        <Row label="Phone" value={brand.phone} />
        <Row label="Instagram" value={brand.instagram} />
        <Row label="Country" value={brand.origin} />
        <Row label="Payment" value="Cash on delivery" />
        <Row label="Out-of-stock lead time" value={MADE_TO_ORDER_LEAD} />
      </Section>

      <Section title="Demo data" desc="In this demo, everything you change is saved in this browser only. Other people and devices still see the original demo catalogue.">
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone">Storage used</span>
          <span className="tabular-nums">{usedKb} KB of ~5,000 KB</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-linen">
          <div className="h-full rounded-full bg-ink" style={{ width: `${Math.min(100, usedKb / 50)}%` }} />
        </div>
        <p className="text-xs text-stone">Uploaded photos take the most space. If it fills up, remove a few images or use image links instead.</p>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => {
              const blob = new Blob([exportDemoData()], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `roze-deco-data-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(a.href);
            }}
            className="flex items-center gap-2 rounded-md border border-sand px-4 py-2 text-sm hover:border-ink"
          >
            <Download className="size-4" /> Export data (JSON)
          </button>
          {confirmReset ? (
            <>
              <button
                onClick={() => {
                  resetDemoData();
                  setConfirmReset(false);
                  setDone("Demo data reset to the original catalogue.");
                }}
                className="rounded-md bg-danger px-4 py-2 text-sm text-white"
              >
                Yes, reset everything
              </button>
              <button onClick={() => setConfirmReset(false)} className="rounded-md border border-sand px-4 py-2 text-sm">Cancel</button>
            </>
          ) : (
            <button onClick={() => setConfirmReset(true)} className="flex items-center gap-2 rounded-md border border-danger/40 px-4 py-2 text-sm text-danger hover:bg-danger/5">
              <RotateCcw className="size-4" /> Reset demo data
            </button>
          )}
        </div>
        {done && <p className="text-sm text-success">{done}</p>}
        <p className="text-xs text-stone">The export contains all products, orders and messages — useful for moving to the real backend later.</p>
      </Section>
    </>
  );
}
