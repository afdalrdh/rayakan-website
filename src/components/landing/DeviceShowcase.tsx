"use client";

import { ArrowLeftRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";

type Device = "desktop" | "mobile";

interface Shot {
  src: string;
  width: number;
  height: number;
}

/** Where each device sits, in % of the stage. Front = in focus, back = dimmed behind. */
const LAYOUT = {
  wide: {
    desktop: { front: { left: "12%", top: "6%", width: "70%" }, back: { left: "4%", top: "14%", width: "56%" } },
    mobile: { front: { left: "39.5%", top: "6%", width: "21%" }, back: { left: "79%", top: "11%", width: "16%" } },
  },
  narrow: {
    desktop: { front: { left: "3%", top: "22%", width: "94%" }, back: { left: "3%", top: "26%", width: "70%" } },
    mobile: { front: { left: "29%", top: "4%", width: "42%" }, back: { left: "67%", top: "14%", width: "29%" } },
  },
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

function useWide() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(min-width: 768px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => true,
  );
}

/** A tall screenshot that slowly scrolls inside its frame, like someone reading the invitation. */
function Scroller({ shot, alt, sizes, paused }: { shot: Shot; alt: string; sizes: string; paused: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white [container-type:size]">
      <div className="rk-autoscroll" style={{ animationPlayState: paused ? "paused" : "running" }}>
        <Image src={shot.src} alt={alt} width={shot.width} height={shot.height} sizes={sizes} className="block h-auto w-full" priority />
      </div>
    </div>
  );
}

/**
 * Hero stage: a laptop window and a phone showing the same invitation.
 * Tap the one behind (or the ⇆ button) to bring it to the front.
 */
export function DeviceShowcase({ desktop, mobile, url, backdrop }: { desktop: Shot; mobile: Shot; url: string; backdrop: string }) {
  const wide = useWide();
  const [chosen, setChosen] = useState<Device | null>(null);
  const focus: Device = chosen ?? (wide ? "desktop" : "mobile");
  const layout = wide ? LAYOUT.wide : LAYOUT.narrow;
  const [hover, setHover] = useState(false);

  const place = (d: Device) => {
    const front = focus === d;
    return {
      ...(front ? layout[d].front : layout[d].back),
      zIndex: front ? 2 : 1,
      filter: front ? "brightness(1) saturate(1)" : "brightness(0.62) saturate(0.85)",
    };
  };
  const swap = () => setChosen(focus === "desktop" ? "mobile" : "desktop");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
      className="relative mx-auto aspect-[4/5] w-full max-w-[1200px] overflow-hidden rounded-[28px] bg-[#1d1714] md:aspect-[16/10] md:rounded-[36px]"
    >
      {/* blurred wedding photo behind the devices */}
      <Image src={backdrop} alt="" fill sizes="(min-width: 1200px) 1200px, 100vw" className="scale-110 object-cover opacity-70 blur-[6px]" priority />
      <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_40%,rgba(20,14,10,0.25),rgba(20,14,10,0.75))]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* laptop / browser window */}
      <motion.button
        type="button"
        aria-label={focus === "desktop" ? "Tampilan laptop" : "Tampilkan versi laptop"}
        onClick={() => focus !== "desktop" && setChosen("desktop")}
        onHoverStart={() => focus === "desktop" && setHover(true)}
        onHoverEnd={() => setHover(false)}
        initial={false}
        animate={place("desktop")}
        transition={{ duration: 0.8, ease: EASE }}
        className={`absolute block overflow-hidden rounded-[10px] bg-[#211b19] text-left shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10 md:rounded-[14px] ${focus === "desktop" ? "cursor-default" : "cursor-pointer"}`}
      >
        <span className="flex h-[22px] items-center gap-1.5 px-2.5 md:h-[34px] md:gap-2 md:px-4">
          <span className="h-[7px] w-[7px] rounded-full bg-[#ec6a5e] md:h-[11px] md:w-[11px]" />
          <span className="h-[7px] w-[7px] rounded-full bg-[#f4bf4f] md:h-[11px] md:w-[11px]" />
          <span className="h-[7px] w-[7px] rounded-full bg-[#61c554] md:h-[11px] md:w-[11px]" />
          <span className="ml-2 flex h-[14px] flex-1 items-center rounded-full bg-white/[0.07] px-2.5 text-[8px] text-white/55 md:ml-4 md:h-[22px] md:px-4 md:text-[12px]">{url}</span>
        </span>
        <span className="block aspect-[16/10]">
          <Scroller shot={desktop} alt="Contoh undangan di laptop" sizes="(min-width: 1200px) 940px, 90vw" paused={hover} />
        </span>
      </motion.button>

      {/* phone */}
      <motion.button
        type="button"
        aria-label={focus === "mobile" ? "Tampilan HP" : "Tampilkan versi HP"}
        onClick={() => focus !== "mobile" && setChosen("mobile")}
        onHoverStart={() => focus === "mobile" && setHover(true)}
        onHoverEnd={() => setHover(false)}
        initial={false}
        animate={place("mobile")}
        transition={{ duration: 0.8, ease: EASE }}
        className={`absolute block aspect-[390/844] rounded-[22px] bg-[#0d0b0a] p-[4px] shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)] ring-1 ring-white/15 md:rounded-[34px] md:p-[6px] ${focus === "mobile" ? "cursor-default" : "cursor-pointer"}`}
      >
        <span className="relative block h-full w-full overflow-hidden rounded-[18px] md:rounded-[28px]">
          <Scroller shot={mobile} alt="Contoh undangan di HP" sizes="(min-width: 768px) 280px, 55vw" paused={hover} />
          <span className="absolute left-1/2 top-[6px] h-[10px] w-[34%] -translate-x-1/2 rounded-full bg-black md:top-[10px] md:h-[16px]" />
        </span>
      </motion.button>

      {/* swap */}
      <div className="absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-2 md:bottom-6">
        <button
          type="button"
          onClick={swap}
          aria-label={focus === "desktop" ? "Lihat versi HP" : "Lihat versi laptop"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55 md:h-12 md:w-12"
        >
          <ArrowLeftRight className="h-[18px] w-[18px]" />
        </button>
        <span className="hidden text-[11px] font-medium uppercase tracking-[2px] text-white/60 md:block">{focus === "desktop" ? "Lihat di HP" : "Lihat di laptop"}</span>
      </div>
    </motion.div>
  );
}
