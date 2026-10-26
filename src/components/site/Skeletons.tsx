export function GridSkeleton() {
  return (
    <div className="container-lux animate-pulse py-12">
      <div className="h-[30vh] bg-linen" />
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] bg-linen" />
            <div className="mt-4 h-4 w-2/3 bg-linen" />
            <div className="mt-2 h-3 w-1/3 bg-linen" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="container-lux grid animate-pulse gap-10 py-12 lg:grid-cols-12 lg:gap-16">
      <div className="aspect-[4/5] bg-linen lg:col-span-7" />
      <div className="space-y-4 lg:col-span-5">
        <div className="h-3 w-24 bg-linen" />
        <div className="h-10 w-3/4 bg-linen" />
        <div className="h-6 w-28 bg-linen" />
        <div className="h-24 bg-linen" />
        <div className="h-12 bg-linen" />
      </div>
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-9 w-64 rounded bg-linen" />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="h-96 rounded-xl bg-linen xl:col-span-2" />
        <div className="h-96 rounded-xl bg-linen" />
      </div>
    </div>
  );
}

export function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid animate-pulse grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[4/5] bg-linen" />
          <div className="mt-4 h-4 w-2/3 bg-linen" />
          <div className="mt-2 h-3 w-1/3 bg-linen" />
        </div>
      ))}
    </div>
  );
}
