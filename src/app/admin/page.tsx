import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminShell";
import { CategoryBars, RevenueChart } from "@/components/admin/Charts";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { kpis, messages, monthlyRevenue, orders, salesByCategory, stockOf } from "@/lib/admin-data";
import { featuredProducts, formatPrice, products } from "@/lib/data";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const lowStock = products.filter((p) => p.inStock && stockOf(p.slug) <= 5).slice(0, 4);

  return (
    <>
      <PageHeader
        title="Good morning"
        subtitle="Here's what's happening at Roze Déco today."
        actions={
          <Link href="/admin/products/new" className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-ivory hover:bg-accent-dark">
            <Plus className="size-4" /> Add product
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card-admin p-4 sm:p-5">
            <p className="text-xs text-stone">{k.label}</p>
            <p className="mt-2 font-serif text-2xl tabular-nums sm:text-3xl">{k.value}</p>
            <p className={`mt-2 flex items-center gap-1 text-xs ${k.up ? "text-success" : "text-danger"}`}>
              {k.up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {k.delta}
              <span className="hidden text-stone sm:inline">vs last month</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="card-admin p-5 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-medium">Monthly revenue</h2>
              <p className="text-xs text-stone">Last 12 months · USD</p>
            </div>
            <select className="input-admin w-auto py-1.5 text-xs" defaultValue="12m" aria-label="Range">
              <option value="12m">Last 12 months</option>
              <option value="6m">Last 6 months</option>
              <option value="ytd">Year to date</option>
            </select>
          </div>
          <RevenueChart data={monthlyRevenue} />
        </div>
        <div className="card-admin p-5">
          <h2 className="font-medium">Sales by category</h2>
          <p className="mb-6 text-xs text-stone">Year to date</p>
          <CategoryBars data={salesByCategory} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="card-admin overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between p-5">
            <h2 className="font-medium">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-accent hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="bg-linen/50 text-left text-xs text-stone">
                <tr>
                  <th className="px-5 py-2.5 font-normal">Order</th>
                  <th className="px-5 py-2.5 font-normal">Customer</th>
                  <th className="px-5 py-2.5 font-normal">Status</th>
                  <th className="px-5 py-2.5 text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/50">
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="hover:bg-linen/30">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-accent">{o.id}</Link>
                      <p className="text-xs text-stone">{o.date}</p>
                    </td>
                    <td className="px-5 py-3">{o.customer}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-right tabular-nums">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="card-admin p-5">
            <h2 className="mb-4 font-medium">Top sellers</h2>
            <ul className="space-y-3">
              {featuredProducts().slice(0, 4).map((p, i) => (
                <li key={p.slug} className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-linen">
                    <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{p.name}</p>
                    <p className="text-xs text-stone">{48 - i * 9} sold this month</p>
                  </div>
                  <p className="text-sm tabular-nums">{formatPrice(p.price)}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-admin p-5">
            <h2 className="mb-4 font-medium">Low stock</h2>
            <ul className="space-y-2.5 text-sm">
              {lowStock.map((p) => (
                <li key={p.slug} className="flex justify-between">
                  <Link href={`/admin/products/${p.slug}`} className="hover:text-accent">{p.name}</Link>
                  <span className="text-xs text-warning">{stockOf(p.slug)} left</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-admin p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-medium">New messages</h2>
              <Link href="/admin/messages" className="text-xs text-accent hover:underline">Inbox</Link>
            </div>
            {messages.filter((m) => m.unread).map((m) => (
              <div key={m.id} className="border-t border-sand/50 py-2.5 first:border-0">
                <p className="text-sm">{m.name} <span className="text-xs text-stone">· {m.topic}</span></p>
                <p className="truncate text-xs text-stone">{m.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
