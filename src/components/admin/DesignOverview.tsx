"use client";

import { Check, ExternalLink, Laptop, Paintbrush, Smartphone } from "lucide-react";
import { useState } from "react";
import { BLOCK_LABELS, blockStatus, getFontPair, getPalette, layoutOf, THEMES, type BlockKey, type WeddingContent } from "@/lib/content";
import { Canvas, type Device } from "@/components/editor/canvas/Canvas";
import { btnGhost, card, useAdminSite } from "./ui";

const ORDER_FIXED: BlockKey[] = ["cover", "hero"];

/** True while the site still looks exactly like the theme it started from. */
function isPreset(c: WeddingContent) {
  const t = THEMES[c.theme];
  if (!t) return false;
  const sameStyle = t.style.mode === c.style.mode && t.style.palette === c.style.palette && t.style.fonts === c.style.fonts && !c.style.accent;
  return sameStyle && Object.entries(t.layouts).every(([k, v]) => c.layouts[k as BlockKey] === v);
}

/** Desain Undangan: short live preview + summary, with a button that opens the full editor in a new tab. */
export function DesignOverview({ content: c }: { content: WeddingContent }) {
  const { slug, plan } = useAdminSite();
  const [device, setDevice] = useState<Device>("hp");
  const pal = getPalette(c.style.palette)[c.style.mode];
  const accent = c.style.accent || pal.accent;
  const fonts = getFontPair(c.style.fonts);
  const blocks: BlockKey[] = [...ORDER_FIXED, ...c.order.filter((k) => !c.hidden.includes(k)), "closing"];
  const checks = blocks.map((k) => ({ k, s: blockStatus(c, k) }));
  const complete = checks.filter((x) => x.s.done === x.s.total).length;

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section className={`${card} overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 border-b border-rk-line px-4 py-3">
          <p className="text-[13px] font-bold">Pratinjau</p>
          <div className="flex rounded-full border border-rk-line bg-white p-0.5">
            {(
              [
                ["hp", Smartphone, "HP"],
                ["laptop", Laptop, "Laptop"],
              ] as const
            ).map(([id, Icon, label]) => (
              <button key={id} type="button" onClick={() => setDevice(id)} className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold ${device === id ? "bg-rk-ink text-white" : "text-rk-mute"}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-[min(78dvh,760px)] flex-col">
          <Canvas readOnly device={device} content={c} media={{}} plan={plan} selected={null} onSelect={() => {}} />
        </div>
      </section>

      <div className="space-y-4 lg:sticky lg:top-6">
        <section className={`${card} p-5`}>
          <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-rk-mute">Tampilan saat ini</p>
          <div className="mt-4 flex items-center gap-4 rounded-2xl p-4" style={{ background: pal.bg, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }}>
            <span className="text-[30px] leading-none" style={{ fontFamily: fonts.display, color: accent, textTransform: fonts.displayUpper ? "uppercase" : "none" }}>
              {c.hero.firstName || "Nama"} &amp; {c.hero.secondName || "Nama"}
            </span>
          </div>
          <dl className="mt-4 divide-y divide-rk-line text-[13px]">
            {[
              ["Tema", isPreset(c) ? THEMES[c.theme].name : "Custom"],
              ["Mode", c.style.mode === "dark" ? "Gelap" : "Terang"],
              ["Huruf", fonts.name],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-2.5">
                <dt className="text-rk-mute">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-rk-mute">Warna</dt>
              <dd className="flex gap-1.5">
                {[pal.bg, accent, pal.muted].map((col) => (
                  <span key={col} className="h-5 w-5 rounded-full ring-1 ring-black/10" style={{ background: col }} />
                ))}
              </dd>
            </div>
          </dl>
          <a href={`/${slug}/editor`} target="_blank" rel="noreferrer" className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-rk-ink text-[14px] font-bold text-white hover:bg-rk-plum">
            <Paintbrush className="h-4 w-4" /> Edit Tampilan
          </a>
          <a href={`/${slug}/preview`} target="_blank" rel="noreferrer" className={`${btnGhost} mt-2 h-11 w-full`}>
            <ExternalLink className="h-4 w-4" /> Lihat undangan
          </a>
          <p className="mt-3 text-center text-[11px] text-rk-mute">Editor terbuka di tab baru. Perubahan tersimpan otomatis.</p>
        </section>

        <section className={`${card} p-5`}>
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-rk-mute">Bagian & tata letak</p>
            <p className="text-[12px] font-semibold">
              Isian {complete}/{checks.length}
            </p>
          </div>
          <ul className="mt-3 space-y-1">
            {checks.map(({ k, s }) => {
              const done = s.done === s.total;
              return (
                <li key={k} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-rk-ivory">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-600 text-white" : "border-[1.5px] border-dashed border-rk-mute/60"}`}>{done && <Check className="h-3 w-3 stroke-[3]" />}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold">{BLOCK_LABELS[k]}</span>
                    {!done && <span className="block truncate text-[11px] text-rk-mute">Belum: {s.missing.join(", ")}</span>}
                  </span>
                  <span className="shrink-0 rounded-full bg-rk-cream px-2.5 py-0.5 text-[11px] font-semibold text-rk-bronze">{layoutOf(k, c.layouts[k]).name}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
