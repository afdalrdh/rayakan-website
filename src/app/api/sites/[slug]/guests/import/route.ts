import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { canEditSite } from "@/server/auth";
import { TAG } from "@/server/cache";
import { parseGuestFile } from "@/server/excel";
import { findSite } from "@/server/repositories/sites";
import { addGuests } from "@/server/services/guests";

const MAX_FILE_BYTES = 2 * 1024 * 1024;

/** Excel/CSV guest import. Adds as many guests as the package still allows and reports the rest. */
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await canEditSite(slug))) return NextResponse.json({ error: "Sesi berakhir. Silakan masuk lagi." }, { status: 401 });
  const site = await findSite(slug);
  if (!site) return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size > MAX_FILE_BYTES) return NextResponse.json({ error: "File Excel/CSV maksimal 2 MB." }, { status: 400 });

  let parsed;
  try {
    parsed = await parseGuestFile(file);
  } catch {
    return NextResponse.json({ error: "File tidak bisa dibaca. Gunakan template Excel dari Rayakan.my.id." }, { status: 400 });
  }
  const { added, overLimit } = await addGuests(site, parsed.guests, "trim");
  revalidateTag(TAG.guests(slug), "max");
  return NextResponse.json({ added: added.length, skipped: parsed.skipped, overLimit });
}
