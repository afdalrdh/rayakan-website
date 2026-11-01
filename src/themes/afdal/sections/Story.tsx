"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import type { StoryItem } from "@/lib/content";
import { Block, EmptyPhoto, Img, useTheme } from "../../shared";

function Indicators({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`h-px transition-all duration-500 ${i === active ? "w-12 bg-t-accent" : "w-5 bg-t-muted/30"}`} />
      ))}
    </div>
  );
}

function ChapterImages({ item, sizes }: { item: StoryItem; sizes: string }) {
  const images = [item.image, ...item.moreImages].filter(Boolean).slice(0, 4);
  if (!images.length) return <EmptyPhoto />;
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

/**
 * Sticky, scroll-driven chapters: the page pins while each chapter's text and
 * photos cross-fade. Works for any number of chapters.
 */
export function Story() {
  const { content: c } = useTheme();
  const items = c.story.items;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setActive(Math.min(items.length - 1, Math.max(0, Math.floor(p * items.length)))));

  if (!items.length) return null;
  const fade = (i: number) => (i === active ? "opacity-100 translate-y-0" : i < active ? "opacity-0 -translate-y-10" : "opacity-0 translate-y-10");

  return (
    <Block id="story">
      <section id="story" ref={ref} style={{ ["--n" as string]: items.length }} className="relative h-[calc(var(--n)*115svh)] bg-t-alt md:h-[calc(var(--n)*80vh)]">
        <div className="sticky top-0 flex h-[100svh] items-start overflow-hidden md:h-screen md:items-center md:px-16 md:py-16">
          <div className="relative h-[100svh] w-full md:grid md:h-auto md:grid-cols-2 md:items-center md:gap-10 lg:grid-cols-[minmax(0,540px)_minmax(0,582px)] lg:justify-center lg:gap-[92px]">
            <div className="relative z-10 h-[calc(100svh-100vw)] overflow-hidden md:h-[65vh]">
              {items.map((item, i) => (
                <div key={item.id} className={`absolute inset-0 flex flex-col justify-center px-6 py-4 transition-all duration-500 md:px-0 md:py-0 ${fade(i)}`} aria-hidden={i !== active}>
                  <p className="mb-2 font-sans text-[10px] uppercase leading-[14px] tracking-[2px] text-t-muted md:mb-5 md:text-[15px] md:leading-[22px] md:tracking-[2.5px]">{item.date}</p>
                  <h3 className="mb-3 font-serif text-[30px] font-semibold leading-[1] text-t-accent md:mb-9 md:text-[56px] md:leading-[1.1] lg:text-[64px]">{item.title}</h3>
                  <p className="max-w-[540px] font-sans text-[12px] leading-[18px] text-[#6f625f] md:text-[18px] md:leading-[32px] lg:text-[19px] lg:leading-[34px]">{item.body}</p>
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
      </section>
    </Block>
  );
}
