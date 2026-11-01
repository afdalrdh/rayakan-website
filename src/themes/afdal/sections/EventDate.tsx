"use client";

import { formatEventDate } from "@/lib/content";
import { Block, COUNTDOWN_UNITS, useCountdown, useTheme } from "../../shared";
import { Reveal } from "./Reveal";

const LABELS = { days: "Days", hours: "Hours", minutes: "Mins", seconds: "Secs" } as const;

export function EventDate() {
  const { content: c } = useTheme();
  const left = useCountdown(c.event);
  return (
    <Block id="event">
      <section id="date" className="flex min-h-[100svh] items-center justify-center bg-t-bg px-4 py-20 text-center text-t-accent md:px-8 md:py-28">
        <div className="mx-auto w-full max-w-[980px]">
          <Reveal>
            <div className="mx-auto h-px w-[58px] bg-t-muted/40" />
            <p className="mt-16 font-sans text-[13px] font-semibold uppercase leading-[18px] tracking-[2px] text-t-muted md:text-[18px] md:tracking-[2.4px]">{c.event.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-14 font-serif text-[40px] leading-none tracking-[1px] sm:text-[60px] md:text-[88px]">{formatEventDate(c.event.date)}</p>
          </Reveal>
          <Reveal delay={0.18} className="mx-auto mt-12 grid max-w-[560px] grid-cols-4 gap-2 sm:gap-4 md:mt-20 md:gap-5">
            {COUNTDOWN_UNITS.map((k) => (
              <div key={k} className="flex aspect-square min-w-0 flex-col items-center justify-center bg-t-card px-2 py-3">
                <span className="font-serif text-[30px] leading-[36px] tabular-nums text-t-accent">{String(left[k]).padStart(2, "0")}</span>
                <span className="mt-1 font-sans text-[10px] uppercase leading-[15px] tracking-[1px] text-t-muted">{LABELS[k]}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </Block>
  );
}
