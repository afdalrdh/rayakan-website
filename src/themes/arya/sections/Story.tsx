"use client";

import { useState } from "react";
import type { StoryItem } from "@/lib/content";
import { Block, Img, Lightbox, useTheme } from "../../shared";
import { Heading } from "./Heading";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function TimelineCard({ item, align, onImageClick }: { item: StoryItem; align: "left" | "right"; onImageClick: () => void }) {
  return (
    <div className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start text-left"}`}>
      <div className="inline-flex items-center rounded-full border border-t-muted/40 bg-t-card px-3.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-[2px] text-t-accent shadow-[0_4px_12px_rgba(0,0,0,0.3)] md:text-[12px]">{item.date}</div>
      <h3 className="mt-3 font-serif text-[21px] font-semibold leading-snug text-white sm:text-[23px] md:text-[25px]">{item.title}</h3>
      <p className="mt-3 font-sans text-[13px] leading-[1.8] text-neutral-300 sm:text-[14px] md:max-w-[460px] md:text-[15px] md:leading-[1.85]">{item.body}</p>
      {item.image && (
        <button
          type="button"
          onClick={onImageClick}
          aria-label={`Perbesar foto ${item.title}`}
          className="group relative mt-4 block aspect-[4/3] w-full max-w-[460px] cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 shadow-[0_12px_28px_rgba(0,0,0,0.45)] transition duration-500 hover:scale-[1.015] hover:border-t-accent/40 sm:aspect-[3/2]"
        >
          <Img src={item.image} alt={item.title} fill quality={80} sizes="(min-width: 768px) 460px, 92vw" className="object-cover transition duration-700 ease-out group-hover:scale-105" />
        </button>
      )}
    </div>
  );
}

/** Vertical timeline; alternates sides on desktop. */
export function Story() {
  const { content: c } = useTheme();
  const [open, setOpen] = useState<StoryItem | null>(null);
  return (
    <Block id="story">
      <section id="story" className="relative bg-t-alt px-4 py-20 text-neutral-200 sm:px-6 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1100px]">
          <Heading eyebrow={c.story.eyebrow} title={c.story.title} />
          <div className="relative mt-16 md:mt-24">
            <div className="absolute bottom-0 top-0 hidden w-px bg-neutral-800 md:left-1/2 md:-ml-[0.5px] md:block" aria-hidden="true" />
            <div className="absolute bottom-0 left-[19px] top-0 w-px bg-neutral-800 md:hidden" aria-hidden="true" />
            <div className="space-y-12 md:space-y-20">
              {c.story.items.map((item, i) => {
                const onLeft = i % 2 === 0;
                return (
                  <div key={item.id} className="relative flex flex-col md:flex-row md:items-start">
                    <div className="absolute left-0 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-t-card font-serif text-[12px] font-bold text-t-accent md:left-1/2 md:-ml-5">{ROMAN[i] ?? i + 1}</div>
                    <div className="hidden md:block md:w-1/2 md:pr-14">{onLeft && <TimelineCard item={item} align="right" onImageClick={() => setOpen(item)} />}</div>
                    <div className="hidden md:block md:w-1/2 md:pl-14">{!onLeft && <TimelineCard item={item} align="left" onImageClick={() => setOpen(item)} />}</div>
                    <div className="pl-14 md:hidden">
                      <TimelineCard item={item} align="left" onImageClick={() => setOpen(item)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {open && <Lightbox src={open.image} alt={open.title} onClose={() => setOpen(null)} />}
      </section>
    </Block>
  );
}
