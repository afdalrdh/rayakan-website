"use client";

import { X } from "lucide-react";
import { useCallback, useState } from "react";

/* Small UI pieces shared by the Tamu / Ucapan / Lainnya tabs. */

export const btn = "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-3.5 font-rk-sans text-[13px] font-semibold transition disabled:opacity-40";
export const btnPrimary = `${btn} bg-rk-ink text-white hover:bg-rk-plum`;
export const btnGhost = `${btn} border border-rk-line bg-white text-rk-ink hover:bg-rk-ivory`;

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button type="button" aria-label="Tutup" onClick={onClose} className="rk-fade-in absolute inset-0 bg-rk-ink/30" />
      <div className="rk-sheet-in relative max-h-[88dvh] w-full max-w-[520px] overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[calc(20px+env(safe-area-inset-bottom))] sm:rounded-[24px]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-rk-serif text-[26px] leading-none">{title}</h2>
          <button type="button" aria-label="Tutup" onClick={onClose} className="rounded-full p-2 hover:bg-rk-ivory">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function useToast() {
  const [msg, setMsg] = useState("");
  const show = useCallback((m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2200);
  }, []);
  const node = msg ? (
    <div className="rk-fade-in fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4 lg:bottom-8">
      <span className="rounded-full bg-rk-ink px-4 py-2.5 font-rk-sans text-[13px] font-semibold text-white shadow-xl">{msg}</span>
    </div>
  ) : null;
  return { show, node };
}
