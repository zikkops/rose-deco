"use client";

import { useState } from "react";
import { ImageUp } from "lucide-react";
import { copyImageToImageKit, imageUploadReady, isImageKitUrl } from "@/lib/image";
import { saveProduct, useProductsState } from "@/lib/store";

/** Copies every product image that isn't on ImageKit yet into ImageKit and updates the products. */
export function MoveImagesToImageKit() {
  const { items: products, loaded } = useProductsState();
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState("");

  const pending = products.flatMap((p) => p.images.filter((u) => !isImageKitUrl(u)).map((u) => ({ p, u })));
  const running = progress !== null && progress.done < progress.total;

  const run = async () => {
    setResult("");
    const total = pending.length;
    let done = 0;
    let failed = 0;
    setProgress({ done, total });
    for (const p of products) {
      if (p.images.every(isImageKitUrl)) continue;
      const images: string[] = [];
      for (const [i, url] of p.images.entries()) {
        if (isImageKitUrl(url)) {
          images.push(url);
          continue;
        }
        try {
          images.push(await copyImageToImageKit(url, `${p.slug}-${i + 1}`));
        } catch {
          images.push(url); // keep the original if the copy fails
          failed++;
        }
        setProgress({ done: ++done, total });
      }
      try {
        await saveProduct({ ...p, images });
      } catch {
        failed++;
      }
    }
    setResult(failed ? `Done, but ${failed} image(s) couldn't be moved — run it again to retry.` : `All ${total} images are now on ImageKit.`);
  };

  if (!loaded) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-stone">Images not on ImageKit yet</span>
        <span className="tabular-nums">{pending.length}</span>
      </div>
      {progress && (
        <div className="h-1.5 overflow-hidden rounded-full bg-linen">
          <div className="h-full rounded-full bg-ink transition-all" style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }} />
        </div>
      )}
      <button
        onClick={run}
        disabled={running || pending.length === 0 || !imageUploadReady()}
        className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-ivory hover:bg-accent-dark disabled:opacity-50"
      >
        <ImageUp className="size-4" />
        {running ? `Moving… ${progress!.done} / ${progress!.total}` : pending.length ? `Move ${pending.length} images to ImageKit` : "All images are on ImageKit"}
      </button>
      {result && <p className="text-sm">{result}</p>}
    </div>
  );
}
