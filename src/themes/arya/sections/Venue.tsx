"use client";

import { ArrowUpRightIcon, Block, Img, InfoIcon, useTheme } from "../../shared";

/** Venue illustration, address, schedule cards, optional guest note and maps button. */
export function Venue() {
  const { content: c } = useTheme();
  const v = c.venue;
  return (
    <Block id="venue">
      <section id="venue" className="relative bg-t-alt px-4 py-20 text-neutral-200 sm:px-6 md:px-8 md:py-28">
        <div className={`mx-auto grid max-w-[1180px] items-center gap-12 lg:gap-16 ${v.image ? "lg:grid-cols-[1.05fr_1fr]" : ""}`}>
          {v.image && (
            <div className="mx-auto w-full max-w-[500px]">
              <Img src={v.image} alt={v.name} width={992} height={1226} sizes="(min-width: 1024px) 500px, 92vw" className="h-auto w-full rounded-[18px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]" />
            </div>
          )}
          <div className={`flex flex-col items-center text-center ${v.image ? "lg:items-start lg:text-left" : ""}`}>
            <p className="font-sans text-[12px] uppercase tracking-[3px] text-t-muted md:text-[13px]">{v.eyebrow}</p>
            <h2 className="mt-3 font-serif text-[38px] font-semibold leading-tight text-t-accent sm:text-[46px] md:text-[52px]">{v.name || "Nama tempat"}</h2>
            <div className="mt-4 h-px w-14 bg-t-muted/60" />
            <p className="mt-5 max-w-[480px] font-sans text-[14px] leading-[1.7] text-neutral-300 sm:text-[15px] md:text-[16px]">{v.address}</p>
            {v.schedules.length > 0 && (
              <div className={`mt-8 grid w-full max-w-[480px] gap-4 ${v.schedules.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                {v.schedules.map((s) => (
                  <div key={s.id} className="flex flex-col items-center justify-center rounded-[14px] border border-white/10 bg-t-card px-4 py-6 text-center shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
                    <p className="font-serif text-[17px] font-semibold text-t-accent md:text-[19px]">{s.label}</p>
                    <p className="mt-2.5 font-sans text-[14px] font-bold text-white md:text-[16px]">{s.time}</p>
                  </div>
                ))}
              </div>
            )}
            {v.note && (
              <p className="mt-6 flex max-w-[480px] items-start gap-3 rounded-[14px] border border-white/10 bg-t-card p-4 text-left font-sans text-[14px] leading-relaxed text-neutral-300">
                <InfoIcon className="mt-0.5 text-t-accent" />
                {v.note}
              </p>
            )}
            {v.mapsUrl && (
              <a href={v.mapsUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center justify-center gap-3 rounded-[9px] bg-t-accent px-6 py-3 font-sans text-[17px] leading-none text-neutral-950 transition hover:brightness-90">
                Lihat di Maps <ArrowUpRightIcon />
              </a>
            )}
          </div>
        </div>
      </section>
    </Block>
  );
}
