import { createHmac, randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/server/admin-auth";

// Signs ImageKit uploads for logged-in admins only.
// The ImageKit private key never leaves the server (IMAGEKIT_PRIVATE_KEY in .env.local / hosting env vars).
export async function POST(request: Request) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) return Response.json({ error: "Image hosting isn't configured on the server." }, { status: 503 });

  const denied = await requireAdmin(request);
  if (denied) return denied;

  // ImageKit client-upload signature: HMAC-SHA1(token + expire) with the private key
  const token = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 10 * 60; // valid for 10 minutes
  const signature = createHmac("sha1", privateKey).update(token + expire).digest("hex");
  return Response.json({ token, expire, signature });
}
