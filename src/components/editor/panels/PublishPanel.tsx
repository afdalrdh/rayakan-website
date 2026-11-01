"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { activeLabel, BLOCK_LABELS, rupiah } from "@/lib/content";
import { SITE_HOST } from "@/lib/messages";
import { useEditor } from "../context";
import { useProgress } from "./ChecklistPanel";
import { Group } from "../fields";

export function PublishPanel() {
  const { content: c, plan, slug, status, adminWhatsapp, expiresAt, mode } = useEditor();
  const { rows, complete, total } = useProgress();
  const ready = complete === total;
  const url = `${SITE_HOST}/${slug}`;
  const [copied, setCopied] = useState(false);
  const msg = `Halo Rayakan.my.id, saya ingin menerbitkan undangan.\n\nAlamat: ${url}\nMempelai: ${c.hero.firstName} & ${c.hero.secondName}\nPaket: ${plan.name} (${rupiah(plan.price)})\n\nMohon info pembayarannya. Terima kasih!`;
  const published = status === "published";
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-rk-line bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-rk-sans text-[12px] font-semibold uppercase tracking-wider text-rk-mute">Alamat undangan</p>
          <span className={`rounded-full px-2.5 py-1 font-rk-sans text-[11px] font-bold ${published ? "bg-emerald-50 text-emerald-700" : "bg-rk-cream text-rk-mute"}`}>{published ? "● Sudah terbit" : "● Draft"}</span>
        </div>
        <p className="mt-1 break-all font-rk-sans text-[16px] font-semibold text-rk-ink">{url}</p>
        {published ? (
          <div className="mt-4 space-y-3 border-t border-rk-line pt-4">
            <p className="font-rk-sans text-[13px] text-rk-mute">Paket {plan.name} · aktif {expiresAt ? `sampai ${new Date(expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}` : "selamanya"}</p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`https://${url}`).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                });
              }}
              className="flex h-11 w-full items-center justify-center rounded-xl border border-rk-line font-rk-sans text-[14px] font-semibold"
            >
              {copied ? "✓ Link disalin" : "Salin link undangan"}
            </button>
            <p className="font-rk-sans text-[12px] text-rk-mute">Untuk mengirim ke tiap tamu dengan nama masing-masing, buka menu Tamu.</p>
          </div>
        ) : (
          <div className="mt-4 flex items-end justify-between border-t border-rk-line pt-4">
            <span>
              <span className="block font-rk-sans text-[12px] text-rk-mute">Paket {plan.name} · aktif {activeLabel(plan)}</span>
              <span className="font-rk-sans text-[13px] text-rk-mute line-through">{rupiah(plan.normalPrice)}</span>
              <span className="ml-2 font-rk-serif text-[26px] leading-none text-rk-ink">{rupiah(plan.price)}</span>
            </span>
            <span className="rounded-full bg-rk-gold/20 px-2.5 py-1 font-rk-sans text-[11px] font-bold text-rk-ink">Promo</span>
          </div>
        )}
      </div>
      <Group title={`Cek kelengkapan · ${complete}/${total}`}>
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.key} className="flex items-start gap-2.5 font-rk-sans text-[13px]">
              <span className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${r.done === r.total ? "bg-emerald-600 text-white" : "border-2 border-dashed border-rk-gold"}`}>
                {r.done === r.total && <Check className="h-3 w-3" />}
              </span>
              <span className="text-rk-ink">
                {BLOCK_LABELS[r.key]}
                {r.done !== r.total && <span className="text-rk-mute"> · {r.missing.join(", ")}</span>}
              </span>
            </li>
          ))}
        </ul>
      </Group>
      {!published && (
        <>
          {adminWhatsapp || mode === "demo" ? (
            <a
              href={`https://wa.me/${adminWhatsapp || "6280000000000"}?text=${encodeURIComponent(msg)}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-13 w-full items-center justify-center rounded-2xl bg-rk-ink font-rk-sans text-[15px] font-bold text-white transition hover:bg-rk-plum"
            >
              Terbitkan via WhatsApp
            </a>
          ) : (
            <p className="rounded-2xl bg-rk-cream p-4 text-center font-rk-sans text-[13px] text-rk-mute">Hubungi admin Rayakan.my.id untuk menerbitkan undangan.</p>
          )}
          <p className="text-center font-rk-sans text-[12px] leading-snug text-rk-mute">
            {ready ? "Semua sudah lengkap." : "Masih ada isian kosong, tapi kamu tetap bisa terbitkan dan melengkapinya nanti."} Setelah pembayaran dikonfirmasi, undangan langsung aktif dan bisa dibagikan ke tamu.
          </p>
        </>
      )}
    </div>
  );
}
