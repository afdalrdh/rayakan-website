import type { Plan, PlanId, WeddingContent } from "./content";

/**
 * Shapes of the stored records (sites, guests, wishes, reviews, settings) and
 * the small rules around them. Shared by the server and the UI, so this file
 * holds types and pure functions only: no database or secrets.
 */

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
  /** "self" = made by a visitor from the free editor, "studio" = made by the owner. */
  source: "studio" | "self";
  /** Package the client asked for when pressing "Kirim ke admin". */
  requestPlan: PlanId | null;
  requestedAt: string | null;
}

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

export type ReviewStatus = "pending" | "shown" | "hidden";

export interface ReviewRecord {
  id: number;
  siteId: number | null;
  siteSlug: string | null;
  name: string;
  occasion: string;
  city: string | null;
  rating: number;
  message: string;
  /** Public link to the invitation, only when its owner allowed it. */
  link: string | null;
  status: ReviewStatus;
  createdAt: string;
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

/** Paths that can never be a client address (app routes, files, marketing pages). */
export const RESERVED_SLUGS = new Set([
  "studio", "demo", "coba", "buat", "ulasan", "portofolio", "portfolio", "api", "admin", "canvas", "login", "masuk", "harga", "tema", "bantuan",
  "undangan-pernikahan", "undangan-ulang-tahun", "undangan-khitanan", "manifest.webmanifest", "opengraph-image",
  "_next", "favicon.ico", "robots.txt", "sitemap.xml", "brand", "fonts", "music", "themes", "uploads", "og", "landing",
]);

/** Paths under an invitation that can never be a guest's link. */
export const RESERVED_GUEST_SLUGS = new Set(["admin", "preview", "editor", "opengraph-image"]);

/** `base`, or `base-2`, `base-3`… whichever is not taken or reserved yet. Adds the result to `taken`. */
export function claimSlug(base: string, taken: Set<string>, reserved: Set<string> = RESERVED_GUEST_SLUGS) {
  let slug = base;
  for (let n = 2; taken.has(slug) || reserved.has(slug); n++) slug = `${base}-${n}`;
  taken.add(slug);
  return slug;
}

export function isExpired(s: Pick<SiteRecord, "expiresAt">, now = Date.now()) {
  return !!s.expiresAt && new Date(s.expiresAt).getTime() < now;
}

/** End of the active period for a plan started at `from` (null = active forever). */
export function computeExpiry(plan: Pick<Plan, "activeMonths">, from = new Date()) {
  if (plan.activeMonths === null) return null;
  const d = new Date(from);
  d.setMonth(d.getMonth() + plan.activeMonths);
  return d.toISOString();
}

/** Indonesian phone number as 62…, or "" when it doesn't look like one. */
export function normalizePhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0")) d = `62${d.slice(1)}`;
  else if (d.startsWith("8")) d = `62${d}`;
  return d.length >= 10 && d.length <= 15 ? d : "";
}
