import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/messages";

/** Public marketing pages are crawlable; admin, editor and tools are not. Invitations carry their own noindex. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/canvas", "/api/", "/demo/admin", "/*/admin", "/*/editor", "/*/preview"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
