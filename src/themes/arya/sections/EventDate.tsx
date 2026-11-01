"use client";

import { formatEventDate } from "@/lib/content";
import { Block, COUNTDOWN_UNITS, useCountdown, useTheme } from "../../shared";

const LABELS = { days: "Hari", hours: "Jam", minutes: "Menit", seconds: "Detik" } as const;

/** Big date + live countdown. */
export function EventDate() {
  const { content: c } = useTheme();
  const left = useCountdown(c.event);
  return (
    <Block id="event">
      <section id="date" className="relative flex min-h-[100svh] items-center justify-center bg-t-bg px-4 py-10 text-center text-white sm:py-14 md:px-8">
        <div className="mx-auto w-full max-w-[960px]">
          <div className="mx-auto h-px w-16 bg-t-muted/60" />
          <p className="mt-8 font-sans text-[12px] uppercase tracking-[3.5px] text-t-muted md:mt-10 md:text-[14px]">{c.event.eyebrow}</p>
          <h2 className="mt-4 font-serif text-[38px] font-semibold leading-[1.15] text-t-accent sm:text-[54px] md:mt-6 md:text-[68px] lg:text-[78px]">{formatEventDate(c.event.date)}</h2>
          <div className="mx-auto mt-10 grid max-w-[560px] grid-cols-4 gap-3 sm:gap-4 md:mt-14 md:max-w-[620px] md:gap-5">
            {COUNTDOWN_UNITS.map((k) => (
              <div key={k} className="flex aspect-square min-w-0 flex-col items-center justify-center rounded-[18px] border border-white/10 bg-t-card px-2 py-3 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
                <span className="font-serif text-[28px] font-semibold tabular-nums text-t-accent sm:text-[36px] md:text-[44px]">{String(left[k]).padStart(2, "0")}</span>
                <span className="mt-1 font-sans text-[10px] font-medium uppercase tracking-[1.8px] text-neutral-400 sm:text-[11px] md:text-[12px]">{LABELS[k]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Block>
  );
}
