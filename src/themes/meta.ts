/**
 * Theme catalogue (no React here, so the server can import it for validation).
 *
 * To add a theme:
 *   1. add its id + metadata below,
 *   2. build `src/themes/<id>/` (render from WeddingContent),
 *   3. register the component in `src/themes/index.tsx`,
 *   4. add sample content in `src/lib/content/demo.ts`.
 */

export const THEME_IDS = ["arya", "afdal"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export interface Palette {
  name: string;
  /** Page background */
  bg: string;
  /** Alternate section background */
  alt: string;
  /** Cards (schedule, countdown, form) */
  card: string;
  /** Form inputs */
  input: string;
  /** Headings, buttons — the brand colour of the site */
  accent: string;
  /** Labels, lines, secondary text */
  muted: string;
}

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tagline: string;
  tone: "dark" | "light";
  palettes: Record<string, Palette>;
  defaultPalette: string;
  /** Photos shown per story chapter (1 = main photo only, 4 = 2×2 grid). */
  storyPhotos: 1 | 4;
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
    tone: "dark",
    defaultPalette: "emas",
    storyPhotos: 1,
    defaultTrack: "arya-background",
    preview: { desktop: "/landing/arya-desktop.webp", mobile: "/landing/arya-mobile.webp", backdrop: "/demo/arya/hero-desktop.jpg" },
    palettes: {
      emas: { name: "Emas Malam", bg: "#0B0C0E", alt: "#141315", card: "#141518", input: "#1A1B1F", accent: "#E5C07B", muted: "#C5A059" },
      sage: { name: "Sage", bg: "#0C0F0D", alt: "#121714", card: "#151A17", input: "#1B211D", accent: "#CBD7B4", muted: "#9DB08A" },
      rose: { name: "Rose Gold", bg: "#100C0D", alt: "#171213", card: "#1A1416", input: "#211A1C", accent: "#EAC2BE", muted: "#C99597" },
      navy: { name: "Navy Champagne", bg: "#0A0D14", alt: "#10141D", card: "#131824", input: "#1A2030", accent: "#DCCBA3", muted: "#B3A27B" },
      marun: { name: "Marun", bg: "#0F0909", alt: "#170E0E", card: "#1B1112", input: "#231718", accent: "#E6BC8C", muted: "#BF9465" },
      perak: { name: "Perak", bg: "#0B0B0C", alt: "#131314", card: "#161618", input: "#1C1C1F", accent: "#E4E4E4", muted: "#A8A8AD" },
    },
  },
  afdal: {
    id: "afdal",
    name: "Putih Marun",
    tagline: "Terang, bersih, tipografi besar",
    tone: "light",
    defaultPalette: "maroon",
    storyPhotos: 4,
    defaultTrack: "afdal-background",
    preview: { desktop: "/landing/afdal-desktop.webp", mobile: "/landing/afdal-mobile.webp", backdrop: "/demo/afdal/hero.webp" },
    palettes: {
      maroon: { name: "Marun Klasik", bg: "#FFFFFF", alt: "#FBFAF7", card: "#FBFBF9", input: "#F3F1F0", accent: "#4A0E0E", muted: "#877270" },
      zaitun: { name: "Hijau Zaitun", bg: "#FFFFFF", alt: "#F9FAF6", card: "#F8F9F4", input: "#EFF1EA", accent: "#3D4A2A", muted: "#7A8270" },
      biru: { name: "Biru Malam", bg: "#FFFFFF", alt: "#F8F9FB", card: "#F7F8FA", input: "#EEF0F4", accent: "#1F2D4A", muted: "#727C8F" },
      terakota: { name: "Terakota", bg: "#FFFFFF", alt: "#FCF9F6", card: "#FBF8F5", input: "#F4EEE9", accent: "#7A3B22", muted: "#937A6E" },
      mauve: { name: "Mauve", bg: "#FFFFFF", alt: "#FBF8FA", card: "#FAF7F9", input: "#F2EDF0", accent: "#5C3A4E", muted: "#8D7A85" },
      arang: { name: "Arang", bg: "#FFFFFF", alt: "#FAFAF9", card: "#F8F8F7", input: "#EFEFED", accent: "#1C1A17", muted: "#7B7772" },
    },
  },
};

export function getThemeMeta(id: string | undefined): ThemeMeta {
  return THEMES[(id as ThemeId) ?? "arya"] ?? THEMES.arya;
}

/** Resolves the palette for a theme; "custom" derives everything from one accent colour. */
export function resolvePalette(themeId: string, paletteId: string, customAccent?: string): Palette {
  const theme = getThemeMeta(themeId);
  const base = theme.palettes[paletteId] ?? theme.palettes[theme.defaultPalette];
  if (paletteId !== "custom") return base;
  const accent = customAccent || base.accent;
  const fallback = theme.palettes[theme.defaultPalette];
  return {
    ...fallback,
    name: "Warna Sendiri",
    accent,
    muted: theme.tone === "dark" ? `color-mix(in srgb, ${accent} 82%, #000)` : `color-mix(in srgb, ${accent} 45%, #9a8a86)`,
  };
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
