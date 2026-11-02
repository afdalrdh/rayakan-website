"use client";

import { formatEventDate } from "@/lib/content";
import { Block, HeroChrome, HeroPhoto, Img, T, useNameFit, useTheme, EmptyPhoto } from "../shared";

/* Opening photo with the couple names. Every layout uses the same fields. */

type Hero = () => React.JSX.Element;

function useDate() {
  const { content: c } = useTheme();
  return c.event.date ? formatEventDate(c.event.date) : "";
}

function Rosette() {
  return (
    <svg viewBox="0 0 24 24" className="mx-2 h-5 w-5 shrink-0 md:h-6 md:w-6" fill="none" aria-hidden="true">
      {[
        "M 12 1.5 C 9.8 5 9.8 8.5 12 10.5 C 14.2 8.5 14.2 5 12 1.5 Z",
        "M 12 22.5 C 9.8 19 9.8 15.5 12 13.5 C 14.2 15.5 14.2 19 12 22.5 Z",
        "M 1.5 12 C 5 9.8 8.5 9.8 10.5 12 C 8.5 14.2 5 14.2 1.5 12 Z",
        "M 22.5 12 C 19 9.8 15.5 9.8 13.5 12 C 15.5 14.2 19 14.2 22.5 12 Z",
      ].map((d) => (
        <path key={d} d={d} fill="url(#accentGradient)" />
      ))}
      <polygon points="12,9.8 14.2,12 12,14.2 9.8,12" fill="#FFF6E0" />
    </svg>
  );
}

/** "Sinematik" (from Malam Emas): names in a gradient of the accent colour, rosette divider. */
const Sinematik: Hero = () => {
  const { content: c } = useTheme();
  const h = c.hero;
  const { first, second, k } = useNameFit(7.2);
  const bottom = h.namePosition === "bottom";
  const hasCutout = !!h.imageCutout && !bottom;
  const size = "text-[calc(clamp(3.6rem,16vw,4.6rem)*var(--k)*var(--t-display-scale))] md:text-[calc(clamp(5rem,8.5vw,8.5rem)*var(--k)*var(--t-display-scale))]";
  return (
    <Block id="hero">
      <section id="welcome" className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-neutral-950 text-white">
        <HeroPhoto overlay={false} />
        <div className="absolute inset-0 z-[5] bg-black/10" />
        <div className="absolute inset-x-0 top-0 z-[5] h-28 bg-linear-to-b from-black/60 via-black/20 to-transparent" />
        <div className={`absolute inset-x-0 bottom-0 z-[5] bg-linear-to-t from-black/80 via-black/30 to-transparent ${bottom ? "h-[55%] md:h-32" : "h-32"}`} />
        <div className={`pointer-events-none absolute left-1/2 z-10 w-[92%] max-w-[400px] -translate-x-1/2 md:left-[10%] md:top-[26%] md:w-auto md:max-w-none md:translate-x-0 ${bottom ? "bottom-[100px] md:bottom-auto" : "top-[16%] sm:top-[18%]"}`}>
          <h1 aria-label={`${first} & ${second}`} style={{ ["--k" as string]: k }} className="t-display flex select-none flex-col items-center text-center drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] md:items-start md:text-left">
            <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden="true">
              <defs>
                <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="color-mix(in srgb, var(--t-accent) 55%, #fff)" />
                  <stop offset="45%" stopColor="var(--t-accent)" />
                  <stop offset="100%" stopColor="var(--t-muted)" />
                </linearGradient>
              </defs>
            </svg>
            <span className={`inline-flex items-baseline font-medium leading-[0.95] tracking-[0.03em] ${size}`}>
              <span className="bg-linear-to-b from-white via-[#FAF5EE] to-[color-mix(in_srgb,var(--t-accent)_35%,#fff)] bg-clip-text pb-[0.06em] text-transparent">{first}</span>
              <span className="ml-[0.14em] bg-linear-to-br from-[color-mix(in_srgb,var(--t-accent)_55%,#fff)] via-t-accent to-t-muted bg-clip-text text-[1em] font-normal normal-case italic text-transparent">&amp;</span>
            </span>
            <span className={`inline-flex font-medium leading-[0.95] tracking-[0.03em] ${size}`}>
              <span className="bg-linear-to-b from-white via-[#FAF5EE] to-[color-mix(in_srgb,var(--t-accent)_35%,#fff)] bg-clip-text pb-[0.06em] text-transparent">{second}</span>
            </span>
            <span className="mt-3 flex w-full max-w-[230px] items-center justify-center md:max-w-[320px]">
              <span className="h-px flex-1 bg-linear-to-r from-transparent via-t-accent to-t-muted" />
              <Rosette />
              <span className="h-px flex-1 bg-linear-to-r from-t-muted via-t-accent to-transparent" />
            </span>
          </h1>
        </div>
        {hasCutout && (
          <div className="pointer-events-none absolute inset-0 z-20 md:hidden">
            <Img src={h.imageCutout} alt="" fill priority quality={90} sizes="100vw" className="object-cover object-center" />
          </div>
        )}
        <HeroChrome />
      </section>
    </Block>
  );
};

const HEART_SIZE = { s: 0.68, m: 1, l: 1.28 } as const;

/** "Nama Raksasa" (from Putih Marun): names fill the screen, optional heart outline. */
const Raksasa: Hero = () => {
  const { content: c } = useTheme();
  const h = c.hero;
  const { first, second, k } = useNameFit(5.6);
  const bottom = h.namePosition === "bottom";
  const heart = HEART_SIZE[h.heartSize] ?? 1;
  return (
    <Block id="hero">
      <section id="welcome" className="relative isolate h-[100svh] min-h-[680px] overflow-hidden bg-neutral-950 text-white">
        <HeroPhoto />
        <div className="absolute inset-x-0 top-0 z-10 h-[28%] bg-linear-to-b from-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-[32%] bg-linear-to-t from-black/45 to-transparent" />
        <h1
          aria-label={`${first} ${second}`}
          style={{ ["--k" as string]: k }}
          className={`t-display absolute inset-x-0 z-20 flex flex-col items-center px-8 text-[calc(clamp(6.5rem,26vw,12rem)*var(--k)*var(--t-display-scale)*0.8)] leading-[0.88] md:top-[37%] md:flex-row md:justify-between md:pl-[12vw] md:pr-[14vw] md:text-[calc(clamp(9rem,15vw,15rem)*var(--k)*var(--t-display-scale)*0.8)] md:leading-[0.8] ${bottom ? "bottom-[15svh] md:bottom-auto" : "top-[13.5%]"}`}
        >
          <span className="-translate-x-[calc(8vw*var(--k))] md:translate-x-0">{first}</span>
          <span className="translate-x-[calc(10vw*var(--k))] md:translate-x-0">{second}</span>
        </h1>
        {h.showHeart && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/themes/afdal/love.svg"
            alt=""
            aria-hidden="true"
            style={{ ["--h" as string]: heart }}
            className={`pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 md:bottom-auto md:top-[29%] md:w-[calc(15vw*var(--h))] md:min-w-[calc(150px*var(--h))] md:max-w-[calc(245px*var(--h))] ${
              bottom ? "bottom-[calc(15svh+clamp(6.5rem,26vw,12rem)*0.8*1.8)] w-[calc(40vw*var(--h))] max-w-[300px]" : "top-[38%] w-[calc(62vw*var(--h))] max-w-[520px]"
            }`}
          />
        )}
        {h.imageCutout && (
          // The cut-out is made from the phone photo; on laptops it only fits when both photos are the same.
          <div className={`pointer-events-none absolute inset-0 z-40 ${bottom ? "hidden" : ""} ${h.imageDesktop === h.imageMobile ? "md:block" : "md:hidden"}`}>
            <Img src={h.imageCutout} alt="" fill priority quality={90} sizes="(max-width: 767px) 180vh, 100vw" className="object-cover object-center" />
          </div>
        )}
        <HeroChrome />
      </section>
    </Block>
  );
};

/** "Klasik Tengah": names and date centred on the photo. Safe for long names. */
const Tengah: Hero = () => {
  const { content: c } = useTheme();
  const { first, second, k } = useNameFit(9);
  const date = useDate();
  return (
    <Block id="hero">
      <section id="welcome" className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-neutral-950 text-white">
        <HeroPhoto overlay={false} />
        <div className="absolute inset-0 z-[5] bg-black/40" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pb-16 text-center">
          <p className="text-[12px] uppercase tracking-[0.32em] text-white/80 md:text-[13px]">The Wedding of</p>
          <h1 style={{ ["--k" as string]: k }} className="t-display mt-5 flex flex-col items-center text-[calc(clamp(3.2rem,13vw,4.4rem)*var(--k)*var(--t-display-scale))] leading-[1] md:mt-7 md:flex-row md:gap-[0.3em] md:text-[calc(clamp(4.5rem,7vw,7rem)*var(--k)*var(--t-display-scale))]">
            <span>{first}</span>
            <span className="my-1 text-[0.55em] italic normal-case opacity-80 md:my-0 md:text-[0.7em]">&amp;</span>
            <span>{second}</span>
          </h1>
          <div className="mt-7 flex items-center gap-3 text-white/70" aria-hidden>
            <span className="h-px w-12 bg-current" />
            <span className="h-1.5 w-1.5 rotate-45 bg-current" />
            <span className="h-px w-12 bg-current" />
          </div>
          <p className="mt-6 text-[15px] tracking-wide text-white/90 md:text-[18px]">
            <T v={date} ph="Tanggal acara" />
          </p>
          {c.venue.name && <p className="mt-1.5 text-[13px] text-white/70 md:text-[15px]">{c.venue.name}</p>}
        </div>
        <HeroChrome />
      </section>
    </Block>
  );
};

/** "Bingkai Lengkung": arch-framed portrait on the theme background. */
const Lengkung: Hero = () => {
  const { content: c } = useTheme();
  const h = c.hero;
  const { first, second, k } = useNameFit(8);
  const date = useDate();
  const photo = h.imageMobile || h.imageDesktop;
  return (
    <Block id="hero">
      <section id="welcome" className="relative isolate min-h-[100svh] overflow-hidden bg-t-bg px-6 pb-28 pt-24 text-t-fg md:flex md:items-center md:px-12 md:pb-28 md:pt-28">
        <div className="mx-auto grid w-full max-w-[1100px] items-center gap-10 md:grid-cols-[1fr_minmax(0,420px)] md:gap-16">
          <div className="order-2 text-center md:order-1 md:text-left">
            <p className="text-[12px] uppercase tracking-[0.3em] text-t-muted md:text-[13px]">The Wedding of</p>
            <h1 style={{ ["--k" as string]: k }} className="t-display mt-4 flex flex-col text-[calc(clamp(3rem,13vw,4rem)*var(--k)*var(--t-display-scale))] leading-[1] text-t-accent md:mt-6 md:text-[calc(clamp(4.2rem,6.5vw,6.5rem)*var(--k)*var(--t-display-scale))]">
              <span>{first}</span>
              <span className="text-[0.55em] italic normal-case text-t-muted">&amp;</span>
              <span>{second}</span>
            </h1>
            <div className="mx-auto mt-7 h-px w-12 bg-t-muted/60 md:mx-0" />
            <p className="mt-6 text-[15px] text-t-fg2 md:text-[17px]">
              <T v={date} ph="Tanggal acara" />
            </p>
          </div>
          <div className="relative order-1 mx-auto aspect-[3/4.2] w-[min(78vw,360px)] overflow-hidden rounded-t-full border border-t-line bg-t-input shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)] md:order-2 md:w-full">
            {photo ? <Img src={photo} alt={`${h.firstName} dan ${h.secondName}`} fill priority sizes="(min-width: 768px) 420px, 78vw" className="object-cover" /> : <EmptyPhoto label="Foto utama belum diisi" />}
          </div>
        </div>
        <HeroChrome tone="theme" />
      </section>
    </Block>
  );
};

/** "Editorial": names bottom-left like a magazine cover, date on the right. */
const Editorial: Hero = () => {
  const { content: c } = useTheme();
  const { first, second, k } = useNameFit(8);
  const date = useDate();
  return (
    <Block id="hero">
      <section id="welcome" className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-neutral-950 text-white">
        <HeroPhoto overlay={false} />
        <div className="absolute inset-0 z-[5] bg-linear-to-t from-black/85 via-black/15 to-black/30" />
        <div className="absolute inset-x-0 bottom-[96px] z-10 mx-auto flex max-w-[1200px] flex-col gap-6 px-6 sm:px-10 md:bottom-[120px] md:flex-row md:items-end md:justify-between md:px-12">
          <div>
            <p className="text-[12px] uppercase tracking-[0.3em] text-white/75">The Wedding of</p>
            <h1 style={{ ["--k" as string]: k }} className="t-display mt-3 text-[calc(clamp(3.4rem,15vw,4.6rem)*var(--k)*var(--t-display-scale))] leading-[0.95] md:text-[calc(clamp(5rem,8vw,8rem)*var(--k)*var(--t-display-scale))]">
              {first}
              <br />
              <span className="text-[0.6em] italic normal-case opacity-80">&amp;</span> {second}
            </h1>
          </div>
          <div className="border-l border-white/40 pl-4 md:max-w-[280px] md:text-right md:border-l-0 md:border-r md:pl-0 md:pr-5">
            <p className="text-[15px] md:text-[17px]">
              <T v={date} ph="Tanggal acara" />
            </p>
            {c.venue.name && <p className="mt-1 text-[13px] text-white/70 md:text-[14px]">{c.venue.name}</p>}
          </div>
        </div>
        <HeroChrome />
      </section>
    </Block>
  );
};

export const HERO_LAYOUTS: Record<string, Hero> = { sinematik: Sinematik, raksasa: Raksasa, tengah: Tengah, lengkung: Lengkung, editorial: Editorial };
