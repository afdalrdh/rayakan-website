import "server-only";
import { unstable_cache } from "next/cache";
import type { GuestRecord } from "@/lib/records";
import { TAG } from "../cache";
import { one, query } from "../db/client";
import { iso } from "./rows";

type GuestRow = { id: string | number; slug: string; name: string; phone: string | null; group_label: string | null; sent_at: string | Date | null; created_at: string | Date };

const COLS = `id, slug, name, phone, group_label, sent_at, created_at`;

const toGuest = (r: GuestRow): GuestRecord => ({
  id: Number(r.id),
  slug: r.slug,
  name: r.name,
  phone: r.phone,
  groupLabel: r.group_label,
  sentAt: iso(r.sent_at),
  createdAt: iso(r.created_at)!,
});

export type NewGuest = { slug: string; name: string; phone: string | null; groupLabel: string | null };

export async function listGuests(siteId: number) {
  const rows = await query<GuestRow>(`SELECT ${COLS} FROM guests WHERE site_id = $1 ORDER BY created_at DESC, id DESC`, [siteId]);
  return rows.map(toGuest);
}

export async function countGuests(siteId: number) {
  const r = await one<{ n: number }>(`SELECT COUNT(*)::int AS n FROM guests WHERE site_id = $1`, [siteId]);
  return Number(r?.n ?? 0);
}

export async function guestSlugsTaken(siteId: number) {
  const rows = await query<{ slug: string }>(`SELECT slug FROM guests WHERE site_id = $1`, [siteId]);
  return new Set(rows.map((r) => r.slug));
}

/** Inserts guests one by one; a slug that already exists is skipped (not an error). */
export async function insertGuests(siteId: number, list: NewGuest[]) {
  const out: GuestRecord[] = [];
  for (const g of list) {
    const r = await one<GuestRow>(
      `INSERT INTO guests (site_id, slug, name, phone, group_label) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (site_id, slug) DO NOTHING RETURNING ${COLS}`,
      [siteId, g.slug, g.name, g.phone, g.groupLabel],
    );
    if (r) out.push(toGuest(r));
  }
  return out;
}

export async function updateGuest(siteId: number, id: number, f: { name: string; phone: string | null; groupLabel: string | null }) {
  await query(`UPDATE guests SET name = $3, phone = $4, group_label = $5 WHERE site_id = $1 AND id = $2`, [siteId, id, f.name, f.phone, f.groupLabel]);
}

export async function markGuestSent(siteId: number, id: number, sent: boolean) {
  await query(`UPDATE guests SET sent_at = ${sent ? "NOW()" : "NULL"} WHERE site_id = $1 AND id = $2`, [siteId, id]);
}

export async function markGuestsSent(siteId: number, ids: number[], sent: boolean) {
  if (!ids.length) return;
  await query(`UPDATE guests SET sent_at = ${sent ? "COALESCE(sent_at, NOW())" : "NULL"} WHERE site_id = $1 AND id = ANY($2::bigint[])`, [siteId, ids]);
}

export async function deleteGuests(siteId: number, ids: number[]) {
  if (!ids.length) return;
  await query(`DELETE FROM guests WHERE site_id = $1 AND id = ANY($2::bigint[])`, [siteId, ids]);
}

/** Name shown on a guest's personal link (cached; tag `TAG.guests(siteSlug)`). */
export function getGuestName(siteSlug: string, guestSlug: string) {
  return unstable_cache(
    async () => {
      const r = await one<{ name: string }>(`SELECT g.name FROM guests g JOIN sites s ON s.id = g.site_id WHERE s.slug = $1 AND g.slug = $2`, [siteSlug, guestSlug]);
      return r?.name ?? null;
    },
    ["guest-v1", siteSlug, guestSlug],
    { tags: [TAG.guests(siteSlug)], revalidate: 86400 },
  )();
}
