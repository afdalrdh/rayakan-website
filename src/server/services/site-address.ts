import "server-only";
import { slugify } from "@/lib/content";
import { RESERVED_SLUGS } from "@/lib/records";
import { findSite } from "../repositories/sites";

export type AddressCheck = { slug: string; available: boolean; reason?: string; suggestion?: string };

/** Whether `raw` (normalised to a slug) can become a new invitation address. */
export async function checkSiteAddress(raw: string): Promise<AddressCheck> {
  const slug = slugify(raw);
  if (slug.length < 3) return { slug, available: false, reason: "Minimal 3 huruf." };
  if (RESERVED_SLUGS.has(slug)) return { slug, available: false, reason: "Alamat ini dipakai sistem." };
  const taken = await findSite(slug);
  return { slug, available: !taken, reason: taken ? "Sudah dipakai." : undefined };
}

/** Like `checkSiteAddress`, plus a free variant ("nama-2", "nama-2027"…) when the address is taken. */
export async function checkSiteAddressWithSuggestion(raw: string): Promise<AddressCheck> {
  const r = await checkSiteAddress(raw);
  if (r.available || r.slug.length < 3 || RESERVED_SLUGS.has(r.slug)) return r;
  for (const n of [2, 3, 4, 5, 2026, 2027]) {
    const alt = await checkSiteAddress(`${r.slug}-${n}`);
    if (alt.available) return { ...r, suggestion: alt.slug };
  }
  return r;
}
