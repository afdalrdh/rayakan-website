"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BlockKey, Plan, WeddingContent } from "@/lib/content";
import { InvitationSkeleton } from "@/components/ui/Skeleton";
import type { FromCanvas, ToCanvas } from "./protocol";

export type Device = "hp" | "laptop";

/**
 * Hosts the live preview in an iframe (/canvas) so the real HP / laptop
 * breakpoints apply, and keeps it in sync over postMessage.
 */
export function Canvas({
  device,
  content,
  media,
  plan,
  selected,
  onSelect,
  readOnly = false,
}: {
  device: Device;
  content: WeddingContent;
  media: Record<string, string>;
  plan: Plan;
  selected: BlockKey | null;
  onSelect: (k: BlockKey) => void;
  /** Read-only preview: no tap targets. */
  readOnly?: boolean;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const locked = useMemo(() => plan.locked as BlockKey[], [plan]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onMsg = (e: MessageEvent<FromCanvas>) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === "ready") setReady(true);
      if (e.data?.type === "select") onSelect(e.data.block);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [onSelect]);

  const post = useCallback((msg: ToCanvas) => frame.current?.contentWindow?.postMessage(msg, window.location.origin), []);

  useEffect(() => {
    if (ready) post({ type: "state", state: { content, media, selected, locked, mode: readOnly ? "preview" : "edit" } });
  }, [ready, content, media, selected, locked, post, readOnly]);

  useEffect(() => {
    if (ready && selected) post({ type: "scrollTo", block: selected });
  }, [ready, selected, post]);

  // Geometry: phone = real width on phones, 390px framed on desktop; laptop = 1280px scaled down.
  const isDesktopUi = size.w >= 600;
  let style: React.CSSProperties;
  let wrap: React.CSSProperties;
  if (device === "laptop") {
    // A real laptop screen: 1280×800 (16:10), scaled to fit both the width and the height.
    const vw = 1280;
    const vh = 800;
    const pad = isDesktopUi ? 48 : 16;
    const s = Math.min(1, (size.w - pad) / vw, (size.h - pad) / vh);
    const h = vh;
    style = { width: vw, height: h, transform: `scale(${s})`, transformOrigin: "top left" };
    wrap = { width: vw * s, height: h * s };
  } else if (isDesktopUi) {
    const h = Math.min(844, size.h - 48);
    style = { width: 390, height: h };
    wrap = { width: 390, height: h };
  } else {
    style = { width: size.w, height: size.h };
    wrap = style;
  }

  return (
    <div ref={box} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#ece4d6]">
      {size.w > 0 && (
        <div
          style={wrap}
          className={`relative overflow-hidden bg-black ${isDesktopUi || device === "laptop" ? "rounded-[28px] shadow-[0_30px_60px_-20px_rgba(18,13,16,0.45)] ring-[6px] ring-rk-ink" : ""} ${device === "laptop" ? "rounded-xl ring-4" : ""}`}
        >
          <iframe ref={frame} src="/canvas" title="Pratinjau undangan" style={style} className="block border-0" />
          {/* Until the preview has loaded and received the content, show the invitation placeholder. */}
          {!ready && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <InvitationSkeleton fill />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
