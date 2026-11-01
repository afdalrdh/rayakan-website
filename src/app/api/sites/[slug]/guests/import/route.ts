import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { canEditSite } from "@/lib/server/auth";
import { countGuests, findSite, getPlan, guestSlugsTaken, insertGuests, RESERVED_GUEST_SLUGS } from "@/lib/server/data";
import { parseGuestFile } from "@/lib/server/excel";
import { guestSlugify } from "@/lib/messages";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await canEditSite(slug))) return NextResponse.json({ error: "Sesi berakhir. Silakan masuk lagi." }, { status: 401 });
  const site = await findSite(slug);
  if (!site) return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "File Excel/CSV maksimal 2 MB." }, { status: 400 });

  let parsed;
  try {
    parsed = await parseGuestFile(file);
  } catch {
    return NextResponse.json({ error: "File tidak bisa dibaca. Gunakan template Excel dari Rayakan.my.id." }, { status: 400 });
  }
  const plan = await getPlan(site.planId);
  const current = await countGuests(site.id);
  const room = plan.guestLimit === null ? Infinity : Math.max(0, plan.guestLimit - current);
  const taken = await guestSlugsTaken(site.id);
  const list = [];
  for (const g of parsed.guests) {
    if (list.length >= room) break;
    const base = guestSlugify(g.name) || "tamu";
    let s = base;
    let n = 2;
    while (taken.has(s) || RESERVED_GUEST_SLUGS.has(s)) s = `${base}-${n++}`;
    taken.add(s);
    list.push({ ...g, slug: s });
  }
  const added = await insertGuests(site.id, list);
  revalidateTag(`guests:${slug}`, "max");
  return NextResponse.json({
    added: added.length,
    skipped: parsed.skipped,
    overLimit: Math.max(0, parsed.guests.length - list.length),
  });
}
