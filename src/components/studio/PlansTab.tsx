"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { savePlansAction } from "@/app/actions/studio";
import { BLOCK_LABELS, type Plan } from "@/lib/content";
import { input, L, primary } from "./ui";

const LOCKABLE = ["story", "gift"] as const;

export function PlansTab({ plans: initial }: { plans: Plan[] }) {
  const router = useRouter();
  const [plans, setPlans] = useState(initial);
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  const set = (i: number, patch: Partial<Plan>) => setPlans((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const num = (v: string) => (v === "" ? 0 : Number(v.replace(/\D/g, "")));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-rk-serif text-[36px] leading-none">Paket &amp; Harga</h1>
          <p className="mt-1.5 text-[14px] text-rk-mute">Perubahan langsung tampil di halaman harga dan berlaku untuk semua undangan dengan paket tersebut.</p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-[13px] font-semibold text-emerald-700">{msg}</span>}
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const r = await savePlansAction(plans);
                setMsg(r.ok ? "✓ Tersimpan" : r.error);
                router.refresh();
                setTimeout(() => setMsg(""), 2500);
              })
            }
            className={`${primary} h-11`}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan semua paket"}
          </button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((p, i) => (
          <section key={p.id} className={`space-y-4 rounded-[24px] border bg-white p-5 ${p.highlight ? "border-rk-ink" : "border-rk-line"}`}>
            <div className="flex items-center justify-between gap-2">
              <input value={p.name} onChange={(e) => set(i, { name: e.target.value })} className="w-full bg-transparent font-rk-serif text-[30px] leading-none outline-none" />
              <label className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold">
                <input type="checkbox" checked={p.highlight} onChange={(e) => setPlans((ps) => ps.map((x, j) => ({ ...x, highlight: j === i ? e.target.checked : e.target.checked ? false : x.highlight })))} />
                Paling laris
              </label>
            </div>
            <L label="Tagline">
              <input value={p.tagline} onChange={(e) => set(i, { tagline: e.target.value })} className={input} />
            </L>
            <div className="grid grid-cols-2 gap-3">
              <L label="Harga promo">
                <input inputMode="numeric" value={p.price.toLocaleString("id-ID")} onChange={(e) => set(i, { price: num(e.target.value) })} className={input} />
              </L>
              <L label="Harga normal">
                <input inputMode="numeric" value={p.normalPrice.toLocaleString("id-ID")} onChange={(e) => set(i, { normalPrice: num(e.target.value) })} className={input} />
              </L>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <L label="Masa aktif (bulan)">
                <input inputMode="numeric" disabled={p.activeMonths === null} value={p.activeMonths ?? ""} placeholder="Selamanya" onChange={(e) => set(i, { activeMonths: num(e.target.value) || 1 })} className={`${input} disabled:bg-rk-cream`} />
              </L>
              <label className="mt-7 flex items-center gap-2 text-[13px] font-semibold">
                <input type="checkbox" checked={p.activeMonths === null} onChange={(e) => set(i, { activeMonths: e.target.checked ? null : 12 })} /> Selamanya
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <L label="Foto galeri">
                <input inputMode="numeric" value={p.galleryLimit} onChange={(e) => set(i, { galleryLimit: num(e.target.value) })} className={input} />
              </L>
              <L label="Babak kisah">
                <input inputMode="numeric" value={p.storyLimit} onChange={(e) => set(i, { storyLimit: num(e.target.value) })} className={input} />
              </L>
              <L label="Tamu">
                <input inputMode="numeric" disabled={p.guestLimit === null} value={p.guestLimit ?? ""} placeholder="∞" onChange={(e) => set(i, { guestLimit: num(e.target.value) })} className={`${input} disabled:bg-rk-cream`} />
              </L>
            </div>
            <label className="flex items-center gap-2 text-[13px] font-semibold">
              <input type="checkbox" checked={p.guestLimit === null} onChange={(e) => set(i, { guestLimit: e.target.checked ? null : 150 })} /> Tamu tanpa batas
            </label>
            <div className="space-y-2 rounded-2xl bg-rk-ivory p-3.5">
              <p className="text-[12px] font-bold uppercase tracking-wider text-rk-mute">Fitur termasuk</p>
              {LOCKABLE.map((k) => (
                <label key={k} className="flex items-center gap-2 text-[13px] font-semibold">
                  <input type="checkbox" checked={!p.locked.includes(k)} onChange={(e) => set(i, { locked: e.target.checked ? p.locked.filter((x) => x !== k) : [...p.locked, k] })} />
                  {BLOCK_LABELS[k]}
                </label>
              ))}
              <label className="flex items-center gap-2 text-[13px] font-semibold">
                <input type="checkbox" checked={p.musicUpload} onChange={(e) => set(i, { musicUpload: e.target.checked })} /> Unggah lagu sendiri
              </label>
              <label className="flex items-center gap-2 text-[13px] font-semibold">
                <input type="checkbox" checked={p.customColor} onChange={(e) => set(i, { customColor: e.target.checked })} /> Warna aksen sendiri
              </label>
            </div>
            <L label="Daftar benefit (tampil di halaman harga)" hint="Satu benefit per baris.">
              <textarea value={p.benefits.join("\n")} rows={7} onChange={(e) => set(i, { benefits: e.target.value.split("\n") })} className={`${input} resize-none leading-relaxed`} />
            </L>
          </section>
        ))}
      </div>
    </>
  );
}
