"use client";

import { initials } from "@/lib/content";
import { CoupleLogo, EnvelopeIcon, Img, useTheme, type CoverFace } from "../shared";

/* Opening cover ("Buka Undangan"). Each face fills the screen. */

function OpenButton({ onOpen, tone }: { onOpen?: () => void; tone: "photo" | "theme" }) {
  const { content: c } = useTheme();
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`inline-flex items-center gap-2.5 rounded-[12px] px-6 py-3 text-[16px] leading-none transition ${
        tone === "photo" ? "border border-white/75 text-white hover:bg-white hover:text-neutral-950" : "bg-t-accent text-t-on-accent hover:brightness-95"
      }`}
    >
      <EnvelopeIcon className="h-[1em] w-[1em]" />
      {c.cover.buttonLabel || "Buka Undangan"}
    </button>
  );
}

function MadeWith({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[13px] leading-[24px] opacity-80 md:text-[14px] ${className}`}>
      Made With <span className="px-1">♥</span> Rayakan.my.id
    </p>
  );
}

function BlurPhoto() {
  const { content: c } = useTheme();
  return (
    <>
      <div className="absolute inset-0 -z-10 hidden md:block">{c.hero.imageDesktop && <Img src={c.hero.imageDesktop} alt="" fill sizes="100vw" className="object-cover" />}</div>
      <div className="absolute inset-0 -z-10 md:hidden">{c.hero.imageMobile && <Img src={c.hero.imageMobile} alt="" fill sizes="100vw" className="object-cover" />}</div>
    </>
  );
}

const Kaca: CoverFace = ({ guestName, onOpen }) => {
  const { content: c } = useTheme();
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center gap-8 overflow-hidden bg-neutral-900 px-6 py-16 text-white">
      <BlurPhoto />
      <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-[30px]" />
      <CoupleLogo tone="light" className="h-auto w-[100px] md:w-[120px]" />
      <div className="flex min-h-[264px] w-full max-w-[392px] flex-col items-center justify-center gap-5 rounded-[16px] border border-white/50 px-6 py-8 text-center">
        <p className="text-[15px] leading-[26px] text-white/80">{c.cover.greeting}</p>
        <h1 className="t-head px-2 text-[clamp(30px,8vw,44px)] italic leading-[1.05]">{guestName}</h1>
        <OpenButton onOpen={onOpen} tone="photo" />
      </div>
      <MadeWith />
    </section>
  );
};

const Amplop: CoverFace = ({ guestName, onOpen }) => {
  const { content: c } = useTheme();
  const [a = "", b = ""] = initials(c.hero.firstName, c.hero.secondName);
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center bg-t-bg px-5 py-14 text-t-fg">
      <div className="relative w-full max-w-[440px]">
        <div className="relative overflow-hidden rounded-[18px] border border-t-line bg-t-card shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]">
          <div className="relative h-[150px] bg-t-alt">
            <svg viewBox="0 0 440 150" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-t-accent" aria-hidden>
              <path d="M0 0 L220 132 L440 0" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" />
            </svg>
            <div className="absolute left-1/2 top-[132px] flex h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-t-accent text-t-on-accent shadow-lg ring-4 ring-t-card">
              <span className="t-display text-[28px] leading-none">
                {a}
                <span className="mx-0.5 text-[16px] italic opacity-80">&amp;</span>
                {b}
              </span>
            </div>
          </div>
          <div className="px-7 pb-9 pt-14 text-center">
            <p className="text-[12px] uppercase tracking-[0.24em] text-t-muted">The Wedding of</p>
            <p className="t-display mt-3 text-[calc(34px*var(--t-display-scale))] leading-none text-t-accent">
              {c.hero.firstName || "Nama"} &amp; {c.hero.secondName || "Nama"}
            </p>
            <div className="mx-auto my-6 h-px w-12 bg-t-muted/50" />
            <p className="text-[14px] text-t-fg2">{c.cover.greeting}</p>
            <h1 className="t-head mt-2 text-[clamp(26px,7vw,36px)] italic leading-tight text-t-fg">{guestName}</h1>
            <div className="mt-7">
              <OpenButton onOpen={onOpen} tone="theme" />
            </div>
          </div>
        </div>
      </div>
      <MadeWith className="mt-8 text-t-fg2" />
    </section>
  );
};

const Lengkung: CoverFace = ({ guestName, onOpen }) => {
  const { content: c } = useTheme();
  const photo = c.hero.imageMobile || c.hero.imageDesktop;
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center gap-7 bg-t-bg px-6 py-12 text-center text-t-fg">
      <div className="relative h-[min(40svh,340px)] w-[min(62vw,260px)] overflow-hidden rounded-t-full border border-t-line bg-t-input">
        {photo && <Img src={photo} alt="" fill sizes="300px" className="object-cover" />}
      </div>
      <div>
        <p className="text-[12px] uppercase tracking-[0.24em] text-t-muted">The Wedding of</p>
        <p className="t-display mt-3 text-[calc(40px*var(--t-display-scale))] leading-none text-t-accent">
          {c.hero.firstName || "Nama"} &amp; {c.hero.secondName || "Nama"}
        </p>
      </div>
      <div>
        <p className="text-[14px] text-t-fg2">{c.cover.greeting}</p>
        <h1 className="t-head mt-1.5 text-[clamp(24px,6.5vw,34px)] italic leading-tight">{guestName}</h1>
      </div>
      <OpenButton onOpen={onOpen} tone="theme" />
      <MadeWith className="text-t-fg2" />
    </section>
  );
};

const Sinema: CoverFace = ({ guestName, onOpen }) => {
  const { content: c } = useTheme();
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-neutral-900 px-6 pb-10 pt-16 text-white md:px-16 md:pb-14">
      <BlurPhoto />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/45 via-black/10 to-black/85" />
      <div className="text-center md:text-left">
        <p className="text-[12px] uppercase tracking-[0.3em] text-white/75">The Wedding of</p>
        <p className="t-display mt-3 text-[calc(clamp(44px,12vw,92px)*var(--t-display-scale))] leading-[0.95]">
          {c.hero.firstName || "Nama"} <span className="opacity-70">&amp;</span> {c.hero.secondName || "Nama"}
        </p>
      </div>
      <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <p className="text-[14px] text-white/75">{c.cover.greeting}</p>
          <h1 className="t-head mt-1.5 text-[clamp(28px,7vw,44px)] italic leading-tight">{guestName}</h1>
        </div>
        <div className="flex flex-col items-center gap-3 md:items-end">
          <OpenButton onOpen={onOpen} tone="photo" />
          <MadeWith />
        </div>
      </div>
    </section>
  );
};

export const COVER_LAYOUTS: Record<string, CoverFace> = { kaca: Kaca, amplop: Amplop, lengkung: Lengkung, sinema: Sinema };
