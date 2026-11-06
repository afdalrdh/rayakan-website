"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MUSIC_LIBRARY } from "@/lib/content";
import { Block } from "./Block";
import { useSrc, useTheme } from "./context";

/**
 * The "Buka Undangan" cover. The look comes from the chosen cover layout
 * (a `CoverFace`); this file only handles where it appears:
 *  - live: a fixed overlay that also starts the music,
 *  - edit / thumb: an inline, tappable section.
 */
export type CoverFace = (p: { guestName: string; onOpen?: (delayMs?: number) => void }) => React.JSX.Element;

export function CoverInline({ guestName, Face }: { guestName: string; Face: CoverFace }) {
  return (
    <Block id="cover">
      <div className="relative min-h-[680px] overflow-hidden">
        <Face guestName={guestName} />
      </div>
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

export function CoverOverlay({ guestName, Face }: { guestName: string; Face: CoverFace }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const music = useMusicSrc();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="fixed inset-0 z-[100] overflow-y-auto">
            <Face
              guestName={guestName}
              onOpen={(delay = 0) => {
                // Music must start inside the tap; animated covers finish their opening before the overlay fades.
                play();
                if (delay > 0) setTimeout(() => setOpen(true), delay);
                else setOpen(true);
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
