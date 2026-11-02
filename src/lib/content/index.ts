/**
 * Public entry for everything about a site's content.
 * Import from "@/lib/content" — the files inside are an implementation detail.
 */
export * from "./schema";
export * from "./plans";
export * from "./helpers";
export * from "./demo";
export { MUSIC_LIBRARY, getThemeMeta, themeSwatch, THEMES, THEME_IDS, type MusicTrack, type ThemeId, type ThemeMeta } from "@/themes/meta";
export { FONT_PAIRS, FONT_PAIR_IDS, PALETTES, PALETTE_IDS, getFontPair, getPalette, resolveTokens, type ColorMode, type FontPair, type PaletteDef, type SiteStyle } from "@/themes/style";
export { DEFAULT_LAYOUTS, LAYOUTS, layoutOf, type LayoutOption, type SiteLayouts } from "@/themes/layouts/catalog";
