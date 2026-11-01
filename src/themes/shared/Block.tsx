"use client";

import type { ReactNode } from "react";
import { BLOCK_LABELS, type BlockKey } from "@/lib/content";
import { useTheme } from "./context";

/**
 * Wraps a section. In edit mode the whole section becomes one tap target:
 * links/buttons inside are neutralised and a chip shows what it edits.
 * In live mode it renders children untouched.
 */
export function Block({ id, children }: { id: BlockKey; children: ReactNode }) {
  const { mode, selected, onSelect, locked } = useTheme();
  if (mode !== "edit") return <>{children}</>;
  const isSelected = selected === id;
  return (
    <div
      data-block={id}
      className="group/block relative cursor-pointer"
      onClickCapture={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.(id);
      }}
    >
      {children}
      {locked?.includes(id) && (
        <div className="pointer-events-none absolute inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-[2px]">
          <span className="rounded-full border border-white/25 bg-black/60 px-4 py-2 font-sans text-[13px] text-white">
            🔒 {BLOCK_LABELS[id]} · tersedia di paket lebih tinggi
          </span>
        </div>
      )}
      <div
        className={`pointer-events-none absolute inset-0 z-[80] transition ${
          isSelected ? "shadow-[inset_0_0_0_3px_#F0C850]" : "group-hover/block:shadow-[inset_0_0_0_2px_rgba(240,200,80,0.7)]"
        }`}
      />
      <span
        className={`pointer-events-none absolute left-3 top-3 z-[81] inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-[12px] font-semibold shadow-lg ${
          isSelected ? "bg-[#F0C850] text-[#120d10]" : "bg-white/90 text-[#120d10]"
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 20h4L19 9l-4-4L4 16v4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
        Ubah {BLOCK_LABELS[id]}
      </span>
    </div>
  );
}

/** Placeholder for an empty photo slot — only visible in the editor. */
export function EmptyPhoto({ label = "Ketuk untuk tambah foto" }: { label?: string }) {
  const { mode } = useTheme();
  if (mode !== "edit") return null;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed border-t-accent/40 bg-t-input text-t-accent/80">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 17l5-4 4 3 3-2 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span className="font-sans text-[12px]">{label}</span>
    </div>
  );
}
