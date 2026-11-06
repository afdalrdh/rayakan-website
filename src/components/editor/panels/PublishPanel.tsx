"use client";

import { Check, MessageCircle } from "lucide-react";
import { useState } from "react";
import { requestPublishAction } from "@/app/actions/site";
import { blockLabel, getOccasion, namesOf, PAID_PLAN_IDS, rupiah, samplePhotos, type PlanId } from "@/lib/content";
import { SITE_HOST } from "@/lib/messages";
import { useEditor } from "../context";
import { Group } from "../fields";
import { useProgress } from "./ChecklistPanel";

/**
 * "Kirim ke admin": the client picks Edit Sendiri or Siap Pakai and sends the
 * draft to the admin on WhatsApp. The request also shows up in Studio →
 * Permintaan, where the owner publishes it after payment.
 */
export function PublishPanel() {
  const { content: c, plan, plans, slug, status, adminWhatsapp, expiresAt, mode } = useEditor();
  const { rows, complete, total } = useProgress();
  const url = `${SITE_HOST}/${slug}`;
  const [copied, setCopied] = useState(false);
  const paid = plans.filter((p) => PAID_PLAN_IDS.includes(p.id));
  const [choice, setChoice] = useState<PlanId>(PAID_PLAN_IDS.includes(plan.id) ? plan.id : "mandiri");
  const chosen = paid.find((p) => p.id === choice) ?? paid[0];
  const published = status === "published";
  const samples = samplePhotos(c);
  const names = namesOf(c);
  const msg = `Halo Rayakan.my.id, saya ingin menerbitkan undangan.\n\nAlamat: ${url}\nAcara: ${getOccasion(c.occasion).name} ${names.joined}\nPaket: ${chosen?.name} (${rupiah(chosen?.price ?? 0)})\n\nMohon info pembayarannya. Terima kasih!`;
  const wa = `https://wa.me/${adminWhatsapp || "6280000000000"}?text=${encodeURIComponent(msg)}`;

  if (published) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-rk-line bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-rk-sans text-[12px] font-semibold uppercase tracking-wider text-rk-mute">Alamat undangan</p>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-rk-sans text-[11px] font-bold text-emerald-700">● Sudah terbit</span>
          </div>
          <p className="mt-1 break-all font-rk-sans text-[16px] font-semibold text-rk-ink">{url}</p>
          <p className="mt-3 font-rk-sans text-[13px] text-rk-mute">
            Paket {plan.name} · aktif {expiresAt ? `sampai ${new Date(expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}` : "selamanya"}
          </p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(`https://${url}`).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              });
            }}
            className="mt-4 flex h-11 w-full items-center justify-center rounded-xl border border-rk-line font-rk-sans text-[14px] font-semibold"
          >
            {copied ? "✓ Link disalin" : "Salin link undangan"}
          </button>
          <p className="mt-3 font-rk-sans text-[12px] text-rk-mute">Untuk mengirim ke tiap tamu dengan nama masing-masing, buka halaman admin → Undangan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Group title="Pilih paket">
        <div className="space-y-2.5">
          {paid.map((p) => {
            const sel = p.id === choice;
            return (
              <button key={p.id} type="button" onClick={() => setChoice(p.id)} className={`w-full rounded-2xl border p-4 text-left transition ${sel ? "border-rk-ink bg-white ring-2 ring-rk-ink" : "border-rk-line bg-white hover:border-rk-ink/40"}`}>
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block font-rk-sans text-[15px] font-bold text-rk-ink">{p.name}</span>
                    <span className="mt-0.5 block font-rk-sans text-[12.5px] text-rk-mute">{p.tagline}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    {p.normalPrice > p.price && <span className="block font-rk-sans text-[12px] text-rk-mute line-through">{rupiah(p.normalPrice)}</span>}
                    <span className="font-rk-serif text-[24px] leading-none text-rk-ink">{rupiah(p.price)}</span>
                  </span>
                </span>
                {sel && (
                  <span className="mt-3 block space-y-1.5 border-t border-rk-line pt-3">
                    {p.benefits.slice(0, 4).map((b) => (
                      <span key={b} className="flex gap-2 font-rk-sans text-[12.5px] text-rk-ink/80">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" /> {b}
                      </span>
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Group>

      {samples.length > 0 && (
        <p className="rounded-2xl bg-rk-gold/15 p-3.5 font-rk-sans text-[12.5px] leading-snug text-rk-ink">
          <b>Masih ada foto contoh:</b> {samples.join(", ")}.{" "}
          {choice === "siap" ? "Tidak apa-apa, admin akan menggantinya dengan foto yang kamu kirim." : "Ganti dengan foto kamu sebelum diterbitkan."}
        </p>
      )}

      {mode === "demo" ? (
        <p className="rounded-2xl bg-rk-cream p-4 text-center font-rk-sans text-[13px] text-rk-mute">Simpan draf dulu (tombol Simpan di atas), lalu kirim ke admin.</p>
      ) : adminWhatsapp ? (
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            requestPublishAction(slug, choice).catch(() => {});
          }}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#1f8f4e] font-rk-sans text-[15px] font-bold text-white transition hover:brightness-95"
        >
          <MessageCircle className="h-5 w-5" /> Kirim ke admin via WhatsApp
        </a>
      ) : (
        <p className="rounded-2xl bg-rk-cream p-4 text-center font-rk-sans text-[13px] text-rk-mute">Hubungi admin Rayakan.my.id untuk menerbitkan undangan.</p>
      )}
      <p className="text-center font-rk-sans text-[12px] leading-snug text-rk-mute">
        Bayar setelah admin membalas. Undangan langsung aktif <b>selamanya</b> dan tetap bisa kamu ubah sampai hari H.
      </p>

      <Group title={`Cek kelengkapan · ${complete}/${total}`}>
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.key} className="flex items-start gap-2.5 font-rk-sans text-[13px]">
              <span className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${r.done === r.total ? "bg-emerald-600 text-white" : "border-2 border-dashed border-rk-gold"}`}>
                {r.done === r.total && <Check className="h-3 w-3" />}
              </span>
              <span className="text-rk-ink">
                {blockLabel(r.key, c.occasion)}
                {r.done !== r.total && <span className="text-rk-mute"> · {r.missing.join(", ")}</span>}
              </span>
            </li>
          ))}
        </ul>
        <p className="font-rk-sans text-[12px] text-rk-mute">Isian yang belum lengkap tetap bisa dilengkapi setelah diterbitkan.</p>
      </Group>
    </div>
  );
}
