"use server";

import { updateTag } from "next/cache";
import { requireSite } from "@/server/auth";
import { TAG } from "@/server/cache";
import { deleteGuests, listGuests, markGuestSent, markGuestsSent, updateGuest } from "@/server/repositories/guests";
import { findSite } from "@/server/repositories/sites";
import { deleteWish, listWishes, wishStats } from "@/server/repositories/wishes";
import { fail, type ActionResult } from "@/server/result";
import { addGuests, cleanGuests, type GuestInput } from "@/server/services/guests";

/* Client admin: guest list and wishes of one invitation. */

/** The signed-in client's site (throws when the session doesn't allow it). */
async function ownSite(slug: string) {
  await requireSite(slug);
  const site = await findSite(slug);
  if (!site) throw new Error("Undangan tidak ditemukan.");
  return site;
}

const ids = (list: number[]) => list.map(Number).filter(Number.isFinite).slice(0, 5000);

export async function listGuestsAction(slug: string) {
  return listGuests((await ownSite(slug)).id);
}

export async function addGuestsAction(slug: string, input: GuestInput[]): Promise<ActionResult<{ added: number }>> {
  try {
    const { added } = await addGuests(await ownSite(slug), input, "reject");
    updateTag(TAG.guests(slug));
    return { ok: true, added: added.length };
  } catch (e) {
    return fail(e);
  }
}

export async function updateGuestAction(slug: string, guestId: number, f: { name: string; phone: string; groupLabel: string }): Promise<ActionResult> {
  try {
    const site = await ownSite(slug);
    const [clean] = cleanGuests([f]);
    if (!clean) throw new Error("Nama wajib diisi.");
    await updateGuest(site.id, guestId, clean);
    updateTag(TAG.guests(slug));
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteGuestsAction(slug: string, guestIds: number[]): Promise<ActionResult> {
  try {
    await deleteGuests((await ownSite(slug)).id, ids(guestIds));
    updateTag(TAG.guests(slug));
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function markSentAction(slug: string, guestId: number, sent: boolean): Promise<ActionResult> {
  try {
    await markGuestSent((await ownSite(slug)).id, guestId, sent);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function markSentBulkAction(slug: string, guestIds: number[], sent: boolean): Promise<ActionResult> {
  try {
    await markGuestsSent((await ownSite(slug)).id, ids(guestIds), sent);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function listWishesAction(slug: string) {
  const { id } = await ownSite(slug);
  const [wishes, stats] = await Promise.all([listWishes(id, 500), wishStats(id)]);
  return { wishes, stats };
}

export async function deleteWishAction(slug: string, wishId: number): Promise<ActionResult> {
  try {
    await deleteWish((await ownSite(slug)).id, wishId);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
