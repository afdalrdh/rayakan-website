"use server";

import { updateTag } from "next/cache";
import { namesOf, normalizeContent } from "@/lib/content";
import { normalizePhone } from "@/lib/records";
import { clientIp, generatePassword, getSession, hashPassword, ipHash, passwordVersion, setSession } from "@/server/auth";
import { TAG } from "@/server/cache";
import { insertSite, recentDraftsFrom } from "@/server/repositories/sites";
import { fail, type ActionResult } from "@/server/result";
import { checkSiteAddress, checkSiteAddressWithSuggestion } from "@/server/services/site-address";
import { sanitizeContent } from "@/server/validate";

/*
 * Self-serve drafts ("Coba Gratis"): a visitor who built an invitation in the
 * free editor saves it here. It becomes a real draft site with its own address
 * and password, waiting until they press "Kirim ke admin" and pay.
 */

const MAX_DRAFTS_PER_DAY = 5;
const MAX_CONTENT_BYTES = 400_000;

/** Address check while typing. Suggests a free variant when the name is taken. */
export async function checkDraftSlugAction(raw: string) {
  return checkSiteAddressWithSuggestion(raw);
}

export async function createDraftAction(input: { name: string; phone: string; slug: string; content: unknown; website?: string }): Promise<ActionResult<{ slug: string; password: string }>> {
  try {
    // Honeypot: real visitors never see or fill this field.
    if (input.website) throw new Error("Tidak dapat menyimpan.");
    const ip = ipHash(await clientIp());
    if ((await recentDraftsFrom(ip)) >= MAX_DRAFTS_PER_DAY) throw new Error("Sudah terlalu banyak draf dari perangkat ini hari ini. Hubungi admin lewat WhatsApp, ya.");
    const name = input.name.replace(/\s+/g, " ").trim().slice(0, 60);
    if (name.length < 2) throw new Error("Isi nama kamu dulu.");
    const phone = normalizePhone(input.phone);
    if (!phone) throw new Error("Nomor WhatsApp belum benar. Contoh: 0812 3456 7890");
    if (JSON.stringify(input.content ?? {}).length > MAX_CONTENT_BYTES) throw new Error("Isi undangan terlalu besar.");

    const content = sanitizeContent(normalizeContent(input.content));
    const names = namesOf(content);
    const check = await checkSiteAddress(input.slug || names.joined.replace("&", ""));
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
    updateTag(TAG.site(check.slug));
    updateTag(TAG.stats);
    return { ok: true, slug: check.slug, password };
  } catch (e) {
    return fail(e);
  }
}
