import type { SiteLayouts } from "@/themes/layouts/catalog";
import type { ThemeId } from "@/themes/meta";
import type { SiteStyle } from "@/themes/style";
import type { Occasion } from "./occasion";

/**
 * Content schema for one invitation site (wedding, birthday, circumcision…).
 * The type keeps its historical name `WeddingContent`.
 *
 * Every theme renders from this same shape, so a client can switch themes
 * without re-entering anything. Image fields hold either a public path
 * ("/demo/arya/x.jpg"), an uploaded file URL, or — only in the demo editor —
 * a browser-local reference ("media:<id>").
 */

export const SECTION_KEYS = [
  "couple",
  "story",
  "event",
  "venue",
  "gallery",
  "rsvp",
  "gift",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

/** Every editable block, including fixed ones (cover, hero, closing). */
export type BlockKey = "cover" | "hero" | SectionKey | "closing";

export const BLOCK_LABELS: Record<BlockKey, string> = {
  cover: "Sampul Pembuka",
  hero: "Foto Utama",
  couple: "Mempelai",
  story: "Kisah Cinta",
  event: "Tanggal Acara",
  venue: "Lokasi & Jadwal",
  gallery: "Galeri Foto",
  rsvp: "Ucapan & Kehadiran",
  gift: "Amplop Digital",
  closing: "Penutup",
};

export const NAV_LABELS: Partial<Record<SectionKey, string>> = {
  couple: "Welcome",
  story: "Our Story",
  event: "Date",
  venue: "Location",
  gallery: "Memories",
  gift: "Gift",
};

export const SECTION_ANCHORS: Record<SectionKey, string> = {
  couple: "invitation",
  story: "story",
  event: "date",
  venue: "venue",
  gallery: "memories",
  rsvp: "rsvp",
  gift: "gift",
};

export interface Person {
  fullName: string;
  parents: string;
  instagram: string;
  photo: string;
}

export interface StoryItem {
  id: string;
  date: string;
  title: string;
  body: string;
  image: string;
  /** Extra photos (max 3). Themes that support it show a 2×2 grid. */
  moreImages: string[];
}

export interface ScheduleItem {
  id: string;
  label: string;
  time: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
}

export interface BankAccount {
  id: string;
  bank: BankId;
  number: string;
  holder: string;
}

export type BankId =
  | "bca"
  | "mandiri"
  | "bni"
  | "bri"
  | "bsi"
  | "seabank"
  | "jago"
  | "dana"
  | "gopay"
  | "ovo"
  | "lainnya";


export interface BankPreset {
  name: string;
  logo?: string;
  gradient: [string, string, string];
  border: string;
}

export const BANKS: Record<BankId, BankPreset> = {
  bca: { name: "BANK BCA", logo: "/themes/shared/banks/bca.png", gradient: ["#0c2648", "#091f3b", "#061528"], border: "#1d4373" },
  mandiri: { name: "BANK MANDIRI", logo: "/themes/shared/banks/mandiri.svg", gradient: ["#0b2a4f", "#0a2140", "#06172d"], border: "#1f4a7a" },
  bni: { name: "BNI", gradient: ["#123a3f", "#0d2e33", "#082125"], border: "#245a60" },
  bri: { name: "BANK BRI", logo: "/themes/shared/banks/bri.svg", gradient: ["#0b3060", "#09264d", "#061a36"], border: "#1f4f8a" },
  bsi: { name: "BSI", gradient: ["#0f3b3a", "#0b2f2e", "#072120"], border: "#21615f" },
  seabank: { name: "SEABANK", logo: "/themes/shared/banks/seabank.png", gradient: ["#29221d", "#211b16", "#181310"], border: "#48392e" },
  jago: { name: "BANK JAGO", gradient: ["#2e2410", "#241c0c", "#191307"], border: "#56461f" },
  dana: { name: "DANA", gradient: ["#0c3050", "#092741", "#061b2e"], border: "#1d5585" },
  gopay: { name: "GOPAY", gradient: ["#093238", "#07282d", "#041c20"], border: "#1a5b63" },
  ovo: { name: "OVO", gradient: ["#2a1846", "#22133a", "#170c28"], border: "#4a2f78" },
  lainnya: { name: "REKENING", gradient: ["#1f2024", "#18191c", "#111214"], border: "#3a3b40" },
};


export interface WeddingContent {
  version: 1;
  /** Preset the site started from. Only a starting point: style and layouts below decide the look. */
  theme: ThemeId;
  /** What is being celebrated. Decides labels and whether there are one or two people. */
  occasion: Occasion;
  /** Colour mode, palette, font pair and optional own accent colour. */
  style: SiteStyle;
  /** Chosen layout per section (ids from themes/layouts/catalog.ts). */
  layouts: SiteLayouts;
  logo: { mode: "monogram" | "image" | "none"; image: string };
  music: { mode: "library" | "upload" | "none"; trackId: string; upload: string; uploadName: string };
  order: SectionKey[];
  hidden: SectionKey[];
  cover: {
    greeting: string;
    buttonLabel: string;
    /** "Stiker" cover: small line and big title above the names. Empty = the occasion's default. */
    kicker: string;
    title: string;
    /** "Stiker" cover: two speech bubbles next to the photo. Empty = not shown. */
    bubbleA: string;
    bubbleB: string;
    /** "Stiker" cover: photo, best as a PNG without background (it gets a white sticker outline). */
    photo: string;
  };
  hero: {
    /** Line above the names. Empty = the occasion's default ("The Wedding of", "Ulang Tahun"…). */
    eyebrow: string;
    firstName: string;
    secondName: string;
    imageDesktop: string;
    imageMobile: string;
    imageCutout: string;
    /** 1200×630 crop of the desktop photo, used for WhatsApp / social previews. */
    ogImage: string;
    /** Where the names sit on phones: top (default, works with cutout) or bottom. */
    namePosition: "top" | "bottom";
    /** Decorative heart outline behind the names (layouts that have one). */
    showHeart: boolean;
    heartSize: "s" | "m" | "l";
    scrollLabel: string;
  };
  couple: {
    showBismillah: boolean;
    headline: string;
    quote: string;
    first: Person;
    second: Person;
    /** Optional YouTube video (prewedding / teaser) and its cover image. */
    videoUrl: string;
    videoThumb: string;
  };
  story: { eyebrow: string; title: string; items: StoryItem[] };
  event: { eyebrow: string; date: string; time: string; timezone: "WIB" | "WITA" | "WIT" };
  venue: {
    eyebrow: string;
    name: string;
    address: string;
    mapsUrl: string;
    image: string;
    schedules: ScheduleItem[];
    /** Optional note for guests, e.g. parking information. */
    note: string;
  };
  gallery: { eyebrow: string; title: string; photos: GalleryPhoto[] };
  rsvp: { eyebrow: string; title: string; askCity: boolean };
  gift: {
    eyebrow: string;
    title: string;
    body: string;
    accounts: BankAccount[];
    /** Optional "send a present" card linking to a gift list / address. */
    registry: { title: string; body: string; url: string; image: string };
  };
  closing: { eyebrow: string; quote: string; displayName: string; hashtag: string; image: string };
}

