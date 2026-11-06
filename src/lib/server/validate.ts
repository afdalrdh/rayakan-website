import "server-only";
import { DECOR_IDS } from "@/themes/decor/catalog";
import { cleanLayouts } from "@/themes/layouts/catalog";
import { FONT_PAIR_IDS, PALETTE_IDS } from "@/themes/style";
import {
  applyOccasion,
  BANKS,
  OCCASION_IDS,
  OCCASIONS,
  type Occasion,
  DEMO_ARYA,
  demoContent,
  getThemeMeta,
  SECTION_KEYS,
  THEME_IDS,
  type SectionKey,
  type ThemeId,
  type WeddingContent,
} from "../content";

/**
 * Never trust what the editor sends: rebuild the content object field by field,
 * using the demo content as the shape template. Unknown keys are dropped,
 * strings are length-capped, arrays are size-capped and URLs are restricted.
 */

const MAX_STR = 3000;
const MAX_ITEMS = 60;

function cleanValue(v: unknown, t: unknown): unknown {
  if (typeof t === "string") return typeof v === "string" ? v.slice(0, MAX_STR) : "";
  if (typeof t === "number") return typeof v === "number" && Number.isFinite(v) ? v : t;
  if (typeof t === "boolean") return typeof v === "boolean" ? v : t;
  if (Array.isArray(t)) {
    if (!Array.isArray(v)) return [];
    const itemT = t[0];
    if (itemT === undefined) return [];
    return v.slice(0, MAX_ITEMS).map((x) => cleanValue(x, itemT));
  }
  if (t && typeof t === "object") {
    const src = v && typeof v === "object" ? (v as Record<string, unknown>) : {};
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(t)) out[k] = cleanValue(src[k], (t as Record<string, unknown>)[k]);
    return out;
  }
  return t;
}

/** Only files we stored ourselves: local paths, Vercel Blob, or Cloudinary. */
const MEDIA_HOSTS = [/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i, /^https:\/\/res\.cloudinary\.com\/[a-z0-9_-]+\//i];

export function safeMediaUrl(u: string) {
  if (!u) return "";
  if (u.startsWith("/") && !u.startsWith("//")) return u.slice(0, 500);
  if (MEDIA_HOSTS.some((h) => h.test(u))) return u.slice(0, 500);
  return "";
}

function safeHttps(u: string) {
  try {
    const url = new URL(u.trim());
    return url.protocol === "https:" ? url.toString().slice(0, 500) : "";
  } catch {
    return "";
  }
}

const pick = <T extends string>(v: string, allowed: readonly T[], fallback: T): T =>
  (allowed as readonly string[]).includes(v) ? (v as T) : fallback;

const YOUTUBE = /^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//i;

export function sanitizeContent(input: unknown): WeddingContent {
  const raw = (input ?? {}) as Partial<WeddingContent>;
  const c = cleanValue(input, DEMO_ARYA) as WeddingContent;
  c.version = 1;
  c.theme = pick(c.theme, THEME_IDS, "arya");
  const theme = getThemeMeta(c.theme);
  c.occasion = pick(c.occasion, OCCASION_IDS, "nikah");
  c.style = {
    mode: pick(c.style.mode, ["light", "dark"], theme.style.mode),
    palette: pick(c.style.palette, PALETTE_IDS, theme.style.palette),
    fonts: pick(c.style.fonts, FONT_PAIR_IDS, theme.style.fonts),
    accent: /^#[0-9a-f]{6}$/i.test(c.style.accent) ? c.style.accent : "",
    decor: pick(c.style.decor, DECOR_IDS, "none"),
  };
  c.layouts = cleanLayouts(raw.layouts, theme.layouts);
  c.hero.heartSize = pick(c.hero.heartSize, ["s", "m", "l"], "m");
  c.logo.mode = pick(c.logo.mode, ["monogram", "image", "none"], "monogram");
  c.music.mode = pick(c.music.mode, ["library", "upload", "none"], "library");
  c.hero.namePosition = pick(c.hero.namePosition, ["top", "bottom"], "top");
  c.event.timezone = pick(c.event.timezone, ["WIB", "WITA", "WIT"], "WIB");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.event.date)) c.event.date = "";
  if (!/^\d{2}:\d{2}$/.test(c.event.time)) c.event.time = "08:00";

  const keys = new Set<SectionKey>(SECTION_KEYS);
  const isKey = (k: unknown): k is SectionKey => keys.has(k as SectionKey);
  c.order = [...new Set([...(Array.isArray(raw.order) ? raw.order : []).filter(isKey), ...SECTION_KEYS])];
  c.hidden = [...new Set((Array.isArray(raw.hidden) ? raw.hidden : []).filter(isKey))];

  c.logo.image = safeMediaUrl(c.logo.image);
  c.cover.photo = safeMediaUrl(c.cover.photo);
  c.music.upload = safeMediaUrl(c.music.upload);
  for (const k of ["imageDesktop", "imageMobile", "imageCutout", "ogImage"] as const) c.hero[k] = safeMediaUrl(c.hero[k]);
  for (const who of ["first", "second"] as const) {
    c.couple[who].photo = safeMediaUrl(c.couple[who].photo);
    c.couple[who].instagram = c.couple[who].instagram.replace(/[^a-zA-Z0-9._]/g, "").slice(0, 30);
  }
  c.couple.videoUrl = YOUTUBE.test(c.couple.videoUrl.trim()) ? safeHttps(c.couple.videoUrl) : "";
  c.couple.videoThumb = safeMediaUrl(c.couple.videoThumb);

  const rawItems = Array.isArray(raw.story?.items) ? raw.story.items : [];
  c.story.items = c.story.items.slice(0, 10).map((s, i) => ({
    ...s,
    image: safeMediaUrl(s.image),
    moreImages: (Array.isArray(rawItems[i]?.moreImages) ? rawItems[i].moreImages : [])
      .map((u) => safeMediaUrl(String(u)))
      .filter(Boolean)
      .slice(0, 3),
  }));
  c.venue.image = safeMediaUrl(c.venue.image);
  c.venue.mapsUrl = safeHttps(c.venue.mapsUrl);
  c.venue.schedules = c.venue.schedules.slice(0, 6);
  c.gallery.photos = c.gallery.photos.slice(0, 60).map((p) => ({ ...p, src: safeMediaUrl(p.src) })).filter((p) => p.src);
  c.gift.accounts = c.gift.accounts.slice(0, 6).map((a) => ({ ...a, bank: pick(a.bank, Object.keys(BANKS) as (keyof typeof BANKS)[], "lainnya") }));
  c.gift.registry.url = safeHttps(c.gift.registry.url);
  c.gift.registry.image = safeMediaUrl(c.gift.registry.image);
  c.closing.image = safeMediaUrl(c.closing.image);
  return c;
}

/** Theme sample switched to the requested occasion (texts follow, layouts stay). */
function themeFor(theme: ThemeId, occasion?: Occasion) {
  const meta = getThemeMeta(theme);
  const c = demoContent(meta.id);
  if (occasion && occasion !== c.occasion) applyOccasion(c, occasion);
  return { meta, c };
}

/** Starting content for a new client: the theme's layout and texts, their names, no sample photos. */
export function starterContent(theme: ThemeId, first: string, second: string, eventDate: string, occasion?: Occasion): WeddingContent {
  const { meta, c } = themeFor(theme, occasion);
  const single = OCCASIONS[c.occasion].single;
  if (single) second = "";
  c.logo = { mode: "monogram", image: "" };
  c.music = { mode: "library", trackId: meta.defaultTrack, upload: "", uploadName: "" };
  c.cover = { ...c.cover, photo: "" };
  c.hero = { ...c.hero, firstName: first, secondName: second, imageDesktop: "", imageMobile: "", imageCutout: "", ogImage: "" };
  c.couple = { ...c.couple, first: { fullName: "", parents: "", instagram: "", photo: "" }, second: { fullName: "", parents: "", instagram: "", photo: "" }, videoUrl: "", videoThumb: "" };
  c.story.items = [];
  c.event.date = /^\d{4}-\d{2}-\d{2}$/.test(eventDate) ? eventDate : "";
  c.venue = {
    ...c.venue,
    name: "",
    address: "",
    mapsUrl: "",
    image: "",
    note: "",
    schedules: OCCASIONS[c.occasion].schedules.map((label, i) => ({ id: `j${i + 1}`, label, time: "" })),
  };
  c.gallery.photos = [];
  c.gift.accounts = [];
  c.gift.registry = { title: "", body: "", url: "", image: "" };
  c.closing = { ...c.closing, displayName: single ? first : `${first} & ${second}`, hashtag: "", image: "" };
  return c;
}

/**
 * Like `starterContent` but keeps the theme's sample photos, story, venue and
 * gallery, so the owner can show or test a complete invitation. Personal data
 * from the sample couple (full names, parents, Instagram, bank numbers) is
 * replaced with neutral placeholders.
 */
export function sampleContent(theme: ThemeId, first: string, second: string, eventDate: string, occasion?: Occasion): WeddingContent {
  const { c } = themeFor(theme, occasion);
  const single = OCCASIONS[c.occasion].single;
  if (single) second = "";
  c.hero = { ...c.hero, firstName: first, secondName: second };
  const person = (name: string, role: string, photo: string) => ({ fullName: name, parents: `${role} dari Bapak Fulan dan Ibu Fulanah`, instagram: "", photo });
  c.couple = { ...c.couple, first: person(first, single ? "Anak pertama" : "Putra pertama", c.couple.first.photo), second: single ? c.couple.second : person(second, "Putri kedua", c.couple.second.photo) };
  if (/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) c.event.date = eventDate;
  c.gift.accounts = c.gift.accounts.map((a, i) => ({ ...a, number: i ? "9876 5432 10" : "1234 5678 90", holder: (i && second ? second : first).toUpperCase() }));
  c.closing = { ...c.closing, displayName: single ? first : `${first} & ${second}`, hashtag: "" };
  return c;
}
