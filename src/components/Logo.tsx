import Image from "next/image";

// Source artwork: public/brand/logo-black.png & logo-white.png (656 × 444)
export function Logo({
  variant = "black",
  height = 40,
  className = "",
  priority = false,
}: {
  variant?: "black" | "white";
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/brand/logo-${variant}.png`}
      alt="Roze Déco"
      width={Math.round((height * 656) / 444)}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
