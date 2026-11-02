"use client";

import { Check, LayoutTemplate, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BLOCK_LABELS, LAYOUTS, layoutOf, type BlockKey, type WeddingContent } from "@/lib/content";
import { LayoutPreview } from "@/themes";
import { useEditor } from "./context";

/* Layout per section: a summary card at the top of each form + a picker with live previews. */

function subscribeWide(cb: () => void) {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
/** Previews follow the editor window's breakpoint: laptop layout on wide screens, phone layout on phones. */
function useWideViewport() {
  return useSyncExternalStore(subscribeWide, () => window.matchMedia("(min-width: 768px)").matches, () => true);
}

/** A section rendered at real size and scaled down to fit its box. */
const FULL_SCREEN: BlockKey[] = ["cover", "hero", "event", "closing"];

/**
 * Full-screen sections are shown whole (same proportions as the screen);
 * other sections show their top part at `height`.
 */
export function ScaledPreview({ content, media, block, layout, height, className = "" }: { content: WeddingContent; media: Record<string, string>; block: BlockKey; layout: string; height: number; className?: string }) {
  const wide = useWideViewport();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const virtual = wide ? 1280 : 390;
  const scale = w ? w / virtual : 0;
  const screenH = typeof window === "undefined" ? 800 : Math.min(window.innerHeight, wide ? 820 : 760);
  const h = FULL_SCREEN.includes(block) && scale ? Math.min(Math.round(screenH * scale), height * 2) : height;
  return (
    <div ref={box} style={{ height: h }} className={`pointer-events-none relative overflow-hidden bg-rk-cream ${className}`} aria-hidden>
      {scale > 0 && (
        <div style={{ width: virtual, transform: `scale(${scale})`, transformOrigin: "top left" }} className="absolute left-0 top-0">
          <LayoutPreview content={content} block={block} layout={layout} media={media} />
        </div>
      )}
    </div>
  );
}

export function LayoutCard({ block }: { block: BlockKey }) {
  const { content: c, media } = useEditor();
  const [open, setOpen] = useState(false);
  const current = layoutOf(block, c.layouts[block]);
  const count = LAYOUTS[block].length;
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-rk-line bg-white">
        <ScaledPreview content={c} media={media} block={block} layout={current.id} height={128} />
        <div className="flex items-center gap-3 border-t border-rk-line p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rk-cream">
            <LayoutTemplate className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-rk-sans text-[11px] font-bold uppercase tracking-[1.2px] text-rk-mute">Tata letak</span>
            <span className="block truncate font-rk-sans text-[14px] font-bold text-rk-ink">{current.name}</span>
          </span>
          <button type="button" onClick={() => setOpen(true)} className="h-9 shrink-0 rounded-xl bg-rk-ink px-3.5 font-rk-sans text-[13px] font-bold text-white hover:bg-rk-plum">
            Ganti · {count}
          </button>
        </div>
      </div>
      {open && <LayoutModal block={block} onClose={() => setOpen(false)} />}
    </>
  );
}

function LayoutModal({ block, onClose }: { block: BlockKey; onClose: () => void }) {
  const { content: c, update, media } = useEditor();
  const current = layoutOf(block, c.layouts[block]).id;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={`Tata letak ${BLOCK_LABELS[block]}`}>
      <button type="button" aria-label="Tutup" onClick={onClose} className="rk-fade-in absolute inset-0 bg-rk-ink/40 backdrop-blur-[2px]" />
      <div className="rk-sheet-in relative flex max-h-[90dvh] w-full max-w-[1040px] flex-col overflow-hidden rounded-t-[28px] bg-rk-ivory md:rounded-[28px]">
        <div className="flex justify-center pt-2.5 md:hidden">
          <span className="h-1 w-10 rounded-full bg-rk-line" />
        </div>
        <div className="flex items-start gap-3 border-b border-rk-line bg-white px-5 pb-4 pt-3 md:px-7 md:pt-6">
          <div className="min-w-0 flex-1">
            <h2 className="font-rk-serif text-[26px] leading-none md:text-[30px]">Tata letak {BLOCK_LABELS[block]}</h2>
            <p className="mt-1.5 font-rk-sans text-[13px] text-rk-mute">Isi teks dan foto tetap sama, hanya susunannya yang berubah. Pratinjau memakai isi undangan kamu.</p>
          </div>
          <button type="button" aria-label="Tutup" onClick={onClose} className="rounded-full p-2 hover:bg-rk-ivory">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid min-h-0 flex-1 auto-rows-max content-start gap-4 overflow-y-auto overscroll-contain p-4 pb-[calc(20px+env(safe-area-inset-bottom))] sm:grid-cols-2 md:p-6">
          {LAYOUTS[block].map((o) => {
            const sel = o.id === current;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  update((d) => void (d.layouts[block] = o.id));
                  onClose();
                }}
                className={`group overflow-hidden rounded-2xl border bg-white text-left transition ${sel ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line hover:border-rk-ink/40 hover:shadow-lg"}`}
              >
                <div className="relative">
                  <ScaledPreview content={c} media={media} block={block} layout={o.id} height={220} />
                  {sel && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-rk-ink px-2.5 py-1 font-rk-sans text-[11px] font-bold text-white">
                      <Check className="h-3.5 w-3.5" /> Dipakai
                    </span>
                  )}
                </div>
                <div className="border-t border-rk-line p-4">
                  <p className="font-rk-sans text-[15px] font-bold text-rk-ink">{o.name}</p>
                  <p className="mt-1 font-rk-sans text-[13px] leading-snug text-rk-mute">{o.desc}</p>
                  {o.hint && <p className="mt-2 inline-flex rounded-lg bg-rk-cream px-2.5 py-1 font-rk-sans text-[12px] font-medium text-rk-bronze">{o.hint}</p>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
