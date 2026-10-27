"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react";
import { logout, useAdmin, useMessages, useOrders } from "@/lib/store";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, badge: "orders" as const },
  { href: "/admin/messages", label: "Messages", icon: Mail, badge: "messages" as const },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const unread = useMessages().filter((m) => !m.read).length;
  const newOrders = useOrders().filter((o) => o.status === "New").length;
  const badges = { orders: newOrders, messages: unread };
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  // Admin login gate
  const router = useRouter();
  const admin = useAdmin();
  const isLogin = pathname === "/admin/login";
  const signedIn = admin.status === "signed-in";
  useEffect(() => {
    if (admin.status !== "loading" && !signedIn && !isLogin) router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [admin.status, signedIn, isLogin, pathname, router]);

  if (isLogin) return <>{children}</>;
  if (!signedIn) return <div className="min-h-screen bg-[#fafafa]" aria-busy="true" />;

  const sidebar = (
    <div className="flex h-full flex-col bg-ink text-ivory/70">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/admin" aria-label="Roze Déco admin">
          <Logo variant="white" height={34} />
        </Link>
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>
      <p className="px-6 pt-4 pb-2 text-[10px] tracking-[0.25em] text-ivory/40 uppercase">Back office</p>
      <nav className="flex-1 space-y-0.5 px-3">
        {links.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
              isActive(href) ? "bg-ivory/10 text-ivory" : "hover:bg-ivory/5 hover:text-ivory"
            }`}
          >
            <Icon className="size-4" strokeWidth={1.6} />
            {label}
            {badge && badges[badge] ? (
              <span className="ml-auto rounded-full bg-white px-1.5 text-[10px] leading-4 text-ink">{badges[badge]}</span>
            ) : null}
          </Link>
        ))}
      </nav>
      <div className="m-3 rounded-lg border border-ivory/10 p-4 text-xs">
        <p className="text-ivory">Live data</p>
        <p className="mt-1 leading-relaxed text-ivory/50">
          Changes are saved to the database and appear on the website for everyone right away.
        </p>
      </div>
      <Link href="/" className="flex items-center gap-2 border-t border-ivory/10 px-6 py-4 text-xs hover:text-ivory">
        <ExternalLink className="size-3.5" /> View storefront
      </Link>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <aside className="fixed inset-y-0 left-0 hidden w-60 lg:block">{sidebar}</aside>
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <div className={`absolute inset-y-0 left-0 w-64 transition-transform ${open ? "" : "-translate-x-full"}`}>{sidebar}</div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-sand/70 bg-white/90 px-4 backdrop-blur sm:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <Link href="/admin" aria-label="Roze Déco admin" className="lg:hidden">
            <Logo height={30} />
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent-light font-serif text-sm text-accent-dark uppercase">{admin.email?.[0] ?? "R"}</span>
              <div className="hidden text-xs sm:block">
                <p className="font-medium">Roze Déco</p>
                <p className="text-stone">{admin.email}</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await logout();
                router.replace("/admin/login");
              }}
              className="flex items-center gap-1.5 rounded-md border border-sand px-3 py-1.5 text-xs text-taupe hover:border-ink hover:text-ink"
            >
              <LogOut className="size-3.5" /> <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="font-serif text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-stone">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
