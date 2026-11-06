"use client";

import { MessageCircle, ExternalLink, Pencil, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setPublishedAction } from "@/app/actions/studio";
import { OCCASIONS, rupiah, type Plan, type PlanId } from "@/lib/content";
import { SITE_HOST, SITE_URL, waLink } from "@/lib/messages";
import { btn, fmtDate, ghost, primary } from "./ui";
import type { SiteSummary } from "./types";

export function RequestsTab({ sites, plans }: { sites: SiteSummary[]; plans: Plan[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const list = sites
    .filter((s) => s.source === "self" && s.status === "draft")
    .sort((a, b) => (b.requestedAt ?? "").localeCompare(a.requestedAt ?? "") || b.createdAt.localeCompare(a.createdAt));
  const planName = (id: PlanId | null) => (id ? plans.find((p) => p.id === id) : null);
  const publish = (s: SiteSummary) =>
    start(async () => {
      if (!confirm(`Terbitkan ${s.title} dengan paket ${planName(s.requestPlan ?? "mandiri")?.name}? Pastikan pembayaran sudah diterima.`)) return;
      const r = await setPublishedAction(s.slug, true);
      if (!r.ok) alert(r.error);
      router.refresh();
    });
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-rk-line bg-white p-4 text-[13px] text-rk-mute">
        Draf dari <b className="text-rk-ink">Coba Gratis</b>. Yang sudah menekan <b className="text-rk-ink">Kirim ke admin</b> tampil paling atas. Setelah pembayaran diterima, tekan Terbitkan: paket yang diminta otomatis dipakai dan masa aktif dimulai.
      </div>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-rk-line bg-white p-10 text-center">
          <p className="font-rk-serif text-[26px]">Belum ada draf masuk</p>
          <p className="mt-1 text-[14px] text-rk-mute">Draf muncul di sini saat pengunjung menyimpan undangan dari Coba Gratis.</p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {list.map((s) => {
            const want = planName(s.requestPlan);
            const hello = `Halo ${s.clientName ?? ""}, terima kasih sudah membuat draf undangan ${s.title} di Rayakan.my.id 🙏\n\n${SITE_URL}/${s.slug}\n\n${want ? `Paket ${want.name}: ${rupiah(want.price)}.` : "Ada yang bisa kami bantu?"}`;
            return (
              <li key={s.slug} className={`rounded-2xl border bg-white p-4 ${s.requestedAt ? "border-rk-gold ring-1 ring-rk-gold/50" : "border-rk-line"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-bold">{s.title}</p>
                    <p className="truncate text-[12px] text-rk-mute">
                      {SITE_HOST}/{s.slug} · {OCCASIONS[s.occasion].name}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${s.requestedAt ? "bg-rk-gold/30 text-rk-ink" : "bg-rk-cream text-rk-mute"}`}>{s.requestedAt ? `Minta terbit · ${want?.name ?? ""}` : "Draf tersimpan"}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-rk-mute">
                  <p>
                    Klien: <b className="text-rk-ink">{s.clientName || "–"}</b>
                  </p>
                  <p>Acara: {fmtDate(s.eventDate || null)}</p>
                  <p>Dibuat: {fmtDate(s.createdAt)}</p>
                  <p>{s.requestedAt ? `Dikirim: ${fmtDate(s.requestedAt)}` : want ? "" : "Belum kirim ke admin"}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.clientPhone && (
                    <a href={waLink(s.clientPhone, hello)} target="_blank" rel="noreferrer" className={`${btn} bg-[#1f8f4e] text-white`}>
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  )}
                  <a href={`/${s.slug}/preview`} target="_blank" rel="noreferrer" className={ghost}>
                    <ExternalLink className="h-4 w-4" /> Pratinjau
                  </a>
                  <a href={`/${s.slug}/editor`} target="_blank" rel="noreferrer" className={ghost}>
                    <Pencil className="h-4 w-4" /> Edit
                  </a>
                  <button type="button" disabled={pending} onClick={() => publish(s)} className={primary}>
                    <Send className="h-4 w-4" /> Terbitkan
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
