"use server";

import { updateTag } from "next/cache";
import { namesOf, normalizeContent, slugify } from "@/lib/content";
import { clientIp, generatePassword, getSession, hashPassword, ipHash, passwordVersion, setSession } from "@/lib/server/auth";
import { findSite, insertSite, recentDraftsFrom, RESERVED_SLUGS } from "@/lib/server/data";
import { sanitizeContent } from "@/lib/server/validate";

/*
 * Self-serve drafts ("Coba Gratis"): a visitor who built an invitation in the
 * free editor saves it here. It becomes a real draft site with its own address
 * and password, waiting until they press "Kirim ke admin" and pay.
 */

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };
const fail = (e: unknown): { ok: false; error: string } => ({ ok: false, error: e instanceof Error ? e.message : "Terjadi kesalahan." });

const MAX_DRAFTS_PER_DAY = 5;

async function slugStatus(raw: string): Promise<{ slug: string; available: boolean; reason?: string }> {
  const slug = slugify(raw);
  if (slug.length < 3) return { slug, available: false, reason: "Minimal 3 huruf." };
  if (RESERVED_SLUGS.has(slug)) return { slug, available: false, reason: "Alamat ini dipakai sistem." };
  const exists = await findSite(slug);
  return { slug, available: !exists, reason: exists ? "Sudah dipakai orang lain." : undefined };
}

/** Address check while typing. Suggests a free variant when the name is taken. */
export async function checkDraftSlugAction(raw: string): Promise<{ slug: string; available: boolean; reason?: string; suggestion?: string }> {
  const r = await slugStatus(raw);
  if (r.available || r.slug.length < 3 || RESERVED_SLUGS.has(r.slug)) return r;
  for (const n of [2, 3, 4, 5, 2026, 2027]) {
    const alt = await slugStatus(`${r.slug}-${n}`);
    if (alt.available) return { ...r, suggestion: alt.slug };
  }
  return r;
}

/** Indonesian phone number as 62…, or "" when it doesn't look like one. */
function cleanPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0")) d = `62${d.slice(1)}`;
  else if (d.startsWith("8")) d = `62${d}`;
  return d.length >= 10 && d.length <= 15 ? d : "";
}

export async function createDraftAction(input: { name: string; phone: string; slug: string; content: unknown; website?: string }): Promise<Result<{ slug: string; password: string }>> {
  try {
    // Honeypot: real visitors never see or fill this field.
    if (input.website) throw new Error("Tidak dapat menyimpan.");
    const ip = ipHash(await clientIp());
    if ((await recentDraftsFrom(ip)) >= MAX_DRAFTS_PER_DAY) throw new Error("Sudah terlalu banyak draf dari perangkat ini hari ini. Hubungi admin lewat WhatsApp, ya.");
    const name = input.name.replace(/\s+/g, " ").trim().slice(0, 60);
    if (name.length < 2) throw new Error("Isi nama kamu dulu.");
    const phone = cleanPhone(input.phone);
    if (!phone) throw new Error("Nomor WhatsApp belum benar. Contoh: 0812 3456 7890");
    if (JSON.stringify(input.content ?? {}).length > 400_000) throw new Error("Isi undangan terlalu besar.");

    const content = sanitizeContent(normalizeContent(input.content));
    const names = namesOf(content);
    const check = await slugStatus(input.slug || names.joined.replace("&", ""));
    if (!check.available) throw new Error(`Alamat ${check.slug || "itu"} tidak bisa dipakai: ${check.reason}`);

    const password = generatePassword();
    const hash = await hashPassword(password);
    await insertSite({
      slug: check.slug,
      title: names.joined || name,
      planId: "gratis",
      content,
      passwordHash: hash,
      clientName: name,
      clientPhone: phone,
      notes: "Dibuat sendiri dari Coba Gratis",
      source: "self",
      createdIp: ip,
    });
    // Log the visitor into their new draft (the owner keeps their Studio session).
    const session = await getSession();
    if (session?.role !== "owner") await setSession({ role: "site", slug: check.slug, v: passwordVersion(hash) });
    updateTag(`site:${check.slug}`);
    updateTag("stats");
    return { ok: true, slug: check.slug, password };
  } catch (e) {
    return fail(e);
  }
}
