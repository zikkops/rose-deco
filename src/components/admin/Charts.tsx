"use client";

import { useState } from "react";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const usdShort = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);

/** Single-series vertical bar chart with hover tooltip. */
export function RevenueChart({ data }: { data: { month: string; value: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = 300000;
  const ticks = [0, 100000, 200000, 300000];
  const H = 220;

  return (
    <div className="relative">
      <div className="flex">
        {/* y axis */}
        <div className="relative mr-3 w-10 shrink-0" style={{ height: H }}>
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-0 -translate-y-1/2 text-[11px] text-stone tabular-nums"
              style={{ top: H - (t / max) * H }}
            >
              {usdShort(t)}
            </span>
          ))}
        </div>
        <div className="relative flex-1" style={{ height: H }}>
          {ticks.map((t) => (
            <div
              key={t}
              className={`absolute inset-x-0 border-t ${t === 0 ? "border-sand" : "border-dashed border-sand/60"}`}
              style={{ top: H - (t / max) * H }}
            />
          ))}
          <div className="absolute inset-0 flex items-end gap-[2px]">
            {data.map((d, i) => {
              const last = i === data.length - 1;
              return (
                <div
                  key={d.month}
                  className="relative flex h-full flex-1 items-end justify-center"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div
                    className={`w-full max-w-7 rounded-t-[4px] transition-colors ${
                      hover === i ? "bg-accent-dark" : last ? "bg-accent/45" : "bg-accent"
                    }`}
                    style={{ height: (d.value / max) * H }}
                  />
                  {hover === i && (
                    <div
                      className="pointer-events-none absolute z-10 -translate-y-full rounded-md bg-ink px-2.5 py-1.5 text-xs whitespace-nowrap text-ivory shadow-lg"
                      style={{ bottom: (d.value / max) * H + 8 }}
                    >
                      <p className="text-ivory/60">{d.month} {last ? "(month to date)" : ""}</p>
                      <p className="font-medium tabular-nums">{usd(d.value)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-2 ml-[52px] flex gap-[2px]">
        {data.map((d, i) => (
          <span key={d.month} className={`flex-1 text-center text-[11px] text-stone ${i % 2 ? "max-sm:invisible" : ""}`}>
            {d.month}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Single-hue horizontal bars for a ranked magnitude comparison. */
export function CategoryBars({ data }: { data: { name: string; value: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <ul className="space-y-4">
      {data.map((d, i) => (
        <li key={d.name} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="text-ink">{d.name}</span>
            <span className="text-taupe tabular-nums">
              {hover === i ? `${((d.value / total) * 100).toFixed(1)}% of sales` : usd(d.value)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-linen">
            <div
              className={`h-full rounded-full transition-colors ${hover === i ? "bg-accent-dark" : "bg-accent"}`}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
