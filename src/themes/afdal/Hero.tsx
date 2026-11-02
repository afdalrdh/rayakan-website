"use client";

import { useState } from "react";
import { ArrowDownIcon, Block, CloseIcon, CoupleLogo, EmptyPhoto, Img, MenuIcon, useNavLinks, useTheme } from "../shared";

/**
 * A full-height `object-cover` photo on a portrait phone is far wider than the
 * screen (a 16:9 photo at 844px tall is ~1500px wide). Telling the browser
 * "100vw" made it download a ~1000px file and stretch the cropped middle, which
 * looked blurry. Size by viewport height on phones instead.
 */
const COVER_SIZES = "(max-width: 767px) 180vh, 100vw";

/**
 * Full-screen photo with huge condensed names, a heart outline and an optional
 * cut-out of the couple layered on top for depth.
 */
export function Hero() {
  const { content: c, mode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const h = c.hero;
  const nav = useNavLinks();
  const first = h.firstName.trim().toUpperCase() || "NAMA";
  const second = h.secondName.trim().toUpperCase() || "NAMA";
  // Designed for ~5 letters per name; shrink longer names so they stay on screen.
  const k = Math.min(1, 5.6 / Math.max(first.length, second.length));
  const bottom = h.namePosition === "bottom";

  return (
    <Block id="hero">
      <section id="welcome" className="relative isolate h-[100svh] min-h-[700px] overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 z-0 hidden md:block">
          {h.imageDesktop ? <Img src={h.imageDesktop} alt={`${h.firstName} dan ${h.secondName}`} fill priority quality={90} sizes="100vw" className="object-cover object-center" /> : <EmptyPhoto label="Tambah foto layar lebar" />}
        </div>
        <div className="absolute inset-0 z-0 md:hidden">
          {h.imageMobile ? <Img src={h.imageMobile} alt={`${h.firstName} dan ${h.secondName}`} fill priority quality={90} sizes={COVER_SIZES} className="object-cover object-center" /> : <EmptyPhoto label="Tambah foto layar HP" />}
        </div>
        <div className="absolute inset-0 z-10 bg-black/20" />
        <div className="absolute inset-x-0 top-0 z-10 h-[28%] bg-linear-to-b from-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-[32%] bg-linear-to-t from-black/45 to-transparent" />

        {mode === "live" && (
          <div className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-10 bg-neutral-950/95 px-8 transition-all duration-300 md:hidden ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!menuOpen}>
            <button type="button" aria-label="Tutup navigasi" onClick={() => setMenuOpen(false)} className="absolute right-6 top-7 flex h-10 w-10 items-center justify-center text-white">
              <CloseIcon size={26} />
            </button>
            <nav className="flex flex-col items-center gap-7 font-sans">
              {nav.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="text-[22px] leading-none text-white transition-opacity hover:opacity-75">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        )}

        <header className="absolute inset-x-0 top-0 z-50 px-6 pt-7 sm:px-10 md:px-12 md:pt-10">
          <nav className="mx-auto flex max-w-[1190px] items-center justify-between font-sans">
            <a href="#welcome" aria-label="Beranda" className="block">
              <CoupleLogo className="h-auto w-[clamp(64px,16vw,110px)] brightness-0 invert md:w-[96px]" />
            </a>
            <div className="hidden items-center gap-8 md:flex lg:gap-9">
              {nav.map((l) => (
                <a key={l.href} href={l.href} className="text-[18px] leading-none text-white transition-opacity hover:opacity-75 lg:text-[19px]">
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-[clamp(20px,5vw,34px)] md:gap-0">
              {!c.hidden.includes("rsvp") && (
                <a href="#rsvp" className="rounded-[14px] border border-white/75 px-[clamp(18px,4vw,29px)] py-[clamp(10px,2vw,15px)] text-[clamp(15px,2.8vw,21px)] leading-none text-white transition-colors hover:bg-white hover:text-neutral-950 md:rounded-[9px] md:px-6 md:py-3 md:text-[17px]">
                  Kehadiran
                </a>
              )}
              <button type="button" aria-label="Buka navigasi" onClick={() => setMenuOpen(true)} className="flex h-10 w-10 items-center justify-center text-white md:hidden">
                <MenuIcon />
              </button>
            </div>
          </nav>
        </header>

        <h1
          aria-label={`${h.firstName} ${h.secondName}`}
          style={{ ["--k" as string]: k }}
          className={`absolute inset-x-0 z-20 flex flex-col items-center px-8 font-display text-[calc(clamp(7rem,27.5vw,12.5rem)*var(--k))] leading-[0.88] text-white md:top-[37.4%] md:flex-row md:justify-between md:pl-[12.6vw] md:pr-[15.1vw] md:text-[calc(clamp(10rem,15.4vw,15.4rem)*var(--k))] md:leading-[0.78] ${
            bottom ? "bottom-[15svh] md:bottom-auto" : "top-[13.5%]"
          }`}
        >
          <span className="origin-left -translate-x-[8.5vw] scale-x-90 md:translate-x-0 md:scale-x-100">{first}</span>
          <span className="translate-x-[12vw] md:translate-x-0">{second}</span>
        </h1>

        {h.showHeart && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/themes/afdal/love.svg"
            alt=""
            aria-hidden="true"
            style={{ ["--k" as string]: k }}
            className={`pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 md:top-[29%] md:bottom-auto md:w-[15vw] md:min-w-[190px] md:max-w-[245px] ${
              bottom
                ? // Names sit at the bottom on phones: put the heart just above them (two lines of names ≈ 1.76em).
                  "bottom-[calc(15svh+clamp(7rem,27.5vw,12.5rem)*var(--k)*1.76+2svh)] w-[42vw] max-w-[300px]"
                : "top-[38%] w-[70vw] max-w-[520px]"
            }`}
          />
        )}

        {h.imageCutout && (
          <div className={`pointer-events-none absolute inset-0 z-40 ${bottom ? "hidden md:block" : ""}`}>
            <Img src={h.imageCutout} alt="" fill priority quality={90} sizes={COVER_SIZES} className="object-cover object-center" />
          </div>
        )}

        <a href="#invitation" className="absolute inset-x-0 bottom-0 z-50 border-t border-white/45">
          <div className="mx-auto flex h-[9.25svh] min-h-[76px] max-w-[1240px] items-center justify-between px-8 text-white sm:px-12 md:h-24 md:px-8">
            <ArrowDownIcon className="h-6 w-[18px] shrink-0 animate-float-subtle md:h-7 md:w-5" />
            <span className="text-[clamp(0.95rem,3vw,1.3rem)] leading-none md:text-[18px]">{h.scrollLabel}</span>
          </div>
        </a>
      </section>
    </Block>
  );
}
