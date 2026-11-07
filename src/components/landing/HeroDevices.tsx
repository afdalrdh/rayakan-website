"use client";

import { ArrowLeftRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Device = "desktop" | "mobile";

/** Position of each device in % of the device box. Front = focused. */
const SPOTS = {
  desktop: { front: { left: "0%", top: "16%", width: "80%" }, back: { left: "2%", top: "24%", width: "66%" } },
  mobile: { front: { left: "40%", top: "1%", width: "34%" }, back: { left: "67%", top: "5%", width: "30%" } },
} as const;

const MOVE = "transition-[left,top,width,filter] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none";

/**
 * Screen recording of the invitation (cover → "Buka Undangan" → scrolling) that
 * fades in over the screenshot. The file only starts downloading after the page
 * has loaded, so it never slows the first paint; visitors who prefer reduced
 * motion or save data keep the still screenshot.
 */
function ScreenVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let idle = 0;
    const start = () => {
      idle = window.setTimeout(() => {
        v.src = src;
        v.play().catch(() => {});
      }, 600);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(idle);
    };
  }, [src]);
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setReady(true)}
      className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}

/**
 * The sample invitation on a laptop and a phone; tapping one brings it to the
 * front. Plain CSS transitions; each screen can play a short recording of the
 * invitation being opened and scrolled (like a GIF).
 */
export function HeroDevices({ url, desktop, mobile, video }: { url: string; desktop: string; mobile: string; video?: { desktop: string; mobile: string } }) {
  const [focus, setFocus] = useState<Device>("desktop");
  const place = (d: Device) => {
    const front = focus === d;
    return { ...SPOTS[d][front ? "front" : "back"], zIndex: front ? 2 : 1, filter: front ? "none" : "brightness(0.55)" };
  };

  return (
    <div className="relative">
      <div className="rk-float relative aspect-[100/76] w-full">
        <button
          type="button"
          aria-pressed={focus === "desktop"}
          onClick={() => setFocus("desktop")}
          style={place("desktop")}
          className={`absolute block overflow-hidden rounded-[10px] bg-[#211b19] text-left shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)] ring-1 ring-white/15 md:rounded-[14px] ${MOVE}`}
        >
          <span className="flex h-[22px] items-center gap-1.5 px-2.5 md:h-[30px] md:px-3.5">
            <span className="h-2 w-2 rounded-full bg-[#ec6a5e] md:h-2.5 md:w-2.5" />
            <span className="h-2 w-2 rounded-full bg-[#f4bf4f] md:h-2.5 md:w-2.5" />
            <span className="h-2 w-2 rounded-full bg-[#61c554] md:h-2.5 md:w-2.5" />
            <span aria-hidden="true" className="ml-2 flex h-[14px] flex-1 items-center truncate rounded-full bg-white/[0.08] px-2.5 text-[8px] text-white/55 md:ml-3 md:h-[19px] md:text-[11px]">{url}</span>
          </span>
          <span className="rk-shimmer-dark relative block aspect-[16/10]">
            <Image src={desktop} alt="Tampilkan contoh undangan di laptop" fill priority sizes="(min-width: 768px) 480px, 80vw" className="object-cover object-top" />
            {video && <ScreenVideo src={video.desktop} />}
          </span>
        </button>

        <button
          type="button"
          aria-pressed={focus === "mobile"}
          onClick={() => setFocus("mobile")}
          style={place("mobile")}
          className={`absolute block aspect-[390/844] rounded-[20px] bg-[#0d0b0a] p-[4px] shadow-[0_40px_70px_-20px_rgba(0,0,0,0.95)] ring-1 ring-white/20 md:rounded-[30px] md:p-[6px] ${MOVE}`}
        >
          <span className="rk-shimmer-dark relative block h-full w-full overflow-hidden rounded-[16px] md:rounded-[24px]">
            <Image src={mobile} alt="Tampilkan contoh undangan di HP" fill sizes="(min-width: 768px) 210px, 34vw" className="object-cover object-top" />
            {video && <ScreenVideo src={video.mobile} />}
          </span>
        </button>
      </div>

      <div className="mt-2 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setFocus(focus === "desktop" ? "mobile" : "desktop")}
          aria-label={focus === "desktop" ? "Lihat versi HP" : "Lihat versi laptop"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
        >
          <ArrowLeftRight className="h-[18px] w-[18px]" />
        </button>
        <span className="text-[11px] font-medium uppercase tracking-[2px] text-white/55">{focus === "desktop" ? "Lihat di HP" : "Lihat di laptop"}</span>
      </div>
    </div>
  );
}
