"use client";

// DATA LAYER — Firestore (products, orders, messages) + Firebase Auth (admin).
// The shopping bag stays in each visitor's browser (localStorage).

import { useMemo, useSyncExternalStore } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, isAdminEmail } from "./firebase";
import type { Product } from "./catalog";
import { deleteHostedImages } from "./image";

type Listener = () => void;

export const uid = () => Math.random().toString(36).slice(2, 10);

// ——— Types

export type OrderStatus = "New" | "Confirmed" | "Preparing" | "Shipped" | "Delivered" | "Cancelled";
export const orderStatuses: OrderStatus[] = ["New", "Confirmed", "Preparing", "Shipped", "Delivered", "Cancelled"];

export type OrderItem = {
  productId: string;
  colorId: string;
  name: string;
  colorName: string;
  colorHex: string;
  price: number;
  qty: number;
  image: string;
  /** false = was out of stock when ordered, needs ~2 weeks */
  readyNow: boolean;
};

export type Customer = { name: string; phone: string; email: string; city: string; address: string; notes: string };

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  payment: string;
  /** stock has been deducted for this order (happens when the shop confirms it) */
  stockApplied: boolean;
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

// ——— Small external-store helper

function createState<T>(initial: T, server: T) {
  let value = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => value,
    set: (next: T) => {
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe: (l: Listener) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    server: () => server,
  };
}

// ——— Auth (admin)

type AdminState = { status: "loading" | "signed-out" | "signed-in" | "not-admin"; email: string | null };
const adminState = createState<AdminState>({ status: "loading", email: null }, { status: "loading", email: null });
const authWatchers = new Set<(u: User | null) => void>();
let authStarted = false;

function startAuth() {
  if (authStarted || typeof window === "undefined") return;
  authStarted = true;
  onAuthStateChanged(auth, (u) => {
    adminState.set(
      !u ? { status: "signed-out", email: null } : { status: isAdminEmail(u.email) ? "signed-in" : "not-admin", email: u.email },
    );
    authWatchers.forEach((w) => w(u));
  });
}

export const useAdmin = () => {
  startAuth();
  return useSyncExternalStore(adminState.subscribe, adminState.get, adminState.server);
};

export async function login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  if (!isAdminEmail(cred.user.email)) {
    await signOut(auth);
    throw new Error("This account doesn't have admin access.");
  }
}

export const logout = () => signOut(auth);

// ——— Live Firestore collections

type CollectionState<T> = { items: T[]; loaded: boolean; error: string | null };

function liveCollection<T extends { id: string }>(name: string, sortField: string, adminOnly: boolean) {
  const EMPTY: CollectionState<T> = { items: [], loaded: false, error: null };
  const state = createState<CollectionState<T>>(EMPTY, EMPTY);
  let stop: (() => void) | null = null;
  let users = 0;
  let allowed = !adminOnly; // admin collections are only readable by a signed-in admin

  const start = () => {
    if (stop || users === 0 || !allowed) return;
    stop = onSnapshot(
      query(collection(db, name), orderBy(sortField, "desc")),
      (snap) => state.set({ items: snap.docs.map((d) => ({ ...(d.data() as T), id: d.id })), loaded: true, error: null }),
      (err) => {
        console.error(`[firestore:${name}]`, err);
        stop = null;
        state.set({ items: [], loaded: true, error: err.message });
      },
    );
  };
  const halt = () => {
    stop?.();
    stop = null;
  };

  if (adminOnly) {
    authWatchers.add((u) => {
      allowed = !!u && isAdminEmail(u.email);
      if (allowed) start();
      else {
        halt();
        state.set(EMPTY);
      }
    });
  }

  const subscribe = (l: Listener) => {
    const off = state.subscribe(l);
    users++;
    if (adminOnly) startAuth();
    start();
    return () => {
      off();
      if (--users === 0) halt();
    };
  };

  return { get: state.get, use: () => useSyncExternalStore(subscribe, state.get, state.server) };
}

const productsCol = liveCollection<Product>("products", "createdAt", false);
const ordersCol = liveCollection<Order>("orders", "createdAt", true);
const messagesCol = liveCollection<Message>("messages", "createdAt", true);

// ——— Products

/** { items, loaded, error } — use `loaded` to show skeletons instead of "empty". */
export const useProductsState = () => productsCol.use();
export const useProducts = () => productsCol.use().items;
export const useActiveProducts = () => {
  const all = useProducts();
  return useMemo(() => all.filter((p) => p.active), [all]);
};
export const useProduct = (idOrSlug: string) => useProducts().find((p) => p.id === idOrSlug || p.slug === idOrSlug);

export const saveProduct = (product: Product) => setDoc(doc(db, "products", product.id), product);
/** Images in `urls` that no product other than `productId` uses. */
const unusedImages = (urls: string[], productId: string) =>
  urls.filter((u) => !productsCol.get().items.some((p) => p.id !== productId && p.images.includes(u)));

/** Admin: delete images from the image host unless another product still uses them. */
export const releaseImages = (urls: string[], productId: string) => deleteHostedImages(unusedImages(urls, productId));

/** Admin: delete the product, then its images on ImageKit (if no other product uses them). */
export async function deleteProduct(id: string) {
  const images = productsCol.get().items.find((p) => p.id === id)?.images ?? [];
  await deleteDoc(doc(db, "products", id));
  await releaseImages(images, id);
}
export const setProductActive = (id: string, active: boolean) => updateDoc(doc(db, "products", id), { active });

export const setColorQuantity = (productId: string, colorId: string, quantity: number) => {
  const p = productsCol.get().items.find((x) => x.id === productId);
  if (!p) return Promise.resolve();
  const q = Math.max(0, Math.floor(quantity) || 0);
  return updateDoc(doc(db, "products", productId), {
    colors: p.colors.map((c) => (c.id === colorId ? { ...c, quantity: q } : c)),
  });
};


// ——— Cart (per visitor, localStorage)

const CART_KEY = "rd:v1:cart";
let cartCache: { raw: string | null; value: CartLine[] } | null = null;
const cartListeners = new Set<Listener>();
const NO_LINES: CartLine[] = [];

const readCart = (): CartLine[] => {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(CART_KEY);
  } catch {}
  if (cartCache && cartCache.raw === raw) return cartCache.value;
  let value: CartLine[] = NO_LINES;
  try {
    value = raw ? (JSON.parse(raw) as CartLine[]) : NO_LINES;
  } catch {}
  cartCache = { raw, value };
  return value;
};
const writeCart = (lines: CartLine[]) => {
  const raw = JSON.stringify(lines);
  try {
    localStorage.setItem(CART_KEY, raw);
  } catch {}
  cartCache = { raw, value: lines };
  cartListeners.forEach((l) => l());
};
const subscribeCart = (l: Listener) => {
  cartListeners.add(l);
  const onStorage = (e: StorageEvent) => e.key === CART_KEY && l();
  window.addEventListener("storage", onStorage);
  return () => {
    cartListeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
};

export const useCart = () => useSyncExternalStore(subscribeCart, readCart, () => NO_LINES);

export const addToCart = (productId: string, colorId: string, qty = 1) => {
  const lines = readCart();
  const i = lines.findIndex((l) => l.productId === productId && l.colorId === colorId);
  writeCart(i === -1 ? [...lines, { productId, colorId, qty }] : lines.map((l, j) => (j === i ? { ...l, qty: l.qty + qty } : l)));
};

export const setCartQty = (productId: string, colorId: string, qty: number) => {
  const lines = readCart();
  writeCart(
    qty <= 0
      ? lines.filter((l) => !(l.productId === productId && l.colorId === colorId))
      : lines.map((l) => (l.productId === productId && l.colorId === colorId ? { ...l, qty } : l)),
  );
};

export const clearCart = () => writeCart([]);

const cartOpenState = createState(false, false);
export const setCartOpen = (v: boolean) => cartOpenState.set(v);
export const useCartOpen = () => useSyncExternalStore(cartOpenState.subscribe, cartOpenState.get, cartOpenState.server);

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

export const useOrders = () => ordersCol.use().items;

/** Customer checkout: creates the order. Stock is deducted when the shop confirms it. */
export async function placeOrder(customer: Customer): Promise<Order> {
  const products = productsCol.get().items;
  const items: OrderItem[] = readCart().flatMap((l) => {
    const p = products.find((x) => x.id === l.productId);
    const col = p?.colors.find((x) => x.id === l.colorId);
    if (!p || !col) return [];
    return [{
      productId: p.id, colorId: col.id, name: p.name, colorName: col.name, colorHex: col.hex,
      price: p.price, qty: l.qty, image: p.images[0] ?? "", readyNow: col.quantity >= l.qty,
    }];
  });
  if (items.length === 0) throw new Error("Your bag is empty.");

  const now = new Date();
  const order: Omit<Order, "id"> = {
    number: `RD-${now.getFullYear().toString().slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}-${uid().slice(0, 4).toUpperCase()}`,
    createdAt: now.toISOString(),
    customer,
    items,
    total: items.reduce((s, i) => s + i.price * i.qty, 0),
    status: "New",
    payment: "Cash on delivery",
    stockApplied: false,
  };
  const ref = await addDoc(collection(db, "orders"), order);
  clearCart();
  return { ...order, id: ref.id };
}

/**
 * Admin: change status. The first move out of "New" (except to Cancelled) deducts
 * stock; cancelling an order whose stock was deducted puts it back.
 */
export async function updateOrderStatus(id: string, status: OrderStatus) {
  await runTransaction(db, async (tx) => {
    const orderRef = doc(db, "orders", id);
    const snap = await tx.get(orderRef);
    if (!snap.exists()) return;
    const order = snap.data() as Order;
    const deduct = !order.stockApplied && status !== "New" && status !== "Cancelled";
    const restore = order.stockApplied && status === "Cancelled";

    if (deduct || restore) {
      const ids = [...new Set(order.items.map((i) => i.productId))];
      const docs = await Promise.all(ids.map((pid) => tx.get(doc(db, "products", pid))));
      docs.forEach((d) => {
        if (!d.exists()) return;
        const p = d.data() as Product;
        const colors = p.colors.map((c) => {
          const used = order.items.filter((i) => i.productId === d.id && i.colorId === c.id).reduce((s, i) => s + i.qty, 0);
          return used ? { ...c, quantity: Math.max(0, c.quantity + (deduct ? -used : used)) } : c;
        });
        tx.update(d.ref, { colors });
      });
    }
    tx.update(orderRef, { status, stockApplied: deduct ? true : restore ? false : order.stockApplied });
  });
}

export const deleteOrder = (id: string) => deleteDoc(doc(db, "orders", id));

// ——— Messages

export const useMessages = () => messagesCol.use().items;

export const addMessage = (m: Omit<Message, "id" | "createdAt" | "read">) =>
  addDoc(collection(db, "messages"), { ...m, createdAt: new Date().toISOString(), read: false });

export const markMessageRead = (id: string) => updateDoc(doc(db, "messages", id), { read: true });
export const deleteMessage = (id: string) => deleteDoc(doc(db, "messages", id));

// ——— Utilities

export const exportData = () =>
  JSON.stringify(
    { products: productsCol.get().items, orders: ordersCol.get().items, messages: messagesCol.get().items, exportedAt: new Date().toISOString() },
    null,
    2,
  );

/** false during server render / hydration, true once running in the browser. */
export const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
