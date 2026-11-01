import "server-only";
import { createHash, randomBytes } from "crypto";
import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";

const LOCAL_DIR = path.join(process.cwd(), ".data", "uploads");

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
};

export const ALLOWED_TYPES = new Set(Object.keys(EXT));
export const MAX_IMAGE = 4 * 1024 * 1024;
export const MAX_AUDIO = 4 * 1024 * 1024;

/**
 * Where uploads go, picked from the environment:
 *   CLOUDINARY_URL         → Cloudinary (recommended: big free tier, resizes on its CDN)
 *   BLOB_READ_WRITE_TOKEN  → Vercel Blob
 *   neither (local only)   → .data/uploads, served by /api/media
 */
export function storageProvider(): "cloudinary" | "blob" | "local" | null {
  if (cloudinaryConfig()) return "cloudinary";
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return process.env.VERCEL ? null : "local";
}

/** Store a file and return its public URL. */
export async function putFile(folder: string, data: Buffer, contentType: string) {
  const ext = EXT[contentType] ?? "bin";
  const id = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`;
  switch (storageProvider()) {
    case "cloudinary":
      return putCloudinary(folder, id, data, contentType);
    case "blob": {
      const { put } = await import("@vercel/blob");
      const blob = await put(`${folder}/${id}.${ext}`, data, { access: "public", contentType, addRandomSuffix: false, cacheControlMaxAge: 31536000 });
      return blob.url;
    }
    case "local": {
      const name = `${folder}/${id}.${ext}`;
      const file = path.join(LOCAL_DIR, name);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, data);
      return `/api/media/${name}`;
    }
    default:
      throw new Error("Penyimpanan foto belum diatur (CLOUDINARY_URL).");
  }
}

/* ------------------------------ Cloudinary ------------------------------ */

/** Parses CLOUDINARY_URL = cloudinary://<api_key>:<api_secret>@<cloud_name> */
function cloudinaryConfig() {
  const raw = process.env.CLOUDINARY_URL;
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const cfg = { cloud: u.hostname, key: decodeURIComponent(u.username), secret: decodeURIComponent(u.password) };
    return cfg.cloud && cfg.key && cfg.secret ? cfg : null;
  } catch {
    return null;
  }
}

/** Signed upload through Cloudinary's REST API (no SDK needed). */
async function putCloudinary(folder: string, publicId: string, data: Buffer, contentType: string) {
  const cfg = cloudinaryConfig()!;
  // Cloudinary files audio under the "video" resource type.
  const resource = contentType.startsWith("audio/") ? "video" : "image";
  const params: Record<string, string> = {
    folder: `rayakan/${folder}`,
    public_id: publicId,
    timestamp: Math.floor(Date.now() / 1000).toString(),
  };
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.set(k, v);
  form.set("api_key", cfg.key);
  form.set("signature", createHash("sha1").update(toSign + cfg.secret).digest("hex"));
  form.set("file", new Blob([new Uint8Array(data)], { type: contentType }));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloud}/${resource}/upload`, { method: "POST", body: form });
  const json = (await res.json().catch(() => ({}))) as { secure_url?: string; error?: { message?: string } };
  if (!res.ok || !json.secure_url) throw new Error(`Gagal mengunggah ke Cloudinary: ${json.error?.message ?? res.status}`);
  return json.secure_url;
}

export async function readLocalFile(rel: string) {
  const file = path.normalize(path.join(LOCAL_DIR, rel));
  if (!file.startsWith(LOCAL_DIR)) return null;
  try {
    return await readFile(file);
  } catch {
    return null;
  }
}

export function contentTypeOf(rel: string) {
  const ext = rel.split(".").pop()?.toLowerCase() ?? "";
  return Object.entries(EXT).find(([, e]) => e === ext)?.[0] ?? "application/octet-stream";
}
