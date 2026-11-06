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

import type { Occasion } from "@/lib/content/occasion";
import { DEFAULT_LAYOUTS, type SiteLayouts } from "./layouts/catalog";
import { getFontPair, getPalette, type SiteStyle } from "./style";

export const THEME_IDS = ["arya", "afdal", "sage", "navy", "jawa", "sunda", "sejoli", "lukis", "kecil", "konfeti", "angkasa", "khitan"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

/** Style filters in the theme catalogue (landing, /buat, editor). */
export const THEME_TAGS = ["Elegan", "Adat", "Ilustrasi", "Foto Masa Kecil", "Anak", "Islami"] as const;
export type ThemeTag = (typeof THEME_TAGS)[number];

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tagline: string;
  /** Occasion the sample is made for. Every theme can still be used for any occasion. */
  occasion: Occasion;
  tags: ThemeTag[];
  /** Shown as a small badge on catalogue cards. */
  badge?: "Baru";
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
    occasion: "nikah",
    tags: ["Elegan"],
    style: { mode: "dark", palette: "emas", fonts: "klasik", decor: "none" },
    layouts: { ...DEFAULT_LAYOUTS },
    defaultTrack: "arya-background",
    preview: { desktop: "/landing/arya-desktop.webp", mobile: "/landing/arya-mobile.webp", backdrop: "/demo/arya/hero-desktop.jpg" },
  },
  afdal: {
    id: "afdal",
    name: "Putih Marun",
    tagline: "Terang, bersih, tipografi besar",
    occasion: "nikah",
    tags: ["Elegan"],
    style: { mode: "light", palette: "marun", fonts: "tegas", decor: "none" },
    layouts: { cover: "kaca", hero: "raksasa", couple: "ringkas", story: "bab", event: "kotak", venue: "berdampingan", gallery: "rapi", rsvp: "berdampingan", gift: "samping", closing: "foto" },
    defaultTrack: "afdal-background",
    preview: { desktop: "/landing/afdal-desktop.webp", mobile: "/landing/afdal-mobile.webp", backdrop: "/demo/afdal/hero.webp" },
  },
  sage: {
    id: "sage",
    name: "Taman Sage",
    tagline: "Terang, lembut, huruf sambung",
    occasion: "nikah",
    tags: ["Elegan"],
    style: { mode: "light", palette: "sage", fonts: "romantis", decor: "none" },
    layouts: { cover: "lengkung", hero: "lengkung", couple: "bulat", story: "zigzag", event: "kalender", venue: "tengah", gallery: "masonry", rsvp: "tengah", gift: "daftar", closing: "lengkung" },
    defaultTrack: "afdal-background",
    preview: { desktop: "/landing/sage-desktop.webp", mobile: "/landing/sage-mobile.webp", backdrop: "/demo/sage/venue.webp" },
  },
  navy: {
    id: "navy",
    name: "Navy Mewah",
    tagline: "Gelap, rapi, huruf majalah",
    occasion: "nikah",
    tags: ["Elegan"],
    style: { mode: "dark", palette: "navy", fonts: "mewah", decor: "none" },
    layouts: { cover: "sinema", hero: "editorial", couple: "editorial", story: "geser", event: "angka", venue: "linimasa", gallery: "geser", rsvp: "tab", gift: "amplop", closing: "belah" },
    defaultTrack: "arya-background",
    preview: { desktop: "/landing/navy-desktop.webp", mobile: "/landing/navy-mobile.webp", backdrop: "/demo/navy/venue.webp" },
  },
  jawa: {
    id: "jawa",
    name: "Sekar Kedhaton",
    tagline: "Adat Jawa: lukisan pengantin, gunungan & melati",
    occasion: "nikah",
    tags: ["Adat", "Ilustrasi"],
    badge: "Baru",
    style: { mode: "light", palette: "sogan", fonts: "agung", decor: "jawa" },
    layouts: { cover: "gerbang", hero: "lukisan", couple: "medali", story: "linimasa", event: "kalender", venue: "kartu", gallery: "rapi", rsvp: "tengah", gift: "kartu", closing: "polos" },
    defaultTrack: "afdal-background",
    preview: preview("jawa"),
  },
  sunda: {
    id: "sunda",
    name: "Pasundan Asri",
    tagline: "Adat Sunda: lukisan siger, sawah & gunung",
    occasion: "nikah",
    tags: ["Adat", "Ilustrasi"],
    badge: "Baru",
    style: { mode: "light", palette: "padi", fonts: "klasik", decor: "sunda" },
    layouts: { cover: "surat", hero: "lukisan", couple: "medali", story: "zigzag", event: "kotak", venue: "tengah", gallery: "mozaik", rsvp: "tab", gift: "daftar", closing: "polos" },
    defaultTrack: "afdal-background",
    preview: preview("sunda"),
  },
  sejoli: {
    id: "sejoli",
    name: "Dua Sejoli",
    tagline: "Ilustrasi chibi pengantin yang manis",
    occasion: "nikah",
    tags: ["Ilustrasi"],
    badge: "Baru",
    style: { mode: "light", palette: "blush", fonts: "romantis", decor: "doodle" },
    layouts: { cover: "surat", hero: "lukisan", couple: "medali", story: "linimasa", event: "kalender", venue: "kartu", gallery: "rapi", rsvp: "obrolan", gift: "amplop", closing: "polos" },
    defaultTrack: "afdal-background",
    preview: preview("sejoli"),
  },
  lukis: {
    id: "lukis",
    name: "Taman Lukis",
    tagline: "Lukisan cat air, pengganti foto prewedding",
    occasion: "nikah",
    tags: ["Ilustrasi", "Elegan"],
    badge: "Baru",
    style: { mode: "light", palette: "rose", fonts: "elegan", decor: "bunga" },
    layouts: { cover: "surat", hero: "lukisan", couple: "medali", story: "geser", event: "angka", venue: "tengah", gallery: "masonry", rsvp: "tengah", gift: "kartu", closing: "polos" },
    defaultTrack: "afdal-background",
    preview: preview("lukis"),
  },
  kecil: {
    id: "kecil",
    name: "Kenangan Kecil",
    tagline: "Foto masa kecil atau versi anak buatan AI",
    occasion: "nikah",
    tags: ["Foto Masa Kecil"],
    badge: "Baru",
    style: { mode: "light", palette: "permen", fonts: "romantis", decor: "doodle" },
    layouts: { cover: "stiker", hero: "polaroid", couple: "bulat", story: "linimasa", event: "kotak", venue: "kartu", gallery: "masonry", rsvp: "obrolan", gift: "samping", closing: "polos" },
    defaultTrack: "afdal-background",
    preview: preview("kecil"),
  },
  konfeti: {
    id: "konfeti",
    name: "Pesta Konfeti",
    tagline: "Ulang tahun ceria: balon, kue & konfeti",
    occasion: "ultah",
    tags: ["Anak", "Ilustrasi"],
    badge: "Baru",
    style: { mode: "light", palette: "ceria", fonts: "ceria", decor: "pesta" },
    layouts: { cover: "kado", hero: "lukisan", couple: "medali", story: "linimasa", event: "kotak", venue: "kartu", gallery: "rapi", rsvp: "obrolan", gift: "amplop", closing: "polos" },
    defaultTrack: "afdal-background",
    preview: preview("konfeti"),
  },
  angkasa: {
    id: "angkasa",
    name: "Petualang Angkasa",
    tagline: "Ulang tahun anak: astronaut cilik & planet",
    occasion: "ultah",
    tags: ["Anak", "Ilustrasi"],
    badge: "Baru",
    style: { mode: "dark", palette: "angkasa", fonts: "ceria", decor: "angkasa" },
    layouts: { cover: "gerbang", hero: "lukisan", couple: "medali", story: "linimasa", event: "angka", venue: "linimasa", gallery: "geser", rsvp: "tab", gift: "daftar", closing: "polos" },
    defaultTrack: "afdal-background",
    preview: preview("angkasa"),
  },
  khitan: {
    id: "khitan",
    name: "Khitan Ceria",
    tagline: "Tasyakuran khitanan: masjid, lampion & bintang",
    occasion: "khitan",
    tags: ["Islami", "Anak", "Ilustrasi"],
    badge: "Baru",
    style: { mode: "light", palette: "zamrud", fonts: "ceria", decor: "islami" },
    layouts: { cover: "gerbang", hero: "lukisan", couple: "medali", story: "linimasa", event: "kalender", venue: "kartu", gallery: "rapi", rsvp: "tengah", gift: "kartu", closing: "polos" },
    defaultTrack: "afdal-background",
    preview: preview("khitan"),
  },
};

/** Screenshots of /tema/<id> in public/landing (made by scripts/theme-shots). */
function preview(id: string) {
  return { desktop: `/landing/${id}-desktop.webp`, mobile: `/landing/${id}-mobile.webp`, backdrop: `/landing/${id}-desktop.webp` };
}

export const isThemeId = (v: unknown): v is ThemeId => typeof v === "string" && (THEME_IDS as readonly string[]).includes(v);

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
  /** Occasions the track suits; the editor lists these first. */
  occasions: Occasion[];
  /** Short mood shown in the editor, e.g. "Piano · romantis". */
  mood: string;
}

/**
 * Background music anyone can pick. Only add tracks you have the right to use
 * for every client (own recordings, or royalty-free music whose licence allows
 * it, e.g. Pixabay Music or YouTube Audio Library). Popular songs are
 * copyrighted: clients who want one upload it themselves. See public/music/README.md.
 */
export const MUSIC_LIBRARY: MusicTrack[] = [
  { id: "arya-background", title: "Piano Romantis", artist: "Instrumental", src: "/music/arya-background.m4a", occasions: ["nikah"], mood: "Piano · romantis" },
  { id: "afdal-background", title: "Akustik Hangat", artist: "Instrumental", src: "/music/afdal-background.mp3", occasions: ["nikah", "ultah", "khitan"], mood: "Gitar akustik · hangat" },
];

/** Tracks for an occasion first, then the rest. */
export function musicFor(occasion: Occasion) {
  const fits = (t: MusicTrack) => t.occasions.includes(occasion);
  return { suggested: MUSIC_LIBRARY.filter(fits), others: MUSIC_LIBRARY.filter((t) => !fits(t)) };
}
