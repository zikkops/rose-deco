"use client";

import { Download } from "lucide-react";
import { PageHeader } from "./AdminShell";
import { MoveImagesToImageKit } from "./MoveImagesToImageKit";
import { brand } from "@/lib/brand";
import { MADE_TO_ORDER_LEAD } from "@/lib/catalog";
import { imageUploadReady } from "@/lib/image";
import { exportData, useOrders, useProductsState } from "@/lib/store";

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
  const { items: products, loaded } = useProductsState();
  const orders = useOrders();

  return (
    <>
      <PageHeader title="Settings" subtitle="Store information and data" />

      <Section title="Store details" desc="Shown on the website. Ask your developer to change these for now.">
        <Row label="Store name" value={brand.name} />
        <Row label="Email" value={brand.email} />
        <Row label="Phone" value={brand.phone} />
        <Row label="Instagram" value={brand.instagram} />
        <Row label="Country" value={brand.origin} />
        <Row label="Payment" value="Cash on delivery" />
        <Row label="Out-of-stock lead time" value={MADE_TO_ORDER_LEAD} />
      </Section>

      <Section title="Connections" desc="Where the website's data and images live.">
        <Row label="Database" value="Firebase Firestore (rose-deco)" />
        <Row label="Admin login" value="Firebase Authentication" />
        <Row label="Image hosting" value={imageUploadReady() ? "ImageKit — connected" : "ImageKit — not connected yet"} />
        <Row label="Products in database" value={loaded ? String(products.length) : "…"} />
        <Row label="Orders in database" value={String(orders.length)} />
      </Section>

      <Section title="Images" desc="Copy product photos that are linked from other websites into your ImageKit account, so all images live in one place.">
        <MoveImagesToImageKit />
      </Section>

      <Section title="Backup" desc="Download a copy of all products, orders and messages.">
        <button
          onClick={() => {
            const blob = new Blob([exportData()], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `roze-deco-backup-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(a.href);
          }}
          className="flex items-center gap-2 rounded-md border border-sand px-4 py-2 text-sm hover:border-ink"
        >
          <Download className="size-4" /> Download backup (JSON)
        </button>
      </Section>
    </>
  );
}
