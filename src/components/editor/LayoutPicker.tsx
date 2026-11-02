"use client";

import { Check, LayoutTemplate, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { BLOCK_LABELS, DEMO_NAVY, DEMO_SAGE, LAYOUTS, layoutOf, type BlockKey, type WeddingContent } from "@/lib/content";
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

const SAMPLE = {
  light: { dir: "sage", story: ["story-1", "story-2", "story-3", "story-4"], gallery: ["g-2", "g-1", "story-3", "bride", "groom", "g-3", "story-2", "closing", "story-1", "hero-mobile", "story-4", "hero-desktop"] },
  dark: { dir: "navy", story: ["story-1", "story-2", "story-3", "story-4"], gallery: ["g-1", "g-2", "hero-desktop", "g-3", "bride", "groom", "story-3", "closing", "hero-mobile", "story-2", "story-4", "story-1"] },
};

/** Fields left empty on purpose by many clients: never filled with sample text. */
const KEEP_EMPTY = new Set(["registry", "videoUrl", "videoThumb", "note", "hashtag", "imageCutout", "ogImage", "instagram"]);

/** Fills empty texts and lists from the sample couple, recursively. */
function fillEmpty<T>(value: T, sample: T): T {
  if (typeof value === "string") return (value.trim() ? value : sample) as T;
  if (Array.isArray(value)) return (value.length ? value : sample) as T;
  if (value && typeof value === "object" && sample && typeof sample === "object") {
    const out = { ...(value as Record<string, unknown>) };
    for (const [k, v] of Object.entries(out)) {
      if (KEEP_EMPTY.has(k)) continue;
      const sv = (sample as Record<string, unknown>)[k];
      if (sv !== undefined) out[k] = fillEmpty(v, sv);
    }
    return out as T;
  }
  return value;
}

/**
 * Layout previews use stock sample photos (fictional couples) instead of the
 * client's own, so choosing a layout never shows real people's photos and
 * every layout looks complete. Texts stay the client's (sample texts fill only empty fields).
 */
export function withSamplePhotos(c: WeddingContent): WeddingContent {
  const set = SAMPLE[c.style.mode === "dark" ? "dark" : "light"];
  const img = (n: string) => `/demo/${set.dir}/${n}.webp`;
  const demo = c.style.mode === "dark" ? DEMO_NAVY : DEMO_SAGE;
  const d = structuredClone(c);
  // Empty fields would make every layout look the same ("Belum ada cerita"), so borrow the sample's texts.
  for (const k of ["cover", "hero", "couple", "story", "event", "venue", "gallery", "rsvp", "gift", "closing"] as const) {
    (d as unknown as Record<string, unknown>)[k] = fillEmpty<unknown>(d[k], demo[k]);
  }
  d.hero.imageDesktop = img("hero-desktop");
  d.hero.imageMobile = img("hero-mobile");
  d.hero.imageCutout = "";
  d.couple.first.photo = img("bride");
  d.couple.second.photo = img("groom");
  if (d.couple.videoThumb) d.couple.videoThumb = img("hero-desktop");
  d.story.items = d.story.items.map((it, i) => ({ ...it, image: img(set.story[i % 4]), moreImages: it.moreImages.map((_, j) => img(set.gallery[(i + j) % set.gallery.length])) }));
  d.venue.image = img("venue");
  const n = Math.max(d.gallery.photos.length, 8);
  d.gallery.photos = Array.from({ length: n }, (_, i) => ({ id: `sample-${i}`, src: img(set.gallery[i % set.gallery.length]) }));
  if (d.gift.registry.image) d.gift.registry.image = img("g-3");
  d.closing.image = img("closing");
  return d;
}

/**
 * Full-screen sections are shown whole (same proportions as the screen).
 * Other sections are scaled to fit and centred in a box of `height`, so the
 * layout's content (not its padding) fills the preview.
 */
export function ScaledPreview({ content, media, block, layout, height, className = "" }: { content: WeddingContent; media: Record<string, string>; block: BlockKey; layout: string; height: number; className?: string }) {
  const wide = useWideViewport();
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [innerH, setInnerH] = useState(0);
  const [bg, setBg] = useState<string>("");
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setInnerH(el.offsetHeight);
      // Fill the margins around a scaled-down section with the section's own colour.
      const section = el.querySelector("section");
      const col = section ? getComputedStyle(section).backgroundColor : "";
      setBg(col && col !== "rgba(0, 0, 0, 0)" ? col : getComputedStyle(el.firstElementChild ?? el).backgroundColor);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  const virtual = wide ? 1280 : 390;
  const fitW = w ? w / virtual : 0;
  const full = FULL_SCREEN.includes(block);
  const screenH = typeof window === "undefined" ? 800 : Math.min(window.innerHeight, wide ? 820 : 760);
  const boxH = wide ? height : Math.round(height * 1.3);
  const h = full && fitW ? Math.min(Math.round(screenH * fitW), height * 2) : boxH;
  let scale = fitW;
  let top = 0;
  if (!full && fitW && innerH) {
    // Shrink tall sections (down to 60% of full width, 35% on phones) so more of the layout shows, then centre.
    scale = Math.max(Math.min(fitW, h / innerH), fitW * (wide ? 0.6 : 0.35));
    top = Math.max(0, (h - innerH * scale) / 2);
  }
  const left = w ? Math.max(0, (w - virtual * scale) / 2) : 0;
  return (
    <div ref={box} style={{ height: h, background: bg || undefined }} className={`pointer-events-none relative overflow-hidden bg-rk-cream ${className}`} aria-hidden>
      {scale > 0 && (
        <div ref={inner} style={{ width: virtual, transform: `translate(${left}px, ${top}px) scale(${scale})`, transformOrigin: "top left" }} className="absolute left-0 top-0">
          <LayoutPreview content={content} block={block} layout={layout} media={media} />
        </div>
      )}
    </div>
  );
}

export function LayoutCard({ block }: { block: BlockKey }) {
  const { content: c, media } = useEditor();
  const [open, setOpen] = useState(false);
  const sample = useMemo(() => withSamplePhotos(c), [c]);
  const current = layoutOf(block, c.layouts[block]);
  const count = LAYOUTS[block].length;
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-rk-line bg-white">
        <ScaledPreview content={sample} media={media} block={block} layout={current.id} height={150} />
        <div className="flex items-center gap-3 border-t border-rk-line p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rk-cream">
            <LayoutTemplate className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-rk-sans text-[11px] font-bold uppercase tracking-[1.2px] text-rk-mute">Tata letak · {count} pilihan</span>
            <span className="block truncate font-rk-sans text-[14px] font-bold text-rk-ink">{current.name}</span>
          </span>
          <button type="button" onClick={() => setOpen(true)} className="h-9 shrink-0 rounded-xl bg-rk-ink px-3.5 font-rk-sans text-[13px] font-bold text-white hover:bg-rk-plum">
            Ganti tata letak
          </button>
        </div>
      </div>
      {open && <LayoutModal block={block} sample={sample} onClose={() => setOpen(false)} />}
    </>
  );
}

function LayoutModal({ block, sample, onClose }: { block: BlockKey; sample: WeddingContent; onClose: () => void }) {
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
      <div className="rk-sheet-in relative flex max-h-[90dvh] w-full max-w-[1040px] lg:max-w-[1280px] flex-col overflow-hidden rounded-t-[28px] bg-rk-ivory md:rounded-[28px]">
        <div className="flex justify-center pt-2.5 md:hidden">
          <span className="h-1 w-10 rounded-full bg-rk-line" />
        </div>
        <div className="flex items-start gap-3 border-b border-rk-line bg-white px-5 pb-4 pt-3 md:px-7 md:pt-6">
          <div className="min-w-0 flex-1">
            <h2 className="font-rk-serif text-[26px] leading-none md:text-[30px]">Tata letak {BLOCK_LABELS[block]}</h2>
            <p className="mt-1.5 font-rk-sans text-[13px] text-rk-mute">Isi teks dan foto kamu tetap sama, hanya susunannya yang berubah. Pratinjau memakai foto contoh.</p>
          </div>
          <button type="button" aria-label="Tutup" onClick={onClose} className="rounded-full p-2 hover:bg-rk-ivory">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid min-h-0 flex-1 auto-rows-max content-start gap-4 overflow-y-auto overscroll-contain p-4 pb-[calc(20px+env(safe-area-inset-bottom))] sm:grid-cols-2 md:p-6 lg:grid-cols-3">
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
                  <ScaledPreview content={sample} media={media} block={block} layout={o.id} height={220} />
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
