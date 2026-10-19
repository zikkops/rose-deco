import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-serif text-5xl font-light lg:text-6xl">This room is empty</h1>
      <p className="mt-4 max-w-md text-taupe">
        The page you&apos;re looking for has moved or no longer exists.
      </p>
      <Link href="/" className="btn-dark mt-10">Return home</Link>
    </main>
  );
}
