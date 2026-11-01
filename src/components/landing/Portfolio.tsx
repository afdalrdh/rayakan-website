"use client";

import { ArrowUpRight, CalendarDays, MapPin, Palette, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PortfolioItem } from "@/lib/portfolio";

const EASE = [0.22, 1, 0.36, 1] as const;

const longDate = (iso: string) => new Date(`${iso}T00:00:00+07:00`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });

export interface PortfolioCard extends PortfolioItem {
  themeName: string;
  /** WhatsApp/Instagram link to order this theme. */
  orderHref: string;
}

/** Grid of weddings; a card opens a detail popup (no live site is loaded). */
export function PortfolioGrid({ items, className = "" }: { items: PortfolioCard[]; className?: string }) {
  const [open, setOpen] = useState<PortfolioCard | null>(null);

  return (
    <>
      <div className={`grid gap-5 sm:grid-cols-2 ${items.length > 2 ? "lg:grid-cols-3" : ""} ${className}`}>
        {items.map((p, i) => (
          <motion.button
            key={p.id}
            type="button"
            onClick={() => setOpen(p)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            className={`group relative block aspect-[4/5] overflow-hidden rounded-[28px] text-left ${items.length > 2 ? "" : "sm:aspect-[4/3]"}`}
          >
            <Image src={p.cover} alt={p.couple} fill sizes="(min-width: 1024px) 600px, (min-width: 640px) 50vw, 92vw" className="object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04]" />
            <span className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-6">
              <span className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-white backdrop-blur-md">Tema {p.themeName}</span>
              <span className="block font-rk-display text-[36px] font-light leading-none tracking-[-0.02em] text-white">{p.couple}</span>
              <span className="mt-2 flex items-center justify-between gap-3 text-[13px] text-white/75">
                {longDate(p.date)} · {p.city}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-rk-ink transition group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </span>
            </span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>{open && <PortfolioModal item={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </>
  );
}

function PortfolioModal({ item: p, onClose }: { item: PortfolioCard; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Tutup" onClick={onClose} className="absolute inset-0 bg-[#1d1714]/55 backdrop-blur-sm" />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={p.couple}
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative max-h-[92dvh] w-full max-w-[980px] overflow-y-auto rounded-t-[28px] bg-rk-paper text-rk-ink shadow-2xl sm:rounded-[28px]"
      >
        <button type="button" onClick={onClose} aria-label="Tutup" className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm">
          <X className="h-5 w-5" />
        </button>
        <div className="grid md:grid-cols-[1.15fr_1fr]">
          {/* previews: laptop centred in the pane, phone tucked into its lower-right corner */}
          <div className="relative flex items-center justify-center overflow-hidden bg-[#1d1714] px-6 py-10 sm:px-10 md:min-h-[480px] md:rounded-l-[28px]">
            <Image src={p.cover} alt="" fill sizes="560px" className="scale-110 object-cover opacity-40 blur-[6px]" />
            <div className="relative w-full max-w-[470px] pb-[9%] pr-[9%]">
              <div className="overflow-hidden rounded-[10px] bg-[#211b19] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
                <div className="flex h-6 items-center gap-1.5 px-3">
                  <span className="h-2 w-2 rounded-full bg-[#ec6a5e]" />
                  <span className="h-2 w-2 rounded-full bg-[#f4bf4f]" />
                  <span className="h-2 w-2 rounded-full bg-[#61c554]" />
                </div>
                <div className="relative aspect-[16/10]">
                  <Image src={p.desktop} alt={`Undangan ${p.couple} di laptop`} fill unoptimized className="object-cover object-top" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-[27%] rounded-[16px] bg-[#0d0b0a] p-[4px] shadow-[0_30px_50px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
                <div className="relative aspect-[390/844] overflow-hidden rounded-[12px]">
                  <Image src={p.mobile} alt={`Undangan ${p.couple} di HP`} fill unoptimized className="object-cover object-top" />
                </div>
              </div>
            </div>
          </div>

          {/* details */}
          <div className="flex flex-col p-6 sm:p-8">
            <p className="text-[12px] font-semibold uppercase tracking-[3px] text-rk-bronze">The wedding of</p>
            <h3 className="mt-3 font-rk-display text-[clamp(38px,5vw,52px)] font-light leading-none tracking-[-0.02em]">{p.couple}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-rk-ink/70">{p.note}</p>
            <dl className="mt-6 divide-y divide-rk-line border-y border-rk-line text-[14px]">
              <div className="flex items-center gap-3 py-3">
                <CalendarDays className="h-4 w-4 shrink-0 text-rk-bronze" />
                <dt className="sr-only">Tanggal</dt>
                <dd>{longDate(p.date)}</dd>
              </div>
              <div className="flex items-center gap-3 py-3">
                <MapPin className="h-4 w-4 shrink-0 text-rk-bronze" />
                <dt className="sr-only">Lokasi</dt>
                <dd>
                  {p.venue}, {p.city}
                </dd>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Palette className="h-4 w-4 shrink-0 text-rk-bronze" />
                <dt className="sr-only">Tema</dt>
                <dd>
                  Tema {p.themeName} · warna {p.palette}
                </dd>
              </div>
            </dl>
            <div className="mt-auto grid gap-2.5 pt-8 sm:grid-cols-2">
              <Link href={`/tema/${p.theme}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-rk-ink/15 bg-white px-5 text-[14px] font-semibold transition hover:border-rk-ink/40">
                Lihat contoh tema
              </Link>
              <a href={p.orderHref} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rk-ink px-5 text-[14px] font-semibold text-white transition hover:bg-rk-plum">
                Pakai tema ini
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
