// Product images: resized in the browser, then uploaded to Cloudinary (free plan).
// Firestore only stores the resulting image URL.

export const CLOUDINARY = {
  cloudName: "", // set once the Cloudinary account exists, e.g. "rozedeco"
  uploadPreset: "roze_deco_products", // unsigned preset, restricted to images in this folder
  folder: "roze-deco/products",
};

export const imageUploadReady = () => !!CLOUDINARY.cloudName;

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

/** Uploads one image and returns its public HTTPS URL. */
export async function uploadProductImage(file: File): Promise<string> {
  if (!imageUploadReady()) throw new Error("Image hosting isn't connected yet — paste an image link for now.");
  const body = new FormData();
  body.append("file", await compress(file));
  body.append("upload_preset", CLOUDINARY.uploadPreset);
  body.append("folder", CLOUDINARY.folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`, { method: "POST", body });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? "Upload failed.");
  return json.secure_url as string;
}
