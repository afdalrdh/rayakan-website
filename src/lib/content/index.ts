/**
 * Public entry for everything about a site's content.
 * Import from "@/lib/content" — the files inside are an implementation detail.
 */
export * from "./schema";
export * from "./plans";
export * from "./helpers";
export * from "./demo";
export { MUSIC_LIBRARY, getThemeMeta, resolvePalette, THEMES, THEME_IDS, type MusicTrack, type Palette, type ThemeId, type ThemeMeta } from "@/themes/meta";
