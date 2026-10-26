export function StockTag({ ready, className = "" }: { ready: boolean; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.18em] whitespace-nowrap uppercase ${
        ready ? "bg-ivory text-ink" : "bg-ink text-ivory"
      } ${className}`}
    >
      <span className={`size-1.5 rounded-full ${ready ? "bg-success" : "bg-warning"}`} />
      {ready ? "Ready now" : "Out of stock"}
    </span>
  );
}
