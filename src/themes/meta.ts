/**
 * Theme presets (no React here, so the server can import it).
 *
 * A theme is only a starting point: colour mode, palette, font pair and one
 * layout per section. After a site is created the client can change any of
 * these on their own, so a site is never locked to its theme.
 *
 * To add a preset:
 *   1. add its id + settings below,
 *   2. add sample content in `src/lib/content/demo.ts` (DEMO_BY_THEME),
 *   3. take screenshots for `preview` (public/landing/<id>-desktop|mobile.webp).
 */

import { DEFAULT_LAYOUTS, type SiteLayouts } from "./layouts/catalog";
import { getFontPair, getPalette, type SiteStyle } from "./style";

export const THEME_IDS = ["arya", "afdal", "sage", "navy"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tagline: string;
  style: Omit<SiteStyle, "accent">;
  layouts: SiteLayouts;
  /** Library track used when a site is created with this theme. */
  defaultTrack: string;
  /** Screenshots for the landing page, plus a photo used as their blurred backdrop. */
  preview: { desktop: string; mobile: string; backdrop: string };
}

export const THEMES: Record<ThemeId, ThemeMeta> = {
  arya: {
    id: "arya",
    name: "Malam Emas",
    tagline: "Gelap, sinematik, aksen emas",
    style: { mode: "dark", palette: "emas", fonts: "klasik" },
    layouts: { ...DEFAULT_LAYOUTS },
    defaultTrack: "arya-background",
    preview: { desktop: "/landing/arya-desktop.webp", mobile: "/landing/arya-mobile.webp", backdrop: "/demo/arya/hero-desktop.jpg" },
  },
  afdal: {
    id: "afdal",
    name: "Putih Marun",
    tagline: "Terang, bersih, tipografi besar",
    style: { mode: "light", palette: "marun", fonts: "tegas" },
    layouts: { cover: "kaca", hero: "raksasa", couple: "ringkas", story: "bab", event: "kotak", venue: "berdampingan", gallery: "rapi", rsvp: "berdampingan", gift: "samping", closing: "foto" },
    defaultTrack: "afdal-background",
    preview: { desktop: "/landing/afdal-desktop.webp", mobile: "/landing/afdal-mobile.webp", backdrop: "/demo/afdal/hero.webp" },
  },
  sage: {
    id: "sage",
    name: "Taman Sage",
    tagline: "Terang, lembut, huruf sambung",
    style: { mode: "light", palette: "sage", fonts: "romantis" },
    layouts: { cover: "lengkung", hero: "lengkung", couple: "bulat", story: "zigzag", event: "kalender", venue: "tengah", gallery: "masonry", rsvp: "tengah", gift: "daftar", closing: "lengkung" },
    defaultTrack: "afdal-background",
    preview: { desktop: "/landing/sage-desktop.webp", mobile: "/landing/sage-mobile.webp", backdrop: "/demo/sage/venue.webp" },
  },
  navy: {
    id: "navy",
    name: "Navy Mewah",
    tagline: "Gelap, rapi, huruf majalah",
    style: { mode: "dark", palette: "navy", fonts: "mewah" },
    layouts: { cover: "sinema", hero: "editorial", couple: "editorial", story: "geser", event: "angka", venue: "linimasa", gallery: "geser", rsvp: "tab", gift: "amplop", closing: "belah" },
    defaultTrack: "arya-background",
    preview: { desktop: "/landing/navy-desktop.webp", mobile: "/landing/navy-mobile.webp", backdrop: "/demo/navy/venue.webp" },
  },
};

export function getThemeMeta(id: string | undefined): ThemeMeta {
  return THEMES[(id as ThemeId) ?? "arya"] ?? THEMES.arya;
}

/** Colours to show on a preset card (background, accent, muted). */
export function themeSwatch(t: ThemeMeta) {
  const p = getPalette(t.style.palette)[t.style.mode];
  return { bg: p.bg, accent: p.accent, muted: p.muted, fonts: getFontPair(t.style.fonts).name };
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
}

export const MUSIC_LIBRARY: MusicTrack[] = [
  { id: "arya-background", title: "Piano Romantis", artist: "Instrumental", src: "/music/arya-background.m4a" },
  { id: "afdal-background", title: "Akustik Hangat", artist: "Instrumental", src: "/music/afdal-background.mp3" },
];
