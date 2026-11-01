"use client";

import { Check, Lock } from "lucide-react";
import Image from "next/image";
import { getThemeMeta, initials, THEME_IDS, THEMES } from "@/lib/content";
import { useEditor } from "../context";
import { Group, ImageField, Segmented, UpgradeNote } from "../fields";

/** Theme, colour palette and logo. Switching theme keeps every text and photo. */
export function ThemePanel() {
  const { content: c, update, resolve, upload, plan } = useEditor();
  const canCustom = plan.customColor;
  const [a = "", b = ""] = initials(c.hero.firstName, c.hero.secondName);
  const theme = getThemeMeta(c.theme);
  return (
    <div className="space-y-8">
      <Group title="Tema">
        <div className="grid grid-cols-2 gap-2.5">
          {THEME_IDS.map((id) => {
            const t = THEMES[id];
            const sel = c.theme === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  update((d) => {
                    if (d.theme === id) return;
                    d.theme = id;
                    if (d.palette !== "custom") d.palette = t.defaultPalette;
                  })
                }
                className={`overflow-hidden rounded-2xl border text-left transition ${sel ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line"}`}
              >
                <span className="relative block aspect-[4/3] bg-rk-cream">
                  <Image src={t.preview.mobile} alt="" fill sizes="200px" className="object-cover object-top" />
                  {sel && (
                    <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
                      <Check className="h-4 w-4 text-rk-ink" />
                    </span>
                  )}
                </span>
                <span className="block px-3 py-2.5">
                  <span className="block font-rk-sans text-[14px] font-bold text-rk-ink">{t.name}</span>
                  <span className="block truncate font-rk-sans text-[12px] text-rk-mute">{t.tagline}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="font-rk-sans text-[12px] text-rk-mute">Semua teks dan foto tetap terpakai saat berganti tema.</p>
      </Group>
      <Group title="Warna">
        <div className="grid grid-cols-3 gap-2.5">
          {Object.entries(theme.palettes).map(([id, p]) => {
            const sel = c.palette === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => update((d) => void (d.palette = id))}
                className={`rounded-2xl border p-2 text-left transition ${sel ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line"}`}
              >
                <span className="relative flex h-14 items-end overflow-hidden rounded-xl p-2" style={{ background: p.bg }}>
                  <span className="font-serif text-[22px] leading-none" style={{ color: p.accent }}>
                    Aa
                  </span>
                  <span className="absolute right-2 top-2 h-3 w-3 rounded-full" style={{ background: p.muted }} />
                  {sel && (
                    <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white">
                      <Check className="h-3.5 w-3.5 text-rk-ink" />
                    </span>
                  )}
                </span>
                <span className="mt-1.5 block truncate font-rk-sans text-[12px] font-semibold text-rk-ink">{p.name}</span>
              </button>
            );
          })}
        </div>
        <div className={`flex items-center gap-3 rounded-2xl border p-3 ${c.palette === "custom" ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line"}`}>
          <input
            type="color"
            disabled={!canCustom}
            value={c.customAccent || theme.palettes[theme.defaultPalette].accent}
            onChange={(e) => update((d) => {
              d.palette = "custom";
              d.customAccent = e.target.value;
            })}
            className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-rk-line bg-transparent disabled:cursor-not-allowed"
          />
          <span className="flex-1">
            <span className="block font-rk-sans text-[14px] font-semibold text-rk-ink">Warna aksen sendiri</span>
            <span className="block font-rk-sans text-[12px] text-rk-mute">Samakan dengan warna seragam / dekorasi.</span>
          </span>
          {!canCustom && <Lock className="h-4 w-4 text-rk-mute" />}
        </div>
        {!canCustom && <UpgradeNote>Warna aksen sendiri tersedia di paket Eksklusif.</UpgradeNote>}
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
          <div className="flex items-center gap-4 rounded-2xl bg-[#0B0C0E] p-4">
            <svg viewBox="0 0 120 102" className="h-14 w-16">
              <text x="34" y="70" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="78" fontWeight="500" fill="#fff">{a}</text>
              <text x="60" y="76" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontSize="34" fill="#E5C07B">&amp;</text>
              <text x="86" y="92" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="78" fontWeight="500" fill="#fff">{b}</text>
            </svg>
            <p className="font-rk-sans text-[12px] leading-snug text-white/70">Dibuat otomatis dari huruf awal nama panggilan kalian.</p>
          </div>
        )}
        {c.logo.mode === "image" && (
          <ImageField
            label="Gambar logo"
            hint="PNG tanpa latar, warna terang."
            value={c.logo.image}
            resolve={resolve}
            upload={upload}
            maxSide={600}
            fit="contain"
            aspect="aspect-[3/1]"
            onChange={(v) => update((d) => void (d.logo.image = v))}
          />
        )}
      </Group>
    </div>
  );
}
