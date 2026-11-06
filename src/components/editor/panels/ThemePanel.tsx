"use client";

import { Check, Lock, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DECOR_IDS, DECORS, FONT_PAIR_IDS, FONT_PAIRS, getPalette, initials, namesOf, OCCASION_IDS, OCCASIONS, PALETTE_IDS, PALETTES, THEME_IDS, THEMES, type Occasion, type ThemeId } from "@/lib/content";
import { DecorCorner } from "@/themes/decor/art";
import { styleVars } from "@/themes/style";
import { useEditor } from "../context";
import { Group, ImageField, Segmented, UpgradeNote } from "../fields";

/** Look of the whole site: starting theme, light/dark, palette, font pair, accent and logo. */
export function ThemePanel() {
  const { content: c, update, resolve, upload, plan } = useEditor();
  const canCustom = plan.customColor;
  const n = namesOf(c);
  const [a = "", b = ""] = initials(n.first, n.second);
  const [confirm, setConfirm] = useState<ThemeId | null>(null);
  const [filter, setFilter] = useState<Occasion | "semua">(c.occasion);
  const themeIds = THEME_IDS.filter((id) => filter === "semua" || THEMES[id].occasion === filter);
  const s = c.style;
  const pal = getPalette(s.palette)[s.mode];

  const applyTheme = (id: ThemeId) =>
    update((d) => {
      d.theme = id;
      d.style = { ...THEMES[id].style, accent: d.style.accent };
      d.layouts = { ...THEMES[id].layouts };
    });

  return (
    <div className="space-y-8">
      <Group title="Mulai dari tema">
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
          {(["semua", ...OCCASION_IDS] as const).map((id) => (
            <button key={id} type="button" onClick={() => setFilter(id)} className={`h-8 shrink-0 rounded-full px-3 font-rk-sans text-[12px] font-semibold transition ${filter === id ? "bg-rk-ink text-white" : "border border-rk-line bg-white text-rk-mute"}`}>
              {id === "semua" ? "Semua tema" : OCCASIONS[id].name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {themeIds.map((id) => {
            const t = THEMES[id];
            const sel = confirm === id;
            const now = c.theme === id;
            return (
              <button key={id} type="button" onClick={() => setConfirm(id)} className={`overflow-hidden rounded-2xl border text-left transition ${sel ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line hover:border-rk-ink/40"}`}>
                <span className="relative block aspect-[4/5] bg-rk-cream">
                  <Image src={t.preview.mobile} alt="" fill sizes="200px" className="object-cover object-top" />
                  {t.badge && <span className="absolute left-2 top-2 rounded-full bg-rk-gold px-2 py-0.5 font-rk-sans text-[10px] font-bold text-rk-ink">{t.badge}</span>}
                  {now && <span className="absolute right-2 top-2 rounded-full bg-rk-ink px-2 py-0.5 font-rk-sans text-[10px] font-bold text-white">Awal</span>}
                </span>
                <span className="block px-3 py-2.5">
                  <span className="block font-rk-sans text-[14px] font-bold text-rk-ink">{t.name}</span>
                  <span className="line-clamp-2 block font-rk-sans text-[11.5px] leading-snug text-rk-mute">{t.tagline}</span>
                </span>
              </button>
            );
          })}
        </div>
        {confirm ? (
          <div className="rk-fade-in rounded-2xl bg-rk-cream p-4">
            <p className="font-rk-sans text-[13px] text-rk-ink">
              Pakai tema <b>{THEMES[confirm].name}</b>? Warna, huruf, dan tata letak semua bagian akan diganti. Teks dan foto tetap.
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setConfirm(null)} className="h-9 flex-1 rounded-xl border border-rk-line bg-white font-rk-sans text-[13px] font-semibold">
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  applyTheme(confirm);
                  setConfirm(null);
                }}
                className="h-9 flex-1 rounded-xl bg-rk-ink font-rk-sans text-[13px] font-bold text-white"
              >
                Pakai tema
              </button>
            </div>
          </div>
        ) : (
          <p className="font-rk-sans text-[12px] text-rk-mute">Tema hanya titik awal. Warna, huruf, ornamen, dan tata letak tiap bagian bisa dicampur sesukamu.</p>
        )}
      </Group>

      <Group title="Ornamen & animasi">
        <div className="grid grid-cols-2 gap-2.5">
          {DECOR_IDS.map((id) => {
            const d = DECORS[id];
            const sel = (s.decor || "none") === id;
            return (
              <button key={id} type="button" onClick={() => update((x) => void (x.style.decor = id))} className={`overflow-hidden rounded-2xl border text-left transition ${sel ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line hover:border-rk-ink/40"}`}>
                <span style={styleVars({ ...s, decor: id }) as React.CSSProperties} className="relative block h-[72px] overflow-hidden bg-t-bg">
                  <DecorCorner decor={id} at="tl" sizeClass="w-[84px]" />
                  <DecorCorner decor={id} at="br" sizeClass="w-[84px]" />
                  {id === "none" && <span className="absolute inset-0 flex items-center justify-center font-rk-sans text-[11px] text-t-muted">Bersih</span>}
                  {sel && (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
                      <Check className="h-3.5 w-3.5 text-rk-ink" />
                    </span>
                  )}
                </span>
                <span className="block px-3 py-2">
                  <span className="block font-rk-sans text-[13px] font-bold text-rk-ink">{d.name}</span>
                  <span className="line-clamp-2 block font-rk-sans text-[11px] leading-snug text-rk-mute">{d.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="font-rk-sans text-[12px] text-rk-mute">Ornamen tampil di sudut tiap bagian, di bawah judul, dan sebagai animasi melayang. Tata letak &quot;Ilustrasi&quot; dan sampul beranimasi ikut berganti gambar.</p>
      </Group>

      <Group title="Mode">
        <div className="grid grid-cols-2 gap-2.5">
          {(
            [
              ["light", "Terang", Sun],
              ["dark", "Gelap", Moon],
            ] as const
          ).map(([m, label, Icon]) => {
            const p = getPalette(s.palette)[m];
            const sel = s.mode === m;
            return (
              <button key={m} type="button" onClick={() => update((d) => void (d.style.mode = m))} className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition ${sel ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line"}`}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: p.bg, color: p.accent, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-rk-sans text-[14px] font-bold text-rk-ink">{label}</span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Palet warna">
        <div className="grid grid-cols-3 gap-2.5">
          {PALETTE_IDS.map((id) => {
            const p = PALETTES[id][s.mode];
            const sel = s.palette === id;
            return (
              <button key={id} type="button" onClick={() => update((d) => void (d.style.palette = id))} className={`rounded-2xl border p-1.5 text-left transition ${sel ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line"}`}>
                <span className="relative flex h-14 items-end gap-1.5 overflow-hidden rounded-xl p-2" style={{ background: p.bg, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }}>
                  <span className="h-5 w-5 rounded-full" style={{ background: p.accent }} />
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: p.muted }} />
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: p.card, boxShadow: "inset 0 0 0 1px rgba(127,127,127,0.25)" }} />
                  {sel && (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
                      <Check className="h-3.5 w-3.5 text-rk-ink" />
                    </span>
                  )}
                </span>
                <span className="mt-1.5 block truncate px-1 font-rk-sans text-[12px] font-semibold text-rk-ink">{PALETTES[id].name}</span>
              </button>
            );
          })}
        </div>
        <div className={`flex items-center gap-3 rounded-2xl border p-3 ${s.accent ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line"}`}>
          <input
            type="color"
            disabled={!canCustom}
            value={s.accent || pal.accent}
            onChange={(e) => update((d) => void (d.style.accent = e.target.value))}
            className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-rk-line bg-transparent disabled:cursor-not-allowed"
          />
          <span className="min-w-0 flex-1">
            <span className="block font-rk-sans text-[14px] font-semibold text-rk-ink">Warna aksen sendiri</span>
            <span className="block font-rk-sans text-[12px] text-rk-mute">Samakan dengan seragam atau dekorasi.</span>
          </span>
          {s.accent && canCustom ? (
            <button type="button" onClick={() => update((d) => void (d.style.accent = ""))} className="font-rk-sans text-[12px] font-semibold text-red-700">
              Hapus
            </button>
          ) : (
            !canCustom && <Lock className="h-4 w-4 text-rk-mute" />
          )}
        </div>
        {!canCustom && <UpgradeNote>Warna aksen sendiri tersedia di paket Eksklusif.</UpgradeNote>}
      </Group>

      <Group title="Huruf">
        <div className="space-y-2">
          {FONT_PAIR_IDS.map((id) => {
            const f = FONT_PAIRS[id];
            const sel = s.fonts === id;
            return (
              <button key={id} type="button" onClick={() => update((d) => void (d.style.fonts = id))} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${sel ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line hover:border-rk-ink/40"}`}>
                <span className="flex h-[60px] w-[96px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-xl" style={{ background: pal.bg, color: pal.accent }}>
                  <span className="truncate leading-none" style={{ fontFamily: f.display, fontSize: 24 * f.displayScale, textTransform: f.displayUpper ? "uppercase" : "none" }}>
                    {a || "A"}&amp;{b || "B"}
                  </span>
                  <span className="mt-1 text-[9px] opacity-75" style={{ fontFamily: f.body }}>
                    Undangan
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] leading-tight text-rk-ink" style={{ fontFamily: f.head, fontWeight: f.headWeight }}>
                    {f.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-rk-mute" style={{ fontFamily: f.body }}>
                    {f.desc}
                  </span>
                </span>
                {sel && <Check className="h-4 w-4 shrink-0 text-rk-ink" />}
              </button>
            );
          })}
        </div>
        <p className="font-rk-sans text-[12px] text-rk-mute">Pasangan huruf judul dan isi yang sudah teruji serasi.</p>
      </Group>

      <Group title="Logo">
        <Segmented
          value={c.logo.mode}
          onChange={(v) => update((d) => void (d.logo.mode = v))}
          options={[
            { value: "monogram", label: "Inisial" },
            { value: "image", label: "Gambar" },
            { value: "none", label: "Tanpa" },
          ]}
        />
        {c.logo.mode === "monogram" && (
          <div className="flex items-center gap-4 rounded-2xl p-4" style={{ background: "#0B0C0E" }}>
            <svg viewBox="0 0 120 102" className="h-14 w-16">
              <text x="34" y="70" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="78" fontWeight="500" fill="#fff">{a}</text>
              <text x="60" y="76" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontSize="34" fill={pal.accent}>&amp;</text>
              <text x="86" y="92" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="78" fontWeight="500" fill="#fff">{b}</text>
            </svg>
            <p className="font-rk-sans text-[12px] leading-snug text-white/70">Dibuat otomatis dari huruf awal nama panggilan kalian.</p>
          </div>
        )}
        {c.logo.mode === "image" && (
          <ImageField label="Gambar logo" hint="PNG tanpa latar, warna terang. Di latar terang otomatis jadi gelap." value={c.logo.image} resolve={resolve} upload={upload} maxSide={600} fit="contain" aspect="aspect-[3/1]" onChange={(v) => update((d) => void (d.logo.image = v))} />
        )}
      </Group>
    </div>
  );
}
