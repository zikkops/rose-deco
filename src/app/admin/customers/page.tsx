import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminShell";
import { customers } from "@/lib/admin-data";
import { formatPrice } from "@/lib/data";

export const metadata = { title: "Customers" };

const tierStyle = {
  Client: "bg-stone-100 text-stone-700",
  VIP: "bg-accent-light text-accent-dark",
  Trade: "bg-amber-50 text-amber-800",
};

export default function CustomersPage() {
  const total = customers.reduce((s, c) => s + c.spent, 0);
  return (
    <>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customers · ${formatPrice(total)} lifetime value`}
        actions={
          <button className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-ivory hover:bg-accent-dark">
            <UserPlus className="size-4" /> Add customer
          </button>
        }
      />
      <div className="mb-4 grid grid-cols-3 gap-3 sm:gap-4">
        {(["Client", "VIP", "Trade"] as const).map((t) => (
          <div key={t} className="card-admin p-4 sm:p-5">
            <p className="text-xs text-stone">{t} accounts</p>
            <p className="mt-1 font-serif text-3xl">{customers.filter((c) => c.tier === t).length}</p>
          </div>
        ))}
      </div>
      <div className="card-admin overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-linen/50 text-left text-xs text-stone">
            <tr>
              <th className="px-4 py-2.5 font-normal">Customer</th>
              <th className="px-4 py-2.5 font-normal">Location</th>
              <th className="px-4 py-2.5 font-normal">Tier</th>
              <th className="px-4 py-2.5 font-normal">Orders</th>
              <th className="px-4 py-2.5 font-normal">Joined</th>
              <th className="px-4 py-2.5 text-right font-normal">Total spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/50">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-linen/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linen font-serif text-sm text-taupe">
                      {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-stone">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-taupe">{c.city}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs ${tierStyle[c.tier]}`}>{c.tier}</span></td>
                <td className="px-4 py-3 text-taupe">{c.orders}</td>
                <td className="px-4 py-3 text-taupe">{c.joined}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatPrice(c.spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
