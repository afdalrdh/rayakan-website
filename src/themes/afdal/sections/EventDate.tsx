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
      <section id="date" className="flex min-h-[80svh] items-center justify-center bg-t-bg px-5 py-20 text-center text-t-accent md:px-8 md:py-28 lg:py-32">
        <div className="mx-auto w-full max-w-[980px]">
          <Reveal>
            <p className="font-sans text-[12px] font-medium uppercase leading-none tracking-[0.24em] text-t-muted md:text-[13px]">{c.event.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 font-serif text-[40px] leading-[1.05] sm:text-[60px] md:mt-8 md:text-[84px]">{formatEventDate(c.event.date)}</p>
          </Reveal>
          <Reveal delay={0.18} className="mx-auto mt-10 grid max-w-[520px] grid-cols-4 gap-2.5 sm:gap-4 md:mt-14 md:gap-5">
            {COUNTDOWN_UNITS.map((k) => (
              <div key={k} className="flex aspect-square min-w-0 flex-col items-center justify-center rounded-[14px] bg-t-card px-2 py-3">
                <span className="font-serif text-[28px] leading-none tabular-nums text-t-accent sm:text-[36px] md:text-[42px]">{String(left[k]).padStart(2, "0")}</span>
                <span className="mt-2 font-sans text-[10px] uppercase leading-none tracking-[0.16em] text-t-muted md:text-[11px]">{LABELS[k]}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </Block>
  );
}
