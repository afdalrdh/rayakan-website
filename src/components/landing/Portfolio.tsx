"use client";

import { ArrowUpRight, CalendarDays, MapPin, Palette, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PortfolioItem } from "@/lib/portfolio";
import { DeviceDuo, DuoStage } from "./DeviceDuo";
import { Reveal } from "./Reveal";

const longDate = (iso: string) => new Date(`${iso}T00:00:00+07:00`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });

export interface PortfolioCard extends PortfolioItem {
  themeName: string;
  /** WhatsApp/Instagram link to order this theme. */
  orderHref: string;
}

/**
 * Weddings shown as phones displaying each site's opening screen, so visitors
 * see right away how it looks on mobile. Tapping one opens a detail popup
 * (no live site is loaded). `fillTo` pads the row with "your turn" slots.
 */
export function PortfolioGrid({ items, className = "", fillTo = 0, ctaHref }: { items: PortfolioCard[]; className?: string; fillTo?: number; ctaHref?: string }) {
  const [open, setOpen] = useState<PortfolioCard | null>(null);
  const empty = Math.max(0, fillTo - items.length);

  return (
    <>
      <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 ${className}`}>
        {items.map((p, i) => (
          <Reveal key={p.id} delay={i * 100} className="group">
            <button type="button" onClick={() => setOpen(p)} className="block w-full text-left" aria-label={`Detail undangan ${p.couple}`}>
              <span className="relative mx-auto block aspect-[390/844] w-full max-w-[260px] rounded-[30px] bg-[#0d0b0a] p-[5px] shadow-[0_30px_50px_-28px_rgba(60,40,20,0.7)] transition duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_40px_60px_-28px_rgba(60,40,20,0.75)] sm:rounded-[36px] sm:p-[6px]">
                <span className="rk-shimmer relative block h-full w-full overflow-hidden rounded-[25px] sm:rounded-[30px]">
                  <Image src={p.mobile} alt={`Undangan ${p.couple} di HP`} fill sizes="(min-width: 1024px) 260px, 45vw" className="object-cover object-top transition duration-[1200ms] ease-out group-hover:scale-[1.04]" />
                </span>
                <span className="absolute -right-2 bottom-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-rk-ink shadow-lg transition group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </span>
              <span className="mx-auto mt-5 block max-w-[260px]">
                <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-rk-bronze">Tema {p.themeName}</span>
                <span className="mt-1 block font-rk-display text-[26px] font-light leading-tight tracking-[-0.02em] sm:text-[30px]">{p.couple}</span>
                <span className="mt-1 block text-[13px] text-rk-mute">
                  {longDate(p.date)} · {p.city}
                </span>
              </span>
            </button>
            {p.liveUrl && (
              <span className="mx-auto block max-w-[260px]">
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-rk-ink px-4 text-[12.5px] font-semibold text-white transition hover:bg-rk-plum">
                  Lihat website <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </span>
            )}
          </Reveal>
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <Reveal key={`empty-${i}`} delay={(items.length + i) * 100}>
            <CtaLink href={ctaHref ?? "/buat"} className="group block">
            <span className="mx-auto flex aspect-[390/844] w-full max-w-[260px] flex-col items-center justify-center gap-3 rounded-[30px] border-2 border-dashed border-rk-bronze/30 bg-white/40 p-5 text-center transition duration-500 group-hover:-translate-y-2 group-hover:border-rk-bronze/60 sm:rounded-[36px]">
              <span className="font-rk-display text-[40px] font-light italic leading-none text-rk-bronze/70">{items.length + i + 1}</span>
              <span className="font-rk-display text-[22px] font-light leading-tight">Momen kalian berikutnya</span>
              <span className="text-[12px] text-rk-mute">Ketuk untuk coba gratis</span>
            </span>
            </CtaLink>
          </Reveal>
        ))}
      </div>
      {open && <PortfolioModal item={open} onClose={() => setOpen(null)} />}
    </>
  );
}

/** Internal links stay in the app; WhatsApp/Instagram links open in a new tab. */
function CtaLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} prefetch={false} className={className}>
      {children}
    </Link>
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
    <div className="rk-fade-in fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label="Tutup" onClick={onClose} className="absolute inset-0 bg-[#1d1714]/55 backdrop-blur-sm" />
      <div role="dialog" aria-modal="true" aria-label={p.couple} className="rk-sheet-in relative max-h-[92dvh] w-full max-w-[980px] overflow-y-auto rounded-t-[28px] bg-rk-paper text-rk-ink shadow-2xl sm:rounded-[28px]">
        <button type="button" onClick={onClose} aria-label="Tutup" className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm">
          <X className="h-5 w-5" />
        </button>
        <div className="grid md:grid-cols-[1.15fr_1fr]">
          {/* previews: laptop centred in the pane, phone tucked into its lower-right corner */}
          <DuoStage backdrop={p.cover} className="px-6 py-10 sm:px-10 md:min-h-[480px] md:rounded-l-[28px]">
            <DeviceDuo desktop={p.desktop} mobile={p.mobile} alt={`Undangan ${p.couple}`} />
          </DuoStage>

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
              {p.liveUrl ? (
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-rk-ink/15 bg-white px-5 text-[14px] font-semibold transition hover:border-rk-ink/40">
                  Lihat website <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : (
                <Link href={`/tema/${p.theme}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-rk-ink/15 bg-white px-5 text-[14px] font-semibold transition hover:border-rk-ink/40">
                  Lihat contoh tema
                </Link>
              )}
              <Link href={`/buat?tema=${p.theme}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rk-ink px-5 text-[14px] font-semibold text-white transition hover:bg-rk-plum">
                Pakai tema ini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
