import { requireAdmin } from "@/lib/server/admin-auth";

// Copies an image from a public URL into ImageKit (ImageKit fetches it) and returns the new URL.
// Used by Admin → Settings → "Move images to ImageKit". Admins only.
export async function POST(request: Request) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) return Response.json({ error: "Image hosting isn't configured on the server." }, { status: 503 });

  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { url, name } = (await request.json().catch(() => ({}))) as { url?: string; name?: string };
  if (!url || !/^https:\/\//.test(url)) return Response.json({ error: "A valid https image URL is required." }, { status: 400 });

  const body = new FormData();
  body.append("file", url);
  body.append("fileName", `${(name || "image").replace(/[^a-z0-9-]+/gi, "-").toLowerCase()}.jpg`);
  body.append("folder", "/roze-deco/products");

  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: { authorization: "Basic " + Buffer.from(privateKey + ":").toString("base64") },
    body,
  });
  const json = await res.json();
  if (!res.ok) return Response.json({ error: json?.message ?? "Copy failed." }, { status: 502 });
  return Response.json({ url: json.url as string });
}
