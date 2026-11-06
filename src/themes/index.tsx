"use client";

import { createElement } from "react";
import { getDecor, type BlockKey, type WeddingContent } from "@/lib/content";
import { coverFace, sectionComponent } from "./layouts";
import { CoverInline, CoverOverlay, DecorParticles, siteStyle, ThemeProvider, useTheme, type SiteInfo } from "./shared";

export interface ThemeRendererProps {
  content: WeddingContent;
  mode: "live" | "edit" | "preview";
  media?: Record<string, string>;
  guestName?: string;
  selected?: BlockKey | null;
  locked?: BlockKey[];
  onSelect?: (key: BlockKey) => void;
  site?: SiteInfo;
}

const NO_MEDIA = {};

/** Layout components come from a static registry; keyed by id so switching layouts remounts cleanly. */
function section(block: Exclude<BlockKey, "cover">, id: string, key: string = block) {
  return createElement(sectionComponent(block, id), { key: `${key}:${id}` });
}

function Site({ guestName }: { guestName: string }) {
  const { content: c, mode } = useTheme();
  const Face = coverFace(c.layouts.cover);
  return (
    <main style={siteStyle(c)} className="min-h-screen bg-t-bg font-t-body text-t-fg">
      {(mode === "edit" || mode === "preview") && <CoverInline guestName={guestName} Face={Face} />}
      {section("hero", c.layouts.hero)}
      {c.order.filter((k) => !c.hidden.includes(k)).map((k) => section(k, c.layouts[k]))}
      {section("closing", c.layouts.closing)}
      {mode === "live" && <CoverOverlay guestName={guestName} Face={Face} />}
      <DecorParticles kind={getDecor(c.style.decor).particles} />
    </main>
  );
}

/** Renders a whole site from its content. The only entry point pages need. */
export function ThemeRenderer({ content, mode, media = NO_MEDIA, guestName = "Tamu Undangan", selected, locked, onSelect, site }: ThemeRendererProps) {
  return (
    <ThemeProvider value={{ content, mode, media, selected, locked, onSelect, site }}>
      <Site guestName={guestName} />
    </ThemeProvider>
  );
}

/**
 * One section drawn with a given layout, read-only (layout picker, admin
 * overview). Wrap it in a scaled box: it renders at real size.
 */
export function LayoutPreview({ content, block, layout, media = NO_MEDIA }: { content: WeddingContent; block: BlockKey; layout: string; media?: Record<string, string> }) {
  const c = { ...content, layouts: { ...content.layouts, [block]: layout } };
  return (
    <ThemeProvider value={{ content: c, mode: "thumb", media }}>
      <div style={siteStyle(c)} className="bg-t-bg font-t-body text-t-fg">
        <PreviewBody block={block} layout={layout} />
      </div>
    </ThemeProvider>
  );
}

function PreviewBody({ block, layout }: { block: BlockKey; layout: string }) {
  if (block === "cover") return createElement(coverFace(layout), { guestName: "Nama Tamu" });
  return section(block, layout);
}
