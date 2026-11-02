"use client";

import { ArrowUpRightIcon, Block, Img, InfoIcon, useTheme } from "../../shared";
import { Heading, SECTION_Y } from "./Heading";

export function Venue() {
  const { content: c } = useTheme();
  const v = c.venue;
  return (
    <Block id="venue">
      <section id="venue" className={`bg-t-bg px-5 text-[#544341] md:px-8 ${SECTION_Y}`}>
        <div className={`mx-auto grid max-w-[1120px] gap-12 md:items-center md:gap-16 lg:gap-20 ${v.image ? "md:grid-cols-[0.95fr_1fr]" : ""}`}>
          {v.image && (
            <div className="mx-auto w-full max-w-[420px] md:max-w-[500px]">
              <Img src={v.image} alt={v.name} width={1085} height={1450} sizes="(min-width: 768px) 45vw, 100vw" className="h-auto w-full" />
            </div>
          )}
          <div className={`mx-auto w-full max-w-[580px] text-center ${v.image ? "md:mx-0 md:text-left" : ""}`}>
            <Heading eyebrow={v.eyebrow} title={v.name || "Nama tempat"} align="center" className={v.image ? "md:hidden" : ""} />
            {v.image && <Heading eyebrow={v.eyebrow} title={v.name || "Nama tempat"} align="left" className="hidden md:block" />}
            <p className="mt-6 font-sans text-[15px] leading-[1.75] md:mt-7 md:text-[16px]">{v.address}</p>
            {v.schedules.length > 0 && (
              <div className={`mt-8 grid gap-3 md:gap-4 ${v.schedules.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {v.schedules.map((s) => (
                  <div key={s.id} className="flex min-h-[120px] flex-col items-center justify-center rounded-[14px] bg-t-card px-6 py-7 text-center">
                    <p className="font-serif text-[18px] leading-tight text-t-accent">{s.label}</p>
                    <p className="mt-3 font-sans text-[17px] font-semibold leading-tight text-[#1F1C0B]">{s.time}</p>
                  </div>
                ))}
              </div>
            )}
            {v.note && (
              <p className="mt-4 flex items-start gap-3 rounded-[14px] bg-t-input p-4 text-left font-sans text-[14px] leading-relaxed md:text-[15px]">
                <InfoIcon className="mt-0.5 text-t-accent" />
                {v.note}
              </p>
            )}
            {v.mapsUrl && (
              <a href={v.mapsUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center justify-center gap-3 rounded-[12px] bg-t-accent px-6 py-3.5 font-sans text-[15px] font-semibold leading-none text-white transition hover:brightness-90">
                Lihat di Maps <ArrowUpRightIcon />
              </a>
            )}
          </div>
        </div>
      </section>
    </Block>
  );
}
