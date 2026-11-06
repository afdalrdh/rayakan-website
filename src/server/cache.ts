import "server-only";

/**
 * Cache tags, in one place so reads (`unstable_cache(..., { tags })`) and
 * writes (`updateTag` / `revalidateTag`) can never drift apart.
 */
export const TAG = {
  plans: "plans",
  settings: "settings",
  reviews: "reviews",
  /** Counters shown on the landing page. */
  stats: "stats",
  /** One invitation's content and status. */
  site: (slug: string) => `site:${slug}`,
  /** Guest names shown on one invitation's personal links. */
  guests: (slug: string) => `guests:${slug}`,
} as const;
