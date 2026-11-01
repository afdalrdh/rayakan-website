"use client";

import { ArrowUpRightIcon, Block, Img, InfoIcon, useTheme } from "../../shared";

export function Venue() {
  const { content: c } = useTheme();
  const v = c.venue;
  return (
    <Block id="venue">
      <section id="venue" className="bg-t-bg px-5 py-20 text-[#544341] md:px-8 md:py-28">
        <div className={`mx-auto grid max-w-[1290px] gap-12 md:items-center md:gap-20 ${v.image ? "md:grid-cols-[0.95fr_1fr]" : ""}`}>
          {v.image && (
            <div className="mx-auto w-full max-w-[565px]">
              <Img src={v.image} alt={v.name} width={1085} height={1450} sizes="(min-width: 768px) 45vw, 100vw" className="h-auto w-full" />
            </div>
          )}
          <div className={`mx-auto w-full max-w-[580px] text-center ${v.image ? "md:mx-0 md:text-left" : ""}`}>
            <p className="font-sans text-[14px] uppercase leading-[20px] tracking-[1.2px] text-t-muted">{v.eyebrow}</p>
            <h2 className="mt-9 font-serif text-[42px] font-semibold leading-none text-t-accent sm:text-[54px] md:text-[64px]">{v.name || "Nama tempat"}</h2>
            <div className={`mt-9 h-px w-[58px] bg-t-muted/40 ${v.image ? "mx-auto md:mx-0" : "mx-auto"}`} />
            <p className="mt-8 font-sans text-[16px] leading-[28px]">{v.address}</p>
            {v.schedules.length > 0 && (
              <div className={`mt-8 grid gap-4 md:gap-[30px] ${v.schedules.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {v.schedules.map((s) => (
                  <div key={s.id} className="flex min-h-[140px] flex-col items-center justify-center bg-t-card px-6 py-8 text-center">
                    <p className="font-serif text-[18px] leading-[28px] text-t-accent">{s.label}</p>
                    <p className="mt-4 font-sans text-[18px] font-semibold leading-[24px] text-[#1F1C0B]">{s.time}</p>
                  </div>
                ))}
              </div>
            )}
            {v.note && (
              <p className="mt-8 flex items-start gap-3 rounded-[12px] bg-t-input p-4 text-left font-sans text-[15px] leading-relaxed">
                <InfoIcon className="mt-0.5 text-t-accent" />
                {v.note}
              </p>
            )}
            {v.mapsUrl && (
              <a href={v.mapsUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center justify-center gap-3 rounded-[9px] bg-t-accent px-6 py-3 font-sans text-[17px] leading-none text-white transition hover:brightness-90">
                Lihat di Maps <ArrowUpRightIcon />
              </a>
            )}
          </div>
        </div>
      </section>
    </Block>
  );
}
