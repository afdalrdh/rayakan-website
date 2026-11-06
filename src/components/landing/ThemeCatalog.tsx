"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { OCCASION_IDS, OCCASIONS, THEME_IDS, THEMES, type Occasion, type ThemeId } from "@/lib/content";

type Filter = Occasion | "semua";

/** Phone frame with the theme's opening screen. */
function ThemePhone({ id }: { id: ThemeId }) {
  const t = THEMES[id];
  return (
    <span className="relative mx-auto block aspect-[390/800] w-full max-w-[250px] rounded-[26px] bg-[#0d0b0a] p-[5px] shadow-[0_26px_44px_-26px_rgba(60,40,20,0.75)] transition duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_34px_54px_-26px_rgba(60,40,20,0.8)] sm:rounded-[32px] sm:p-[6px]">
      <span className="rk-shimmer relative block h-full w-full overflow-hidden rounded-[21px] sm:rounded-[26px]">
        <Image src={t.preview.mobile} alt="" fill sizes="(min-width: 1024px) 250px, (min-width: 768px) 30vw, 45vw" className="object-cover object-top transition duration-[1400ms] ease-out group-hover:scale-[1.03]" />
      </span>
      {/* On phones the action sits on the frame, so the name gets the full width below. */}
      <span aria-hidden className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-rk-ink shadow-md sm:hidden">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </span>
  );
}

/** Name and one-line description under the phone. */
function ThemeCaption({ id, action }: { id: ThemeId; action: string }) {
  const t = THEMES[id];
  return (
    <span className="mx-auto mt-4 flex w-full max-w-[250px] items-start justify-between gap-3">
      <span className="min-w-0">
        <span className="block font-rk-display text-[21px] font-light leading-tight tracking-[-0.01em] sm:text-[25px]">{t.name}</span>
        <span className="mt-1 line-clamp-2 block text-[12.5px] leading-snug text-rk-ink/65">{t.tagline}</span>
      </span>
      <span className="mt-1 hidden h-8 shrink-0 items-center gap-1 rounded-full border border-rk-ink/15 bg-white px-3 text-[12px] font-semibold text-rk-ink transition group-hover:border-rk-ink group-hover:bg-rk-ink group-hover:text-white sm:inline-flex">
        {action} <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </span>
  );
}

/**
 * Theme catalogue for the marketing pages: a filter per occasion and one card
 * per theme. The whole card is a single link to the live sample ("Lihat");
 * choosing a theme happens there, so the grid stays calm.
 */
export function ThemeCatalog({ initialOccasion = "semua" }: { initialOccasion?: Filter }) {
  const [filter, setFilter] = useState<Filter>(initialOccasion);
  const list = THEME_IDS.filter((id) => filter === "semua" || THEMES[id].occasion === filter);

  return (
    <div>
      <div role="tablist" aria-label="Jenis acara" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:justify-center sm:px-0">
        {(["semua", ...OCCASION_IDS] as const).map((o) => (
          <button
            key={o}
            type="button"
            role="tab"
            aria-selected={filter === o}
            onClick={() => setFilter(o)}
            className={`h-10 shrink-0 rounded-full px-5 text-[14px] font-semibold transition ${filter === o ? "bg-rk-ink text-white" : "text-rk-ink/65 hover:bg-white hover:text-rk-ink"}`}
          >
            {o === "semua" ? "Semua" : OCCASIONS[o].name}
          </button>
        ))}
      </div>

      <ul className="mt-9 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {list.map((id) => (
          <li key={id}>
            <Link prefetch={false} href={`/tema/${id}`} className="group block">
              <ThemePhone id={id} />
              <ThemeCaption id={id} action="Lihat" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Picker for the /buat wizard: themes made for the chosen occasion first,
 * then the others (every theme works for every occasion). Tapping picks it.
 */
export function ThemePicker({ occasion, onPick }: { occasion: Occasion; onPick: (id: ThemeId) => void }) {
  const mine = THEME_IDS.filter((id) => THEMES[id].occasion === occasion);
  const others = THEME_IDS.filter((id) => THEMES[id].occasion !== occasion);
  const grid = (ids: ThemeId[]) => (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3">
      {ids.map((id) => (
        <li key={id}>
          <button type="button" onClick={() => onPick(id)} className="group block w-full text-left">
            <ThemePhone id={id} />
            <ThemeCaption id={id} action="Pilih" />
          </button>
        </li>
      ))}
    </ul>
  );
  return (
    <div>
      {grid(mine)}
      {others.length > 0 && (
        <>
          <div className="my-10 flex items-center gap-4">
            <span className="h-px flex-1 bg-rk-line" />
            <span className="text-[13px] font-semibold text-rk-ink/65">Tema lain, bisa juga untuk {OCCASIONS[occasion].name.toLowerCase()}</span>
            <span className="h-px flex-1 bg-rk-line" />
          </div>
          {grid(others)}
        </>
      )}
    </div>
  );
}
