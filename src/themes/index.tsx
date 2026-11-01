"use client";

import type { BlockKey, WeddingContent } from "@/lib/content";
import { AfdalTheme } from "./afdal/AfdalTheme";
import { AryaTheme } from "./arya/AryaTheme";
import type { ThemeId } from "./meta";
import { ThemeProvider, type SiteInfo } from "./shared";

const COMPONENTS: Record<ThemeId, (p: { guestName: string }) => React.JSX.Element> = {
  arya: AryaTheme,
  afdal: AfdalTheme,
};

export interface ThemeRendererProps {
  content: WeddingContent;
  mode: "live" | "edit";
  media?: Record<string, string>;
  guestName?: string;
  selected?: BlockKey | null;
  locked?: BlockKey[];
  onSelect?: (key: BlockKey) => void;
  site?: SiteInfo;
}

const NO_MEDIA = {};

/** Renders a site with whichever theme its content selects. The only entry point pages need. */
export function ThemeRenderer({ content, mode, media = NO_MEDIA, guestName = "Tamu Undangan", selected, locked, onSelect, site }: ThemeRendererProps) {
  const Theme = COMPONENTS[content.theme] ?? AryaTheme;
  return (
    <ThemeProvider value={{ content, mode, media, selected, locked, onSelect, site }}>
      <Theme guestName={guestName} />
    </ThemeProvider>
  );
}
