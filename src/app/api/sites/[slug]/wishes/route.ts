import { NextResponse } from "next/server";
import { clientIp, ipHash } from "@/lib/server/auth";
import { findSite, insertWish, isExpired, listWishes, recentWishesFromIp, wishStats } from "@/lib/server/data";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await findSite(slug);
  if (!site || site.status !== "published") return NextResponse.json({ wishes: [], stats: { total: 0, present: 0, absent: 0 } });
  const page = Math.max(0, Number(new URL(req.url).searchParams.get("page") ?? 0) || 0);
  const [wishes, stats] = await Promise.all([listWishes(site.id, 30, page * 30), wishStats(site.id)]);
  return NextResponse.json(
    { wishes, stats },
    { headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=120" } },
  );
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await findSite(slug);
  if (!site || site.status !== "published" || isExpired(site)) {
    return NextResponse.json({ error: "Undangan ini belum aktif." }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const name = clean(body.name, 80);
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 600) : "";
  const attendance = body.attendance === "Tidak Hadir" ? "Tidak Hadir" : "Hadir";
  if (!name || !message) return NextResponse.json({ error: "Nama dan ucapan wajib diisi." }, { status: 400 });
  const ip = ipHash(await clientIp());
  if ((await recentWishesFromIp(ip)) >= 5) {
    return NextResponse.json({ error: "Terlalu banyak ucapan dalam waktu singkat. Coba lagi nanti." }, { status: 429 });
  }
  const wish = await insertWish(site.id, {
    name,
    attendance,
    location: clean(body.location, 80) || null,
    message,
    guestSlug: clean(body.guestSlug, 80) || null,
    ipHash: ip,
  });
  return NextResponse.json({ wish });
}
