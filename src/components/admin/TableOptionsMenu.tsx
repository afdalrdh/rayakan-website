"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, SlidersHorizontal, Trash2 } from "lucide-react";
import type { SendPreference } from "./send-preference";
import { ResponsiveDialog, useIsMobile } from "./ResponsiveDialog";

interface TableOptionsMenuProps {
  preference: SendPreference;
  onChangePreference: (mode: SendPreference) => void;
  totalCount: number;
  onDeleteAll: () => void;
}

const OPTIONS: { value: SendPreference; title: string; desc: string }[] = [
  {
    value: "ask",
    title: "Tanya setiap kali",
    desc: "Muncul konfirmasi sebelum menyalin atau mengirim.",
  },
  {
    value: "mark",
    title: "Langsung tandai terkirim",
    desc: "Tanpa konfirmasi. Berlaku sampai hari ini berakhir.",
  },
  {
    value: "skip",
    title: "Jangan ubah status",
    desc: "Tanpa konfirmasi. Berlaku sampai hari ini berakhir.",
  },
];

function OptionsContent({
  preference,
  onChangePreference,
  totalCount,
  onDeleteAll,
}: TableOptionsMenuProps) {
  return (
    <div>
      <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-rk-mute">
        Saat klik Salin / Kirim
      </p>
      <div role="radiogroup" className="mt-1.5 space-y-1">
        {OPTIONS.map((opt) => {
          const selected = preference === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChangePreference(opt.value)}
              className={`flex w-full items-start gap-2.5 rounded-[8px] border px-2.5 py-2 text-left transition cursor-pointer ${
                selected
                  ? "border-rk-sand bg-rk-cream"
                  : "border-transparent hover:bg-rk-ivory"
              }`}
            >
              <span
                className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                  selected ? "border-rk-bronze" : "border-rk-line"
                }`}
              >
                {selected ? <span className="h-1.5 w-1.5 rounded-full bg-rk-bronze" /> : null}
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-bold leading-tight text-rk-ink">
                  {opt.title}
                </span>
                <span className="mt-0.5 block text-[11px] leading-[15px] text-rk-mute">
                  {opt.desc}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="my-2.5 h-px bg-rk-line" />

      <button
        type="button"
        onClick={onDeleteAll}
        disabled={totalCount === 0}
        className="group flex w-full items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-left transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-red-50 text-red-700">
          <Trash2 className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] font-bold text-red-700">Hapus semua data</span>
          <span className="block text-[11px] text-red-400">{totalCount} tamu</span>
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-rk-mute transition group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

/** Tombol "Opsi" di sebelah Ekspor Excel: pengaturan aksi Salin/Kirim + Hapus semua. */
export function TableOptionsMenu(props: TableOptionsMenuProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || isMobile) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, isMobile]);

  const auto = props.preference !== "ask";
  const content = (
    <OptionsContent
      {...props}
      onChangePreference={(mode) => {
        props.onChangePreference(mode);
      }}
      onDeleteAll={() => {
        setOpen(false);
        props.onDeleteAll();
      }}
    />
  );

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Opsi lainnya"
        className={`relative inline-flex h-8.5 items-center justify-center gap-1.5 rounded-full border px-2.5 sm:px-3 text-[12px] font-bold transition shadow-xs cursor-pointer ${
          open
            ? "border-rk-ink bg-rk-ink text-white"
            : "border-rk-line bg-rk-cream text-rk-ink hover:bg-rk-sand"
        }`}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Opsi</span>
        {auto ? (
          <span
            className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 ${
              open ? "border-rk-ink" : "border-white"
            } ${props.preference === "mark" ? "bg-emerald-700" : "bg-rk-gold"}`}
            title={
              props.preference === "mark"
                ? "Hari ini: langsung tandai terkirim"
                : "Hari ini: status tidak diubah"
            }
          />
        ) : null}
      </button>

      {open && !isMobile ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-[296px] rounded-[12px] border border-rk-line bg-white p-2.5 shadow-[0_16px_40px_-12px_rgba(32,26,24,0.3)] rk-fade-in">
          {content}
        </div>
      ) : null}

      {isMobile ? (
        <ResponsiveDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Opsi lainnya"
          icon={<SlidersHorizontal className="h-4 w-4" />}
        >
          {content}
        </ResponsiveDialog>
      ) : null}
    </div>
  );
}
