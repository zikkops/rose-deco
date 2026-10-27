import Image, { type ImageProps } from "next/image";
import { canOptimize } from "@/lib/catalog";

/**
 * next/image that also accepts admin-uploaded images (data: URLs) and
 * arbitrary links from hosts not listed in next.config images.remotePatterns.
 */
export function SmartImage({ src, alt, ...rest }: Omit<ImageProps, "src"> & { src?: string }) {
  if (!src) return <div className="absolute inset-0 bg-linen" aria-hidden />;
  return <Image src={src} alt={alt} unoptimized={!canOptimize(src)} {...rest} />;
}
