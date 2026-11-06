import "server-only";
import { guestSlugify } from "@/lib/messages";
import { claimSlug, type SiteRecord } from "@/lib/records";
import { getPlan } from "../repositories/plans";
import { countGuests, guestSlugsTaken, insertGuests } from "../repositories/guests";

export type GuestInput = { name: string; phone?: string | null; groupLabel?: string | null };

/** Trimmed name, digits-only phone, short group label. Empty names are dropped. */
export function cleanGuests(input: GuestInput[]) {
  return input
    .map((g) => ({
      name: g.name.replace(/\s+/g, " ").trim().slice(0, 100),
      phone: (g.phone ?? "").replace(/[^\d+]/g, "").slice(0, 20) || null,
      groupLabel: (g.groupLabel ?? "").trim().slice(0, 40) || null,
    }))
    .filter((g) => g.name);
}

/**
 * Adds guests to a site, each with its own link slug ("budi", "budi-2"…).
 * `onLimit: "reject"` fails when the plan's guest limit would be passed;
 * `"trim"` adds as many as still fit (used by the Excel import).
 */
export async function addGuests(site: Pick<SiteRecord, "id" | "planId">, input: GuestInput[], onLimit: "reject" | "trim" = "reject") {
  const plan = await getPlan(site.planId);
  const clean = cleanGuests(input);
  const room = plan.guestLimit === null ? Infinity : Math.max(0, plan.guestLimit - (await countGuests(site.id)));
  if (clean.length > room && onLimit === "reject") throw new Error(`Batas paket ${plan.name}: ${plan.guestLimit} tamu. Upgrade paket untuk tamu tanpa batas.`);
  const fitting = clean.slice(0, room);
  const taken = await guestSlugsTaken(site.id);
  const added = await insertGuests(
    site.id,
    fitting.map((g) => ({ ...g, slug: claimSlug(guestSlugify(g.name) || "tamu", taken) })),
  );
  return { added, overLimit: clean.length - fitting.length };
}
