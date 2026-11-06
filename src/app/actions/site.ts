"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { PAID_PLAN_IDS, type PlanId } from "@/lib/content";
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
} from "@/server/auth";
import { TAG } from "@/server/cache";
import { passwordHashOf, updateSiteContent, updateSiteFields } from "@/server/repositories/sites";
import { fail, type ActionResult } from "@/server/result";
import { sanitizeContent } from "@/server/validate";

/* Client admin of one invitation: login, content, password, publish request. */

const MAX_CONTENT_BYTES = 400_000;

export async function loginSiteAction(_: unknown, form: FormData): Promise<{ error?: string }> {
  const slug = String(form.get("slug") ?? "");
  const password = String(form.get("password") ?? "");
  const key = `site:${await clientIp()}:${slug}`;
  if (!(await loginAllowed(key))) return { error: "Terlalu banyak percobaan. Coba lagi 15 menit lagi." };
  const hash = await passwordHashOf(slug);
  if (!hash || !(await verifyPassword(password, hash))) {
    await recordLoginFailure(key);
    return { error: "Password salah." };
  }
  await clearLoginFailures(key);
  await setSession({ role: "site", slug, v: passwordVersion(hash) });
  redirect(`/${slug}/admin`);
}

export async function logoutSiteAction(slug: string) {
  const s = await getSession();
  if (s?.role === "site") await clearSession();
  redirect(s?.role === "owner" ? "/studio" : `/${slug}/admin`);
}

export async function saveContentAction(slug: string, content: unknown): Promise<ActionResult> {
  try {
    await requireSite(slug);
    if (JSON.stringify(content).length > MAX_CONTENT_BYTES) throw new Error("Isi undangan terlalu besar.");
    await updateSiteContent(slug, sanitizeContent(content));
    updateTag(TAG.site(slug));
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function saveWaTemplateAction(slug: string, template: string): Promise<ActionResult> {
  try {
    await requireSite(slug);
    await updateSiteFields(slug, { waTemplate: template.slice(0, 2000) || null });
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function changePasswordAction(slug: string, current: string, next: string): Promise<ActionResult> {
  try {
    await requireSite(slug);
    if (next.length < 8) throw new Error("Password baru minimal 8 karakter.");
    const stored = await passwordHashOf(slug);
    const s = await getSession();
    if (s?.role !== "owner" && (!stored || !(await verifyPassword(current, stored)))) throw new Error("Password lama salah.");
    const hash = await hashPassword(next);
    await updateSiteFields(slug, { passwordHash: hash });
    if (s?.role === "site") await setSession({ role: "site", slug, v: passwordVersion(hash) });
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** "Kirim ke admin": remember which package the client wants, so it shows up in Studio → Permintaan. */
export async function requestPublishAction(slug: string, planId: PlanId): Promise<ActionResult> {
  try {
    await requireSite(slug);
    if (!PAID_PLAN_IDS.includes(planId)) throw new Error("Paket tidak dikenal.");
    await updateSiteFields(slug, { requestPlan: planId, requestedAt: new Date().toISOString() });
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function canEdit(slug: string) {
  return canEditSite(slug);
}
