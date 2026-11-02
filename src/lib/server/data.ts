import "server-only";
import { unstable_cache } from "next/cache";
import { normalizeContent, PLAN_IDS, PLANS, type Plan, type PlanId, type WeddingContent } from "../content";
import { one, query } from "./db";

/* ------------------------------ Types ------------------------------ */

export type SiteStatus = "draft" | "published";

export interface SiteRecord {
  id: number;
  slug: string;
  title: string;
  planId: PlanId;
  theme: string;
  status: SiteStatus;
  content: WeddingContent;
  waTemplate: string | null;
  clientName: string | null;
  clientPhone: string | null;
  notes: string | null;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  adminWhatsapp: string;
  instagram: string;
  promoLabel: string;
  promoEndsAt: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  adminWhatsapp: "",
  instagram: "rayakan.my.id",
  promoLabel: "Harga perkenalan",
  promoEndsAt: "",
};

export interface GuestRecord {
  id: number;
  slug: string;
  name: string;
  phone: string | null;
  groupLabel: string | null;
  sentAt: string | null;
  createdAt: string;
}

export interface WishRecord {
  id: number;
  name: string;
  attendance: "Hadir" | "Tidak Hadir";
  location: string | null;
  message: string;
  guestSlug: string | null;
  createdAt: string;
}

/** Slugs that can never be a client address. */
export const RESERVED_SLUGS = new Set([
  "studio", "demo", "coba", "portofolio", "portfolio", "api", "admin", "canvas", "login", "masuk", "harga", "tema", "bantuan",
  "_next", "favicon.ico", "robots.txt", "sitemap.xml", "brand", "fonts", "music", "themes", "uploads",
]);
export const RESERVED_GUEST_SLUGS = new Set(["admin", "preview", "editor", "opengraph-image"]);

/* ------------------------------ Mapping ------------------------------ */

type SiteRow = {
  id: string | number;
  slug: string;
  title: string;
  plan_id: string;
  theme: string;
  status: SiteStatus;
  content: WeddingContent | string;
  wa_template: string | null;
  client_name: string | null;
  client_phone: string | null;
  notes: string | null;
  published_at: string | Date | null;
  expires_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
};

const iso = (v: string | Date | null) => (v ? new Date(v).toISOString() : null);
const json = <T,>(v: T | string): T => (typeof v === "string" ? (JSON.parse(v) as T) : v);

function toSite(r: SiteRow): SiteRecord {
  return {
    id: Number(r.id),
    slug: r.slug,
    title: r.title,
    planId: (PLAN_IDS as string[]).includes(r.plan_id) ? (r.plan_id as PlanId) : "premium",
    theme: r.theme,
    status: r.status,
    content: normalizeContent(json(r.content)),
    waTemplate: r.wa_template,
    clientName: r.client_name,
    clientPhone: r.client_phone,
    notes: r.notes,
    publishedAt: iso(r.published_at),
    expiresAt: iso(r.expires_at),
    createdAt: iso(r.created_at)!,
    updatedAt: iso(r.updated_at)!,
  };
}

const SITE_COLS = `id, slug, title, plan_id, theme, status, content, wa_template, client_name, client_phone, notes, published_at, expires_at, created_at, updated_at`;

/* ------------------------------ Plans & settings ------------------------------ */

async function loadPlans(): Promise<Plan[]> {
  let rows: { id: string; data: Plan | string }[] = [];
  try {
    rows = await query<{ id: string; data: Plan | string }>(`SELECT id, data FROM plans ORDER BY sort ASC`);
  } catch (e) {
    console.error("[plans] fallback to defaults:", e);
    return PLAN_IDS.map((id) => PLANS[id]);
  }
  const byId = new Map(rows.map((r) => [r.id, { ...PLANS[r.id as PlanId], ...json(r.data), id: r.id as PlanId }]));
  return PLAN_IDS.map((id) => byId.get(id) ?? PLANS[id]);
}

export const getPlans = unstable_cache(loadPlans, ["plans-v1"], { tags: ["plans"], revalidate: 3600 });

export async function getPlan(id: PlanId) {
  return (await getPlans()).find((p) => p.id === id) ?? PLANS[id];
}

export async function savePlan(p: Plan, sort: number) {
  await query(
    `INSERT INTO plans (id, data, sort, updated_at) VALUES ($1, $2, $3, NOW())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, sort = EXCLUDED.sort, updated_at = NOW()`,
    [p.id, JSON.stringify(p), sort],
  );
}

async function loadSettings(): Promise<AppSettings> {
  try {
    const row = await one<{ value: AppSettings | string }>(`SELECT value FROM app_settings WHERE key = 'app'`);
    return { ...DEFAULT_SETTINGS, ...(row ? json(row.value) : {}) };
  } catch (e) {
    console.error("[settings] fallback to defaults:", e);
    return DEFAULT_SETTINGS;
  }
}

export const getSettings = unstable_cache(loadSettings, ["settings-v1"], { tags: ["settings"], revalidate: 3600 });

export async function saveSettings(s: AppSettings) {
  await query(
    `INSERT INTO app_settings (key, value, updated_at) VALUES ('app', $1, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [JSON.stringify(s)],
  );
}

/* ------------------------------ Sites ------------------------------ */

export async function findSite(slug: string) {
  const r = await one<SiteRow>(`SELECT ${SITE_COLS} FROM sites WHERE slug = $1`, [slug]);
  return r ? toSite(r) : null;
}

/** Public, cached read. Invalidated with tag `site:<slug>` whenever the site changes. */
export function getPublicSite(slug: string) {
  return unstable_cache(() => findSite(slug), ["site-v1", slug], { tags: [`site:${slug}`], revalidate: 86400 })();
}

export async function listSites(opts: { search?: string; status?: string } = {}) {
  const where: string[] = [];
  const params: unknown[] = [];
  if (opts.search) {
    params.push(`%${opts.search.toLowerCase()}%`);
    where.push(`(LOWER(slug) LIKE $${params.length} OR LOWER(title) LIKE $${params.length} OR LOWER(COALESCE(client_name,'')) LIKE $${params.length})`);
  }
  if (opts.status === "draft" || opts.status === "published") {
    params.push(opts.status);
    where.push(`status = $${params.length}`);
  }
  const rows = await query<SiteRow & { guests: number; wishes: number }>(
    `SELECT ${SITE_COLS},
       (SELECT COUNT(*)::int FROM guests g WHERE g.site_id = sites.id) AS guests,
       (SELECT COUNT(*)::int FROM wishes w WHERE w.site_id = sites.id) AS wishes
     FROM sites ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY created_at DESC LIMIT 500`,
    params,
  );
  return rows.map((r) => ({ ...toSite(r), guests: Number(r.guests), wishes: Number(r.wishes) }));
}

export async function insertSite(input: {
  slug: string;
  title: string;
  planId: PlanId;
  content: WeddingContent;
  passwordHash: string;
  clientName: string;
  clientPhone: string;
  notes: string;
}) {
  const r = await one<SiteRow>(
    `INSERT INTO sites (slug, title, plan_id, content, password_hash, client_name, client_phone, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ${SITE_COLS}`,
    [input.slug, input.title, input.planId, JSON.stringify(input.content), input.passwordHash, input.clientName, input.clientPhone, input.notes],
  );
  return toSite(r!);
}

export async function updateSiteContent(slug: string, content: WeddingContent) {
  await query(`UPDATE sites SET content = $2, updated_at = NOW() WHERE slug = $1`, [slug, JSON.stringify(content)]);
}

export async function updateSiteFields(
  slug: string,
  f: Partial<{ title: string; planId: PlanId; status: SiteStatus; waTemplate: string | null; clientName: string; clientPhone: string; notes: string; publishedAt: string | null; expiresAt: string | null; passwordHash: string }>,
) {
  const map: Record<string, string> = {
    title: "title",
    planId: "plan_id",
    status: "status",
    waTemplate: "wa_template",
    clientName: "client_name",
    clientPhone: "client_phone",
    notes: "notes",
    publishedAt: "published_at",
    expiresAt: "expires_at",
    passwordHash: "password_hash",
  };
  const sets: string[] = [];
  const params: unknown[] = [slug];
  for (const [k, v] of Object.entries(f)) {
    if (v === undefined || !map[k]) continue;
    params.push(v);
    sets.push(`${map[k]} = $${params.length}`);
  }
  if (!sets.length) return;
  await query(`UPDATE sites SET ${sets.join(", ")}, updated_at = NOW() WHERE slug = $1`, params);
}

export async function deleteSite(slug: string) {
  await query(`DELETE FROM sites WHERE slug = $1`, [slug]);
}

export async function siteIdOf(slug: string) {
  const r = await one<{ id: string | number }>(`SELECT id FROM sites WHERE slug = $1`, [slug]);
  return r ? Number(r.id) : null;
}

/* ------------------------------ Guests ------------------------------ */

type GuestRow = { id: string | number; slug: string; name: string; phone: string | null; group_label: string | null; sent_at: string | Date | null; created_at: string | Date };
const toGuest = (r: GuestRow): GuestRecord => ({
  id: Number(r.id),
  slug: r.slug,
  name: r.name,
  phone: r.phone,
  groupLabel: r.group_label,
  sentAt: iso(r.sent_at),
  createdAt: iso(r.created_at)!,
});

export async function listGuests(siteId: number) {
  const rows = await query<GuestRow>(`SELECT id, slug, name, phone, group_label, sent_at, created_at FROM guests WHERE site_id = $1 ORDER BY created_at DESC, id DESC`, [siteId]);
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

export async function insertGuests(siteId: number, list: { slug: string; name: string; phone: string | null; groupLabel: string | null }[]) {
  const out: GuestRecord[] = [];
  for (const g of list) {
    const r = await one<GuestRow>(
      `INSERT INTO guests (site_id, slug, name, phone, group_label) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (site_id, slug) DO NOTHING RETURNING id, slug, name, phone, group_label, sent_at, created_at`,
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

export function getGuestName(siteSlug: string, guestSlug: string) {
  return unstable_cache(
    async () => {
      const r = await one<{ name: string }>(`SELECT g.name FROM guests g JOIN sites s ON s.id = g.site_id WHERE s.slug = $1 AND g.slug = $2`, [siteSlug, guestSlug]);
      return r?.name ?? null;
    },
    ["guest-v1", siteSlug, guestSlug],
    { tags: [`guests:${siteSlug}`], revalidate: 86400 },
  )();
}

/* ------------------------------ Wishes ------------------------------ */

type WishRow = { id: string | number; name: string; attendance: "Hadir" | "Tidak Hadir"; location: string | null; message: string; guest_slug: string | null; created_at: string | Date };
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
  const rows = await query<WishRow>(
    `SELECT id, name, attendance, location, message, guest_slug, created_at FROM wishes WHERE site_id = $1 ORDER BY created_at DESC, id DESC LIMIT $2 OFFSET $3`,
    [siteId, limit, offset],
  );
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
    `INSERT INTO wishes (site_id, name, attendance, location, message, guest_slug, ip_hash) VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, attendance, location, message, guest_slug, created_at`,
    [siteId, w.name, w.attendance, w.location, w.message, w.guestSlug, w.ipHash],
  );
  return toWish(r!);
}

export async function recentWishesFromIp(ipHash: string) {
  const r = await one<{ n: number }>(`SELECT COUNT(*)::int AS n FROM wishes WHERE ip_hash = $1 AND created_at > NOW() - INTERVAL '10 minutes'`, [ipHash]);
  return Number(r?.n ?? 0);
}

export async function deleteWish(siteId: number, id: number) {
  await query(`DELETE FROM wishes WHERE site_id = $1 AND id = $2`, [siteId, id]);
}

/* ------------------------------ Status helpers ------------------------------ */

export function isExpired(s: Pick<SiteRecord, "expiresAt">) {
  return !!s.expiresAt && new Date(s.expiresAt).getTime() < Date.now();
}

export function computeExpiry(plan: Plan, from = new Date()) {
  if (plan.activeMonths === null) return null;
  const d = new Date(from);
  d.setMonth(d.getMonth() + plan.activeMonths);
  return d.toISOString();
}
