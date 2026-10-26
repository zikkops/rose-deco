import { Suspense } from "react";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const metadata = { title: "Edit product" };

// ?id=<productId> edits a product; no id creates a new one.
export default function EditProductPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-linen" />}>
      <ProductEditor />
    </Suspense>
  );
}
