"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "crypto";
import { DEFAULT_LAYOUTS, FONT_PAIR_IDS, isOccasion, OCCASIONS, PALETTE_IDS, PLAN_IDS, PLANS, SECTION_KEYS, slugify, THEME_IDS, type Occasion, type Plan, type PlanId, type SectionKey, type ThemeId } from "@/lib/content";
import {
  clearLoginFailures,
  clearSession,
  clientIp,
  generatePassword,
  hashPassword,
  loginAllowed,
  ownerCredentials,
  recordLoginFailure,
  requireOwner,
  setSession,
} from "@/lib/server/auth";
import {
  computeExpiry,
  deleteReview,
  deleteSite,
  findSite,
  getPlan,
  insertReview,
  insertSite,
  RESERVED_SLUGS,
  saveSettings,
  savePlan,
  setReviewStatus,
  updateReview,
  updateSiteFields,
  type AppSettings,
  type ReviewStatus,
} from "@/lib/server/data";
import { sampleContent, starterContent } from "@/lib/server/validate";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };
const fail = (e: unknown): { ok: false; error: string } => ({ ok: false, error: e instanceof Error ? e.message : "Terjadi kesalahan." });

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function loginOwnerAction(_: unknown, form: FormData): Promise<{ error?: string }> {
  const creds = ownerCredentials();
  if (!creds) return { error: "STUDIO_USERNAME dan STUDIO_PASSWORD belum diatur di server." };
  const key = `owner:${await clientIp()}`;
  if (!(await loginAllowed(key))) return { error: "Terlalu banyak percobaan. Coba lagi 15 menit lagi." };
  const u = String(form.get("username") ?? "").trim();
  const p = String(form.get("password") ?? "");
  if (!same(u.toLowerCase(), creds.username.toLowerCase()) || !same(p, creds.password)) {
    await recordLoginFailure(key);
    return { error: "Username atau password salah." };
  }
  await clearLoginFailures(key);
  await setSession({ role: "owner" });
  redirect("/studio");
}

export async function logoutOwnerAction() {
  await clearSession();
  redirect("/studio");
}

export async function checkSlugAction(raw: string): Promise<{ slug: string; available: boolean; reason?: string }> {
  await requireOwner();
  const slug = slugify(raw);
  if (slug.length < 3) return { slug, available: false, reason: "Minimal 3 karakter." };
  if (RESERVED_SLUGS.has(slug)) return { slug, available: false, reason: "Alamat ini dipakai sistem." };
  const exists = await findSite(slug);
  return { slug, available: !exists, reason: exists ? "Sudah dipakai." : undefined };
}

export async function createSiteAction(input: {
  firstName: string;
  secondName: string;
  slug: string;
  planId: PlanId;
  theme: ThemeId;
  eventDate: string;
  clientName: string;
  clientPhone: string;
  notes: string;
  /** Fill with the theme's sample photos & texts (portfolio / demo sites). */
  sample?: boolean;
  /** "Custom" start: own mode, palette and font pair with standard layouts. */
  style?: { mode: string; palette: string; fonts: string };
  occasion?: Occasion;
}): Promise<Result<{ slug: string; password: string }>> {
  try {
    await requireOwner();
    const occasion: Occasion = isOccasion(input.occasion) ? input.occasion : "nikah";
    const single = OCCASIONS[occasion].single;
    const first = input.firstName.trim().slice(0, 20);
    const second = single ? "" : input.secondName.trim().slice(0, 20);
    if (!first || (!single && !second)) throw new Error(single ? "Nama panggilan wajib diisi." : "Nama panggilan kedua mempelai wajib diisi.");
    const check = await checkSlugAction(input.slug || (single ? first : `${first}-${second}`));
    if (!check.available) throw new Error(`Alamat tidak bisa dipakai: ${check.reason}`);
    const planId = (PLAN_IDS as string[]).includes(input.planId) ? input.planId : "mandiri";
    const password = generatePassword();
    const content = (input.sample ? sampleContent : starterContent)((THEME_IDS as readonly string[]).includes(input.theme) ? input.theme : "arya", first, second, input.eventDate, occasion);
    if (input.style) {
      content.style = { mode: input.style.mode === "dark" ? "dark" : "light", palette: PALETTE_IDS.includes(input.style.palette) ? input.style.palette : "marun", fonts: FONT_PAIR_IDS.includes(input.style.fonts) ? input.style.fonts : "klasik", accent: "", decor: "none" };
      content.layouts = { ...DEFAULT_LAYOUTS };
    }
    await insertSite({
      slug: check.slug,
      title: single ? first : `${first} & ${second}`,
      planId,
      content,
      passwordHash: await hashPassword(password),
      clientName: input.clientName.trim().slice(0, 80),
      clientPhone: input.clientPhone.replace(/[^\d+]/g, "").slice(0, 20),
      notes: input.notes.trim().slice(0, 500),
    });
    updateTag(`site:${check.slug}`);
    return { ok: true, slug: check.slug, password };
  } catch (e) {
    return fail(e);
  }
}

/** Publishing starts the active period of the package. */
export async function setPublishedAction(slug: string, publish: boolean): Promise<Result> {
  try {
    await requireOwner();
    const site = await findSite(slug);
    if (!site) throw new Error("Undangan tidak ditemukan.");
    if (publish) {
      // A free draft gets the package the client asked for (or Edit Sendiri) when it goes live.
      const planId = site.planId === "gratis" ? site.requestPlan ?? "mandiri" : site.planId;
      const plan = await getPlan(planId);
      const start = site.publishedAt ? new Date(site.publishedAt) : new Date();
      await updateSiteFields(slug, { planId, status: "published", publishedAt: start.toISOString(), expiresAt: computeExpiry(plan, start) });
      updateTag("stats");
    } else {
      await updateSiteFields(slug, { status: "draft" });
    }
    updateTag(`site:${slug}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function updateSiteMetaAction(
  slug: string,
  f: { planId: PlanId; clientName: string; clientPhone: string; notes: string; expiresAt: string | null },
): Promise<Result> {
  try {
    await requireOwner();
    const site = await findSite(slug);
    if (!site) throw new Error("Undangan tidak ditemukan.");
    const planId = (PLAN_IDS as string[]).includes(f.planId) ? f.planId : site.planId;
    let expiresAt = f.expiresAt && !Number.isNaN(Date.parse(f.expiresAt)) ? new Date(f.expiresAt).toISOString() : null;
    if (planId !== site.planId && site.publishedAt) expiresAt = computeExpiry(await getPlan(planId), new Date(site.publishedAt));
    await updateSiteFields(slug, {
      planId,
      clientName: f.clientName.trim().slice(0, 80),
      clientPhone: f.clientPhone.replace(/[^\d+]/g, "").slice(0, 20),
      notes: f.notes.trim().slice(0, 500),
      expiresAt,
    });
    updateTag(`site:${slug}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function resetPasswordAction(slug: string): Promise<Result<{ password: string }>> {
  try {
    await requireOwner();
    const password = generatePassword();
    await updateSiteFields(slug, { passwordHash: await hashPassword(password) });
    return { ok: true, password };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteSiteAction(slug: string, confirm: string): Promise<Result> {
  try {
    await requireOwner();
    if (confirm !== slug) throw new Error("Ketik alamat undangan untuk konfirmasi.");
    await deleteSite(slug);
    updateTag(`site:${slug}`);
    updateTag(`guests:${slug}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function savePlansAction(plans: Plan[]): Promise<Result> {
  try {
    await requireOwner();
    for (const [i, id] of PLAN_IDS.entries()) {
      const p = plans.find((x) => x.id === id);
      if (!p) continue;
      const base = PLANS[id];
      const num = (v: unknown, min: number, max: number, d: number) => (typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : d);
      await savePlan(
        {
          id,
          name: String(p.name || base.name).slice(0, 30),
          tagline: String(p.tagline ?? "").slice(0, 80),
          price: num(p.price, 0, 50_000_000, base.price),
          normalPrice: num(p.normalPrice, 0, 50_000_000, base.normalPrice),
          activeMonths: p.activeMonths === null ? null : num(p.activeMonths, 1, 120, 12),
          galleryLimit: num(p.galleryLimit, 0, 60, base.galleryLimit),
          storyLimit: num(p.storyLimit, 0, 10, base.storyLimit),
          guestLimit: p.guestLimit === null ? null : num(p.guestLimit, 0, 100_000, 150),
          locked: (p.locked ?? []).filter((k): k is SectionKey => (SECTION_KEYS as readonly string[]).includes(k)),
          musicUpload: !!p.musicUpload,
          customColor: !!p.customColor,
          benefits: (p.benefits ?? []).map((b) => String(b).trim().slice(0, 90)).filter(Boolean).slice(0, 12),
          highlight: !!p.highlight,
        },
        i,
      );
    }
    updateTag("plans");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function saveSettingsAction(s: AppSettings): Promise<Result> {
  try {
    await requireOwner();
    await saveSettings({
      adminWhatsapp: s.adminWhatsapp.replace(/[^\d]/g, "").slice(0, 16),
      instagram: s.instagram.replace(/[^a-zA-Z0-9._]/g, "").slice(0, 30),
      promoLabel: s.promoLabel.trim().slice(0, 60),
      promoEndsAt: /^\d{4}-\d{2}-\d{2}$/.test(s.promoEndsAt) ? s.promoEndsAt : "",
    });
    updateTag("settings");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ------------------------------ Reviews ------------------------------ */

function cleanReview(f: { name: string; occasion: string; city: string; rating: number; message: string; link: string }) {
  const name = f.name.replace(/\s+/g, " ").trim().slice(0, 60);
  const message = f.message.trim().slice(0, 600);
  if (!name || message.length < 5) throw new Error("Nama dan isi ulasan wajib diisi.");
  let link: string | null = null;
  if (f.link.trim()) {
    try {
      const u = new URL(f.link.trim());
      if (u.protocol === "https:") link = u.toString().slice(0, 300);
    } catch {
      throw new Error("Link harus diawali https://");
    }
  }
  return {
    name,
    occasion: isOccasion(f.occasion) ? f.occasion : "nikah",
    city: f.city.trim().slice(0, 40) || null,
    rating: Math.min(5, Math.max(1, Math.round(Number(f.rating) || 5))),
    message,
    link,
  };
}

/** Owner adds or edits a review (e.g. copied from a client's WhatsApp message, with their permission). */
export async function saveReviewAction(id: number | null, f: { name: string; occasion: string; city: string; rating: number; message: string; link: string; status: ReviewStatus }): Promise<Result> {
  try {
    await requireOwner();
    const clean = cleanReview(f);
    const status: ReviewStatus = ["pending", "shown", "hidden"].includes(f.status) ? f.status : "shown";
    if (id) await updateReview(id, { ...clean, status });
    else await insertReview(null, clean, status);
    updateTag("reviews");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function setReviewStatusAction(id: number, status: ReviewStatus): Promise<Result> {
  try {
    await requireOwner();
    if (!["pending", "shown", "hidden"].includes(status)) throw new Error("Status tidak dikenal.");
    await setReviewStatus(id, status);
    updateTag("reviews");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteReviewAction(id: number): Promise<Result> {
  try {
    await requireOwner();
    await deleteReview(id);
    updateTag("reviews");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
