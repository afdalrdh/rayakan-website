"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  canEditSite,
  clearLoginFailures,
  clearSession,
  clientIp,
  getSession,
  hashPassword,
  loginAllowed,
  passwordVersion,
  recordLoginFailure,
  requireSite,
  setSession,
  verifyPassword,
} from "@/lib/server/auth";
import {
  countGuests,
  deleteGuests,
  deleteWish,
  findSite,
  getPlan,
  guestSlugsTaken,
  insertGuests,
  listGuests,
  listWishes,
  markGuestSent,
  markGuestsSent,
  RESERVED_GUEST_SLUGS,
  siteIdOf,
  updateGuest,
  updateSiteContent,
  updateSiteFields,
  wishStats,
} from "@/lib/server/data";
import { one } from "@/lib/server/db";
import { sanitizeContent } from "@/lib/server/validate";
import { guestSlugify } from "@/lib/messages";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

async function siteId(slug: string) {
  await requireSite(slug);
  const id = await siteIdOf(slug);
  if (!id) throw new Error("Undangan tidak ditemukan.");
  return id;
}

const fail = (e: unknown): { ok: false; error: string } => ({ ok: false, error: e instanceof Error ? e.message : "Terjadi kesalahan." });

/* ------------------------------ Login ------------------------------ */

export async function loginSiteAction(_: unknown, form: FormData): Promise<{ error?: string }> {
  const slug = String(form.get("slug") ?? "");
  const password = String(form.get("password") ?? "");
  const key = `site:${await clientIp()}:${slug}`;
  if (!(await loginAllowed(key))) return { error: "Terlalu banyak percobaan. Coba lagi 15 menit lagi." };
  const row = await one<{ password_hash: string }>(`SELECT password_hash FROM sites WHERE slug = $1`, [slug]);
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    await recordLoginFailure(key);
    return { error: "Password salah." };
  }
  await clearLoginFailures(key);
  await setSession({ role: "site", slug, v: passwordVersion(row.password_hash) });
  redirect(`/${slug}/admin`);
}

export async function logoutSiteAction(slug: string) {
  const s = await getSession();
  if (s?.role === "site") await clearSession();
  redirect(s?.role === "owner" ? "/studio" : `/${slug}/admin`);
}

/* ------------------------------ Content ------------------------------ */

export async function saveContentAction(slug: string, content: unknown): Promise<Result> {
  try {
    await requireSite(slug);
    if (JSON.stringify(content).length > 400_000) throw new Error("Isi undangan terlalu besar.");
    await updateSiteContent(slug, sanitizeContent(content));
    updateTag(`site:${slug}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function saveWaTemplateAction(slug: string, template: string): Promise<Result> {
  try {
    await requireSite(slug);
    await updateSiteFields(slug, { waTemplate: template.slice(0, 2000) || null });
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function changePasswordAction(slug: string, current: string, next: string): Promise<Result> {
  try {
    await requireSite(slug);
    if (next.length < 8) throw new Error("Password baru minimal 8 karakter.");
    const row = await one<{ password_hash: string }>(`SELECT password_hash FROM sites WHERE slug = $1`, [slug]);
    const s = await getSession();
    if (s?.role !== "owner" && (!row || !(await verifyPassword(current, row.password_hash)))) throw new Error("Password lama salah.");
    const hash = await hashPassword(next);
    await updateSiteFields(slug, { passwordHash: hash });
    if (s?.role === "site") await setSession({ role: "site", slug, v: passwordVersion(hash) });
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ------------------------------ Guests ------------------------------ */

export async function listGuestsAction(slug: string) {
  return listGuests(await siteId(slug));
}

export async function addGuestsAction(slug: string, input: { name: string; phone?: string; groupLabel?: string }[]): Promise<Result<{ added: number }>> {
  try {
    const id = await siteId(slug);
    const site = await findSite(slug);
    const plan = await getPlan(site!.planId);
    const current = await countGuests(id);
    const clean = input
      .map((g) => ({ name: g.name.replace(/\s+/g, " ").trim().slice(0, 100), phone: (g.phone ?? "").replace(/[^\d+]/g, "").slice(0, 20) || null, groupLabel: (g.groupLabel ?? "").trim().slice(0, 40) || null }))
      .filter((g) => g.name);
    if (plan.guestLimit !== null && current + clean.length > plan.guestLimit) {
      throw new Error(`Batas paket ${plan.name}: ${plan.guestLimit} tamu. Upgrade paket untuk tamu tanpa batas.`);
    }
    const taken = await guestSlugsTaken(id);
    const list = clean.map((g) => {
      const base = guestSlugify(g.name) || "tamu";
      let s = base;
      let n = 2;
      while (taken.has(s) || RESERVED_GUEST_SLUGS.has(s)) s = `${base}-${n++}`;
      taken.add(s);
      return { ...g, slug: s };
    });
    const added = await insertGuests(id, list);
    updateTag(`guests:${slug}`);
    return { ok: true, added: added.length };
  } catch (e) {
    return fail(e);
  }
}

export async function updateGuestAction(slug: string, guestId: number, f: { name: string; phone: string; groupLabel: string }): Promise<Result> {
  try {
    const id = await siteId(slug);
    const name = f.name.replace(/\s+/g, " ").trim().slice(0, 100);
    if (!name) throw new Error("Nama wajib diisi.");
    await updateGuest(id, guestId, { name, phone: f.phone.replace(/[^\d+]/g, "").slice(0, 20) || null, groupLabel: f.groupLabel.trim().slice(0, 40) || null });
    updateTag(`guests:${slug}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteGuestsAction(slug: string, ids: number[]): Promise<Result> {
  try {
    await deleteGuests(await siteId(slug), ids.map(Number).filter(Number.isFinite));
    updateTag(`guests:${slug}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function markSentAction(slug: string, guestId: number, sent: boolean): Promise<Result> {
  try {
    await markGuestSent(await siteId(slug), guestId, sent);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function markSentBulkAction(slug: string, ids: number[], sent: boolean): Promise<Result> {
  try {
    await markGuestsSent(await siteId(slug), ids.map(Number).filter(Number.isFinite).slice(0, 5000), sent);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ------------------------------ Wishes ------------------------------ */

export async function listWishesAction(slug: string) {
  const id = await siteId(slug);
  const [wishes, stats] = await Promise.all([listWishes(id, 500), wishStats(id)]);
  return { wishes, stats };
}

export async function deleteWishAction(slug: string, wishId: number): Promise<Result> {
  try {
    await deleteWish(await siteId(slug), wishId);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function canEdit(slug: string) {
  return canEditSite(slug);
}
