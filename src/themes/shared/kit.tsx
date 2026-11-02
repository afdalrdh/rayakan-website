"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { SECTION_ANCHORS, type Person, type SectionKey } from "@/lib/content";
import { Block } from "./Block";
import { Img, useFontPair, useShowEmpty, useTheme } from "./context";
import { useNavLinks, useWishes, type Wish } from "./hooks";
import { ArrowDownIcon, ArrowUpRightIcon, CloseIcon, InstagramIcon, MenuIcon } from "./icons";
import { CoupleLogo } from "./Logo";
import { VideoEmbed } from "./Video";

/* ------------------------------------------------------------------ */
/* Text placeholders                                                   */
/* ------------------------------------------------------------------ */

/**
 * A text value, or — in the editor and previews only — a dashed placeholder
 * that names the empty field, so clients see at a glance what is missing.
 */
export function T({ v, ph }: { v: string | undefined; ph: string }) {
  const showEmpty = useShowEmpty();
  if (v && v.trim()) return <>{v}</>;
  if (!showEmpty) return null;
  return (
    <span className="inline-flex max-w-full items-center gap-[0.35em] rounded-[0.35em] border border-dashed border-current px-[0.45em] py-[0.05em] align-middle text-[0.75em] not-italic leading-tight opacity-60" style={{ fontFamily: "inherit" }}>
      <svg viewBox="0 0 24 24" className="h-[0.9em] w-[0.9em] shrink-0" fill="none" aria-hidden>
        <path d="M4 20h4L19 9l-4-4L4 16v4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <span className="truncate">{ph}</span>
    </span>
  );
}

/** True when a text should be rendered: it has content, or we are in the editor. */
export function useHas() {
  const showEmpty = useShowEmpty();
  return (v: string | undefined) => !!(v && v.trim()) || showEmpty;
}

/* ------------------------------------------------------------------ */
/* Section frame & heading                                             */
/* ------------------------------------------------------------------ */

export const CONTAINER = "mx-auto w-full max-w-[1120px]";

/** Every section: same anchor, padding and background rules. */
export function Section({ block, tone = "bg", className = "", pad = true, children, sectionRef, style }: { block: SectionKey; tone?: "bg" | "alt" | "none"; className?: string; pad?: boolean; children: ReactNode; sectionRef?: React.Ref<HTMLElement>; style?: React.CSSProperties }) {
  const colors = tone === "none" ? "" : tone === "alt" ? "bg-t-alt text-t-fg" : "bg-t-bg text-t-fg";
  return (
    <Block id={block}>
      <section ref={sectionRef} style={style} id={SECTION_ANCHORS[block]} className={`relative ${colors} ${pad ? "px-5 py-20 md:px-8 md:py-28 lg:py-32" : ""} ${className}`}>
        {children}
      </section>
    </Block>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[12px] font-medium uppercase leading-none tracking-[0.24em] text-t-muted md:text-[13px] ${className}`}>{children}</p>;
}

export function Rule({ center = true, className = "" }: { center?: boolean; className?: string }) {
  return <div className={`h-px w-12 bg-t-muted/50 ${center ? "mx-auto" : ""} ${className}`} />;
}

/** One heading style for every layout: eyebrow, title, short rule, optional intro. */
export function Heading({ eyebrow, title, body, align = "center", className = "", phTitle = "Judul bagian" }: { eyebrow?: string; title?: string; body?: string; align?: "center" | "left"; className?: string; phTitle?: string }) {
  const has = useHas();
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : "text-left"} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {has(title) && (
        <h2 className={`t-head mt-4 text-[34px] leading-[1.08] text-t-accent sm:text-[42px] md:mt-5 md:text-[52px] ${center ? "mx-auto max-w-[760px]" : "max-w-[760px]"}`}>
          <T v={title} ph={phTitle} />
        </h2>
      )}
      <Rule center={center} className="mt-6 md:mt-7" />
      {body && <p className={`mt-6 max-w-[640px] text-[15px] leading-[1.75] text-t-fg2 md:mt-7 md:text-[16px] ${center ? "mx-auto" : ""}`}>{body}</p>}
    </div>
  );
}

/** Soft fade-up when a block scrolls into view. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { mode } = useTheme();
  if (mode === "thumb") return <div className={className}>{children}</div>;
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.75, delay }} className={className}>
      {children}
    </motion.div>
  );
}

/** Small diamond ornament between two hairlines. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-t-muted ${className}`} aria-hidden>
      <span className="h-px w-14 bg-current opacity-50" />
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="currentColor">
        <path d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z" />
      </svg>
      <span className="h-px w-14 bg-current opacity-50" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero helpers                                                        */
/* ------------------------------------------------------------------ */

/** Shrinks the couple names when they are longer than the layout + font pair were designed for. */
export function useNameFit(designedFor: number) {
  const { content: c } = useTheme();
  const pair = useFontPair();
  const first = c.hero.firstName.trim() || "Nama";
  const second = c.hero.secondName.trim() || "Nama";
  const longest = Math.max(first.length, second.length);
  const fit = designedFor * (pair.fit / 7);
  return { first, second, k: Math.min(1, fit / Math.max(longest, 1)) };
}

/** Hero photo for laptop and phone, with skeleton placeholders when empty. */
export function HeroPhoto({ className = "object-cover object-center", overlay = true }: { className?: string; overlay?: boolean }) {
  const { content: c } = useTheme();
  const h = c.hero;
  const alt = `${h.firstName} dan ${h.secondName}`;
  return (
    <>
      <div className="absolute inset-0 z-0 hidden md:block">
        {h.imageDesktop ? <Img src={h.imageDesktop} alt={alt} fill priority quality={90} sizes="100vw" className={className} /> : <EmptyPhotoDark label="Foto utama untuk laptop belum diisi" />}
      </div>
      <div className="absolute inset-0 z-0 md:hidden">
        {h.imageMobile ? <Img src={h.imageMobile} alt={alt} fill priority quality={90} sizes="(max-width: 767px) 180vh, 100vw" className={className} /> : <EmptyPhotoDark label="Foto utama untuk HP belum diisi" />}
      </div>
      {overlay && <div className="absolute inset-0 z-[5] bg-black/20" />}
    </>
  );
}

/** Skeleton on the dark hero background (text on top of it is white). */
function EmptyPhotoDark({ label }: { label: string }) {
  const { mode } = useTheme();
  if (mode === "live") return null;
  return (
    <div className="t-skeleton absolute inset-0 flex items-end justify-center bg-neutral-800 pb-[22%] text-white/60">
      <span className="rounded-full border border-dashed border-white/40 px-3 py-1.5 font-sans text-[12px]">{label}</span>
    </div>
  );
}

/**
 * Header (logo, links, "Kehadiran"), phone menu, and the scroll link at the
 * bottom of the hero. `tone` = "photo" for white text on a photo, "theme" for
 * text in theme colours on a plain background.
 */
export function HeroChrome({ tone = "photo", scroll = true }: { tone?: "photo" | "theme"; scroll?: boolean }) {
  const { content: c, mode } = useTheme();
  const [open, setOpen] = useState(false);
  const nav = useNavLinks();
  const onPhoto = tone === "photo";
  const ink = onPhoto ? "text-white" : "text-t-fg";
  return (
    <>
      {mode === "live" && (
        <div className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-10 px-8 transition-all duration-300 md:hidden ${onPhoto ? "bg-neutral-950/95 text-white" : "bg-t-bg/95 text-t-fg"} ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!open}>
          <button type="button" aria-label="Tutup navigasi" onClick={() => setOpen(false)} className="absolute right-6 top-7 flex h-10 w-10 items-center justify-center">
            <CloseIcon size={26} />
          </button>
          <nav className="flex flex-col items-center gap-7">
            {nav.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-[22px] leading-none transition-opacity hover:opacity-75">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
      <header className={`absolute inset-x-0 top-0 z-50 px-6 pt-6 sm:px-10 md:px-12 md:pt-8 ${ink}`}>
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between">
          <a href="#welcome" aria-label="Beranda" className="block">
            <CoupleLogo tone={onPhoto ? "light" : "dark"} className="h-auto w-[44px] md:w-[52px]" />
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {nav.map((l) => (
              <a key={l.href} href={l.href} className="text-[16px] leading-none opacity-90 transition-opacity hover:opacity-100">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3 md:gap-0">
            {!c.hidden.includes("rsvp") && (
              <a href="#rsvp" className={`rounded-[10px] border px-4 py-2 text-[14px] leading-none transition-colors md:px-6 md:py-2.5 md:text-[15px] ${onPhoto ? "border-white/75 bg-black/15 hover:bg-white hover:text-neutral-950" : "border-t-accent/50 hover:bg-t-accent hover:text-t-on-accent"}`}>
                Kehadiran
              </a>
            )}
            <button type="button" aria-label="Buka navigasi" onClick={() => setOpen(true)} className="flex h-9 w-9 items-center justify-center md:hidden">
              <MenuIcon />
            </button>
          </div>
        </nav>
      </header>
      {scroll && <ScrollLink tone={tone} />}
    </>
  );
}

export function ScrollLink({ tone = "photo" }: { tone?: "photo" | "theme" }) {
  const { content: c } = useTheme();
  const onPhoto = tone === "photo";
  return (
    <a href="#invitation" className={`absolute inset-x-0 bottom-0 z-50 border-t ${onPhoto ? "border-white/30 text-white" : "border-t-line text-t-fg"}`}>
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-6 sm:px-10 md:h-20 md:px-12">
        <ArrowDownIcon className="h-5 w-4 shrink-0 animate-float-subtle" />
        <span className="text-[13px] leading-none tracking-wide sm:text-[14px] md:text-[16px]">{c.hero.scrollLabel}</span>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Couple helpers                                                      */
/* ------------------------------------------------------------------ */

/** Bismillah, invitation line, optional video and quote — shared by every couple layout. */
export function CoupleIntro({ showQuote = true, className = "" }: { showQuote?: boolean; className?: string }) {
  const { content: c, mode } = useTheme();
  const has = useHas();
  const cp = c.couple;
  // Layout thumbnails only need the part that differs between layouts: the profiles.
  if (mode === "thumb") return null;
  return (
    <div className={`mx-auto max-w-[1000px] text-center ${className}`}>
      {cp.showBismillah && (
        <div
          role="img"
          aria-label="Bismillahirrahmanirrahim"
          className="mx-auto aspect-[306/64] w-[220px] bg-t-accent sm:w-[260px] md:w-[300px]"
          style={{ mask: "url(/themes/shared/bismillah.svg) center / contain no-repeat", WebkitMask: "url(/themes/shared/bismillah.svg) center / contain no-repeat" }}
        />
      )}
      {has(cp.headline) && (
        <h2 className="t-head mx-auto mt-8 max-w-[820px] px-2 text-[22px] italic leading-[1.3] text-t-accent sm:text-[28px] md:mt-10 md:text-[34px]">
          <T v={cp.headline} ph="Kalimat undangan" />
        </h2>
      )}
      <Rule className="mt-8 md:mt-10" />
      {cp.videoUrl && <VideoEmbed url={cp.videoUrl} thumb={cp.videoThumb} title={`Video ${c.hero.firstName} & ${c.hero.secondName}`} className="mx-auto mt-10 max-w-[960px] overflow-hidden rounded-[18px] md:mt-14" />}
      {showQuote && has(cp.quote) && (
        <p className="mx-auto mt-10 max-w-[760px] text-[14px] leading-[1.75] text-t-fg2 md:mt-12 md:text-[16px] md:leading-[1.8]">
          <T v={cp.quote} ph="Ayat atau kutipan" />
        </p>
      )}
    </div>
  );
}

export function Instagram({ p, className = "" }: { p: Person; className?: string }) {
  const handle = p.instagram.replace(/^@/, "").trim();
  if (!handle) return null;
  return (
    <a href={`https://instagram.com/${handle}`} target="_blank" rel="noreferrer" className={`inline-flex w-fit items-center gap-1.5 rounded-full border border-t-line bg-t-input px-3 py-1.5 text-[12px] font-medium leading-none text-t-fg transition hover:border-t-accent ${className}`}>
      <InstagramIcon size={13} />@{handle}
    </a>
  );
}

/** Full name + parents, with placeholders. */
export function PersonText({ p, which, nameClass = "", parentsClass = "" }: { p: Person; which: 1 | 2; nameClass?: string; parentsClass?: string }) {
  const has = useHas();
  return (
    <>
      <h3 className={`t-head leading-[1.2] text-t-accent ${nameClass}`}>
        <T v={p.fullName} ph={`Nama lengkap mempelai ${which}`} />
      </h3>
      {has(p.parents) && (
        <p className={`leading-[1.6] text-t-fg2 ${parentsClass}`}>
          <T v={p.parents} ph="Keterangan orang tua" />
        </p>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Venue helpers                                                       */
/* ------------------------------------------------------------------ */

export function MapsButton({ className = "" }: { className?: string }) {
  const { content: c } = useTheme();
  if (!c.venue.mapsUrl) return null;
  return (
    <a href={c.venue.mapsUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center justify-center gap-2.5 rounded-[12px] bg-t-accent px-6 py-3.5 text-[14px] font-semibold leading-none text-t-on-accent transition hover:brightness-95 ${className}`}>
      Lihat di Maps <ArrowUpRightIcon size={17} />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* RSVP helpers                                                        */
/* ------------------------------------------------------------------ */

const inputCls = "h-[50px] w-full rounded-[12px] border border-t-line bg-t-input px-4 text-[15px] text-t-fg outline-none transition placeholder:text-t-fg2/60 focus:border-t-accent";
const labelCls = "mb-2 block text-[12px] font-semibold uppercase tracking-[1px] text-t-fg2";

export type WishesState = ReturnType<typeof useWishes>;

/** The RSVP form fields + submit button (all layouts use the same form). */
export function RsvpFields({ w }: { w: WishesState }) {
  const { content: c } = useTheme();
  return (
    <form onSubmit={w.submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Nama</span>
          <input value={w.form.name} onChange={(e) => w.set("name", e.target.value)} required maxLength={80} placeholder="Nama Anda" className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Kehadiran</span>
          <div className="relative">
            <select value={w.form.attendance} onChange={(e) => w.set("attendance", e.target.value as Wish["attendance"])} className={`${inputCls} cursor-pointer appearance-none pr-10`}>
              <option value="Hadir">Hadir</option>
              <option value="Tidak Hadir">Tidak Hadir</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-t-fg2" aria-hidden />
          </div>
        </label>
      </div>
      {c.rsvp.askCity && (
        <label className="mt-4 block">
          <span className={labelCls}>Kota / Domisili</span>
          <input value={w.form.location} onChange={(e) => w.set("location", e.target.value)} maxLength={80} placeholder="Kota atau domisili Anda" className={inputCls} />
        </label>
      )}
      <label className="mt-4 block">
        <span className={labelCls}>Ucapan atau Doa</span>
        <textarea value={w.form.message} onChange={(e) => w.set("message", e.target.value)} required maxLength={600} rows={3} placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..." className={`${inputCls} h-auto min-h-[96px] resize-none py-3 leading-relaxed`} />
      </label>
      {w.status && <p className={`mt-4 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold ${w.status.ok ? "bg-emerald-500/12 text-emerald-600" : "bg-red-500/12 text-red-600"}`}>{w.status.text}</p>}
      <button type="submit" disabled={w.busy} className="mt-6 h-[52px] w-full rounded-[12px] bg-t-accent text-[14px] font-bold uppercase tracking-[2px] text-t-on-accent transition hover:brightness-95 disabled:opacity-50">
        {w.busy ? "Mengirim..." : "Kirim Ucapan"}
      </button>
    </form>
  );
}

export function WishStats({ w }: { w: WishesState }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full bg-emerald-500/12 px-3 py-1 text-[12px] font-semibold text-emerald-600">{w.stats.present} Hadir</span>
      <span className="rounded-full border border-t-line bg-t-input px-3 py-1 text-[12px] font-semibold text-t-fg2">{w.stats.total} Ucapan</span>
    </div>
  );
}

export function WishCard({ x }: { x: Wish }) {
  const { content: c } = useTheme();
  return (
    <article className="rounded-[16px] border border-t-line bg-t-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="t-head text-[17px] text-t-accent">{x.name}</h4>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none ${x.attendance === "Hadir" ? "bg-emerald-500/12 text-emerald-600" : "bg-t-input text-t-fg2"}`}>{x.attendance}</span>
      </div>
      {c.rsvp.askCity && x.location && <p className="mt-1 text-[12px] text-t-fg2">{x.location}</p>}
      <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-t-fg">{x.message}</p>
    </article>
  );
}

export function WishEmpty() {
  return <p className="rounded-[14px] border border-t-line bg-t-card px-5 py-4 text-[14px] text-t-fg2">Belum ada ucapan. Jadilah yang pertama memberikan doa restu!</p>;
}

export function MoreWishes({ w }: { w: WishesState }) {
  if (!w.hasMore) return null;
  return (
    <button type="button" onClick={w.loadMore} className="mt-5 w-full rounded-[12px] border border-t-line py-3 text-[13px] font-semibold text-t-fg2 hover:bg-t-input">
      Muat ucapan lainnya
    </button>
  );
}
