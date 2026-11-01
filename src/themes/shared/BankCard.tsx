"use client";

import { BANKS, type BankAccount } from "@/lib/content";
import { useSrc } from "./context";
import { useCopy } from "./hooks";
import { ContactlessIcon, CopyIcon } from "./icons";

/** Credit-card style bank account with copy button. Same look in every theme. */
export function BankCard({ account: a, validThru, className = "" }: { account: BankAccount; validThru: string; className?: string }) {
  const preset = BANKS[a.bank] ?? BANKS.lainnya;
  const logo = useSrc(preset.logo);
  const { copied, copy } = useCopy();
  return (
    <article
      style={{ background: `linear-gradient(135deg, ${preset.gradient.join(", ")})`, borderColor: `${preset.border}99` }}
      className={`relative flex flex-col justify-between overflow-hidden rounded-[20px] border p-6 text-left text-white shadow-[0_20px_45px_rgba(0,0,0,0.35)] md:p-7 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {logo && <img src={logo} alt="" width={28} height={28} className="h-7 w-auto max-w-[64px] object-contain" />}
          <span className="font-sans text-[17px] font-bold tracking-wide md:text-[19px]">{preset.name}</span>
        </div>
        <ContactlessIcon className="opacity-80" />
      </div>
      <div className="mt-8 flex items-center gap-3 md:mt-10">
        <span className="font-sans text-[22px] font-bold tracking-wider sm:text-[24px] md:text-[26px]">{a.number || "0000 0000 0000"}</span>
        <button type="button" onClick={() => copy(a.number.replace(/\s/g, ""), a.id)} aria-label={`Salin nomor rekening ${preset.name}`} className="rounded-md p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white">
          <CopyIcon />
        </button>
      </div>
      <div className="mt-6 flex items-end justify-between pt-2">
        <div>
          <p className="font-sans text-[9px] uppercase tracking-wider text-white/60">Valid Thru</p>
          <p className="font-sans text-[13px] font-medium text-white/85">{validThru}</p>
          <p className="mt-2 font-sans text-[13px] font-bold uppercase tracking-wider md:text-[15px]">{a.holder || "NAMA PEMILIK"}</p>
        </div>
        <div className="flex -space-x-3">
          <span className="h-9 w-9 rounded-full bg-[#EB001B] md:h-10 md:w-10" />
          <span className="h-9 w-9 rounded-full bg-[#F79E1B] opacity-90 md:h-10 md:w-10" />
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
