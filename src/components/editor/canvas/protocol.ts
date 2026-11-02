import type { BlockKey, WeddingContent } from "@/lib/content";

/* Messages between the editor (parent window) and the preview iframe (/canvas). */

export interface CanvasState {
  content: WeddingContent;
  media: Record<string, string>;
  selected: BlockKey | null;
  locked: BlockKey[];
  /** "preview" = read-only (admin overview). */
  mode?: "edit" | "preview";
}

export type ToCanvas = { type: "state"; state: CanvasState } | { type: "scrollTo"; block: BlockKey };
export type FromCanvas = { type: "ready" } | { type: "select"; block: BlockKey };
