import "server-only";
import type { WishRecord } from "@/lib/records";
import { one, query } from "../db/client";
import { iso } from "./rows";

type WishRow = { id: string | number; name: string; attendance: "Hadir" | "Tidak Hadir"; location: string | null; message: string; guest_slug: string | null; created_at: string | Date };

const COLS = `id, name, attendance, location, message, guest_slug, created_at`;

const toWish = (r: WishRow): WishRecord => ({
  id: Number(r.id),
  name: r.name,
  attendance: r.attendance,
  location: r.location,
  message: r.message,
  guestSlug: r.guest_slug,
  createdAt: iso(r.created_at)!,
});

export async function listWishes(siteId: number, limit = 200, offset = 0) {
  const rows = await query<WishRow>(`SELECT ${COLS} FROM wishes WHERE site_id = $1 ORDER BY created_at DESC, id DESC LIMIT $2 OFFSET $3`, [siteId, limit, offset]);
  return rows.map(toWish);
}

export async function wishStats(siteId: number) {
  const r = await one<{ total: number; present: number }>(
    `SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE attendance = 'Hadir')::int AS present FROM wishes WHERE site_id = $1`,
    [siteId],
  );
  const total = Number(r?.total ?? 0);
  const present = Number(r?.present ?? 0);
  return { total, present, absent: total - present };
}

export async function insertWish(siteId: number, w: { name: string; attendance: string; location: string | null; message: string; guestSlug: string | null; ipHash: string }) {
  const r = await one<WishRow>(
    `INSERT INTO wishes (site_id, name, attendance, location, message, guest_slug, ip_hash) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ${COLS}`,
    [siteId, w.name, w.attendance, w.location, w.message, w.guestSlug, w.ipHash],
  );
  return toWish(r!);
}

/** Wishes sent from one (hashed) IP in the last 10 minutes, to slow down spam. */
export async function recentWishesFromIp(ipHash: string) {
  const r = await one<{ n: number }>(`SELECT COUNT(*)::int AS n FROM wishes WHERE ip_hash = $1 AND created_at > NOW() - INTERVAL '10 minutes'`, [ipHash]);
  return Number(r?.n ?? 0);
}

export async function deleteWish(siteId: number, id: number) {
  await query(`DELETE FROM wishes WHERE site_id = $1 AND id = $2`, [siteId, id]);
}
