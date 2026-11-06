"use server";

import { updateTag } from "next/cache";
import { isOccasion, peopleOf } from "@/lib/content";
import { SITE_URL } from "@/lib/messages";
import type { ReviewStatus } from "@/lib/records";
import { requireOwner, requireSite } from "@/server/auth";
import { TAG } from "@/server/cache";
import { deleteReview, insertReview, reviewOfSite, setReviewStatus, updateReview, type ReviewInput } from "@/server/repositories/reviews";
import { findSite } from "@/server/repositories/sites";
import { fail, type ActionResult } from "@/server/result";

/*
 * Reviews of Rayakan.my.id. Clients write theirs from Admin → Pengaturan (it
 * waits for approval); the owner approves, edits or adds them in Studio → Ulasan.
 * Only real reviews: never add made-up ones.
 */

const STATUSES: ReviewStatus[] = ["pending", "shown", "hidden"];
const rating = (n: unknown) => Math.min(5, Math.max(1, Math.round(Number(n) || 5)));

function cleanReview(f: { name: string; occasion: string; city: string; rating: number; message: string; link: string }): ReviewInput {
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
  return { name, occasion: isOccasion(f.occasion) ? f.occasion : "nikah", city: f.city.trim().slice(0, 40) || null, rating: rating(f.rating), message, link };
}

/* ------------------------------ Owner (Studio) ------------------------------ */

/** Owner adds or edits a review (e.g. copied from a client's WhatsApp message, with their permission). */
export async function saveReviewAction(id: number | null, f: { name: string; occasion: string; city: string; rating: number; message: string; link: string; status: ReviewStatus }): Promise<ActionResult> {
  try {
    await requireOwner();
    const clean = cleanReview(f);
    const status = STATUSES.includes(f.status) ? f.status : "shown";
    if (id) await updateReview(id, { ...clean, status });
    else await insertReview(null, clean, status);
    updateTag(TAG.reviews);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function setReviewStatusAction(id: number, status: ReviewStatus): Promise<ActionResult> {
  try {
    await requireOwner();
    if (!STATUSES.includes(status)) throw new Error("Status tidak dikenal.");
    await setReviewStatus(id, status);
    updateTag(TAG.reviews);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteReviewAction(id: number): Promise<ActionResult> {
  try {
    await requireOwner();
    await deleteReview(id);
    updateTag(TAG.reviews);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ------------------------------ Client (Admin → Pengaturan) ------------------------------ */

export async function myReviewAction(slug: string) {
  await requireSite(slug);
  const site = await findSite(slug);
  return site ? reviewOfSite(site.id) : null;
}

/** The client's own review. Editing it sends it back for approval. */
export async function submitReviewAction(slug: string, f: { name: string; city: string; rating: number; message: string; showLink: boolean }): Promise<ActionResult> {
  try {
    await requireSite(slug);
    const site = await findSite(slug);
    if (!site) throw new Error("Undangan tidak ditemukan.");
    const fallbackName = peopleOf(site.content).map((p) => p.fullName.split(" ")[0]).filter(Boolean).join(" & ") || site.title;
    const message = f.message.trim().slice(0, 600);
    if (message.length < 10) throw new Error("Ceritakan sedikit lebih banyak, minimal 10 huruf.");
    const clean: ReviewInput = {
      name: f.name.replace(/\s+/g, " ").trim().slice(0, 60) || fallbackName,
      occasion: site.content.occasion,
      city: f.city.trim().slice(0, 40) || null,
      rating: rating(f.rating),
      message,
      link: f.showLink && site.status === "published" ? `${SITE_URL}/${slug}` : null,
    };
    const existing = await reviewOfSite(site.id);
    if (existing) await updateReview(existing.id, { ...clean, status: "pending" });
    else await insertReview(site.id, clean, "pending");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
