"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

/* Small building blocks shared by the Studio tabs. */

export const input = "w-full rounded-xl border border-rk-line bg-white px-3.5 py-2.5 text-[14px] text-rk-ink outline-none focus:border-rk-ink focus:ring-2 focus:ring-rk-gold/30";
export const btn = "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-[13px] font-semibold transition disabled:opacity-40";
export const primary = `${btn} bg-rk-ink text-white hover:bg-rk-plum`;
export const ghost = `${btn} border border-rk-line bg-white text-rk-ink hover:bg-rk-ivory`;
export const fmtDate = (d: string | null, withYear = true) =>
  d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) }) : "–";

export function L({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-rk-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-rk-mute">{hint}</span>}
    </label>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label="Tutup" onClick={onClose} className="rk-fade-in absolute inset-0 bg-rk-ink/40" />
      <div className={`rk-sheet-in relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] bg-rk-ivory p-6 sm:rounded-[24px] ${wide ? "max-w-[640px]" : "max-w-[480px]"}`}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-rk-serif text-[28px] leading-none">{title}</h2>
          <button type="button" aria-label="Tutup" onClick={onClose} className="rounded-full p-2 hover:bg-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
