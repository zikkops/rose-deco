import { Download } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminShell";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Track, fulfil and manage client orders"
        actions={
          <button className="flex items-center gap-2 rounded-md border border-sand bg-white px-4 py-2 text-sm hover:border-ink">
            <Download className="size-4" /> Export CSV
          </button>
        }
      />
      <OrdersTable />
    </>
  );
}
