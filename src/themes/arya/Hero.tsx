"use client";

import { useState } from "react";
import { ArrowDownIcon, Block, CloseIcon, CoupleLogo, EmptyPhoto, Img, MenuIcon, useNavLinks, useTheme } from "../shared";

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
      <polygon points="12,12 8,8 7.2,9.6 9.6,7.2" fill="url(#accentGradient)" />
      <polygon points="12,12 16,8 16.8,9.6 14.4,7.2" fill="url(#accentGradient)" />
      <polygon points="12,12 8,16 7.2,14.4 9.6,16.8" fill="url(#accentGradient)" />
      <polygon points="12,12 16,16 16.8,14.4 14.4,16.8" fill="url(#accentGradient)" />
      <polygon points="12,9.8 14.2,12 12,14.2 9.8,12" fill="#FFF6E0" />
    </svg>
  );
}

/** Full-screen opening: photo, couple names in gradient serif, navigation. */
export function Hero() {
  const { content: c, mode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const h = c.hero;
  const first = h.firstName.trim().toUpperCase() || "NAMA";
  const second = h.secondName.trim().toUpperCase() || "NAMA";
  // Keep long names inside the frame: shrink proportionally past ~7 characters.
  const k = Math.min(1, 7.2 / Math.max(first.length + 1, second.length));
  const navLinks = useNavLinks();
  const bottom = h.namePosition === "bottom";
  const hasCutout = !!h.imageCutout && !bottom;

  return (
    <Block id="hero">
      <section
        id="welcome"
        className="relative isolate h-[100svh] min-h-[600px] overflow-hidden bg-neutral-950 text-white"
      >
        <div className="absolute inset-0 z-0 hidden md:block">
          {h.imageDesktop ? (
            <Img src={h.imageDesktop} alt={`${h.firstName} dan ${h.secondName}`} fill priority quality={90} sizes="100vw" className="object-cover object-center" />
          ) : (
            <EmptyPhoto label="Tambah foto layar lebar" />
          )}
        </div>
        <div className="absolute inset-0 z-0 block md:hidden">
          {h.imageMobile ? (
            <Img src={h.imageMobile} alt={`${h.firstName} dan ${h.secondName}`} fill priority quality={90} sizes="100vw" className="object-cover object-center" />
          ) : (
            <EmptyPhoto label="Tambah foto layar HP" />
          )}
        </div>

        <div className="absolute inset-0 z-[5] bg-black/10" />
        <div className="absolute inset-x-0 top-0 z-[5] h-28 bg-linear-to-b from-black/60 via-black/20 to-transparent" />
        <div className={`absolute inset-x-0 bottom-0 z-[5] bg-linear-to-t from-black/80 via-black/30 to-transparent ${bottom ? "h-[55%] md:h-32" : "h-32"}`} />

        <div
          className={`pointer-events-none absolute left-1/2 z-10 w-[92%] max-w-[380px] -translate-x-1/2 md:left-[10%] md:top-[26%] md:w-auto md:max-w-none md:translate-x-0 ${
            bottom ? "bottom-[96px] sm:bottom-[110px] md:bottom-auto" : "top-[16%] sm:top-[18%]"
          }`}
        >
          <h1
            aria-label={`${h.firstName} & ${h.secondName}`}
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", ["--k" as string]: k }}
            className="flex select-none flex-col items-center text-center drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] md:items-start md:text-left"
          >
            <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden="true">
              <defs>
                <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="color-mix(in srgb, var(--t-accent) 55%, #fff)" />
                  <stop offset="45%" stopColor="var(--t-accent)" />
                  <stop offset="70%" stopColor="var(--t-muted)" />
                  <stop offset="100%" stopColor="var(--t-accent)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="inline-flex items-baseline justify-center text-[calc(clamp(3.8rem,17vw,4.6rem)*var(--k))] font-medium leading-[0.92] tracking-[0.04em] md:text-[calc(clamp(5.2rem,8.5vw,8.5rem)*var(--k))]">
              <span className="bg-linear-to-b from-white via-[#FAF5EE] to-[color-mix(in_srgb,var(--t-accent)_35%,#fff)] bg-clip-text text-transparent">
                {first}
              </span>
              <span className="ml-[0.14em] -translate-y-[0.05em] bg-linear-to-br from-[color-mix(in_srgb,var(--t-accent)_55%,#fff)] via-t-accent to-t-muted bg-clip-text text-[1.05em] font-normal italic text-transparent">
                &amp;
              </span>
            </div>
            <div className="mt-[0.04em] inline-flex items-baseline justify-center text-[calc(clamp(3.8rem,17vw,4.6rem)*var(--k))] font-medium leading-[0.92] tracking-[0.04em] md:text-[calc(clamp(5.2rem,8.5vw,8.5rem)*var(--k))]">
              <span className="bg-linear-to-b from-white via-[#FAF5EE] to-[color-mix(in_srgb,var(--t-accent)_35%,#fff)] bg-clip-text text-transparent">
                {second}
              </span>
            </div>
            <div className="mt-3 flex w-full max-w-[210px] items-center justify-center sm:mt-3.5 sm:max-w-[230px] md:max-w-[320px]">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-t-accent to-t-muted" />
              <Rosette />
              <div className="h-px flex-1 bg-linear-to-r from-t-muted via-t-accent to-transparent" />
            </div>
          </h1>
        </div>

        {hasCutout && (
          <div className="pointer-events-none absolute inset-0 z-20 block md:hidden">
            <Img src={h.imageCutout} alt="" fill priority quality={90} sizes="100vw" className="object-cover object-center" />
          </div>
        )}

        {mode === "live" && (
          <div
            className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-10 bg-neutral-950/95 px-8 transition-all duration-300 md:hidden ${
              menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!menuOpen}
          >
            <button type="button" aria-label="Tutup navigasi" onClick={() => setMenuOpen(false)} className="absolute right-6 top-7 flex h-10 w-10 items-center justify-center text-white">
              <CloseIcon size={26} />
            </button>
            <nav className="flex flex-col items-center gap-7 font-sans">
              {navLinks.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="text-[22px] leading-none text-white transition-opacity hover:opacity-75">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}

        <header className="absolute inset-x-0 top-0 z-40 px-6 pt-5 sm:px-10 md:px-14 md:pt-7">
          <nav className="mx-auto flex max-w-[1240px] items-center justify-between font-sans">
            <a href="#welcome" aria-label="Beranda" className="block">
              <CoupleLogo className="h-auto w-[38px] sm:w-[44px] md:w-[50px]" />
            </a>
            <div className="hidden items-center gap-7 md:flex lg:gap-9">
              {navLinks.map((item) => (
                <a key={item.href} href={item.href} className="text-[16px] leading-none text-white/90 transition-opacity hover:text-white lg:text-[17px]">
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3 md:gap-0">
              {!c.hidden.includes("rsvp") && (
                <a href="#rsvp" className="rounded-[9px] border border-white/75 bg-black/20 px-4 py-2 text-[14px] leading-none text-white transition-colors hover:bg-white hover:text-neutral-950 md:px-6 md:py-2.5 md:text-[16px]">
                  Kehadiran
                </a>
              )}
              <button type="button" aria-label="Buka navigasi" onClick={() => setMenuOpen(true)} className="flex h-9 w-9 items-center justify-center text-white md:hidden">
                <MenuIcon />
              </button>
            </div>
          </nav>
        </header>

        <a href="#invitation" className="absolute inset-x-0 bottom-0 z-40 border-t border-white/20 transition hover:bg-white/5">
          <div className="mx-auto flex h-[64px] w-full max-w-[1240px] items-center justify-between px-6 text-white sm:h-[72px] sm:px-10 md:h-[80px] md:px-14">
            <ArrowDownIcon className="h-5 w-4 shrink-0 animate-bounce text-white" />
            <span className="font-sans text-[13px] leading-none tracking-wide text-white/95 sm:text-[14px] md:text-[16px]">{h.scrollLabel}</span>
          </div>
        </a>
      </section>
    </Block>
  );
}
