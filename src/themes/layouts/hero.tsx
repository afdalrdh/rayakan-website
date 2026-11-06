"use client";

import { motion } from "motion/react";
import { formatEventDate, peopleOf } from "@/lib/content";
import { Block, DecorFrame, DecorScene, EmptyPhoto, HeroChrome, HeroPhoto, Img, Rule, T, useDecor, useEyebrow, useNameFit, useSrc, useTheme } from "../shared";

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
  const { first, second, single, k } = useNameFit(7.2);
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
          <h1 aria-label={single ? first : `${first} & ${second}`} style={{ ["--k" as string]: k }} className="t-display flex select-none flex-col items-center text-center drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] md:items-start md:text-left">
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
              {!single && <span className="ml-[0.14em] bg-linear-to-br from-[color-mix(in_srgb,var(--t-accent)_55%,#fff)] via-t-accent to-t-muted bg-clip-text text-[1em] font-normal normal-case italic text-transparent">&amp;</span>}
            </span>
            {!single && (
              <span className={`inline-flex font-medium leading-[0.95] tracking-[0.03em] ${size}`}>
                <span className="bg-linear-to-b from-white via-[#FAF5EE] to-[color-mix(in_srgb,var(--t-accent)_35%,#fff)] bg-clip-text pb-[0.06em] text-transparent">{second}</span>
              </span>
            )}
            <span className="mt-3 flex w-full max-w-[230px] items-center justify-center md:max-w-[320px]">
              <span className="h-px flex-1 bg-linear-to-r from-transparent via-t-accent to-t-muted" />
              <Rosette />
              <span className="h-px flex-1 bg-linear-to-r from-t-muted via-t-accent to-transparent" />
            </span>
          </h1>
        </div>
        {hasCutout && (
          <div className="pointer-events-none absolute inset-0 z-20 md:hidden">
            <Img src={h.imageCutout} alt="" fill priority quality={85} sizes="100vw" className="object-cover object-center" />
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
  const { first, second, single, k } = useNameFit(5.6);
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
          {single ? (
            <span className="md:mx-auto">{first}</span>
          ) : (
            <>
              <span className="-translate-x-[calc(8vw*var(--k))] md:translate-x-0">{first}</span>
              <span className="translate-x-[calc(10vw*var(--k))] md:translate-x-0">{second}</span>
            </>
          )}
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
            <Img src={h.imageCutout} alt="" fill priority quality={85} sizes="(max-width: 767px) 130vw, 100vw" className="object-cover object-center" />
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
  const { first, second, single, k } = useNameFit(9);
  const date = useDate();
  const eyebrow = useEyebrow();
  return (
    <Block id="hero">
      <section id="welcome" className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-neutral-950 text-white">
        <HeroPhoto overlay={false} />
        <div className="absolute inset-0 z-[5] bg-black/40" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pb-16 text-center">
          <p className="text-[12px] uppercase tracking-[0.32em] text-white/80 md:text-[13px]">{eyebrow}</p>
          <h1 style={{ ["--k" as string]: k }} className="t-display mt-5 flex flex-col items-center text-[calc(clamp(3.2rem,13vw,4.4rem)*var(--k)*var(--t-display-scale))] leading-[1] md:mt-7 md:flex-row md:gap-[0.3em] md:text-[calc(clamp(4.5rem,7vw,7rem)*var(--k)*var(--t-display-scale))]">
            <span>{first}</span>
            {!single && (
              <>
                <span className="my-1 text-[0.55em] italic normal-case opacity-80 md:my-0 md:text-[0.7em]">&amp;</span>
                <span>{second}</span>
              </>
            )}
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
  const { first, second, single, k } = useNameFit(8);
  const date = useDate();
  const eyebrow = useEyebrow();
  const photo = h.imageMobile || h.imageDesktop;
  return (
    <Block id="hero">
      <section id="welcome" className="relative isolate min-h-[100svh] overflow-hidden bg-t-bg px-6 pb-28 pt-24 text-t-fg md:flex md:items-center md:px-12 md:pb-28 md:pt-28">
        <div className="mx-auto grid w-full max-w-[1100px] items-center gap-10 md:grid-cols-[1fr_minmax(0,420px)] md:gap-16">
          <div className="order-2 text-center md:order-1 md:text-left">
            <p className="text-[12px] uppercase tracking-[0.3em] text-t-muted md:text-[13px]">{eyebrow}</p>
            <h1 style={{ ["--k" as string]: k }} className="t-display mt-4 flex flex-col text-[calc(clamp(3rem,13vw,4rem)*var(--k)*var(--t-display-scale))] leading-[1] text-t-accent md:mt-6 md:text-[calc(clamp(4.2rem,6.5vw,6.5rem)*var(--k)*var(--t-display-scale))]">
              <span>{first}</span>
              {!single && (
                <>
                  <span className="text-[0.55em] italic normal-case text-t-muted">&amp;</span>
                  <span>{second}</span>
                </>
              )}
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
  const { first, second, single, k } = useNameFit(8);
  const date = useDate();
  const eyebrow = useEyebrow();
  return (
    <Block id="hero">
      <section id="welcome" className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-neutral-950 text-white">
        <HeroPhoto overlay={false} />
        <div className="absolute inset-0 z-[5] bg-linear-to-t from-black/85 via-black/15 to-black/30" />
        <div className="absolute inset-x-0 bottom-[96px] z-10 mx-auto flex max-w-[1200px] flex-col gap-6 px-6 sm:px-10 md:bottom-[120px] md:flex-row md:items-end md:justify-between md:px-12">
          <div>
            <p className="text-[12px] uppercase tracking-[0.3em] text-white/75">{eyebrow}</p>
            <h1 style={{ ["--k" as string]: k }} className="t-display mt-3 text-[calc(clamp(3.4rem,15vw,4.6rem)*var(--k)*var(--t-display-scale))] leading-[0.95] md:text-[calc(clamp(5rem,8vw,8rem)*var(--k)*var(--t-display-scale))]">
              {first}
              {!single && (
                <>
                  <br />
                  <span className="text-[0.6em] italic normal-case opacity-80">&amp;</span> {second}
                </>
              )}
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

const EASE = [0.22, 1, 0.36, 1] as const;

/** Names in the theme's display font, "&" in the muted colour. Centred on phones; `align` sets laptops. */
function Names({ className = "", align = "start" }: { className?: string; align?: "start" | "center" }) {
  const { first, second, single, k } = useNameFit(8);
  return (
    <h1 style={{ ["--k" as string]: k }} className={`t-display flex flex-wrap items-baseline justify-center gap-x-[0.2em] text-[calc(clamp(3rem,12.5vw,4.2rem)*var(--k)*var(--t-display-scale))] leading-[1.02] text-t-accent ${align === "start" ? "md:justify-start" : ""} md:text-[calc(clamp(4rem,6vw,6rem)*var(--k)*var(--t-display-scale))] ${className}`}>
      <span>{first}</span>
      {!single && (
        <span className="whitespace-nowrap">
          <span className="mr-[0.18em] text-[0.6em] italic normal-case text-t-muted">&amp;</span>
          {second}
        </span>
      )}
    </h1>
  );
}

/** "Ilustrasi": an animated illustrated scene that needs no photo (faceless figures, adat ornaments…). */
const Ilustrasi: Hero = () => {
  const { content: c, mode } = useTheme();
  const decor = useDecor();
  const eyebrow = useEyebrow();
  const date = useDate();
  const photo = useSrc(c.hero.imageMobile || c.hero.imageDesktop);
  const still = mode === "thumb";
  return (
    <Block id="hero">
      <section id="welcome" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-t-bg px-5 pb-28 pt-24 text-t-fg md:px-12 md:pt-28">
        <DecorFrame decor={decor} inset="hero" />
        <div className="mx-auto grid w-full max-w-[1100px] items-center gap-6 md:grid-cols-[1fr_minmax(0,480px)] md:gap-14">
          <motion.div
            initial={still ? false : { opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
            className="mx-auto w-[min(88vw,420px)] md:order-2 md:w-full"
          >
            <DecorScene decor={decor} occasion={c.occasion} photo={photo || undefined} />
          </motion.div>
          <motion.div initial={still ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.25, ease: EASE }} className="text-center md:order-1 md:text-left">
            <p className="text-[12px] uppercase tracking-[0.3em] text-t-muted md:text-[13px]">{eyebrow}</p>
            <Names className="mt-4 md:mt-6" />
            <div className="mx-auto mt-6 h-px w-12 bg-t-muted/60 md:mx-0" />
            <p className="mt-5 text-[15px] text-t-fg2 md:text-[17px]">
              <T v={date} ph="Tanggal acara" />
            </p>
            {c.venue.name && <p className="mt-1 text-[13px] text-t-fg2/80 md:text-[15px]">{c.venue.name}</p>}
          </motion.div>
        </div>
        <HeroChrome tone="theme" />
      </section>
    </Block>
  );
};

/**
 * "Lukisan": a painting or illustration (watercolour, AI illustration…) fills
 * the phone screen and fades into the page colour, names below it. On laptops
 * the painting takes the left half and the names sit on the right.
 */
const Lukisan: Hero = () => {
  const { content: c, mode } = useTheme();
  const decor = useDecor();
  const eyebrow = useEyebrow();
  const date = useDate();
  const h = c.hero;
  const src = h.imageMobile || h.imageDesktop;
  const still = mode === "thumb";
  return (
    <Block id="hero">
      <section id="welcome" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-t-bg text-t-fg md:grid md:h-[100svh] md:min-h-[640px] md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="relative h-[75svh] min-h-[440px] w-full shrink-0 md:h-full md:min-h-0">
          {src ? (
            <motion.div initial={still ? false : { opacity: 0, scale: 1.06 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: EASE }} className="absolute inset-0">
              <Img src={src} alt={`Ilustrasi ${namesLabel(h.firstName, h.secondName)}`} fill priority quality={80} sizes="(min-width: 768px) 55vw, 100vw" className="object-cover object-top md:object-[50%_22%]" />
            </motion.div>
          ) : mode === "live" ? (
            // No painting yet: the decor set's faceless illustration keeps the page complete.
            <div className="absolute inset-0 flex items-center justify-center px-8 pt-16">
              <div className="w-[min(78vw,380px)]">
                <DecorScene decor={decor} occasion={c.occasion} />
              </div>
            </div>
          ) : (
            <EmptyPhoto label="Gambar lukisan belum diisi" />
          )}
          {/* fade into the page colour: at the bottom on phones, at the right edge on laptops */}
          <div className="absolute inset-x-0 bottom-0 h-[42%] bg-linear-to-t from-t-bg via-t-bg/75 to-transparent md:hidden" />
          <div className="absolute inset-y-0 right-0 hidden w-[48%] bg-linear-to-l from-t-bg from-[8%] via-t-bg/65 to-transparent md:block" />
        </div>
        <div className="absolute inset-x-0 top-0 z-[5] h-28 bg-linear-to-b from-t-bg/70 to-transparent" />
        <motion.div
          initial={still ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.35, ease: EASE }}
          className="relative z-10 -mt-[16svh] px-6 pb-28 text-center md:mt-0 md:flex md:flex-col md:items-center md:justify-center md:px-12 md:pb-16"
        >
          <p className="text-[12px] uppercase tracking-[0.3em] text-t-muted md:text-[13px]">{eyebrow}</p>
          <Names align="center" className="mt-3 md:mt-5" />
          <Rule className="mt-5 md:mt-7" />
          <p className="mt-4 text-[15px] text-t-fg2 md:text-[17px]">
            <T v={date} ph="Tanggal acara" />
          </p>
          {c.venue.name && <p className="mt-1 text-[13px] text-t-fg2/80 md:text-[15px]">{c.venue.name}</p>}
        </motion.div>
        <HeroChrome tone="theme" />
      </section>
    </Block>
  );
};

const namesLabel = (a: string, b: string) => (b ? `${a} dan ${b}` : a);

/** One tilted polaroid with tape and a handwritten caption. */
function PolaroidCard({ src, caption, rot, className = "", delay = 0 }: { src: string; caption: string; rot: number; className?: string; delay?: number }) {
  const { mode } = useTheme();
  const still = mode === "thumb";
  return (
    <motion.figure
      initial={still ? false : { opacity: 0, y: -40, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: rot }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: EASE }}
      style={still ? { rotate: rot } : undefined}
      className={`absolute bg-white p-[3.5%] pb-[13%] shadow-[0_24px_40px_-18px_rgba(0,0,0,0.45)] ${className}`}
    >
      <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] bg-[color-mix(in_srgb,var(--t-accent)_22%,#fff)] opacity-90 shadow-sm" />
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-t-input">{src ? <Img src={src} alt={caption} fill sizes="(min-width: 768px) 260px, 46vw" className="object-cover" /> : <EmptyPhoto label="Foto masa kecil" />}</div>
      <figcaption className="t-display absolute inset-x-0 bottom-[3%] text-center text-[calc(clamp(18px,5vw,26px)*var(--t-display-scale))] leading-none text-neutral-800">{caption}</figcaption>
    </motion.figure>
  );
}

/** "Polaroid": two childhood photos (or AI kid versions) with doodles. Uses the profile photos. */
const Polaroid: Hero = () => {
  const { content: c } = useTheme();
  const decor = useDecor();
  const eyebrow = useEyebrow();
  const date = useDate();
  const people = peopleOf(c);
  const { first, second } = useNameFit(8);
  return (
    <Block id="hero">
      <section id="welcome" className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-t-bg px-5 pb-28 pt-24 text-center text-t-fg">
        <DecorFrame decor={decor} inset="hero" />
        {/* fixed proportions, so the polaroids and the doodle line up the same on every screen */}
        <div className="relative aspect-[100/103] w-full max-w-[440px]">
          {people.length > 1 ? (
            <>
              <PolaroidCard src={people[0].photo} caption={first} rot={-7} className="left-[2%] top-[4%] w-[52%]" />
              <PolaroidCard src={people[1].photo} caption={second} rot={6} className="right-[2%] top-[16%] w-[52%]" delay={0.2} />
              <svg viewBox="0 0 120 60" aria-hidden className="absolute bottom-0 left-[11%] w-[32%] text-t-accent">
                <path d="M8 40 C 30 10, 60 60, 90 26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="1 7" />
                <path d="M84 18 L92 26 L82 30" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M104 18 C 98 10, 92 18, 104 28 C 116 18, 110 10, 104 18 Z" fill="currentColor" />
              </svg>
            </>
          ) : (
            <PolaroidCard src={people[0].photo} caption={first} rot={-4} className="left-1/2 top-[4%] w-[66%] -translate-x-1/2" />
          )}
        </div>
        <p className="mt-6 text-[12px] uppercase tracking-[0.3em] text-t-muted md:text-[13px]">{eyebrow}</p>
        <Names className="mt-3" />
        <p className="mt-4 text-[15px] text-t-fg2 md:text-[17px]">
          <T v={date} ph="Tanggal acara" />
        </p>
        <HeroChrome tone="theme" />
      </section>
    </Block>
  );
};

export const HERO_LAYOUTS: Record<string, Hero> = { sinematik: Sinematik, raksasa: Raksasa, tengah: Tengah, lengkung: Lengkung, editorial: Editorial, lukisan: Lukisan, ilustrasi: Ilustrasi, polaroid: Polaroid };
