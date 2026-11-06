"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Check, Link2, MessageCircle, Minus } from "lucide-react";
import type { GuestRecord } from "@/lib/records";
import { formatDateTime } from "../ui";

/* ------------------------------ small pieces ------------------------------ */

export function sortIcon(active: boolean, asc: boolean) {
  if (!active) return <ArrowUpDown className="ml-1 h-3 w-3 text-rk-line" />;
  return asc ? <ArrowUp className="ml-1 h-3 w-3 text-rk-bronze" /> : <ArrowDown className="ml-1 h-3 w-3 text-rk-bronze" />;
}

export function Checkbox({ checked, partial, onClick, label }: { checked: boolean; partial?: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} aria-label={label} onClick={onClick} className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition ${checked || partial ? "border-rk-ink bg-rk-ink text-white" : "border-rk-mute/60 hover:border-rk-ink"}`}>
      {checked ? <Check className="h-3 w-3 stroke-[3]" /> : partial ? <Minus className="h-3 w-3 stroke-[3]" /> : null}
    </button>
  );
}

export function StatusBadge({ g, onToggle }: { g: GuestRecord; onToggle: () => void }) {
  const sent = !!g.sentAt;
  const when = g.sentAt ? formatDateTime(g.sentAt) : null;
  return (
    <button
      type="button"
      onClick={onToggle}
      title={when ? `Dikirim ${when.date} ${when.time} — klik untuk membatalkan` : "Klik untuk menandai sudah dikirim"}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition ${sent ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "border-dashed border-[#e3c995] bg-[#fbf3e6] text-[#9a6b1f] hover:bg-[#f6e9d2]"}`}
    >
      {sent ? <Check className="h-3 w-3 stroke-[2.5]" /> : <span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-current" />}
      {sent ? "Terkirim" : "Belum"}
    </button>
  );
}

export function ShareButtons({ g, onLink, onCopy, onSend, flash, full }: { g: GuestRecord; onLink: () => void; onCopy: (e: React.MouseEvent<HTMLButtonElement>) => void; onSend: (e: React.MouseEvent<HTMLButtonElement>) => void; flash: string | null; full?: boolean }) {
  return (
    <>
      <button type="button" onClick={onLink} title="Salin link undangan" className={`inline-flex h-7 shrink-0 items-center gap-1 rounded-lg border border-rk-line bg-white px-2 text-[11px] font-semibold transition hover:bg-rk-ivory ${flash === `${g.id}-link` ? "text-emerald-700" : ""}`}>
        {flash === `${g.id}-link` ? <Check className="h-3 w-3" /> : <Link2 className="h-3 w-3 text-rk-mute" />}
        Link
      </button>
      <span className={`inline-flex h-7 items-stretch overflow-hidden rounded-lg border border-rk-line bg-white text-[11px] font-semibold ${full ? "flex-1" : "shrink-0"}`}>
        <button type="button" onClick={onCopy} title="Salin pesan WhatsApp" className={`inline-flex items-center justify-center gap-1 px-2 transition hover:bg-rk-ivory ${full ? "flex-1" : ""} ${flash === `${g.id}-wa` ? "text-emerald-700" : ""}`}>
          {flash === `${g.id}-wa` ? <Check className="h-3 w-3" /> : <MessageCircle className="h-3 w-3 text-[#25D366]" />}
          Salin
        </button>
        <span className="my-1 w-px bg-rk-line" aria-hidden />
        <button type="button" onClick={onSend} title={g.phone ? "Buka chat WhatsApp tamu" : "Buka WhatsApp dengan pesan undangan"} className={`inline-flex items-center justify-center gap-1 px-2 text-emerald-700 transition hover:bg-emerald-50 ${full ? "flex-1" : ""}`}>
          {flash === `${g.id}-send` && <Check className="h-3 w-3" />}
          Kirim
        </button>
      </span>
    </>
  );
}

export function EmptyIllustration({ searching }: { searching: boolean }) {
  return (
    <svg viewBox="0 0 160 120" className="h-[104px] w-[140px]" fill="none" aria-hidden>
      <ellipse cx="80" cy="108" rx="52" ry="6" fill="#efe7da" />
      <g transform="rotate(-8 58 62)">
        <rect x="26" y="40" width="64" height="44" rx="6" fill="#f6efe3" stroke="#e7dccb" strokeWidth="1.5" />
        <path d="M27 43l31 22 31-22" stroke="#e7dccb" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <rect x="56" y="22" width="62" height="76" rx="7" fill="#fff" stroke="#dccfbd" strokeWidth="1.5" />
      <path d="M87 36c-2.2-3.4-7.4-2.6-7.4 1.4 0 3.2 4 5.6 7.4 8.2 3.4-2.6 7.4-5 7.4-8.2 0-4-5.2-4.8-7.4-1.4z" fill="#8b6b43" />
      <rect x="68" y="54" width="38" height="4" rx="2" fill="#ece3d4" />
      <rect x="73" y="63" width="28" height="3.5" rx="1.75" fill="#f3ecdf" />
      <rect x="70" y="71" width="34" height="3.5" rx="1.75" fill="#f3ecdf" />
      {searching ? (
        <g>
          <circle cx="118" cy="78" r="15" fill="#fff" stroke="#120d10" strokeWidth="3" />
          <circle cx="118" cy="78" r="9" fill="#fcf7ed" />
          <path d="M129 89l10 10" stroke="#120d10" strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx="122" cy="80" r="13" fill="#120d10" />
          <path d="M122 74v12M116 80h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
      <path d="M36 26v8M32 30h8" stroke="#e9bf4a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M134 34v6M131 37h6" stroke="#e9bf4a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------ dialogs ------------------------------ */
