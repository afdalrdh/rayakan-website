import "server-only";
import { unstable_cache } from "next/cache";
import { normalizeContent, toPlanId, type PlanId, type WeddingContent } from "@/lib/content";
import type { SiteRecord, SiteStatus } from "@/lib/records";
import { TAG } from "../cache";
import { one, query } from "../db/client";
import { iso, json } from "./rows";

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
  source: string | null;
  request_plan: string | null;
  requested_at: string | Date | null;
};

const COLS = `id, slug, title, plan_id, theme, status, content, wa_template, client_name, client_phone, notes, published_at, expires_at, created_at, updated_at, source, request_plan, requested_at`;

function toSite(r: SiteRow): SiteRecord {
  return {
    id: Number(r.id),
    slug: r.slug,
    title: r.title,
    planId: toPlanId(r.plan_id),
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
    source: r.source === "self" ? "self" : "studio",
    requestPlan: r.request_plan ? toPlanId(r.request_plan) : null,
    requestedAt: iso(r.requested_at),
  };
}

export async function findSite(slug: string) {
  const r = await one<SiteRow>(`SELECT ${COLS} FROM sites WHERE slug = $1`, [slug]);
  return r ? toSite(r) : null;
}

/** Public, cached read. Invalidated with `TAG.site(slug)` whenever the site changes. */
export function getPublicSite(slug: string) {
  return unstable_cache(() => findSite(slug), ["site-v2", slug], { tags: [TAG.site(slug)], revalidate: 86400 })();
}

/** Stored password hash (never leaves the server). */
export async function passwordHashOf(slug: string) {
  const r = await one<{ password_hash: string }>(`SELECT password_hash FROM sites WHERE slug = $1`, [slug]);
  return r?.password_hash ?? null;
}

export async function siteIdOf(slug: string) {
  const r = await one<{ id: string | number }>(`SELECT id FROM sites WHERE slug = $1`, [slug]);
  return r ? Number(r.id) : null;
}

/** Studio list with guest and wish counts. */
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
    `SELECT ${COLS},
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
  source?: "studio" | "self";
  createdIp?: string;
}) {
  const r = await one<SiteRow>(
    `INSERT INTO sites (slug, title, plan_id, theme, content, password_hash, client_name, client_phone, notes, source, created_ip)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING ${COLS}`,
    [input.slug, input.title, input.planId, input.content.theme, JSON.stringify(input.content), input.passwordHash, input.clientName, input.clientPhone, input.notes, input.source ?? "studio", input.createdIp ?? null],
  );
  return toSite(r!);
}

export async function updateSiteContent(slug: string, content: WeddingContent) {
  await query(`UPDATE sites SET content = $2, updated_at = NOW() WHERE slug = $1`, [slug, JSON.stringify(content)]);
}

/** Columns that `updateSiteFields` may change (field name → column). */
const FIELD_COLUMNS = {
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
  requestPlan: "request_plan",
  requestedAt: "requested_at",
} as const;

type SiteFields = {
  title: string;
  planId: PlanId;
  status: SiteStatus;
  waTemplate: string | null;
  clientName: string;
  clientPhone: string;
  notes: string;
  publishedAt: string | null;
  expiresAt: string | null;
  passwordHash: string;
  requestPlan: PlanId | null;
  requestedAt: string | null;
};

export async function updateSiteFields(slug: string, fields: Partial<SiteFields>) {
  const sets: string[] = [];
  const params: unknown[] = [slug];
  for (const [key, value] of Object.entries(fields)) {
    const column = FIELD_COLUMNS[key as keyof SiteFields];
    if (value === undefined || !column) continue;
    params.push(value);
    sets.push(`${column} = $${params.length}`);
  }
  if (!sets.length) return;
  await query(`UPDATE sites SET ${sets.join(", ")}, updated_at = NOW() WHERE slug = $1`, params);
}

export async function deleteSite(slug: string) {
  await query(`DELETE FROM sites WHERE slug = $1`, [slug]);
}

/** Drafts made from one (hashed) IP in the last day, to slow down spam. */
export async function recentDraftsFrom(ipHash: string) {
  const r = await one<{ n: number }>(`SELECT COUNT(*)::int AS n FROM sites WHERE created_ip = $1 AND created_at > NOW() - INTERVAL '1 day'`, [ipHash]);
  return Number(r?.n ?? 0);
}

/** Number of invitations made with Rayakan.my.id (shown on the landing page once it is meaningful). */
export const countSites = unstable_cache(
  async () => {
    try {
      const r = await one<{ n: number }>(`SELECT COUNT(*)::int AS n FROM sites`);
      return Number(r?.n ?? 0);
    } catch {
      return 0;
    }
  },
  ["sites-count-v1"],
  { tags: [TAG.stats], revalidate: 3600 },
);
