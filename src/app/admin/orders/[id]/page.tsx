import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Mail, MapPin, Printer } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { orders, type OrderStatus } from "@/lib/admin-data";
import { formatPrice, getProduct } from "@/lib/data";

export const metadata = { title: "Order" };

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

const steps: OrderStatus[] = ["Pending", "Processing", "In production", "Shipped", "Delivered"];

export default async function OrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const order = orders.find((o) => o.id === id);
  if (!order) notFound();
  const current = steps.indexOf(order.status);
  const delivery = order.total >= 2500 ? 0 : 150;

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="rounded-md border border-sand bg-white p-2 hover:border-ink" aria-label="Back">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl">{order.id}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-stone">Placed {order.date} · {order.payment}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-md border border-sand bg-white px-4 py-2 text-sm hover:border-ink">
            <Printer className="size-4" /> Invoice
          </button>
          <select className="input-admin w-auto" defaultValue={order.status} aria-label="Update status">
            {[...steps, "Cancelled"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {order.status !== "Cancelled" && (
            <section className="card-admin p-5">
              <h2 className="mb-5 font-medium">Progress</h2>
              <ol className="flex items-start">
                {steps.map((s, i) => (
                  <li key={s} className="relative flex flex-1 flex-col items-center text-center">
                    {i > 0 && (
                      <span className={`absolute top-3.5 right-1/2 h-0.5 w-full ${i <= current ? "bg-accent" : "bg-sand"}`} />
                    )}
                    <span
                      className={`relative z-10 flex size-7 items-center justify-center rounded-full text-xs ${
                        i <= current ? "bg-accent text-white" : "border border-sand bg-white text-stone"
                      }`}
                    >
                      {i < current ? <Check className="size-3.5" /> : i + 1}
                    </span>
                    <span className={`mt-2 text-[11px] ${i <= current ? "text-ink" : "text-stone"}`}>{s}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section className="card-admin">
            <h2 className="p-5 font-medium">Items</h2>
            <ul className="divide-y divide-sand/50 border-t border-sand/50">
              {order.items.map((it) => {
                const p = getProduct(it.slug)!;
                return (
                  <li key={it.slug} className="flex items-center gap-4 p-5">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-linen">
                      <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-stone">Finish: {it.finish}<span className="sm:hidden"> · Qty {it.qty}</span><span className="hidden sm:inline"> · {p.leadTime}</span></p>
                    </div>
                    <p className="hidden text-sm text-taupe sm:block">{it.qty} × {formatPrice(p.price)}</p>
                    <p className="text-right text-sm tabular-nums sm:w-24">{formatPrice(p.price * it.qty)}</p>
                  </li>
                );
              })}
            </ul>
            <dl className="space-y-2 border-t border-sand/50 p-5 text-sm">
              <div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd className="tabular-nums">{formatPrice(order.total)}</dd></div>
              <div className="flex justify-between"><dt className="text-stone">White-glove delivery</dt><dd>{delivery ? formatPrice(delivery) : "Complimentary"}</dd></div>
              <div className="flex justify-between border-t border-sand/50 pt-2 font-medium"><dt>Total</dt><dd className="tabular-nums">{formatPrice(order.total + delivery)}</dd></div>
            </dl>
          </section>

          <section className="card-admin p-5">
            <h2 className="mb-3 font-medium">Internal notes</h2>
            <textarea rows={3} className="input-admin" placeholder="Add a note for the team…" />
            <button className="mt-3 rounded-md bg-ink px-4 py-2 text-sm text-ivory hover:bg-accent-dark">Add note</button>
          </section>
        </div>

        <div className="space-y-4">
          <section className="card-admin p-5">
            <h2 className="mb-4 font-medium">Customer</h2>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent-light font-serif text-accent-dark">
                {order.customer.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
              <div>
                <p className="text-sm font-medium">{order.customer}</p>
                <p className="text-xs text-stone">Client since 2024</p>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-taupe"><Mail className="size-4" /> {order.email}</p>
          </section>
          <section className="card-admin p-5">
            <h2 className="mb-3 font-medium">Delivery address</h2>
            <p className="flex gap-2 text-sm leading-relaxed text-taupe">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{order.customer}<br />12 Example Street, Apt 4<br />{order.city}</span>
            </p>
          </section>
          <section className="card-admin p-5">
            <h2 className="mb-3 font-medium">Activity</h2>
            <ul className="space-y-3 text-xs">
              <li><p className="text-ink">Order placed</p><p className="text-stone">{order.date} · 10:42</p></li>
              <li><p className="text-ink">Payment {order.payment === "Deposit" ? "deposit (50%) received" : order.payment.toLowerCase()}</p><p className="text-stone">{order.date} · 10:43</p></li>
              <li><p className="text-ink">Confirmation email sent</p><p className="text-stone">{order.date} · 10:43</p></li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
