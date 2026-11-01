"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { MUSIC_LIBRARY } from "@/lib/content";
import { Block } from "./Block";
import { Img, useSrc, useTheme } from "./context";
import { EnvelopeIcon } from "./icons";

/**
 * The "Buka Undangan" cover: a blurred overlay with the guest's name.
 * Live: fixed overlay that also starts the music. Edit: an inline, tappable section.
 * Themes pass their own logo; layout is shared because both designs use it.
 */

function CoverCard({ guestName, logo, onOpen }: { guestName: string; logo: ReactNode; onOpen?: () => void }) {
  const { content: c } = useTheme();
  return (
    <>
      <div className="relative z-10">{logo}</div>
      <div className="relative z-10 flex h-[264px] w-full max-w-[392px] flex-col items-center justify-center gap-5 rounded-[16px] border border-white/50 px-6 text-center">
        <p className="font-sans text-[14px] leading-[24px] text-white/80 sm:text-[16px] sm:leading-[28px]">{c.cover.greeting}</p>
        <h1 className="px-2 font-serif text-[clamp(30px,8vw,44px)] italic leading-[1.05] text-white sm:text-[40px] md:text-[48px]">{guestName}</h1>
        <button
          type="button"
          onClick={onOpen}
          className="mt-2 inline-flex items-center gap-2.5 rounded-[14px] border border-white/75 px-6 py-3 font-sans text-[17px] leading-none text-white transition-colors hover:bg-white hover:text-neutral-950 md:rounded-[9px]"
        >
          <EnvelopeIcon className="h-[1em] w-[1em]" />
          {c.cover.buttonLabel}
        </button>
      </div>
      <p className="relative z-10 mt-6 font-sans text-[14px] leading-[26px] text-white/90 md:text-[16px]">
        Made With <span className="px-1 text-white">♥</span> Rayakan.my.id
      </p>
    </>
  );
}

export function CoverInline({ guestName, logo }: { guestName: string; logo: ReactNode }) {
  const { content: c } = useTheme();
  return (
    <Block id="cover">
      <section className="relative isolate flex min-h-[640px] flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16">
        <div className="absolute inset-0 -z-10 hidden md:block">{c.hero.imageDesktop && <Img src={c.hero.imageDesktop} alt="" fill sizes="100vw" className="object-cover" />}</div>
        <div className="absolute inset-0 -z-10 md:hidden">{c.hero.imageMobile && <Img src={c.hero.imageMobile} alt="" fill sizes="100vw" className="object-cover" />}</div>
        <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-[30px]" />
        <CoverCard guestName={guestName} logo={logo} />
      </section>
    </Block>
  );
}

function useMusicSrc() {
  const { content: c } = useTheme();
  const upload = useSrc(c.music.mode === "upload" ? c.music.upload : "");
  if (c.music.mode === "none") return "";
  if (c.music.mode === "upload") return upload;
  return MUSIC_LIBRARY.find((t) => t.id === c.music.trackId)?.src ?? "";
}

export function CoverOverlay({ guestName, logo }: { guestName: string; logo: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const music = useMusicSrc();

  useLayoutEffect(() => window.scrollTo(0, 0), []);
  useEffect(() => {
    document.body.style.overflow = open ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const play = () =>
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => {});
  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) play();
    else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      {music && <audio ref={audioRef} loop preload="auto" src={music} />}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 px-6"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[30px]" />
            <CoverCard
              guestName={guestName}
              logo={logo}
              onOpen={() => {
                play();
                setOpen(true);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {open && music && (
        <button type="button" aria-label={playing ? "Hentikan musik" : "Putar musik"} onClick={toggle} className="fixed bottom-6 right-6 z-50 transition hover:scale-105 md:bottom-8 md:right-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={playing ? "/themes/shared/music-on.svg" : "/themes/shared/music-off.svg"} alt="" width={48} height={48} />
        </button>
      )}
    </>
  );
}
