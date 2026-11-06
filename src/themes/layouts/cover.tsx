"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { formatEventDate, getOccasion, initials, namesOf } from "@/lib/content";
import { CoupleLogo, DecorCorner, DecorFrame, DecorPattern, EmptyPhoto, EnvelopeIcon, Img, useDecor, useEyebrow, useTheme, type CoverFace } from "../shared";

/* Opening cover ("Buka Undangan"). Each face fills the screen. */

const EASE = [0.22, 1, 0.36, 1] as const;

const BUTTON_TONE = {
  photo: "border border-white/75 text-white hover:bg-white hover:text-neutral-950",
  theme: "bg-t-accent text-t-on-accent shadow-[0_12px_30px_-12px_var(--t-accent)] hover:brightness-95",
  /** On an accent-coloured panel. */
  inverse: "bg-t-on-accent font-semibold text-t-accent shadow-[0_14px_30px_-14px_rgba(0,0,0,0.5)] hover:brightness-95",
};

function OpenButton({ onOpen, tone, pulse = false }: { onOpen?: () => void; tone: keyof typeof BUTTON_TONE; pulse?: boolean }) {
  const { content: c } = useTheme();
  return (
    <button type="button" onClick={() => onOpen?.()} className={`relative inline-flex items-center gap-2.5 rounded-[12px] px-6 py-3 text-[16px] leading-none transition ${BUTTON_TONE[tone]}`}>
      {pulse && <span aria-hidden className={`t-anim absolute inset-0 animate-ping rounded-[12px] [animation-duration:2.4s] ${tone === "inverse" ? "bg-t-on-accent/40" : "bg-t-accent/30"}`} />}
      <EnvelopeIcon className="relative h-[1em] w-[1em]" />
      <span className="relative">{c.cover.buttonLabel || "Buka Undangan"}</span>
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

/** "Arya & Alma" or "Alea": names of the hosts on the cover. */
function useJoined() {
  const { content: c } = useTheme();
  const n = namesOf(c);
  return { ...n, first: n.first || "Nama", joined: n.single ? n.first || "Nama" : `${n.first || "Nama"} & ${n.second || "Nama"}` };
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
  const n = useJoined();
  const eyebrow = useEyebrow();
  const [a = "", b = ""] = initials(n.first, n.second);
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
                {b && (
                  <>
                    <span className="mx-0.5 text-[16px] italic opacity-80">&amp;</span>
                    {b}
                  </>
                )}
              </span>
            </div>
          </div>
          <div className="px-7 pb-9 pt-14 text-center">
            <p className="text-[12px] uppercase tracking-[0.24em] text-t-muted">{eyebrow}</p>
            <p className="t-display mt-3 text-[calc(34px*var(--t-display-scale))] leading-none text-t-accent">{n.joined}</p>
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
  const n = useJoined();
  const eyebrow = useEyebrow();
  const photo = c.hero.imageMobile || c.hero.imageDesktop;
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center gap-7 bg-t-bg px-6 py-12 text-center text-t-fg">
      <div className="relative h-[min(40svh,340px)] w-[min(62vw,260px)] overflow-hidden rounded-t-full border border-t-line bg-t-input">
        {photo && <Img src={photo} alt="" fill sizes="300px" className="object-cover" />}
      </div>
      <div>
        <p className="text-[12px] uppercase tracking-[0.24em] text-t-muted">{eyebrow}</p>
        <p className="t-display mt-3 text-[calc(40px*var(--t-display-scale))] leading-none text-t-accent">{n.joined}</p>
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
  const n = useJoined();
  const eyebrow = useEyebrow();
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-neutral-900 px-6 pb-10 pt-16 text-white md:px-16 md:pb-14">
      <BlurPhoto />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/45 via-black/10 to-black/85" />
      <div className="text-center md:text-left">
        <p className="text-[12px] uppercase tracking-[0.3em] text-white/75">{eyebrow}</p>
        <p className="t-display mt-3 text-[calc(clamp(44px,12vw,92px)*var(--t-display-scale))] leading-[0.95]">
          {n.first}
          {!n.single && (
            <>
              {" "}
              <span className="opacity-70">&amp;</span> {n.second || "Nama"}
            </>
          )}
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

/* ------------------------------------------------------------------ */
/* Animated covers: the opening itself is the hook                     */
/* ------------------------------------------------------------------ */

/** Plays the opening once, then lets the overlay fade out (`onOpen(delay)` starts the music right away). */
function useOpening(onOpen: ((delay?: number) => void) | undefined, ms: number) {
  const [opening, setOpening] = useState(false);
  const start = () => {
    if (opening) return;
    setOpening(true);
    onOpen?.(ms);
  };
  return { opening, start };
}

/** "Surat Terbuka": a sealed envelope opens and the letter slides out. */
const Surat: CoverFace = ({ guestName, onOpen }) => {
  const { content: c, mode } = useTheme();
  const decor = useDecor();
  const n = useJoined();
  const eyebrow = useEyebrow();
  const [a = "", b = ""] = initials(n.first, n.second);
  const { opening, start } = useOpening(onOpen, 1750);
  const [flapBehind, setFlapBehind] = useState(false);
  useEffect(() => {
    if (!opening) return;
    const t = setTimeout(() => setFlapBehind(true), 520);
    return () => clearTimeout(t);
  }, [opening]);
  const still = mode === "thumb";
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-t-alt px-5 py-12 text-center text-t-fg">
      <DecorFrame decor={decor} />
      <motion.div initial={still ? false : { opacity: 0, y: 14 }} animate={{ opacity: opening ? 0 : 1, y: 0 }} transition={{ duration: opening ? 0.4 : 0.9, ease: EASE }}>
        <p className="text-[12px] uppercase tracking-[0.28em] text-t-muted">{eyebrow}</p>
        <p className="t-display mt-3 text-[calc(clamp(38px,10vw,56px)*var(--t-display-scale))] leading-none text-t-accent">{n.joined}</p>
      </motion.div>

      {/* envelope */}
      <motion.div
        initial={still ? false : { opacity: 0, scale: 0.92 }}
        animate={opening ? { opacity: 1, scale: 1.05, y: 26 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: opening ? 1.1 : 0.9, delay: opening ? 0.6 : 0.15, ease: EASE }}
        className="relative mt-10 aspect-[1.3] w-[min(84vw,380px)] [perspective:1200px]"
      >
        <div className={still || opening ? "h-full w-full" : "t-anim t-bob h-full w-full"}>
          {/* back */}
          <div className="absolute inset-0 rounded-[14px] bg-[color-mix(in_srgb,var(--t-accent)_16%,var(--t-card))] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.45)]" />
          {/* letter */}
          <motion.div
            animate={opening ? { y: "-62%" } : { y: "0%" }}
            transition={{ duration: 0.8, delay: opening ? 0.75 : 0, ease: EASE }}
            className="absolute inset-x-[7%] top-[8%] z-[2] flex h-[84%] flex-col items-center justify-start rounded-[8px] border border-t-line bg-t-card px-4 pt-[7%] shadow-sm"
          >
            <p className="text-[10px] uppercase tracking-[0.24em] text-t-muted">{eyebrow}</p>
            <p className="t-display mt-1.5 text-[calc(26px*var(--t-display-scale))] leading-none text-t-accent">{n.joined}</p>
            {c.event.date && <p className="mt-2 text-[11px] text-t-fg2">{formatEventDate(c.event.date)}</p>}
          </motion.div>
          {/* front pocket with the guest's name, like an address */}
          <svg viewBox="0 0 380 292" preserveAspectRatio="none" aria-hidden className="absolute inset-0 z-[3] h-full w-full">
            <path d="M0 292 L0 6 L190 175 L380 6 L380 292 Z" fill="color-mix(in srgb, var(--t-accent) 9%, var(--t-card))" />
            <path d="M0 292 L165 162 M380 292 L215 162" fill="none" stroke="var(--t-line)" strokeWidth="1.2" />
            <path d="M0 6 L190 175 L380 6" fill="none" stroke="var(--t-line)" strokeWidth="1.5" />
          </svg>
          <div className="absolute inset-x-0 bottom-[7%] z-[4] px-6">
            <p className="text-[12px] text-t-fg2">{c.cover.greeting}</p>
            <p className="t-head mt-1 truncate text-[clamp(20px,5.6vw,26px)] italic leading-tight text-t-fg">{guestName}</p>
          </div>
          {/* flap */}
          <motion.div
            animate={{ rotateX: opening ? 180 : 0 }}
            transition={{ duration: 0.7, delay: opening ? 0.2 : 0, ease: [0.65, 0, 0.35, 1] }}
            style={{ transformOrigin: "50% 0%", zIndex: flapBehind ? 1 : 5 }}
            className="absolute inset-x-0 top-0 h-[60%] [transform-style:preserve-3d]"
          >
            <svg viewBox="0 0 380 175" preserveAspectRatio="none" aria-hidden className="h-full w-full drop-shadow-[0_6px_8px_rgba(0,0,0,0.12)]">
              <path d="M0 0 L380 0 L380 6 L190 175 L0 6 Z" fill="color-mix(in srgb, var(--t-accent) 22%, var(--t-card))" />
              <path d="M0 6 L190 175 L380 6" fill="none" stroke="var(--t-line)" strokeWidth="1.5" />
            </svg>
          </motion.div>
          {/* wax seal */}
          <motion.div
            animate={opening ? { scale: 0, opacity: 0, rotate: -40 } : { scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="absolute left-1/2 top-[60%] z-[6] flex h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-t-accent text-t-on-accent shadow-[0_8px_18px_-6px_rgba(0,0,0,0.5)] ring-[5px] ring-[color-mix(in_srgb,var(--t-accent)_55%,transparent)]"
          >
            <span className="t-display text-[22px] leading-none">
              {a}
              {b && <span className="text-[13px] italic opacity-80">&amp;</span>}
              {b}
            </span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div animate={{ opacity: opening ? 0 : 1 }} transition={{ duration: 0.3 }} className="mt-9 flex flex-col items-center gap-4">
        <OpenButton onOpen={start} tone="theme" pulse={!still} />
        <MadeWith className="text-t-fg2" />
      </motion.div>
    </section>
  );
};

/** One door of "Gerbang Terbuka". */
function Door({ side, decor }: { side: "left" | "right"; decor: ReturnType<typeof useDecor> }) {
  const left = side === "left";
  return (
    <div className={`absolute inset-y-0 ${left ? "left-0 border-r" : "right-0 border-l"} w-1/2 overflow-hidden border-t-muted/40 bg-t-alt`}>
      <DecorPattern decor={decor === "none" ? "jawa" : decor} opacity={0.1} />
      <div className={`absolute inset-3 rounded-[6px] border border-t-muted/45 md:inset-5 ${left ? "rounded-r-none border-r-0" : "rounded-l-none border-l-0"}`} />
      <div className={`absolute inset-6 rounded-[4px] border border-t-muted/25 md:inset-9 ${left ? "rounded-r-none border-r-0" : "rounded-l-none border-l-0"}`} />
      {decor !== "none" && <DecorCorner decor={decor} at={left ? "tl" : "tr"} />}
      {decor !== "none" && <DecorCorner decor={decor} at={left ? "bl" : "br"} />}
      {/* half medallion + ring handle at the meeting edge */}
      <div className={`absolute top-1/2 h-[min(46vw,230px)] w-[min(46vw,230px)] -translate-y-1/2 rounded-full border-2 border-t-muted/50 ${left ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"}`} />
      <div className={`absolute top-[58%] h-6 w-6 rounded-full border-[3px] border-t-muted/70 ${left ? "right-4" : "left-4"}`} />
    </div>
  );
}

/** "Gerbang Terbuka": two ornamented doors slide apart to reveal the invitation. */
const Gerbang: CoverFace = ({ guestName, onOpen }) => {
  const { content: c, mode } = useTheme();
  const decor = useDecor();
  const n = useJoined();
  const eyebrow = useEyebrow();
  const { opening, start } = useOpening(onOpen, 1150);
  const still = mode === "thumb";
  const door = { duration: 1.15, ease: [0.7, 0, 0.3, 1] as const };
  return (
    <section className={`relative isolate min-h-[100svh] overflow-hidden text-t-fg ${mode === "live" ? "" : "bg-t-bg"}`}>
      <motion.div animate={{ x: opening ? "-100%" : "0%" }} transition={door} className="absolute inset-0 z-0">
        <Door side="left" decor={decor} />
      </motion.div>
      <motion.div animate={{ x: opening ? "100%" : "0%" }} transition={door} className="absolute inset-0 z-0">
        <Door side="right" decor={decor} />
      </motion.div>
      <motion.div
        initial={still ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: opening ? 0 : 1, scale: 1 }}
        transition={{ duration: opening ? 0.35 : 0.9, ease: EASE }}
        className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-8 py-14 text-center"
      >
        <div className="rounded-[28px] bg-t-bg/85 px-7 py-9 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] backdrop-blur-sm md:px-12">
          <CoupleLogo tone="dark" className="mx-auto h-auto w-[70px]" />
          <p className="mt-4 text-[12px] uppercase tracking-[0.28em] text-t-muted">{eyebrow}</p>
          <p className="t-display mt-3 text-[calc(clamp(36px,10vw,58px)*var(--t-display-scale))] leading-none text-t-accent">{n.joined}</p>
          <div className="mx-auto my-6 h-px w-12 bg-t-muted/50" />
          <p className="text-[14px] text-t-fg2">{c.cover.greeting}</p>
          <h1 className="t-head mt-1.5 text-[clamp(24px,6.5vw,34px)] italic leading-tight">{guestName}</h1>
          <div className="mt-7">
            <OpenButton onOpen={start} tone="theme" pulse={!still} />
          </div>
        </div>
        <MadeWith className="mt-6 text-t-fg2" />
      </motion.div>
    </section>
  );
};

const BURST = Array.from({ length: 26 }, (_, i) => {
  const a = (i / 26) * Math.PI * 2;
  const d = 110 + ((i * 37) % 70);
  return { x: Math.cos(a) * d, y: Math.sin(a) * d - 60, r: (i * 47) % 360, c: ["#FF7A6B", "#FFC845", "#3CC5B6", "#8C6CF2", "#FF8FB7"][i % 5] };
});

/** "Kotak Kado": the lid pops off and confetti bursts out. */
const Kado: CoverFace = ({ guestName, onOpen }) => {
  const { content: c, mode } = useTheme();
  const decor = useDecor();
  const n = useJoined();
  const eyebrow = useEyebrow();
  const { opening, start } = useOpening(onOpen, 1350);
  const still = mode === "thumb";
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-t-alt px-6 py-12 text-center text-t-fg">
      <DecorFrame decor={decor} />
      <motion.div animate={{ opacity: opening ? 0 : 1 }} transition={{ duration: 0.35 }}>
        <p className="text-[12px] uppercase tracking-[0.28em] text-t-muted">{eyebrow}</p>
        <p className="t-display mt-3 text-[calc(clamp(40px,11vw,60px)*var(--t-display-scale))] leading-none text-t-accent">{n.joined}</p>
      </motion.div>
      <div className="relative mt-8 h-[220px] w-[220px]">
        {opening &&
          BURST.map((p, i) => (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.r }}
              transition={{ duration: 1.2, delay: 0.25, ease: "easeOut" }}
              className="absolute left-1/2 top-[45%] block h-3 w-2 rounded-[2px]"
              style={{ background: p.c }}
            />
          ))}
        <motion.svg viewBox="0 0 220 220" className="h-full w-full overflow-visible" animate={opening ? { scale: [1, 1.08, 0.9], opacity: [1, 1, 0] } : { scale: 1 }} transition={{ duration: 1.2, times: [0, 0.3, 1] }}>
          <g className={still || opening ? "" : "t-anim t-bob"}>
            <rect x={40} y={98} width={140} height={104} rx={8} fill="var(--t-accent)" />
            <rect x={98} y={98} width={24} height={104} fill="#FFC845" />
            <rect x={40} y={128} width={140} height={14} fill="#FFFFFF" fillOpacity={0.18} />
            <motion.g animate={opening ? { y: -130, rotate: -28, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }} transition={{ duration: 0.9, ease: EASE }} style={{ transformOrigin: "110px 90px" }}>
              <rect x={32} y={76} width={156} height={30} rx={7} fill="color-mix(in srgb, var(--t-accent) 82%, #000)" />
              <rect x={98} y={76} width={24} height={30} fill="#FFB020" />
              <path d="M110 76 C 84 42, 58 58, 80 76 Z M110 76 C 136 42, 162 58, 140 76 Z" fill="#FFC845" stroke="#E0A21C" strokeWidth={2} />
              <circle cx={110} cy={74} r={8} fill="#FFB020" />
            </motion.g>
          </g>
        </motion.svg>
      </div>
      <motion.div animate={{ opacity: opening ? 0 : 1 }} transition={{ duration: 0.3 }} className="mt-4 flex flex-col items-center">
        <p className="text-[14px] text-t-fg2">{c.cover.greeting}</p>
        <h1 className="t-head mt-1.5 text-[clamp(24px,6.5vw,34px)] italic leading-tight">{guestName}</h1>
        <div className="mt-7">
          <OpenButton onOpen={start} tone="theme" pulse={!still} />
        </div>
        <MadeWith className="mt-6 text-t-fg2" />
      </motion.div>
    </section>
  );
};

const HEART = "M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z";
const SPARKLE = "M12 0 C 12.8 7, 17 11.2, 24 12 C 17 12.8, 12.8 17, 12 24 C 11.2 17, 7 12.8, 0 12 C 7 11.2, 11.2 7, 12 0 Z";

/** Hearts that fly up when the sticker cover opens (fixed positions, so server and browser agree). */
const LOVE = Array.from({ length: 16 }, (_, i) => ({
  x: ((i * 61) % 240) - 120,
  y: -150 - ((i * 43) % 170),
  s: 14 + ((i * 7) % 16),
  d: 0.05 + (i % 6) * 0.05,
  c: ["#FF6F91", "#FFC845", "#FF9AB5", "#5ED1BE"][i % 4],
}));

/** Twinkling sparkles on the background: [left %, top %, size px, delay s]. */
const TWINKLES: [number, number, number, number][] = [
  [8, 12, 16, 0],
  [88, 9, 12, 1.2],
  [14, 47, 10, 0.6],
  [90, 40, 18, 2],
  [6, 66, 12, 1.6],
  [93, 63, 10, 0.3],
];

/** One speech bubble next to the sticker photo. Empty text is a hint in the editor and hidden for guests. */
function Bubble({ text, ph, side, className, delay, opening }: { text: string; ph: string; side: "left" | "right"; className: string; delay: number; opening: boolean }) {
  const { mode } = useTheme();
  const still = mode === "thumb";
  if (!text && mode === "live") return null;
  const rot = side === "left" ? -5 : 5;
  return (
    <motion.div
      initial={still ? false : { opacity: 0, scale: 0.3, rotate: rot * 3 }}
      animate={opening ? { opacity: 0, scale: 0.4, rotate: rot * 3 } : { opacity: 1, scale: 1, rotate: rot }}
      transition={opening ? { duration: 0.25 } : { type: "spring", stiffness: 240, damping: 15, delay }}
      style={still ? { rotate: rot } : undefined}
      className={`absolute z-[4] max-w-[46%] md:max-w-[220px] ${className}`}
    >
      <div className={still ? "" : "t-anim t-bob"} style={{ animationDelay: `${delay}s` }}>
        <div className={`relative rounded-[18px] bg-white px-3.5 py-2.5 text-[13px] font-bold leading-snug text-neutral-800 shadow-[0_12px_26px_-14px_rgba(0,0,0,0.45)] md:text-[15px] ${text ? "" : "border border-dashed border-neutral-300"}`}>
          {text || <span className="font-semibold text-neutral-400">{ph}</span>}
          <svg viewBox="0 0 18 14" aria-hidden className={`absolute -bottom-[11px] h-[14px] w-[18px] ${side === "left" ? "right-6" : "left-6 -scale-x-100"}`}>
            <path d="M0 0 L14 0 L17 14 Z" fill="white" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * "Stiker Lucu": a cut-out photo with a white die-cut outline (childhood photo,
 * AI kid version…), two speech bubbles and a curved panel holding the guest's
 * name. Opening: the photo hops and hearts fly up.
 */
const Stiker: CoverFace = ({ guestName, onOpen }) => {
  const { content: c, mode } = useTheme();
  const decor = useDecor();
  const n = useJoined();
  const o = getOccasion(c.occasion).sticker;
  const { opening, start } = useOpening(onOpen, 1300);
  const still = mode === "thumb";
  const cutout = c.cover.photo;
  const photo = cutout || c.hero.imageMobile || c.hero.imageDesktop;
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden bg-t-alt text-center text-t-fg">
      <DecorFrame decor={decor} corners={["tl", "tr"]} />
      {TWINKLES.map(([x, y, size, delay], i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden className={`absolute -z-[1] text-t-muted ${still ? "opacity-60" : "t-anim t-twinkle"}`} style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${delay}s` }}>
          <path d={i % 3 === 1 ? HEART : SPARKLE} fill="currentColor" />
        </svg>
      ))}

      <motion.div initial={still ? false : { opacity: 0, y: -12 }} animate={{ opacity: opening ? 0 : 1, y: 0 }} transition={{ duration: opening ? 0.35 : 0.8, ease: EASE }} className="relative z-[3] w-full max-w-[560px] px-6 pt-[max(44px,7svh)]">
        <p className="t-display text-[calc(clamp(24px,6.6vw,34px)*var(--t-display-scale))] leading-none text-t-muted">{c.cover.kicker || o.kicker}</p>
        <p className="mt-1.5 text-[clamp(30px,9.4vw,50px)] font-extrabold uppercase leading-[0.95] tracking-[0.02em] text-t-fg">{c.cover.title || o.title}</p>
        <p className="t-display mt-3 text-[calc(clamp(34px,10.5vw,56px)*var(--t-display-scale))] leading-[1.05] text-t-accent">{n.joined}</p>
        <svg viewBox="0 0 180 22" aria-hidden className="mx-auto mt-1 h-[22px] w-[180px] text-t-accent">
          <path d="M4 12 C 24 2, 40 20, 62 11 C 70 8, 74 9, 78 11 M102 11 C 106 9, 110 8, 118 11 C 140 20, 156 2, 176 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d={HEART} transform="translate(80 0) scale(0.85)" fill="currentColor" />
        </svg>
      </motion.div>

      {/* sticker photo + speech bubbles */}
      <div className="relative z-[2] w-full max-w-[460px] flex-1 basis-[42svh]">
        <motion.div
          initial={still ? false : { opacity: 0, y: 40, scale: 0.92 }}
          animate={opening ? { opacity: 1, y: [0, -26, -10], scale: [1, 1.06, 1.02] } : { opacity: 1, y: 0, scale: 1 }}
          transition={opening ? { duration: 0.8, ease: EASE } : { type: "spring", stiffness: 120, damping: 14, delay: 0.25 }}
          className="absolute inset-x-[6%] -bottom-[56px] top-[14%]"
        >
          {cutout ? (
            <Img src={cutout} alt={n.joined} fill priority sizes="(min-width: 768px) 420px, 88vw" className="t-sticker object-contain object-bottom" />
          ) : photo ? (
            <div className="absolute bottom-[64px] left-1/2 aspect-[4/5] h-[86%] -translate-x-1/2 rotate-[-3deg] overflow-hidden rounded-[22px] border-[6px] border-white bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]">
              <Img src={photo} alt={n.joined} fill priority sizes="320px" className="object-cover" />
            </div>
          ) : (
            <div className="absolute bottom-[64px] left-1/2 aspect-[4/5] h-[86%] -translate-x-1/2 overflow-hidden rounded-[22px]">
              <EmptyPhoto label="Foto stiker (PNG tanpa latar)" />
            </div>
          )}
        </motion.div>
        <Bubble text={c.cover.bubbleA} ph={o.bubbles[0]} side="left" className="left-[3%] top-0" delay={0.7} opening={opening} />
        <Bubble text={c.cover.bubbleB} ph={o.bubbles[1]} side="right" className="right-[3%] top-[11%]" delay={0.95} opening={opening} />
        {opening &&
          LOVE.map((h, i) => (
            <motion.svg
              key={i}
              viewBox="0 0 24 24"
              aria-hidden
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
              animate={{ x: h.x, y: h.y, opacity: [0, 1, 0], scale: 1 }}
              transition={{ duration: 1.1, delay: h.d, ease: "easeOut" }}
              className="absolute left-1/2 top-[45%] z-[5]"
              style={{ width: h.s, height: h.s, color: h.c }}
            >
              <path d={HEART} fill="currentColor" />
            </motion.svg>
          ))}
      </div>

      {/* curved panel with the guest's name */}
      <div className="relative z-[3] w-full">
        <svg viewBox="0 0 400 48" preserveAspectRatio="none" aria-hidden className="block h-[44px] w-full text-t-accent md:h-[60px]">
          <path d="M0 30 C 70 4, 140 0, 200 14 C 260 28, 330 30, 400 6 L400 48 L0 48 Z" fill="currentColor" />
        </svg>
        <div className="-mt-px bg-t-accent px-6 pb-7 pt-2 text-t-on-accent">
          <motion.div animate={{ opacity: opening ? 0 : 1 }} transition={{ duration: 0.35, delay: opening ? 0.4 : 0 }}>
            <p className="text-[13px] opacity-85">{c.cover.greeting}</p>
            <h1 className="t-head mt-1 text-[clamp(24px,6.6vw,34px)] italic leading-tight">{guestName}</h1>
            <div className="mt-5">
              <OpenButton onOpen={start} tone="inverse" pulse={!still} />
            </div>
            <MadeWith className="mt-4" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const COVER_LAYOUTS: Record<string, CoverFace> = { surat: Surat, gerbang: Gerbang, kado: Kado, stiker: Stiker, kaca: Kaca, amplop: Amplop, lengkung: Lengkung, sinema: Sinema };
