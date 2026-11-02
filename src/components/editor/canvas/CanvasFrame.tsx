"use client";

import { useEffect, useState } from "react";
import type { BlockKey } from "@/lib/content";
import type { CanvasState, FromCanvas, ToCanvas } from "./protocol";
import { ThemeRenderer } from "@/themes";

/** Runs inside the editor's iframe so real breakpoints (HP / desktop) apply. */
export function CanvasFrame() {
  const [state, setState] = useState<CanvasState | null>(null);

  useEffect(() => {
    const onMsg = (e: MessageEvent<ToCanvas>) => {
      if (e.origin !== window.location.origin) return;
      const msg = e.data;
      if (msg?.type === "state") setState(msg.state);
      if (msg?.type === "scrollTo") {
        document.querySelector(`[data-block="${msg.block}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "ready" } satisfies FromCanvas, window.location.origin);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  if (!state) return <div className="min-h-screen bg-[#0B0C0E]" />;
  return (
    <ThemeRenderer
      content={state.content}
      media={state.media}
      mode={state.mode ?? "edit"}
      selected={state.selected}
      locked={state.locked}
      onSelect={(block: BlockKey) => window.parent.postMessage({ type: "select", block } satisfies FromCanvas, window.location.origin)}
    />
  );
}
