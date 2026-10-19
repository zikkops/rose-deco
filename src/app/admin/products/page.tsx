import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminShell";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { products } from "@/lib/data";

export const metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products across 6 categories`}
        actions={
          <>
            <button className="flex items-center gap-2 rounded-md border border-sand bg-white px-4 py-2 text-sm hover:border-ink">
              <Download className="size-4" /> Export
            </button>
            <Link href="/admin/products/new" className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-ivory hover:bg-accent-dark">
              <Plus className="size-4" /> Add product
            </Link>
          </>
        }
      />
      <ProductsTable />
    </>
  );
}
