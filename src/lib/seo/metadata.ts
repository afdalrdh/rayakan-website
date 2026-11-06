import type { Metadata } from "next";
import type { OccasionPage } from "../marketing";

/** Title, description, canonical and share card for an occasion page. */
export function occasionMetadata(page: OccasionPage): Metadata {
  return {
    title: { absolute: `${page.title} | Rayakan.my.id` },
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
      type: "website",
      images: [{ url: page.ogImage, width: 1200, height: 630, alt: `${page.name} digital Rayakan.my.id` }],
    },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [page.ogImage] },
  };
}
