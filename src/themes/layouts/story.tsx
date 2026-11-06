"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import type { StoryItem } from "@/lib/content";
import { CONTAINER, EmptyPhoto, Heading, Img, Lightbox, Section, T, useShowEmpty, useTheme } from "../shared";

/* Love story chapters. */

type Story = () => React.JSX.Element | null;

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function NoChapters() {
  return (
    <div className="mx-auto mt-12 flex max-w-[520px] flex-col items-center gap-2 rounded-[18px] border border-dashed border-t-muted/50 bg-t-card px-6 py-10 text-center text-t-fg2">
      <span className="t-head text-[20px] text-t-accent">Belum ada cerita</span>
      <span className="text-[13px]">Tambahkan babak kisah cinta kalian dari editor.</span>
    </div>
  );
}

function ChapterPhoto({ item, sizes, className = "" }: { item: StoryItem; sizes: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-t-input ${className}`}>
      {item.image ? <Img src={item.image} alt={item.title} fill quality={80} sizes={sizes} className="object-cover" /> : <EmptyPhoto label="Foto cerita" />}
    </div>
  );
}

/** "Linimasa" (from Malam Emas): vertical timeline, alternating sides on desktop. */
const Linimasa: Story = () => {
  const { content: c, mode } = useTheme();
  const showEmpty = useShowEmpty();
  const [open, setOpen] = useState<StoryItem | null>(null);
  const items = mode === "thumb" ? c.story.items.slice(0, 2) : c.story.items;
  const card = (item: StoryItem, align: "left" | "right") => (
    <div className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start text-left"}`}>
      <span className="inline-flex items-center rounded-full border border-t-muted/40 bg-t-card px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[2px] text-t-accent md:text-[12px]">
        <T v={item.date} ph="Waktu" />
      </span>
      <h3 className="t-head mt-3 text-[21px] leading-snug text-t-fg md:text-[25px]">
        <T v={item.title} ph="Judul cerita" />
      </h3>
      <p className="mt-3 text-[14px] leading-[1.8] text-t-fg2 md:max-w-[460px] md:text-[15px]">
        <T v={item.body} ph="Isi cerita" />
      </p>
      {/* Text-only chapters are fine for photo-free themes: no empty box for guests. */}
      {(item.image || showEmpty) && (
        <button type="button" onClick={() => item.image && setOpen(item)} aria-label={`Perbesar foto ${item.title}`} className="mt-4 block w-full max-w-[460px] cursor-zoom-in">
          <ChapterPhoto item={item} sizes="(min-width: 768px) 460px, 92vw" className="aspect-[3/2] w-full rounded-2xl border border-t-line" />
        </button>
      )}
    </div>
  );
  return (
    <Section block="story" tone="alt">
      <div className="mx-auto max-w-[1100px]">
        <Heading eyebrow={c.story.eyebrow} title={c.story.title} />
        {!items.length && <NoChapters />}
        <div className="relative mt-16 md:mt-24">
          {items.length > 0 && <div className="absolute bottom-0 left-[19px] top-0 w-px bg-t-line md:left-1/2" aria-hidden="true" />}
          <div className="space-y-12 md:space-y-20">
            {items.map((item, i) => (
              <div key={item.id} className="relative flex flex-col md:flex-row md:items-start">
                <div className="t-head absolute left-0 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-t-line bg-t-card text-[12px] text-t-accent md:left-1/2 md:-ml-5">{ROMAN[i] ?? i + 1}</div>
                <div className="hidden md:block md:w-1/2 md:pr-14">{i % 2 === 0 && card(item, "right")}</div>
                <div className="hidden md:block md:w-1/2 md:pl-14">{i % 2 === 1 && card(item, "left")}</div>
                <div className="pl-14 md:hidden">{card(item, "left")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {open && <Lightbox src={open.image} alt={open.title} onClose={() => setOpen(null)} />}
    </Section>
  );
};

function ChapterImages({ item, sizes }: { item: StoryItem; sizes: string }) {
  const images = [item.image, ...item.moreImages].filter(Boolean).slice(0, 4);
  if (!images.length) return <EmptyPhoto label="Foto cerita" />;
  return (
    <div className={images.length > 1 ? "grid h-full w-full grid-cols-2 grid-rows-2 gap-2 md:gap-3" : "h-full w-full"}>
      {images.map((src, i) => (
        <div key={`${src}-${i}`} className="relative h-full w-full overflow-hidden">
          <Img src={src} alt={`${item.title} ${i + 1}`} fill sizes={sizes} className="object-cover" />
        </div>
      ))}
    </div>
  );
}

function Indicators({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`h-px transition-all duration-500 ${i === active ? "w-12 bg-t-accent" : "w-5 bg-t-muted/40"}`} />
      ))}
    </div>
  );
}

/** "Bab Bergulir" (from Putih Marun): the page pins while chapters cross-fade on scroll. */
const Bab: Story = () => {
  const { content: c, mode } = useTheme();
  const showEmpty = useShowEmpty();
  const items = c.story.items;
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setActive(Math.min(items.length - 1, Math.max(0, Math.floor(p * items.length)))));
  const active = mode === "thumb" ? 0 : scrolled;

  if (!items.length) {
    if (!showEmpty) return null;
    return (
      <Section block="story" tone="alt">
        <Heading eyebrow={c.story.eyebrow} title={c.story.title} />
        <NoChapters />
      </Section>
    );
  }
  // Thumbnails can't scroll, so show the first chapter as a still.
  const n = mode === "thumb" ? 1 : items.length;
  const fade = (i: number) => (i === active ? "opacity-100 translate-y-0" : i < active ? "opacity-0 -translate-y-10" : "opacity-0 translate-y-10");

  return (
    <Section block="story" tone="alt" pad={false} sectionRef={ref} style={{ ["--n" as string]: n }} className="h-[calc(var(--n)*115svh)] md:h-[calc(var(--n)*80vh)]">
      <div className="sticky top-0 flex h-[100svh] items-start overflow-hidden md:h-screen md:items-center md:px-16 md:py-16">
        <div className="relative h-[100svh] w-full md:grid md:h-auto md:grid-cols-2 md:items-center md:gap-10 lg:grid-cols-[minmax(0,540px)_minmax(0,582px)] lg:justify-center lg:gap-[92px]">
          <div className="relative z-10 h-[calc(100svh-100vw)] overflow-hidden md:h-[65vh]">
            {items.map((item, i) => (
              <div key={item.id} className={`absolute inset-0 flex flex-col justify-center px-6 py-4 transition-all duration-500 md:px-0 md:py-0 ${fade(i)}`} aria-hidden={i !== active}>
                <p className="mb-2 text-[10px] uppercase leading-[14px] tracking-[2px] text-t-muted md:mb-5 md:text-[15px] md:leading-[22px] md:tracking-[2.5px]">
                  <T v={item.date} ph="Waktu" />
                </p>
                <h3 className="t-head mb-3 text-[30px] leading-[1] text-t-accent md:mb-9 md:text-[56px] md:leading-[1.1] lg:text-[64px]">
                  <T v={item.title} ph="Judul cerita" />
                </h3>
                <p className="max-w-[540px] text-[12px] leading-[18px] text-t-fg2 md:text-[18px] md:leading-[32px]">
                  <T v={item.body} ph="Isi cerita" />
                </p>
                <div className="hidden md:mt-16 md:block">
                  <Indicators count={items.length} active={i} />
                </div>
              </div>
            ))}
            <div className="pointer-events-none absolute bottom-5 left-6 z-20 md:hidden" aria-hidden="true">
              <Indicators count={items.length} active={active} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 aspect-square w-screen overflow-hidden md:hidden">
            {items.map((item, i) => (
              <div key={item.id} className={`absolute inset-0 transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}>
                <ChapterImages item={item} sizes="100vw" />
              </div>
            ))}
          </div>
          <div className="relative hidden aspect-square w-[min(42vw,582px)] justify-self-center overflow-hidden md:block">
            {items.map((item, i) => (
              <div key={item.id} className={`absolute inset-0 transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}>
                <ChapterImages item={item} sizes="(min-width: 1024px) 582px, 50vw" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

/** "Kartu Geser": chapter cards in a horizontal, swipeable row. */
const Geser: Story = () => {
  const { content: c } = useTheme();
  const items = c.story.items;
  return (
    <Section block="story" tone="alt" pad={false} className="py-20 md:py-28 lg:py-32">
      <div className="px-5 md:px-8">
        <Heading eyebrow={c.story.eyebrow} title={c.story.title} />
      </div>
      {!items.length && (
        <div className="px-5">
          <NoChapters />
        </div>
      )}
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:mt-16 md:gap-7 md:px-[max(2rem,calc((100vw-1120px)/2))]">
        {items.map((item, i) => (
          <article key={item.id} className="w-[82vw] max-w-[380px] shrink-0 snap-center overflow-hidden rounded-[22px] border border-t-line bg-t-card md:w-[380px]">
            <ChapterPhoto item={item} sizes="380px" className="aspect-[4/3] w-full" />
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[2px] text-t-muted">
                  <T v={item.date} ph="Waktu" />
                </span>
                <span className="t-head text-[13px] text-t-accent">{ROMAN[i] ?? i + 1}</span>
              </div>
              <h3 className="t-head mt-3 text-[22px] leading-snug text-t-accent">
                <T v={item.title} ph="Judul cerita" />
              </h3>
              <p className="mt-3 text-[14px] leading-[1.75] text-t-fg2">
                <T v={item.body} ph="Isi cerita" />
              </p>
            </div>
          </article>
        ))}
      </div>
      {items.length > 1 && <p className="mt-4 text-center text-[12px] text-t-fg2 md:hidden">Geser untuk cerita berikutnya →</p>}
    </Section>
  );
};

/** "Zig-zag": big photo and text alternate, with large chapter numbers. */
const Zigzag: Story = () => {
  const { content: c } = useTheme();
  const items = c.story.items;
  return (
    <Section block="story">
      <div className={CONTAINER}>
        <Heading eyebrow={c.story.eyebrow} title={c.story.title} />
        {!items.length && <NoChapters />}
        <div className="mt-16 space-y-16 md:mt-24 md:space-y-24">
          {items.map((item, i) => (
            <div key={item.id} className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <ChapterPhoto item={item} sizes="(min-width: 768px) 540px, 92vw" className="aspect-[4/3] w-full rounded-[20px]" />
              <div>
                <span className="t-display block text-[calc(72px*var(--t-display-scale))] leading-none text-t-muted/50 md:text-[calc(96px*var(--t-display-scale))]">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-[12px] font-semibold uppercase tracking-[2px] text-t-muted">
                  <T v={item.date} ph="Waktu" />
                </p>
                <h3 className="t-head mt-3 text-[26px] leading-tight text-t-accent md:text-[34px]">
                  <T v={item.title} ph="Judul cerita" />
                </h3>
                <p className="mt-4 text-[15px] leading-[1.8] text-t-fg2 md:text-[16px]">
                  <T v={item.body} ph="Isi cerita" />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export const STORY_LAYOUTS: Record<string, Story> = { linimasa: Linimasa, bab: Bab, geser: Geser, zigzag: Zigzag };
