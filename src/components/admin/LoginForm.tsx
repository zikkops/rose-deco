"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DEMO_ACCOUNT } from "@/lib/firebase";
import { login, logout, useAdmin } from "@/lib/store";

const friendly = (e: unknown) => {
  const code = (e as { code?: string })?.code ?? "";
  if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found", "auth/invalid-email"].includes(code))
    return "Wrong email or password.";
  if (code === "auth/too-many-requests") return "Too many attempts — please wait a minute and try again.";
  if (code === "auth/network-request-failed") return "No connection — check your internet and try again.";
  return e instanceof Error ? e.message : "Could not log in.";
};

export function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const target = next?.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin";
  const admin = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (admin.status === "signed-in") router.replace(target);
  }, [admin.status, router, target]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 py-12">
      <Logo height={56} priority />
      <div className="card-admin mt-8 w-full max-w-sm p-6 sm:p-8">
        <h1 className="font-serif text-3xl">Admin login</h1>
        <p className="mt-1 text-sm text-stone">Sign in to manage products, stock and orders.</p>

        {admin.status === "not-admin" && (
          <p className="mt-4 rounded-md bg-warning/10 p-3 text-sm">
            {admin.email} isn&apos;t an admin account.{" "}
            <button onClick={() => logout()} className="underline">Sign out</button>
          </p>
        )}

        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              await login(email, password);
            } catch (err) {
              setError(friendly(err));
            } finally {
              setBusy(false);
            }
          }}
        >
          <div>
            <label className="label-admin" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input-admin"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              autoComplete="username"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="label-admin" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={show ? "text" : "password"}
                className="input-admin pr-10"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-stone hover:text-ink"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" disabled={busy} className="w-full rounded-md bg-ink py-2.5 text-sm text-ivory hover:bg-accent-dark disabled:opacity-60">
            {busy ? "Signing in…" : "Log in"}
          </button>
        </form>

        {DEMO_ACCOUNT.show && (
          <div className="mt-6 rounded-lg border border-dashed border-stone/50 bg-linen/60 p-4">
            <p className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              <KeyRound className="size-3.5" /> Demo access
            </p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <dt className="text-stone">Email</dt>
              <dd className="font-mono break-all">{DEMO_ACCOUNT.email}</dd>
              <dt className="text-stone">Password</dt>
              <dd className="font-mono">{DEMO_ACCOUNT.password}</dd>
            </dl>
            <button
              type="button"
              onClick={() => {
                setEmail(DEMO_ACCOUNT.email);
                setPassword(DEMO_ACCOUNT.password);
                setError("");
              }}
              className="mt-3 text-xs underline underline-offset-4 hover:text-taupe"
            >
              Fill in demo details
            </button>
          </div>
        )}
      </div>
      <Link href="/" className="mt-6 flex items-center gap-1.5 text-xs text-stone hover:text-ink">
        <ArrowLeft className="size-3.5" /> Back to the website
      </Link>
    </div>
  );
}
