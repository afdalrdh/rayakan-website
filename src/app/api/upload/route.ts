import { NextResponse } from "next/server";
import { canEditSite } from "@/lib/server/auth";
import { ALLOWED_TYPES, MAX_AUDIO, MAX_IMAGE, putFile } from "@/lib/server/media";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const slug = String(form?.get("slug") ?? "");
  if (!slug || !(await canEditSite(slug))) return NextResponse.json({ error: "Sesi berakhir. Silakan masuk lagi." }, { status: 401 });
  if (!(file instanceof File)) return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "Format file tidak didukung." }, { status: 400 });
  const max = file.type.startsWith("audio/") ? MAX_AUDIO : MAX_IMAGE;
  if (file.size > max) return NextResponse.json({ error: `Ukuran file maksimal ${Math.round(max / 1024 / 1024)} MB.` }, { status: 400 });
  try {
    const url = await putFile(`sites/${slug}`, Buffer.from(await file.arrayBuffer()), file.type);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Gagal mengunggah." }, { status: 500 });
  }
}
