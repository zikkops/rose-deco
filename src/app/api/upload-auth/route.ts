import { createHmac, randomUUID } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { ADMIN_EMAILS } from "@/lib/firebase";

// Signs ImageKit uploads for logged-in admins only.
// The ImageKit private key never leaves the server (IMAGEKIT_PRIVATE_KEY in .env.local / hosting env vars).

const PROJECT_ID = "rose-deco";
const firebaseKeys = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

export async function POST(request: Request) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) return Response.json({ error: "Image hosting isn't configured on the server." }, { status: 503 });

  // Verify the Firebase ID token sent by the admin panel
  const idToken = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!idToken) return Response.json({ error: "Not signed in." }, { status: 401 });
  try {
    const { payload } = await jwtVerify(idToken, firebaseKeys, {
      issuer: `https://securetoken.google.com/${PROJECT_ID}`,
      audience: PROJECT_ID,
    });
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : "";
    if (!ADMIN_EMAILS.includes(email)) return Response.json({ error: "Admins only." }, { status: 403 });
  } catch {
    return Response.json({ error: "Session expired — please log in again." }, { status: 401 });
  }

  // ImageKit client-upload signature: HMAC-SHA1(token + expire) with the private key
  const token = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 10 * 60; // valid for 10 minutes
  const signature = createHmac("sha1", privateKey).update(token + expire).digest("hex");
  return Response.json({ token, expire, signature });
}
