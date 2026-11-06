import "server-only";
import { unstable_cache } from "next/cache";
import type { ReviewRecord, ReviewStatus } from "@/lib/records";
import { TAG } from "../cache";
import { one, query } from "../db/client";
import { iso } from "./rows";

type ReviewRow = {
  id: string | number;
  site_id: string | number | null;
  site_slug?: string | null;
  name: string;
  occasion: string;
  city: string | null;
  rating: number;
  message: string;
  link: string | null;
  status: ReviewStatus;
  created_at: string | Date;
};

const toReview = (r: ReviewRow): ReviewRecord => ({
  id: Number(r.id),
  siteId: r.site_id === null ? null : Number(r.site_id),
  siteSlug: r.site_slug ?? null,
  name: r.name,
  occasion: r.occasion,
  city: r.city,
  rating: Number(r.rating),
  message: r.message,
  link: r.link,
  status: r.status,
  createdAt: iso(r.created_at)!,
});

const SELECT = `SELECT r.id, r.site_id, s.slug AS site_slug, r.name, r.occasion, r.city, r.rating, r.message, r.link, r.status, r.created_at
  FROM reviews r LEFT JOIN sites s ON s.id = r.site_id`;

export type ReviewInput = { name: string; occasion: string; city: string | null; rating: number; message: string; link: string | null };

export async function listReviews() {
  const rows = await query<ReviewRow>(`${SELECT} ORDER BY r.created_at DESC LIMIT 500`);
  return rows.map(toReview);
}

/** Approved reviews for the landing page (cached; tag "reviews"). Never fails the page. */
export const getShownReviews = unstable_cache(
  async () => {
    try {
      const rows = await query<ReviewRow>(`${SELECT} WHERE r.status = 'shown' ORDER BY r.created_at DESC LIMIT 60`);
      return rows.map(toReview);
    } catch (e) {
      console.error("[reviews] unavailable:", e);
      return [] as ReviewRecord[];
    }
  },
  ["reviews-shown-v1"],
  { tags: [TAG.reviews], revalidate: 3600 },
);

export async function reviewOfSite(siteId: number) {
  const r = await one<ReviewRow>(`${SELECT} WHERE r.site_id = $1 ORDER BY r.created_at DESC LIMIT 1`, [siteId]);
  return r ? toReview(r) : null;
}

export async function insertReview(siteId: number | null, f: ReviewInput, status: ReviewStatus) {
  await query(`INSERT INTO reviews (site_id, name, occasion, city, rating, message, link, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [siteId, f.name, f.occasion, f.city, f.rating, f.message, f.link, status]);
}

export async function updateReview(id: number, f: ReviewInput & { status?: ReviewStatus }) {
  await query(`UPDATE reviews SET name = $2, occasion = $3, city = $4, rating = $5, message = $6, link = $7, status = COALESCE($8, status) WHERE id = $1`, [id, f.name, f.occasion, f.city, f.rating, f.message, f.link, f.status ?? null]);
}

export async function setReviewStatus(id: number, status: ReviewStatus) {
  await query(`UPDATE reviews SET status = $2 WHERE id = $1`, [id, status]);
}

export async function deleteReview(id: number) {
  await query(`DELETE FROM reviews WHERE id = $1`, [id]);
}
