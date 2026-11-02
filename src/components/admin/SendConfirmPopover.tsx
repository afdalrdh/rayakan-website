"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCheck } from "lucide-react";

export interface SendConfirmAnchor {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface SendConfirmPopoverProps {
  anchor: SendConfirmAnchor;
  guestName: string;
  kind: "copy" | "send";
  onChoose: (markSent: boolean, rememberToday: boolean) => void;
  onClose: () => void;
}

const WIDTH = 264;
const EST_HEIGHT = 150;
const GAP = 6;

/**
 * Popover kecil saat klik Salin/Kirim: tanya apakah status diubah jadi
 * Terkirim. Aksi salin/kirim baru dijalankan setelah memilih.
 */
export function SendConfirmPopover({
  anchor,
  guestName,
  kind,
  onChoose,
  onClose,
}: SendConfirmPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
    };
  }, [onClose]);

  const vw = typeof window === "undefined" ? 1024 : window.innerWidth;
  const vh = typeof window === "undefined" ? 768 : window.innerHeight;
  const left = Math.min(Math.max(8, anchor.right - WIDTH), vw - WIDTH - 8);
  const openBelow = anchor.top < EST_HEIGHT + 16;
  const style: React.CSSProperties = openBelow
    ? { position: "fixed", left, top: anchor.bottom + GAP, width: WIDTH, zIndex: 9999 }
    : { position: "fixed", left, bottom: vh - anchor.top + GAP, width: WIDTH, zIndex: 9999 };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Konfirmasi status terkirim"
      style={style}
      className={`overflow-hidden rounded-[10px] border border-rk-line bg-white text-left shadow-[0_12px_32px_-8px_rgba(32,26,24,0.28)] rk-fade-in ${
        openBelow ? "origin-top-right" : "origin-bottom-right"
      }`}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCheck className="h-3 w-3" />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold leading-tight text-rk-ink">
              Tandai sebagai terkirim?
            </p>
            <p className="mt-0.5 text-[11px] leading-[15px] text-rk-mute">
              {kind === "copy" ? "Pesan untuk " : "WhatsApp dibuka untuk "}
              <span className="font-semibold text-rk-ink">{guestName}</span>
              {kind === "copy" ? " disalin setelah memilih." : " setelah memilih."}
            </p>
          </div>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onChoose(false, remember)}
            className="h-7.5 rounded-[7px] border border-rk-line bg-white text-[11.5px] font-semibold text-rk-mute transition hover:bg-rk-ivory cursor-pointer"
          >
            Tidak
          </button>
          <button
            type="button"
            autoFocus
            onClick={() => onChoose(true, remember)}
            className="h-7.5 rounded-[7px] bg-emerald-700 text-[11.5px] font-bold text-white transition hover:bg-emerald-800 cursor-pointer"
          >
            Ya, tandai
          </button>
        </div>
      </div>
      <label className="flex cursor-pointer items-center justify-between gap-2 border-t border-rk-line bg-rk-ivory px-3 py-2">
        <span className="text-[11px] font-medium text-rk-mute">
          Pakai pilihan ini terus hari ini
        </span>
        <span className="relative inline-flex shrink-0">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="peer sr-only"
          />
          <span className="h-4 w-7 rounded-full bg-rk-line transition peer-checked:bg-rk-bronze peer-focus-visible:ring-2 peer-focus-visible:ring-rk-bronze/40" />
          <span className="absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition peer-checked:translate-x-3" />
        </span>
      </label>
    </div>
  );
}
