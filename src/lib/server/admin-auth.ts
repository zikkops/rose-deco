import { createRemoteJWKSet, jwtVerify } from "jose";
import { ADMIN_EMAILS } from "@/lib/firebase";

// Verifies the Firebase ID token sent by the admin panel ("Authorization: Bearer <token>").
const PROJECT_ID = "rose-deco";
const firebaseKeys = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

/** Returns an error Response if the caller isn't a signed-in admin, otherwise null. */
export async function requireAdmin(request: Request): Promise<Response | null> {
  const idToken = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!idToken) return Response.json({ error: "Not signed in." }, { status: 401 });

  // Local testing with the Auth emulator: its tokens are unsigned, so only decode them.
  // Disabled in production builds.
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "1" && process.env.NODE_ENV !== "production") {
    try {
      const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString());
      const email = typeof payload.email === "string" ? payload.email.toLowerCase() : "";
      return ADMIN_EMAILS.includes(email) ? null : Response.json({ error: "Admins only." }, { status: 403 });
    } catch {
      return Response.json({ error: "Not signed in." }, { status: 401 });
    }
  }
  try {
    const { payload } = await jwtVerify(idToken, firebaseKeys, {
      issuer: `https://securetoken.google.com/${PROJECT_ID}`,
      audience: PROJECT_ID,
    });
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : "";
    if (!ADMIN_EMAILS.includes(email)) return Response.json({ error: "Admins only." }, { status: 403 });
    return null;
  } catch {
    return Response.json({ error: "Session expired — please log in again." }, { status: 401 });
  }
}
