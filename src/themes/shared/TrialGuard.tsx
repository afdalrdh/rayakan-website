"use client";

import { useEffect, useState, type ReactNode, type SyntheticEvent } from "react";

/** What counts as a guest action: forms, copy buttons (`data-paid`) and links that leave the invitation. */
const PAID_ACTION = '[data-paid], a[target="_blank"]';

/**
 * Wraps an unpaid preview (theme sample, sandbox, draft). Reading, scrolling,
 * music and the opening animation work; guest actions show a short notice
 * instead, so the full invitation is only usable once it is published.
 */
export function TrialGuard({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState(false);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(false), 2600);
    return () => clearTimeout(t);
  }, [notice]);

  const block = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotice(true);
  };

  return (
    <div
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest?.(PAID_ACTION)) block(e);
      }}
      onSubmitCapture={block}
    >
      {children}
      <div role="status" aria-live="polite" className={`pointer-events-none fixed inset-x-0 top-4 z-[130] flex justify-center px-4 transition duration-300 ${notice ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}>
        <p className="max-w-[360px] rounded-2xl bg-[#15110e]/92 px-4 py-3 text-center font-sans text-[13px] leading-snug text-white shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] backdrop-blur-md">
          Ini pratinjau. Tombol untuk tamu (ucapan, salin rekening, peta) aktif setelah undangan diterbitkan.
        </p>
      </div>
    </div>
  );
}
