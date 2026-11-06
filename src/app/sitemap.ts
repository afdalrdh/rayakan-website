import type { MetadataRoute } from "next";
import { THEME_IDS } from "@/lib/content";
import { SITE_URL } from "@/lib/messages";

/** Only the public marketing pages. Couples' invitations are private (noindex) and never listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/buat`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/portofolio`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...THEME_IDS.map((id) => ({ url: `${SITE_URL}/tema/${id}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
