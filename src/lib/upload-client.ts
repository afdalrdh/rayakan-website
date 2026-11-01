"use client";

/** Shrink a photo in the browser before upload (≈5 MB phone photo → ≈300 KB). */
export async function compressImage(file: File, maxSide = 1920, quality = 0.82): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  const keepAlpha = file.type === "image/png";
  const blob = await new Promise<Blob | null>((r) =>
    canvas.toBlob(r, keepAlpha ? "image/webp" : "image/jpeg", quality),
  );
  return blob && blob.size < file.size ? blob : file;
}

/** 1200×630 center crop for WhatsApp / social link previews (~80–120 KB). */
export async function makeOgBlob(file: File): Promise<Blob | null> {
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return null;
  const W = 1200;
  const H = 630;
  const scale = Math.max(W / bmp.width, H / bmp.height);
  const sw = W / scale;
  const sh = H / scale;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(bmp, (bmp.width - sw) / 2, (bmp.height - sh) / 2, sw, sh, 0, 0, W, H);
  return new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.8));
}

export async function uploadToServer(slug: string, blob: Blob, name: string) {
  const form = new FormData();
  form.append("slug", slug);
  form.append("file", new File([blob], name, { type: blob.type || "application/octet-stream" }));
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Gagal mengunggah file.");
  return data.url as string;
}
