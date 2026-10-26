"use client";

// DEMO DATA LAYER — everything is saved in this browser's localStorage.
// When the client approves, swap these functions for real API calls
// (same shapes), and move image uploads to proper storage.

import { useMemo, useSyncExternalStore } from "react";
import { seedProducts, type Product } from "./catalog";

// ——— Generic localStorage-backed store

type Listener = () => void;

export class StorageFullError extends Error {
  constructor() {
    super("Browser storage is full. Remove some images or use smaller ones.");
  }
}

function createStore<T>(key: string, seed: T) {
  let cache: { raw: string | null; value: T } | null = null;
  const listeners = new Set<Listener>();

  const read = (): T => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      // storage unavailable (private mode etc.) — fall back to seed
    }
    if (cache && cache.raw === raw) return cache.value;
    let value = seed;
    if (raw) {
      try {
        value = JSON.parse(raw) as T;
      } catch {
        value = seed;
      }
    }
    cache = { raw, value };
    return value;
  };

  const emit = () => listeners.forEach((l) => l());

  const write = (next: T) => {
    const raw = JSON.stringify(next);
    try {
      localStorage.setItem(key, raw);
    } catch (e) {
      if (e instanceof DOMException && e.name === "QuotaExceededError") throw new StorageFullError();
      throw e;
    }
    cache = { raw, value: next };
    emit();
  };

  const subscribe = (l: Listener) => {
    listeners.add(l);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key || e.key === null) l();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", onStorage);
    };
  };

  return {
    read,
    write,
    update: (fn: (v: T) => T) => write(fn(read())),
    reset: () => {
      try {
        localStorage.removeItem(key);
      } catch {}
      cache = null;
      emit();
    },
    // Server render + hydration use the seed; the client then switches to saved data.
    use: () => useSyncExternalStore(subscribe, read, () => seed),
  };
}

export const uid = () => Math.random().toString(36).slice(2, 10);

// ——— Types

export type OrderStatus = "New" | "Confirmed" | "Preparing" | "Shipped" | "Delivered" | "Cancelled";
export const orderStatuses: OrderStatus[] = ["New", "Confirmed", "Preparing", "Shipped", "Delivered", "Cancelled"];

export type OrderItem = {
  productId: string;
  name: string;
  colorName: string;
  colorHex: string;
  price: number;
  qty: number;
  image: string;
  /** false = was out of stock when ordered, needs ~2 weeks */
  readyNow: boolean;
};

export type Customer = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
};

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  payment: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type CartLine = { productId: string; colorId: string; qty: number };

// ——— Seed back-office data so the admin isn't empty on first open

const seedItem = (slug: string, colorIndex: number, qty: number, readyNow = true): OrderItem => {
  const p = seedProducts.find((x) => x.slug === slug)!;
  const col = p.colors[colorIndex];
  return { productId: p.id, name: p.name, colorName: col.name, colorHex: col.hex, price: p.price, qty, image: p.images[0], readyNow };
};

const mkOrder = (n: number, date: string, customer: Partial<Customer> & { name: string; city: string }, items: OrderItem[], status: OrderStatus): Order => ({
  id: `seed-${n}`,
  number: `RD-${n}`,
  createdAt: date,
  customer: { phone: "+961 70 000 000", email: "", address: "—", notes: "", ...customer },
  items,
  total: items.reduce((s, i) => s + i.price * i.qty, 0),
  status,
  payment: "Cash on delivery",
});

const seedOrders: Order[] = [
  mkOrder(1004, "2026-10-24T10:15:00Z", { name: "Maya K.", city: "Beirut" }, [seedItem("tawleh-backgammon", 0, 1), seedItem("soleil-cushion", 0, 2)], "New"),
  mkOrder(1003, "2026-10-22T15:40:00Z", { name: "Karim S.", city: "Jounieh" }, [seedItem("velours-cube-pouf", 0, 1, false)], "Preparing"),
  mkOrder(1002, "2026-10-19T09:05:00Z", { name: "Nour H.", city: "Batroun" }, [seedItem("nido-nesting-tables", 0, 1), seedItem("dune-ceramic-vase", 0, 1)], "Shipped"),
  mkOrder(1001, "2026-10-15T18:20:00Z", { name: "Lea M.", city: "Beirut" }, [seedItem("or-hammered-vases", 0, 1)], "Delivered"),
];

const seedMessages: Message[] = [
  { id: "seed-m2", name: "Rita A.", email: "rita@example.com", phone: "", topic: "Custom request", message: "Hi! Is the Cubo side table available in a dusty pink? I'd need two of them.", createdAt: "2026-10-25T11:30:00Z", read: false },
  { id: "seed-m1", name: "Joe B.", email: "joe@example.com", phone: "+961 3 000 000", topic: "Order & delivery", message: "Do you deliver to Tripoli and how long would it take?", createdAt: "2026-10-23T08:10:00Z", read: true },
];

// ——— Stores

const productsStore = createStore<Product[]>("rd:v1:products", seedProducts);
const ordersStore = createStore<Order[]>("rd:v1:orders", seedOrders);
const messagesStore = createStore<Message[]>("rd:v1:messages", seedMessages);
const cartStore = createStore<CartLine[]>("rd:v1:cart", []);

// Cart drawer open/closed (in-memory, not persisted)
let cartOpen = false;
const cartOpenListeners = new Set<Listener>();
export const setCartOpen = (v: boolean) => {
  cartOpen = v;
  cartOpenListeners.forEach((l) => l());
};
export const useCartOpen = () =>
  useSyncExternalStore(
    (l) => {
      cartOpenListeners.add(l);
      return () => cartOpenListeners.delete(l);
    },
    () => cartOpen,
    () => false,
  );

// ——— Products

export const useProducts = () => productsStore.use();
/** Products visible on the storefront. */
export const useActiveProducts = () => {
  const all = useProducts();
  return useMemo(() => all.filter((p) => p.active), [all]);
};
export const useProduct = (idOrSlug: string) => {
  const all = useProducts();
  return all.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
};

export const saveProduct = (product: Product) =>
  productsStore.update((list) => {
    const i = list.findIndex((p) => p.id === product.id);
    if (i === -1) return [product, ...list];
    const next = [...list];
    next[i] = product;
    return next;
  });

export const deleteProduct = (id: string) => productsStore.update((list) => list.filter((p) => p.id !== id));

export const setColorQuantity = (productId: string, colorId: string, quantity: number) =>
  productsStore.update((list) =>
    list.map((p) =>
      p.id !== productId
        ? p
        : { ...p, colors: p.colors.map((c) => (c.id === colorId ? { ...c, quantity: Math.max(0, Math.floor(quantity) || 0) } : c)) },
    ),
  );

export const setProductActive = (productId: string, active: boolean) =>
  productsStore.update((list) => list.map((p) => (p.id === productId ? { ...p, active } : p)));

// ——— Cart

export const useCart = () => cartStore.use();

export const addToCart = (productId: string, colorId: string, qty = 1) =>
  cartStore.update((lines) => {
    const i = lines.findIndex((l) => l.productId === productId && l.colorId === colorId);
    if (i === -1) return [...lines, { productId, colorId, qty }];
    const next = [...lines];
    next[i] = { ...next[i], qty: next[i].qty + qty };
    return next;
  });

export const setCartQty = (productId: string, colorId: string, qty: number) =>
  cartStore.update((lines) =>
    qty <= 0
      ? lines.filter((l) => !(l.productId === productId && l.colorId === colorId))
      : lines.map((l) => (l.productId === productId && l.colorId === colorId ? { ...l, qty } : l)),
  );

export const clearCart = () => cartStore.write([]);

/** Cart lines joined with live product data. */
export const useCartDetails = () => {
  const lines = useCart();
  const products = useProducts();
  return useMemo(() => {
    const items = lines.flatMap((l) => {
      const product = products.find((p) => p.id === l.productId);
      const color = product?.colors.find((c) => c.id === l.colorId);
      if (!product || !color) return [];
      return [{ ...l, product, color, readyNow: color.quantity >= l.qty, lineTotal: product.price * l.qty }];
    });
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.lineTotal, 0),
      hasMadeToOrder: items.some((i) => !i.readyNow),
    };
  }, [lines, products]);
};

// ——— Orders

export const useOrders = () => ordersStore.use();

export const placeOrder = (customer: Customer): Order => {
  const lines = cartStore.read();
  const products = productsStore.read();
  const items: OrderItem[] = [];
  const nextProducts = products.map((p) => ({ ...p, colors: p.colors.map((c) => ({ ...c })) }));

  for (const l of lines) {
    const p = nextProducts.find((x) => x.id === l.productId);
    const col = p?.colors.find((x) => x.id === l.colorId);
    if (!p || !col) continue;
    const readyNow = col.quantity >= l.qty;
    col.quantity = Math.max(0, col.quantity - l.qty); // reserve what's in stock
    items.push({ productId: p.id, name: p.name, colorName: col.name, colorHex: col.hex, price: p.price, qty: l.qty, image: p.images[0] ?? "", readyNow });
  }

  const orders = ordersStore.read();
  const lastNumber = Math.max(1000, ...orders.map((o) => Number(o.number.replace(/\D/g, "")) || 0));
  const order: Order = {
    id: uid(),
    number: `RD-${lastNumber + 1}`,
    createdAt: new Date().toISOString(),
    customer,
    items,
    total: items.reduce((s, i) => s + i.price * i.qty, 0),
    status: "New",
    payment: "Cash on delivery",
  };

  productsStore.write(nextProducts);
  ordersStore.write([order, ...orders]);
  clearCart();
  return order;
};

export const updateOrderStatus = (id: string, status: OrderStatus) =>
  ordersStore.update((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));

export const deleteOrder = (id: string) => ordersStore.update((list) => list.filter((o) => o.id !== id));

// ——— Messages

export const useMessages = () => messagesStore.use();

export const addMessage = (m: Omit<Message, "id" | "createdAt" | "read">) =>
  messagesStore.update((list) => [{ ...m, id: uid(), createdAt: new Date().toISOString(), read: false }, ...list]);

export const markMessageRead = (id: string) =>
  messagesStore.update((list) => list.map((m) => (m.id === id ? { ...m, read: true } : m)));

export const deleteMessage = (id: string) => messagesStore.update((list) => list.filter((m) => m.id !== id));

// ——— Demo utilities

export const resetDemoData = () => {
  productsStore.reset();
  ordersStore.reset();
  messagesStore.reset();
  cartStore.reset();
};

export const exportDemoData = () =>
  JSON.stringify(
    { products: productsStore.read(), orders: ordersStore.read(), messages: messagesStore.read(), exportedAt: new Date().toISOString() },
    null,
    2,
  );

/** Approximate bytes used by the demo in localStorage. */
export const storageUsage = () => {
  let bytes = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (k.startsWith("rd:")) bytes += (k.length + (localStorage.getItem(k)?.length ?? 0)) * 2;
    }
  } catch {}
  return bytes;
};

/** false during server render / hydration, true once running in the browser. */
export const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

// ——— Demo admin login (browser-only check — replace with real auth with the backend)

export const DEMO_LOGIN = { username: "demo", password: "roze2026" };

const sessionStore = createStore<string | null>("rd:v1:session", null);
export const useSession = () => sessionStore.use();

export const login = (username: string, password: string) => {
  if (username.trim().toLowerCase() !== DEMO_LOGIN.username || password !== DEMO_LOGIN.password) return false;
  sessionStore.write(DEMO_LOGIN.username);
  return true;
};

export const logout = () => sessionStore.reset();
