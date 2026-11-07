import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { HeroDevices } from "./HeroDevices";

type HeroDevicesProps = Parameters<typeof HeroDevices>[0];

/** The sample on the home page: Afdal & Putri, with screen recordings of /tema/afdal (made by scripts/record-hero.mjs). */
export const HOME_DEVICES: HeroDevicesProps = {
  url: "rayakan.my.id/namamu",
  desktop: "/landing/afdal-desktop.webp",
  mobile: "/landing/afdal-mobile.webp",
  video: { desktop: "/landing/afdal-desktop.mp4", mobile: "/landing/afdal-mobile.mp4" },
};
import { Sparkle } from "./illustrations";

const MARQUEE = ["Coba gratis tanpa daftar", "Bayar setelah jadi", "Aktif selamanya", "Tema adat Jawa & Sunda", "Lukisan & ilustrasi AI", "Animasi pembuka", "Link nama per tamu", "RSVP & buku ucapan", "Amplop digital", "Edit dari HP"];

/** Delay for the CSS entrance animations (`.rk-enter`, `.rk-lift`). */
const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** One headline word that comes into focus on first paint (no JavaScript needed). */
function Word({ children, at, italic = false }: { children: ReactNode; at: number; italic?: boolean }) {
  return (
    <span style={delay(at)} className={`rk-enter mr-[0.22em] inline-block last:mr-0 ${italic ? "italic text-[#e8d5b5]" : ""}`}>
      {children}
    </span>
  );
}

export type HeroCopy = {
  /** Small pill above the title. */
  badge: string;
  /** Two lines; the second is set in italic gold. */
  title: [string, string];
  lead: string;
  /** Anchor or URL for the secondary button. */
  themesHref: string;
  themesLabel: string;
};

const HOME_COPY = (priceFrom: string): HeroCopy => ({
  badge: `Nikah · Ulang tahun · Khitanan · mulai ${priceFrom}`,
  title: ["Setiap momen", "layak dirayakan."],
  lead: "Undangan digital yang gampang dibuat, bebas kamu atur sendiri dari HP, dan dikirim ke setiap tamu dengan namanya. Coba dulu gratis, bayar saat siap disebar.",
  themesHref: "#tema",
  themesLabel: "Lihat tema",
});

/**
 * Landing hero: cinematic photo with a slow zoom, a hand-drawn curve, headline
 * on the left and the sample invitation on a laptop and a phone on the right.
 * Rendered on the server; only the device toggle is interactive.
 */
export function Hero({
  tryHref,
  consultHref,
  priceFrom,
  copy = HOME_COPY(priceFrom),
  devices = HOME_DEVICES,
}: {
  tryHref: string;
  consultHref: string;
  priceFrom: string;
  copy?: HeroCopy;
  devices?: HeroDevicesProps;
}) {
  let word = 0;
  const words = (line: string, italic: boolean) => line.split(" ").map((w) => <Word key={`${w}-${word}`} at={0.08 + 0.07 * word++} italic={italic}>{w}</Word>);
  return (
    <section className="relative isolate overflow-hidden bg-[#15110e] text-white">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <picture>
          <source media="(min-width: 768px)" srcSet="/landing/hero-bg.webp" />
          <img src="/landing/hero-bg-mobile.webp" alt="" fetchPriority="high" decoding="async" className="rk-kenburns h-full w-full object-cover" />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,13,10,0.88)_0%,rgba(18,13,10,0.5)_45%,rgba(18,13,10,0.2)_100%)] max-md:bg-[linear-gradient(180deg,rgba(18,13,10,0.75)_0%,rgba(18,13,10,0.55)_50%,rgba(18,13,10,0.85)_100%)]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#15110e] to-transparent" />
      </div>

      {/* hand-drawn curve behind the devices (draws itself once) */}
      <svg viewBox="0 0 560 800" className="pointer-events-none absolute right-0 top-0 -z-[5] hidden h-[86%] max-h-[900px] w-auto overflow-visible text-[#e8d5b5] md:block" aria-hidden="true">
        <path d="M 590 30 C 390 190, 62 410, 37 600 C 17 760, 300 790, 590 610" fill="none" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.55" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="rk-draw" />
        <path d="M 590 80 C 410 225, 98 432, 75 600 C 57 728, 300 752, 590 576" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="2 7" vectorEffect="non-scaling-stroke" />
      </svg>
      <Sparkle className="rk-twinkle pointer-events-none absolute left-[46%] top-[22%] hidden h-5 w-5 text-[#e8d5b5] md:block" />
      <Sparkle className="rk-twinkle pointer-events-none absolute right-[14%] top-[66%] hidden h-4 w-4 text-[#e8d5b5] [animation-delay:1.5s] md:block" />

      <div className="mx-auto grid min-h-[100svh] max-w-[1240px] items-center gap-10 px-5 pb-28 pt-28 sm:px-8 md:grid-cols-[1fr_1.05fr] md:gap-6 md:pt-24">
        <div>
          <span style={delay(0)} className="rk-lift inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 text-[12px] text-white/80">
            <span className="text-[#e8d5b5]">✦</span> {copy.badge}
          </span>
          <h1 className="mt-6 font-rk-display text-[clamp(50px,6.6vw,94px)] font-light leading-[0.98] tracking-[-0.03em]">
            {words(copy.title[0], false)}
            <br />
            {words(copy.title[1], true)}
          </h1>
          {/* No fade on the lead text: it is often the largest text on phones (LCP), so it shows on first paint. */}
          <div style={delay(0.25)} className="rk-lift">
            <p className="mt-6 max-w-[500px] text-[16px] leading-relaxed text-white/75 sm:text-[17px]">{copy.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={tryHref} prefetch={false} className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#f3eadb] px-7 text-[15px] font-semibold text-rk-ink transition hover:bg-white">
                Coba gratis sekarang <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a href={copy.themesHref} className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/[0.04] px-7 text-[15px] font-semibold transition hover:border-white/60">
                {copy.themesLabel}
              </a>
            </div>
            <p className="mt-5 text-[13px] text-white/55">
              Sudah punya konsep sendiri?{" "}
              <a href={consultHref} target="_blank" rel="noreferrer" className="text-white/85 underline underline-offset-4">
                Konsultasi gratis
              </a>
            </p>
          </div>
        </div>

        <div style={delay(0.15)} className="rk-lift mx-auto w-full max-w-[600px]">
          <HeroDevices {...devices} />
        </div>
      </div>

      {/* feature ticker */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/10 py-4 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="rk-marquee flex w-max gap-10 whitespace-nowrap text-[13px] text-white/60" aria-hidden="true">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t} <span className="text-[#e8d5b5]/60">✦</span>
            </span>
          ))}
        </div>
        <p className="sr-only">{MARQUEE.join(", ")}</p>
      </div>
    </section>
  );
}
