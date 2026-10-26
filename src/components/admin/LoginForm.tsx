"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DEMO_LOGIN, login, useSession } from "@/lib/store";

export function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const target = next?.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin";
  const session = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) router.replace(target);
  }, [session, router, target]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 py-12">
      <Logo height={56} priority />
      <div className="card-admin mt-8 w-full max-w-sm p-6 sm:p-8">
        <h1 className="font-serif text-3xl">Admin login</h1>
        <p className="mt-1 text-sm text-stone">Sign in to manage products, stock and orders.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!login(username, password)) setError("Wrong username or password.");
          }}
        >
          <div>
            <label className="label-admin" htmlFor="username">Username</label>
            <input
              id="username"
              className="input-admin"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              autoComplete="username"
              autoFocus
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
          <button type="submit" className="w-full rounded-md bg-ink py-2.5 text-sm text-ivory hover:bg-accent-dark">
            Log in
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 rounded-lg border border-dashed border-stone/50 bg-linen/60 p-4">
          <p className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
            <KeyRound className="size-3.5" /> Demo access
          </p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-stone">Username</dt>
            <dd className="font-mono">{DEMO_LOGIN.username}</dd>
            <dt className="text-stone">Password</dt>
            <dd className="font-mono">{DEMO_LOGIN.password}</dd>
          </dl>
          <button
            type="button"
            onClick={() => {
              setUsername(DEMO_LOGIN.username);
              setPassword(DEMO_LOGIN.password);
              setError("");
            }}
            className="mt-3 text-xs underline underline-offset-4 hover:text-taupe"
          >
            Fill in demo details
          </button>
        </div>
      </div>
      <Link href="/" className="mt-6 flex items-center gap-1.5 text-xs text-stone hover:text-ink">
        <ArrowLeft className="size-3.5" /> Back to the website
      </Link>
    </div>
  );
}
