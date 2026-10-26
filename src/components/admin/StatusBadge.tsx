import type { OrderStatus } from "@/lib/store";

const styles: Record<OrderStatus, string> = {
  New: "bg-amber-50 text-amber-800 ring-amber-200",
  Confirmed: "bg-sky-50 text-sky-800 ring-sky-200",
  Preparing: "bg-violet-50 text-violet-800 ring-violet-200",
  Shipped: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  Delivered: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Cancelled: "bg-stone-100 text-stone-600 ring-stone-200",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap ring-1 ring-inset ${styles[status]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/** Admin-side stock pill: same wording as the storefront tag. */
export function StockPill({ ready }: { ready: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap ring-1 ring-inset ${
        ready ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-amber-50 text-amber-800 ring-amber-200"
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {ready ? "Ready now" : "Out of stock"}
    </span>
  );
}
