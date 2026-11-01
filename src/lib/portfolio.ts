import type { ThemeId } from "@/themes/meta";

/**
 * Weddings shown in "Momen bahagia, dirayakan" (landing + /portofolio).
 * Newest first. To add one: put its images in public/portfolio/<id>/ (or reuse
 * existing ones) and add an entry below. Nothing else needs to change.
 */
export interface PortfolioItem {
  id: string;
  couple: string;
  /** ISO date of the wedding. */
  date: string;
  city: string;
  venue: string;
  theme: ThemeId;
  palette: string;
  /** Portrait photo for the card. */
  cover: string;
  /** Screenshots shown in the detail popup. */
  desktop: string;
  mobile: string;
  /** One line from the couple or about the site. */
  note: string;
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "arya-almalia",
    couple: "Arya & Almalia",
    date: "2026-11-15",
    city: "Cimahi",
    venue: "Bale Pancaniti",
    theme: "arya",
    palette: "Emas Malam",
    cover: "/demo/arya/hero-mobile.png",
    desktop: "/landing/arya-desktop.webp",
    mobile: "/landing/arya-mobile.webp",
    note: "Nuansa sinematik dengan aksen emas, kisah cinta bergambar, dan galeri 25 foto.",
  },
  {
    id: "afdal-putri",
    couple: "Afdal & Putri",
    date: "2026-07-04",
    city: "Kabupaten Bandung",
    venue: "Marsoeta Coffee & Eatery",
    theme: "afdal",
    palette: "Marun Klasik",
    cover: "/demo/afdal/g-p3.webp",
    desktop: "/landing/afdal-desktop.webp",
    mobile: "/landing/afdal-mobile.webp",
    note: "Kisah cinta lima babak yang bergulir saat di-scroll, video prewedding, dan daftar hadiah.",
  },
];

export const portfolioNewestFirst = () => [...PORTFOLIO].sort((a, b) => b.date.localeCompare(a.date));
