// Product images: resized in the browser, uploaded to ImageKit (free plan, no card).
// Uploads are signed by /api/upload-auth, which only accepts logged-in admins.
// Firestore only stores the resulting image URL.
import { auth } from "./firebase";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? "";
const FOLDER = "/roze-deco/products";

// ImageKit file IDs of images uploaded in this browser session (url -> fileId), so they can be
// deleted immediately, even before ImageKit's search index has picked them up.
const uploadedFileIds = new Map<string, string>();

/** Current admin's ID token, with a readable error if the login has expired. */
async function idToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Your login has expired — please log in again.");
  try {
    return await user.getIdToken();
  } catch {
    throw new Error("Your login has expired — please log in again.");
  }
}

export const imageUploadReady = () => !!PUBLIC_KEY;

async function compress(file: File, maxSize = 1600, quality = 0.85): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read that image."));
      el.src = url;
    });
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff"; // flatten transparent PNGs
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process that image."))), "image/jpeg", quality),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Uploads one image and returns its public HTTPS URL.
 * `onProgress` receives 0–1 (preparing is ~0–0.1, the transfer to ImageKit fills the rest).
 */
export async function uploadProductImage(file: File, onProgress?: (fraction: number) => void): Promise<string> {
  onProgress?.(0.02);
  if (!imageUploadReady()) throw new Error("Image hosting isn't connected yet — paste an image link for now.");
  const authRes = await fetch("/api/upload-auth", {
    method: "POST",
    headers: { authorization: `Bearer ${await idToken()}` },
  });
  const sig = await authRes.json();
  if (!authRes.ok) throw new Error(sig?.error ?? "Upload not allowed.");

  onProgress?.(0.06);
  const body = new FormData();
  body.append("file", await compress(file));
  onProgress?.(0.1);
  body.append("fileName", `${file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]+/gi, "-").toLowerCase() || "image"}.jpg`);
  body.append("folder", FOLDER);
  body.append("publicKey", PUBLIC_KEY);
  body.append("token", sig.token);
  body.append("expire", String(sig.expire));
  body.append("signature", sig.signature);

  // XMLHttpRequest (not fetch) so we can report upload progress
  const json = await new Promise<{ url: string; fileId: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(0.1 + 0.88 * (e.loaded / e.total));
    };
    xhr.onload = () => {
      let data: { url?: string; fileId?: string; message?: string } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && data.url && data.fileId) resolve({ url: data.url, fileId: data.fileId });
      else reject(new Error(data.message ?? "Upload failed."));
    };
    xhr.onerror = () => reject(new Error("Upload failed — check your connection."));
    xhr.send(body);
  });
  onProgress?.(1);
  uploadedFileIds.set(json.url, json.fileId);
  return json.url;
}

export const isImageKitUrl = (url: string) => url.startsWith("https://ik.imagekit.io/");

/** Admin: copy an image from any public URL into ImageKit; returns the new ImageKit URL. */
export async function copyImageToImageKit(url: string, name: string): Promise<string> {
  const res = await fetch("/api/import-image", {
    method: "POST",
    headers: { authorization: `Bearer ${await idToken()}`, "content-type": "application/json" },
    body: JSON.stringify({ url, name }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error ?? "Copy failed.");
  return json.url as string;
}

/**
 * Admin: delete images from ImageKit (best effort). Only ImageKit URLs are sent;
 * pass only images that no other product still uses.
 */
export async function deleteHostedImages(urls: string[]): Promise<void> {
  const hosted = [...new Set(urls.filter(isImageKitUrl))];
  const user = auth.currentUser;
  if (!hosted.length || !user) return;
  try {
    const res = await fetch("/api/delete-images", {
      method: "POST",
      headers: { authorization: `Bearer ${await user.getIdToken()}`, "content-type": "application/json" },
      body: JSON.stringify({
        urls: hosted,
        fileIds: Object.fromEntries(hosted.flatMap((u) => (uploadedFileIds.has(u) ? [[u, uploadedFileIds.get(u)!]] : []))),
      }),
    });
    if (!res.ok) console.error("[images] delete failed", await res.text());
  } catch (e) {
    console.error("[images] delete failed", e);
  }
}
