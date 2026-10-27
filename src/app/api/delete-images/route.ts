import { requireAdmin } from "@/lib/server/admin-auth";

// Deletes product images from ImageKit by URL. Admins only.
// Only files inside this shop's /roze-deco/ folder can be deleted.

const API = "https://api.imagekit.io/v1/files";
type IkFile = { fileId: string; name: string; filePath: string };

/** "https://ik.imagekit.io/<id>/roze-deco/products/a_x.jpg?tr=w-400" -> "/roze-deco/products/a_x.jpg" */
function toFilePath(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "ik.imagekit.io") return null;
    const filePath = "/" + decodeURIComponent(u.pathname).split("/").filter(Boolean).slice(1).join("/");
    return filePath.startsWith("/roze-deco/") ? filePath : null;
  } catch {
    return null;
  }
}

async function findFile(filePath: string, auth: string): Promise<IkFile | undefined> {
  const name = filePath.split("/").pop()!;
  const folder = filePath.slice(0, filePath.length - name.length);
  const search = async (params: Record<string, string>) => {
    const res = await fetch(`${API}?${new URLSearchParams(params)}`, { headers: { authorization: auth } });
    return res.ok ? ((await res.json()) as IkFile[]) : [];
  };
  // Search by name (fast), then fall back to listing the folder (covers search-index lag)
  const hits = await search({ path: folder, searchQuery: `name = "${name}"`, type: "file" });
  return (
    hits.find((f) => f.filePath === filePath) ??
    (await search({ path: folder, type: "file", limit: "1000" })).find((f) => f.filePath === filePath)
  );
}

/** Fetch a file by ID, but only accept it if it really is the file at `filePath`. */
async function fileById(fileId: string, filePath: string, auth: string): Promise<IkFile | undefined> {
  const res = await fetch(`${API}/${encodeURIComponent(fileId)}/details`, { headers: { authorization: auth } });
  if (!res.ok) return undefined;
  const file = (await res.json()) as IkFile;
  return file.filePath === filePath ? file : undefined;
}

export async function POST(request: Request) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) return Response.json({ error: "Image hosting isn't configured on the server." }, { status: 503 });

  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { urls, fileIds } = (await request.json().catch(() => ({}))) as { urls?: unknown; fileIds?: Record<string, string> };
  if (!Array.isArray(urls) || urls.length > 100) return Response.json({ error: "Send up to 100 image URLs." }, { status: 400 });

  const auth = "Basic " + Buffer.from(privateKey + ":").toString("base64");
  const result = { deleted: 0, notFound: 0, skipped: 0, failed: 0 };

  for (const url of urls) {
    const filePath = typeof url === "string" ? toFilePath(url) : null;
    if (!filePath) {
      result.skipped++; // not an image hosted in this shop's ImageKit folder
      continue;
    }
    try {
      // Freshly uploaded files come with their ID (search can lag a few seconds behind uploads)
      const knownId = typeof fileIds?.[url as string] === "string" ? fileIds[url as string] : null;
      const file = knownId ? await fileById(knownId, filePath, auth) : await findFile(filePath, auth);
      if (!file) {
        result.notFound++;
        continue;
      }
      const res = await fetch(`${API}/${file.fileId}`, { method: "DELETE", headers: { authorization: auth } });
      if (res.status === 204 || res.status === 404) result.deleted++;
      else result.failed++;
    } catch {
      result.failed++;
    }
  }
  return Response.json(result);
}
