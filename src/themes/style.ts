/**
 * Design system for invitations (no React, so the server can import it).
 *
 * A site's look = colour mode (light/dark) + palette + font pair + one layout
 * per section. Every layout reads colours and fonts from CSS variables, so any
 * combination stays readable and consistent.
 */

export type ColorMode = "light" | "dark";

interface Surface {
  /** Page background */
  bg: string;
  /** Alternate section background */
  alt: string;
  /** Cards (schedule, countdown, form) */
  card: string;
  /** Form inputs, empty photo slots */
  input: string;
  /** Headings, buttons — the brand colour of the site */
  accent: string;
  /** Eyebrows, small labels, divider lines */
  muted: string;
}

export interface PaletteDef {
  name: string;
  light: Surface;
  dark: Surface;
}

/** Ready-made palettes. Each has a light and a dark version that were checked for contrast. */
export const PALETTES: Record<string, PaletteDef> = {
  marun: {
    name: "Marun",
    light: { bg: "#FFFFFF", alt: "#FBFAF7", card: "#FBF7F5", input: "#F3EEEC", accent: "#4A0E0E", muted: "#877270" },
    dark: { bg: "#0F0909", alt: "#170E0E", card: "#1B1112", input: "#231718", accent: "#E6BC8C", muted: "#BF9465" },
  },
  emas: {
    name: "Emas",
    light: { bg: "#FFFDF8", alt: "#FAF5EA", card: "#FBF5E9", input: "#F2EBDC", accent: "#7C5C22", muted: "#A08757" },
    dark: { bg: "#0B0C0E", alt: "#141315", card: "#141518", input: "#1A1B1F", accent: "#E5C07B", muted: "#C5A059" },
  },
  sage: {
    name: "Sage",
    light: { bg: "#FFFFFF", alt: "#F7F9F4", card: "#F5F8F1", input: "#EBF0E5", accent: "#3F4E30", muted: "#7A8670" },
    dark: { bg: "#0C0F0D", alt: "#121714", card: "#151A17", input: "#1B211D", accent: "#CBD7B4", muted: "#9DB08A" },
  },
  rose: {
    name: "Rose Gold",
    light: { bg: "#FFFFFF", alt: "#FDF7F6", card: "#FCF4F3", input: "#F5EAE9", accent: "#87444C", muted: "#AE8487" },
    dark: { bg: "#100C0D", alt: "#171213", card: "#1A1416", input: "#211A1C", accent: "#EAC2BE", muted: "#C99597" },
  },
  navy: {
    name: "Navy",
    light: { bg: "#FFFFFF", alt: "#F8F9FB", card: "#F5F7FA", input: "#ECEFF4", accent: "#1F2D4A", muted: "#727C8F" },
    dark: { bg: "#0A0D14", alt: "#10141D", card: "#131824", input: "#1A2030", accent: "#DCCBA3", muted: "#B3A27B" },
  },
  terakota: {
    name: "Terakota",
    light: { bg: "#FFFFFF", alt: "#FCF9F6", card: "#FBF6F2", input: "#F4ECE6", accent: "#7A3B22", muted: "#937A6E" },
    dark: { bg: "#120C09", alt: "#1A120E", card: "#1D1410", input: "#251A15", accent: "#E8A783", muted: "#BC8466" },
  },
  mauve: {
    name: "Mauve",
    light: { bg: "#FFFFFF", alt: "#FBF8FA", card: "#F9F5F8", input: "#F1EBEF", accent: "#5C3A4E", muted: "#8D7A85" },
    dark: { bg: "#110C10", alt: "#191218", card: "#1C141B", input: "#241A22", accent: "#DDB8CF", muted: "#AC8A9D" },
  },
  dusty: {
    name: "Dusty Blue",
    light: { bg: "#FFFFFF", alt: "#F6F9FB", card: "#F3F7FA", input: "#E8EFF4", accent: "#33506A", muted: "#7B8D9C" },
    dark: { bg: "#0A0E12", alt: "#10161C", card: "#131A21", input: "#19222B", accent: "#B4CBDF", muted: "#839BB0" },
  },
  blush: {
    name: "Blush",
    light: { bg: "#FFFCFC", alt: "#FDF5F6", card: "#FCF1F3", input: "#F6E6E9", accent: "#93354F", muted: "#B6818E" },
    dark: { bg: "#120B0D", alt: "#1A1013", card: "#1E1317", input: "#27191E", accent: "#F2BACA", muted: "#C88D9D" },
  },
  lilac: {
    name: "Lilac",
    light: { bg: "#FFFFFF", alt: "#F9F7FC", card: "#F6F3FA", input: "#ECE8F3", accent: "#4B3B6E", muted: "#8A80A0" },
    dark: { bg: "#0D0B12", alt: "#14111B", card: "#18141F", input: "#201B29", accent: "#CDBDEB", muted: "#9D8DBC" },
  },
  zamrud: {
    name: "Zamrud",
    light: { bg: "#FFFFFF", alt: "#F5F9F7", card: "#F2F7F4", input: "#E6EFEA", accent: "#1E4A38", muted: "#6D877A" },
    dark: { bg: "#08100C", alt: "#0E1813", card: "#111C16", input: "#17251D", accent: "#A6DCBE", muted: "#73A88A" },
  },
  monokrom: {
    name: "Monokrom",
    light: { bg: "#FFFFFF", alt: "#FAFAF9", card: "#F7F7F6", input: "#EEEEEC", accent: "#1C1A17", muted: "#7B7772" },
    dark: { bg: "#0B0B0C", alt: "#131314", card: "#161618", input: "#1C1C1F", accent: "#E4E4E4", muted: "#A8A8AD" },
  },
};
export const PALETTE_IDS = Object.keys(PALETTES);

export interface FontPair {
  id: string;
  name: string;
  desc: string;
  /** Couple names on the opening photo and closing. */
  display: string;
  /** Section titles. */
  head: string;
  /** Paragraphs, labels, buttons. */
  body: string;
  /** Show names in capitals (condensed / roman fonts). */
  displayUpper: boolean;
  /** Relative size of the display font so every pair looks equally big. */
  displayScale: number;
  /** Weight used for section titles. */
  headWeight: number;
  /** Rough number of characters that fit the hero at full size (shrinks after). */
  fit: number;
}

const stack = {
  cormorant: "'Cormorant Garamond', Georgia, serif",
  sourceSerif: "var(--font-source-serif), 'Source Serif 4', Georgia, serif",
  montserrat: "'Montserrat', ui-sans-serif, system-ui, sans-serif",
  bebas: "'Bebas Neue', 'Arial Narrow', Impact, sans-serif",
  greatVibes: "'Great Vibes', 'Brush Script MT', cursive",
  playfair: "'Playfair Display', Georgia, serif",
  lato: "'Lato', ui-sans-serif, system-ui, sans-serif",
  dmSerif: "'DM Serif Display', Georgia, serif",
  dmSans: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
  cinzel: "'Cinzel', 'Trajan Pro', Georgia, serif",
  raleway: "'Raleway', ui-sans-serif, system-ui, sans-serif",
  instrument: "var(--font-instrument), 'Instrument Serif', Georgia, serif",
  jakarta: "var(--font-jakarta), 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
  bodoni: "'Bodoni Moda', 'Didot', Georgia, serif",
  jost: "'Jost', ui-sans-serif, system-ui, sans-serif",
};

/** Proven heading + body combinations. Clients pick a pair, not single fonts, so typography stays tidy. */
export const FONT_PAIRS: Record<string, FontPair> = {
  klasik: { id: "klasik", name: "Klasik", desc: "Cormorant · Source Serif · Montserrat", display: stack.cormorant, head: stack.sourceSerif, body: stack.montserrat, displayUpper: true, displayScale: 1, headWeight: 600, fit: 7 },
  tegas: { id: "tegas", name: "Tegas", desc: "Bebas Neue · Source Serif · Montserrat", display: stack.bebas, head: stack.sourceSerif, body: stack.montserrat, displayUpper: true, displayScale: 1.25, headWeight: 600, fit: 7 },
  romantis: { id: "romantis", name: "Romantis", desc: "Great Vibes · Cormorant · Montserrat", display: stack.greatVibes, head: stack.cormorant, body: stack.montserrat, displayUpper: false, displayScale: 1.15, headWeight: 600, fit: 8 },
  elegan: { id: "elegan", name: "Elegan", desc: "Playfair Display · Lato", display: stack.playfair, head: stack.playfair, body: stack.lato, displayUpper: false, displayScale: 0.92, headWeight: 600, fit: 7 },
  minimalis: { id: "minimalis", name: "Minimalis", desc: "DM Serif Display · DM Sans", display: stack.dmSerif, head: stack.dmSerif, body: stack.dmSans, displayUpper: false, displayScale: 0.95, headWeight: 400, fit: 7 },
  agung: { id: "agung", name: "Agung", desc: "Cinzel · Raleway", display: stack.cinzel, head: stack.cinzel, body: stack.raleway, displayUpper: true, displayScale: 0.78, headWeight: 600, fit: 6 },
  kontemporer: { id: "kontemporer", name: "Kontemporer", desc: "Instrument Serif · Plus Jakarta Sans", display: stack.instrument, head: stack.instrument, body: stack.jakarta, displayUpper: false, displayScale: 1.05, headWeight: 400, fit: 8 },
  mewah: { id: "mewah", name: "Mewah", desc: "Bodoni Moda · Jost", display: stack.bodoni, head: stack.bodoni, body: stack.jost, displayUpper: false, displayScale: 0.9, headWeight: 500, fit: 7 },
};
export const FONT_PAIR_IDS = Object.keys(FONT_PAIRS);

export interface SiteStyle {
  mode: ColorMode;
  palette: string;
  fonts: string;
  /** Optional own accent colour (#rrggbb), empty = palette accent. */
  accent: string;
}

export interface Tokens extends Surface {
  /** Main text colour */
  fg: string;
  /** Secondary text (paragraphs) */
  fg2: string;
  /** Hairlines and card borders */
  line: string;
  /** Text on top of the accent colour (buttons) */
  onAccent: string;
}

export function getPalette(id: string) {
  return PALETTES[id] ?? PALETTES.marun;
}

export function getFontPair(id: string) {
  return FONT_PAIRS[id] ?? FONT_PAIRS.klasik;
}

/** Full colour set for a style. Text colours are derived so they always contrast with the background. */
export function resolveTokens(s: SiteStyle): Tokens {
  const base = getPalette(s.palette)[s.mode];
  const accent = /^#[0-9a-f]{6}$/i.test(s.accent) ? s.accent : base.accent;
  const muted = accent === base.accent ? base.muted : s.mode === "dark" ? `color-mix(in srgb, ${accent} 80%, #000)` : `color-mix(in srgb, ${accent} 50%, #9a8f8b)`;
  if (s.mode === "dark") {
    return {
      ...base,
      accent,
      muted,
      fg: "#F5F0E8",
      fg2: "#BDB6AE",
      line: "rgba(255,255,255,0.1)",
      onAccent: base.bg,
    };
  }
  return {
    ...base,
    accent,
    muted,
    fg: "#211C1A",
    fg2: `color-mix(in srgb, ${accent} 18%, #5c5350)`,
    line: `color-mix(in srgb, ${accent} 14%, transparent)`,
    onAccent: "#FFFFFF",
  };
}

/** CSS variables consumed by the `t-*` Tailwind colours and fonts (see globals.css). */
export function styleVars(s: SiteStyle): Record<string, string | number> {
  const t = resolveTokens(s);
  const f = getFontPair(s.fonts);
  return {
    "--t-bg": t.bg,
    "--t-alt": t.alt,
    "--t-card": t.card,
    "--t-input": t.input,
    "--t-accent": t.accent,
    "--t-muted": t.muted,
    "--t-fg": t.fg,
    "--t-fg2": t.fg2,
    "--t-line": t.line,
    "--t-on-accent": t.onAccent,
    "--t-font-display": f.display,
    "--t-font-head": f.head,
    "--t-font-body": f.body,
    "--t-display-scale": f.displayScale,
    "--t-head-weight": f.headWeight,
    "--t-display-case": f.displayUpper ? "uppercase" : "none",
    colorScheme: s.mode,
  };
}

/* ------------------------------------------------------------------ */
/* Legacy content (before the design system): theme palette ids        */
/* ------------------------------------------------------------------ */

const LEGACY_PALETTE: Record<string, string> = {
  emas: "emas",
  sage: "sage",
  rose: "rose",
  navy: "navy",
  marun: "marun",
  perak: "monokrom",
  maroon: "marun",
  zaitun: "sage",
  biru: "navy",
  terakota: "terakota",
  mauve: "mauve",
  arang: "monokrom",
};

export function legacyStyle(theme: string, palette: string, customAccent?: string): SiteStyle {
  const dark = theme !== "afdal";
  return {
    mode: dark ? "dark" : "light",
    palette: LEGACY_PALETTE[palette] ?? (dark ? "emas" : "marun"),
    fonts: dark ? "klasik" : "tegas",
    accent: palette === "custom" && customAccent && /^#[0-9a-f]{6}$/i.test(customAccent) ? customAccent : "",
  };
}
