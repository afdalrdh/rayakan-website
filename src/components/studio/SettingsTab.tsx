"use client";



import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveSettingsAction } from "@/app/actions/studio";
import type { AppSettings } from "@/lib/records";
import { input, L, primary } from "./ui";

export function SettingsTab({ settings }: { settings: AppSettings }) {
  const router = useRouter();
  const [s, setS] = useState(settings);
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  return (
    <div className="max-w-[640px] space-y-5">
      <div>
        <h1 className="font-rk-serif text-[36px] leading-none">Pengaturan</h1>
        <p className="mt-1.5 text-[14px] text-rk-mute">Dipakai di landing page, tombol pesan, dan tombol terbitkan di editor klien.</p>
      </div>
      <div className="space-y-4 rounded-[24px] border border-rk-line bg-white p-5">
        <L label="Nomor WhatsApp admin" hint="Format 62812…. Semua tombol Pesan / Terbitkan / Upgrade mengarah ke nomor ini.">
          <input value={s.adminWhatsapp} inputMode="tel" onChange={(e) => setS({ ...s, adminWhatsapp: e.target.value })} className={input} placeholder="6281234567890" />
        </L>
        <L label="Instagram">
          <input value={s.instagram} onChange={(e) => setS({ ...s, instagram: e.target.value })} className={input} />
        </L>
        <div className="grid gap-3 sm:grid-cols-2">
          <L label="Label promo" hint="Contoh: Harga perkenalan, Promo November.">
            <input value={s.promoLabel} onChange={(e) => setS({ ...s, promoLabel: e.target.value })} className={input} />
          </L>
          <L label="Promo berakhir" hint="Kosongkan bila tanpa batas waktu.">
            <input type="date" value={s.promoEndsAt} onChange={(e) => setS({ ...s, promoEndsAt: e.target.value })} className={input} />
          </L>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const r = await saveSettingsAction(s);
                setMsg(r.ok ? "✓ Tersimpan" : r.error);
                router.refresh();
                setTimeout(() => setMsg(""), 2500);
              })
            }
            className={`${primary} h-11`}
          >
            Simpan pengaturan
          </button>
          {msg && <span className="text-[13px] font-semibold text-emerald-700">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
