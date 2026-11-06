"use client";

import { ArrowRight, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { OCCASION_IDS, OCCASIONS, THEME_IDS, THEME_TAGS, THEMES, type Occasion, type ThemeTag } from "@/lib/content";

/**
 * Theme catalogue with event + style filters (landing page and /buat).
 * `onPick` turns the cards into a picker instead of links.
 */
export function ThemeCatalog({ initialOccasion = "semua", onPick, compact = false }: { initialOccasion?: Occasion | "semua"; onPick?: (id: (typeof THEME_IDS)[number]) => void; compact?: boolean }) {
  const [occasion, setOccasion] = useState<Occasion | "semua">(initialOccasion);
  const [tag, setTag] = useState<ThemeTag | "semua">("semua");
  // On phones the full grid is long: show 6 first, the rest on request.
  const [all, setAll] = useState(compact);
  const list = useMemo(() => THEME_IDS.filter((id) => (occasion === "semua" || THEMES[id].occasion === occasion) && (tag === "semua" || THEMES[id].tags.includes(tag))), [occasion, tag]);
  const count = (o: Occasion | "semua") => THEME_IDS.filter((id) => o === "semua" || THEMES[id].occasion === o).length;
  const tags = THEME_TAGS.filter((t) => THEME_IDS.some((id) => (occasion === "semua" || THEMES[id].occasion === occasion) && THEMES[id].tags.includes(t)));

  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {(["semua", ...OCCASION_IDS] as const).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => {
              setOccasion(o);
              setTag("semua");
            }}
            className={`flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold transition ${occasion === o ? "bg-rk-ink text-white" : "border border-rk-ink/12 bg-white text-rk-ink/70 hover:text-rk-ink"}`}
          >
            {o === "semua" ? "Semua acara" : OCCASIONS[o].name}
            <span className={`rounded-full px-1.5 text-[11px] ${occasion === o ? "bg-white/20" : "bg-rk-cream"}`}>{count(o)}</span>
          </button>
        ))}
      </div>
      {tags.length > 1 && (
        <div className="no-scrollbar -mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {(["semua", ...tags] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTag(t)} className={`h-8 shrink-0 rounded-full px-3.5 text-[12.5px] font-medium transition ${tag === t ? "bg-rk-bronze text-white" : "text-rk-ink/60 hover:text-rk-ink"}`}>
              {t === "semua" ? "Semua gaya" : t}
            </button>
          ))}
        </div>
      )}

      <div className={`mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 md:grid-cols-3 ${compact ? "" : "lg:grid-cols-4"}`}>
        {list.map((id, i) => {
          const t = THEMES[id];
          const phone = (
            <span className="relative mx-auto block aspect-[390/800] w-full max-w-[250px] rounded-[26px] bg-[#0d0b0a] p-[5px] shadow-[0_26px_44px_-26px_rgba(60,40,20,0.75)] transition duration-500 group-hover:-translate-y-1.5 sm:rounded-[32px] sm:p-[6px]">
              <span className="relative block h-full w-full overflow-hidden rounded-[21px] bg-rk-cream sm:rounded-[26px]">
                <Image src={t.preview.mobile} alt={`Tema ${t.name}`} fill unoptimized sizes="250px" className="object-cover object-top transition duration-[1400ms] ease-out group-hover:scale-[1.03]" />
              </span>
              {t.badge && <span className="absolute left-3 top-3 rounded-full bg-rk-gold px-2.5 py-0.5 text-[10.5px] font-bold text-rk-ink shadow">{t.badge}</span>}
              <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10.5px] font-bold text-rk-ink shadow backdrop-blur">{OCCASIONS[t.occasion].name}</span>
            </span>
          );
          return (
            <div key={id} className={`group flex-col ${!all && i >= 6 ? "hidden sm:flex" : "flex"}`}>
              {onPick ? (
                <button type="button" onClick={() => onPick(id)} className="block text-left" aria-label={`Pilih tema ${t.name}`}>
                  {phone}
                </button>
              ) : (
                <Link prefetch={false} href={`/tema/${id}`} className="block" aria-label={`Lihat contoh tema ${t.name}`}>
                  {phone}
                </Link>
              )}
              <div className="mx-auto mt-4 flex w-full max-w-[250px] flex-1 flex-col">
                <p className="font-rk-display text-[23px] font-light leading-tight tracking-[-0.01em] sm:text-[26px]">{t.name}</p>
                <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-rk-mute">{t.tagline}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.tags.map((g) => (
                    <span key={g} className="rounded-full bg-rk-cream px-2 py-0.5 text-[10.5px] font-semibold text-rk-bronze">
                      {g}
                    </span>
                  ))}
                </div>
                <div className="mt-auto grid grid-cols-2 gap-1.5 pt-3.5">
                  <Link prefetch={false} href={`/tema/${id}`} className="inline-flex h-9 items-center justify-center gap-1 rounded-full border border-rk-ink/15 bg-white text-[12.5px] font-semibold transition hover:border-rk-ink/40">
                    <Eye className="h-3.5 w-3.5" /> Lihat
                  </Link>
                  {onPick ? (
                    <button type="button" onClick={() => onPick(id)} className="inline-flex h-9 items-center justify-center gap-1 rounded-full bg-rk-ink text-[12.5px] font-semibold text-white transition hover:bg-rk-plum">
                      Pakai <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <Link prefetch={false} href={`/buat?tema=${id}`} className="inline-flex h-9 items-center justify-center gap-1 rounded-full bg-rk-ink text-[12.5px] font-semibold text-white transition hover:bg-rk-plum">
                      Pakai <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!all && list.length > 6 && (
        <div className="mt-8 text-center sm:hidden">
          <button type="button" onClick={() => setAll(true)} className="inline-flex h-11 items-center rounded-full border border-rk-ink/15 bg-white px-5 text-[14px] font-semibold">
            Tampilkan {list.length - 6} tema lainnya
          </button>
        </div>
      )}
      {list.length === 0 && <p className="mt-10 text-center text-[14px] text-rk-mute">Belum ada tema untuk pilihan ini. Coba gaya lain, ya.</p>}
    </div>
  );
}
