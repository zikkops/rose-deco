"use client";

import { Minus, Plus } from "lucide-react";

export function QtyStepper({ value, onChange, label }: { value: number; onChange: (v: number) => void; label?: string }) {
  const set = (v: number) => onChange(Math.max(0, Math.floor(v) || 0));
  return (
    <div className="inline-flex items-center rounded-md border border-sand bg-white">
      <button type="button" onClick={() => set(value - 1)} className="px-2 py-1.5 text-stone hover:text-ink" aria-label={`Decrease ${label ?? "quantity"}`}>
        <Minus className="size-3.5" />
      </button>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        aria-label={label ?? "Quantity"}
        className="w-12 [appearance:textfield] bg-transparent text-center text-sm tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" onClick={() => set(value + 1)} className="px-2 py-1.5 text-stone hover:text-ink" aria-label={`Increase ${label ?? "quantity"}`}>
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
