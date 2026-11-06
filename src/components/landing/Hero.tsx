"use client";

import { ArrowLeftRight, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Sparkle } from "./illustrations";

const EASE = [0.22, 1, 0.36, 1] as const;

type Device = "desktop" | "mobile";

/** Position of each device in % of the device box. Front = focused. */
const SPOTS = {
  desktop: { front: { left: "0%", top: "16%", width: "80%" }, back: { left: "2%", top: "24%", width: "66%" } },
  mobile: { front: { left: "40%", top: "1%", width: "34%" }, back: { left: "67%", top: "5%", width: "30%" } },
} as const;

function Devices({ url, desktop, mobile }: { url: string; desktop: string; mobile: string }) {
  const [focus, setFocus] = useState<Device>("desktop");
  const place = (d: Device) => {
    const front = focus === d;
    return { ...SPOTS[d][front ? "front" : "back"], zIndex: front ? 2 : 1, filter: front ? "brightness(1)" : "brightness(0.55)" };
  };

  return (
    <div className="relative">
      <div className="rk-float relative aspect-[100/76] w-full">
        <motion.button
          type="button"
          aria-label={focus === "desktop" ? "Tampilan laptop" : "Tampilkan versi laptop"}
          onClick={() => setFocus("desktop")}
          initial={false}
          animate={place("desktop")}
          transition={{ duration: 0.75, ease: EASE }}
          className="absolute block overflow-hidden rounded-[10px] bg-[#211b19] text-left shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)] ring-1 ring-white/15 md:rounded-[14px]"
        >
          <span className="flex h-[22px] items-center gap-1.5 px-2.5 md:h-[30px] md:px-3.5">
            <span className="h-2 w-2 rounded-full bg-[#ec6a5e] md:h-2.5 md:w-2.5" />
            <span className="h-2 w-2 rounded-full bg-[#f4bf4f] md:h-2.5 md:w-2.5" />
            <span className="h-2 w-2 rounded-full bg-[#61c554] md:h-2.5 md:w-2.5" />
            <span className="ml-2 flex h-[14px] flex-1 items-center truncate rounded-full bg-white/[0.08] px-2.5 text-[8px] text-white/55 md:ml-3 md:h-[19px] md:text-[11px]">{url}</span>
          </span>
          <span className="relative block aspect-[16/10]">
            <Image src={desktop} alt="Contoh undangan di laptop" fill priority unoptimized className="object-cover object-top" />
          </span>
        </motion.button>

        <motion.button
          type="button"
          aria-label={focus === "mobile" ? "Tampilan HP" : "Tampilkan versi HP"}
          onClick={() => setFocus("mobile")}
          initial={false}
          animate={place("mobile")}
          transition={{ duration: 0.75, ease: EASE }}
          className="absolute block aspect-[390/844] rounded-[20px] bg-[#0d0b0a] p-[4px] shadow-[0_40px_70px_-20px_rgba(0,0,0,0.95)] ring-1 ring-white/20 md:rounded-[30px] md:p-[6px]"
        >
          <span className="relative block h-full w-full overflow-hidden rounded-[16px] md:rounded-[24px]">
            <Image src={mobile} alt="Contoh undangan di HP" fill priority unoptimized className="object-cover object-top" />
          </span>
        </motion.button>
      </div>

      <div className="mt-2 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setFocus(focus === "desktop" ? "mobile" : "desktop")}
          aria-label={focus === "desktop" ? "Lihat versi HP" : "Lihat versi laptop"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <ArrowLeftRight className="h-[18px] w-[18px]" />
        </button>
        <span className="text-[11px] font-medium uppercase tracking-[2px] text-white/55">{focus === "desktop" ? "Lihat di HP" : "Lihat di laptop"}</span>
      </div>
    </div>
  );
}

const MARQUEE = ["Coba gratis tanpa daftar", "Bayar setelah jadi", "Aktif selamanya", "Tema adat Jawa & Sunda", "Lukisan & ilustrasi AI", "Animasi pembuka", "Link nama per tamu", "RSVP & buku ucapan", "Amplop digital", "Edit dari HP"];

/**
 * Landing hero: cinematic photo with a slow zoom, drifting dots and a hand-drawn
 * curve; headline on the left, the sample invitation on a laptop and a phone on the right.
 */
export function Hero({ tryHref, consultHref, priceFrom }: { tryHref: string; consultHref: string; priceFrom: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#15110e] text-white">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <picture>
          <source media="(min-width: 768px)" srcSet="/landing/hero-bg.webp" />
          <img src="/landing/hero-bg-mobile.webp" alt="" fetchPriority="high" className="rk-kenburns h-full w-full object-cover" />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,13,10,0.88)_0%,rgba(18,13,10,0.5)_45%,rgba(18,13,10,0.2)_100%)] max-md:bg-[linear-gradient(180deg,rgba(18,13,10,0.75)_0%,rgba(18,13,10,0.55)_50%,rgba(18,13,10,0.85)_100%)]" />
        <div className="rk-drift absolute -inset-x-[240px] -top-[120px] bottom-0 opacity-[0.22] [background-image:radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#15110e] to-transparent" />
      </div>

      {/* hand-drawn curve behind the devices */}
      <svg viewBox="0 0 560 800" className="pointer-events-none absolute right-0 top-0 -z-[5] hidden h-[86%] max-h-[900px] w-auto overflow-visible text-[#e8d5b5] md:block" aria-hidden="true">
        <motion.path
          d="M 590 30 C 390 190, 62 410, 37 600 C 17 760, 300 790, 590 610"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeOpacity="0.55"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
        />
        <path d="M 590 80 C 410 225, 98 432, 75 600 C 57 728, 300 752, 590 576" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="2 7" vectorEffect="non-scaling-stroke" className="rk-march" />
      </svg>
      <Sparkle className="rk-twinkle pointer-events-none absolute left-[46%] top-[22%] hidden h-5 w-5 text-[#e8d5b5] md:block" delay={1.2} />
      <Sparkle className="rk-twinkle pointer-events-none absolute right-[14%] top-[66%] hidden h-4 w-4 text-[#e8d5b5] [animation-delay:1.5s] md:block" delay={1.6} />

      <div className="mx-auto grid min-h-[100svh] max-w-[1240px] items-center gap-10 px-5 pb-28 pt-28 sm:px-8 md:grid-cols-[1fr_1.05fr] md:gap-6 md:pt-24">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-4 py-1.5 text-[12px] text-white/80 backdrop-blur-md"
          >
            <span className="text-[#e8d5b5]">✦</span> Nikah · Ulang tahun · Khitanan · mulai {priceFrom}
          </motion.span>
          <h1 className="mt-6 font-rk-display text-[clamp(50px,6.6vw,94px)] font-light leading-[0.98] tracking-[-0.03em]">
            {["Setiap", "momen"].map((w, i) => (
              <motion.span key={w} initial={{ opacity: 0, y: 14, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: EASE }} className="mr-[0.22em] inline-block">
                {w}
              </motion.span>
            ))}
            <br />
            {["layak", "dirayakan."].map((w, i) => (
              <motion.span key={w} initial={{ opacity: 0, y: 14, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.7, delay: 0.24 + i * 0.07, ease: EASE }} className="mr-[0.22em] inline-block italic text-[#e8d5b5]">
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4, ease: EASE }}>
            <p className="mt-6 max-w-[500px] text-[16px] leading-relaxed text-white/75 sm:text-[17px]">
              Undangan digital yang gampang dibuat, bebas kamu atur sendiri dari HP, dan dikirim ke setiap tamu dengan namanya. Coba dulu gratis, bayar saat siap disebar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={tryHref} prefetch={false} className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#f3eadb] px-7 text-[15px] font-semibold text-rk-ink transition hover:bg-white">
                Coba gratis sekarang <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a href="#tema" className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/[0.04] px-7 text-[15px] font-semibold backdrop-blur-sm transition hover:border-white/60">
                Lihat 12 tema
              </a>
            </div>
            <p className="mt-5 text-[13px] text-white/55">
              Sudah punya konsep sendiri?{" "}
              <a href={consultHref} target="_blank" rel="noreferrer" className="text-white/85 underline underline-offset-4">
                Konsultasi gratis
              </a>
            </p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }} className="mx-auto w-full max-w-[600px]">
          <Devices url="rayakan.my.id/afdal-putri" desktop="/landing/afdal-desktop.webp" mobile="/landing/afdal-mobile.webp" />
        </motion.div>
      </div>

      {/* feature ticker */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/10 py-4 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="rk-marquee flex w-max gap-10 whitespace-nowrap text-[13px] text-white/60">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t} <span className="text-[#e8d5b5]/60">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
