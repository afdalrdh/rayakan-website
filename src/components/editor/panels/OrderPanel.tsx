"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { BLOCK_LABELS, SECTION_KEYS } from "@/lib/content";
import { useEditor } from "../context";
import { move } from "../fields";

export function OrderPanel() {
  const { content: c, update, plan } = useEditor();
  const locked = plan.locked;
  return (
    <div className="space-y-3">
      <p className="font-rk-sans text-[13px] text-rk-mute">Foto utama selalu di atas, penutup selalu di bawah. Atur urutan bagian di antaranya.</p>
      {c.order.map((k, i) => {
        const hidden = c.hidden.includes(k);
        const isLocked = locked.includes(k);
        return (
          <div key={k} className={`flex items-center gap-2 rounded-2xl border border-rk-line bg-white p-2.5 pl-4 ${hidden ? "opacity-55" : ""}`}>
            <span className="flex-1 font-rk-sans text-[14px] font-semibold text-rk-ink">
              {BLOCK_LABELS[k]}
              {isLocked && <Lock className="-mt-0.5 ml-1.5 inline h-3.5 w-3.5 text-rk-mute" />}
            </span>
            <button type="button" aria-label="Naikkan" disabled={i === 0} onClick={() => update((d) => void (d.order = move(d.order, i, -1)))} className="h-9 w-9 rounded-lg text-rk-ink hover:bg-rk-cream disabled:opacity-25">
              ↑
            </button>
            <button type="button" aria-label="Turunkan" disabled={i === c.order.length - 1} onClick={() => update((d) => void (d.order = move(d.order, i, 1)))} className="h-9 w-9 rounded-lg text-rk-ink hover:bg-rk-cream disabled:opacity-25">
              ↓
            </button>
            <button
              type="button"
              aria-label={hidden ? "Tampilkan" : "Sembunyikan"}
              onClick={() => update((d) => void (d.hidden = hidden ? d.hidden.filter((x) => x !== k) : [...d.hidden, k]))}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-rk-ink hover:bg-rk-cream"
            >
              {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        );
      })}
      <p className="pt-1 font-rk-sans text-[12px] text-rk-mute">Total {SECTION_KEYS.length} bagian · bagian tersembunyi tidak tampil ke tamu.</p>
    </div>
  );
}
