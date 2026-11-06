"use client";

import { BANKS, type BankAccount } from "@/lib/content";
import { useSrc } from "./context";
import { useCopy } from "./hooks";
import { ContactlessIcon, CopyIcon } from "./icons";

/**
 * Credit-card style bank account with copy button. Same look in every theme.
 * Real card proportions (85.6 × 54 mm); text scales with the card width via
 * container units, so it never looks tiny with empty space around it.
 */
export function BankCard({ account: a, validThru, className = "" }: { account: BankAccount; validThru: string; className?: string }) {
  const preset = BANKS[a.bank] ?? BANKS.lainnya;
  const logo = useSrc(preset.logo);
  const { copied, copy } = useCopy();
  return (
    <article
      style={{ background: `linear-gradient(135deg, ${preset.gradient.join(", ")})`, borderColor: `${preset.border}99` }}
      className={`@container relative aspect-[1.586/1] w-full overflow-hidden rounded-[20px] border text-left text-white shadow-[0_20px_45px_rgba(0,0,0,0.35)] ${className}`}
    >
      <div className="absolute inset-0 flex flex-col p-[7cqw]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-[2.4cqw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logo && <img src={logo} alt="" width={28} height={28} className="h-[7cqw] max-h-9 w-auto max-w-[16cqw] object-contain" />}
            <span className="truncate font-sans text-[clamp(15px,5.4cqw,28px)] font-bold leading-none tracking-wide">{preset.name}</span>
          </div>
          <ContactlessIcon className="h-[7cqw] max-h-9 w-auto shrink-0 opacity-80" />
        </div>
        <div className="mt-auto flex items-center gap-[2.4cqw]">
          <span className="whitespace-nowrap font-sans text-[clamp(17px,6cqw,34px)] font-bold leading-none tracking-wide tabular-nums">{a.number || "0000 0000 0000"}</span>
          <button type="button" data-paid onClick={() => copy(a.number.replace(/\s/g, ""), a.id)} aria-label={`Salin nomor rekening ${preset.name}`} className="shrink-0 rounded-md p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white">
            <CopyIcon />
          </button>
        </div>
        <div className="mt-[2.6cqw]">
          <p className="font-sans text-[clamp(8px,2.1cqw,11px)] font-semibold uppercase leading-none tracking-wider text-white/60">Valid Thru</p>
          <p className="mt-[0.8cqw] font-sans text-[clamp(12px,3.6cqw,18px)] font-medium leading-none text-white/90">{validThru}</p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <p className="min-w-0 truncate font-sans text-[clamp(12px,3.8cqw,20px)] font-semibold uppercase leading-none tracking-wider">{a.holder || "NAMA PEMILIK"}</p>
          <div className="flex shrink-0 -space-x-[3.2cqw]">
            <span className="h-[10cqw] max-h-14 w-[10cqw] max-w-14 rounded-full bg-[#EB001B]" />
            <span className="h-[10cqw] max-h-14 w-[10cqw] max-w-14 rounded-full bg-[#F79E1B] opacity-90" />
          </div>
        </div>
      </div>
      {copied === a.id && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/75 backdrop-blur-xs">
          <p className="rounded-full border border-emerald-500/40 bg-emerald-950/80 px-4 py-1.5 font-sans text-[13px] font-bold uppercase tracking-[1px] text-emerald-300">Nomor Rekening Disalin ✓</p>
        </div>
      )}
    </article>
  );
}
