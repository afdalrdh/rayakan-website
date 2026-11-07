import type { MetadataRoute } from "next";
import { THEME_IDS } from "@/lib/content";
import { OCCASION_PAGE_LIST } from "@/lib/marketing";
import { SITE_URL } from "@/lib/messages";

/** Only the public marketing pages. Clients' invitations are private (noindex) and never listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page("/", 1, "weekly"),
    ...OCCASION_PAGE_LIST.map((p) => page(p.path, 0.9, "weekly")),
    page("/buat", 0.8),
    page("/portofolio", 0.7),
    ...THEME_IDS.map((id) => page(`/tema/${id}`, 0.6)),
  ];
}
