"use client";

import { ExternalLink, KeyRound, MoreVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { setPublishedAction } from "@/app/actions/studio";
import { OCCASIONS, rupiah, type Plan, type PlanId } from "@/lib/content";
import { SITE_HOST } from "@/lib/messages";
import { fmtDate, ghost, input, primary } from "./ui";
import type { SiteSummary } from "./types";
import { AccessModal, DeleteModal, EditSiteModal, NewSiteModal, ResetAccessModal } from "./SiteModals";

export function SitesTab({ sites, plans }: { sites: SiteSummary[]; plans: Plan[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [modal, setModal] = useState<null | { kind: "new" } | { kind: "edit" | "access" | "delete"; site: SiteSummary } | { kind: "created"; slug: string; password: string; phone: string; title: string }>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const planOf = (id: PlanId) => plans.find((p) => p.id === id) ?? plans[0];

  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    return sites.filter((s) => (status === "all" || s.status === status) && (!n || s.slug.includes(n) || s.title.toLowerCase().includes(n) || (s.clientName ?? "").toLowerCase().includes(n)));
  }, [sites, q, status]);

  const now = new Date();
  const thisMonth = sites.filter((s) => s.publishedAt && new Date(s.publishedAt).getMonth() === now.getMonth() && new Date(s.publishedAt).getFullYear() === now.getFullYear());
  const revenue = thisMonth.reduce((n, s) => n + planOf(s.planId).price, 0);

  const togglePublish = (s: SiteSummary) =>
    start(async () => {
      const r = await setPublishedAction(s.slug, s.status !== "published");
      if (!r.ok) alert(r.error);
      router.refresh();
    });

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [sites.length, "Total undangan"],
          [sites.filter((s) => s.status === "published").length, "Sudah terbit"],
          [sites.filter((s) => s.status === "draft").length, "Draft"],
          [rupiah(revenue), "Terbit bulan ini (estimasi)"],
        ].map(([n, l]) => (
          <div key={String(l)} className="rounded-2xl border border-rk-line bg-white p-4">
            <p className="text-[26px] font-semibold leading-none tracking-tight tabular-nums">{n}</p>
            <p className="mt-1.5 text-[12px] text-rk-mute">{l}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rk-mute" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, alamat, atau klien" className={`${input} h-11 pl-10`} />
        </div>
        <div className="flex gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={`${input} h-11 w-auto`}>
            <option value="all">Semua status</option>
            <option value="published">Sudah terbit</option>
            <option value="draft">Draft</option>
          </select>
          <button type="button" onClick={() => setModal({ kind: "new" })} className={`${primary} h-11 shrink-0`}>
            <Plus className="h-4 w-4" /> Undangan baru
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-rk-line bg-white">
        {shown.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-rk-serif text-[26px]">{sites.length ? "Tidak ada yang cocok" : "Belum ada undangan"}</p>
            <p className="mt-1 text-[14px] text-rk-mute">{sites.length ? "Coba kata kunci lain." : "Buat undangan pertama untuk klien kamu."}</p>
          </div>
        ) : (
          <ul className="divide-y divide-rk-line">
            {shown.map((s) => {
              const p = planOf(s.planId);
              const expired = s.expiresAt && new Date(s.expiresAt) < now;
              return (
                <li key={s.slug} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 sm:flex-nowrap">
                  <div className="min-w-0 flex-1 basis-[220px]">
                    <p className="truncate text-[15px] font-bold">{s.title}</p>
                    <a href={`/${s.slug}`} target="_blank" rel="noreferrer" className="block truncate text-[12px] text-rk-mute hover:text-rk-ink">
                      {SITE_HOST}/{s.slug}
                    </a>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-1.5 text-[11px] font-bold">
                    <span className="rounded-full bg-rk-cream px-2.5 py-1">{OCCASIONS[s.occasion].short}</span>
                    <span className="rounded-full bg-rk-cream px-2.5 py-1">{p.name}</span>
                    {s.status === "draft" && s.requestedAt && <span className="rounded-full bg-rk-gold/30 px-2.5 py-1">Minta terbit</span>}
                    <span className={`rounded-full px-2.5 py-1 ${expired ? "bg-red-50 text-red-700" : s.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-rk-cream text-rk-mute"}`}>
                      {expired ? "Kedaluwarsa" : s.status === "published" ? "Terbit" : "Draft"}
                    </span>
                  </div>
                  <div className="hidden w-[150px] shrink-0 text-[12px] text-rk-mute md:block">
                    <p>{s.clientName || "–"}</p>
                    <p>Acara {fmtDate(s.eventDate || null)}</p>
                  </div>
                  <div className="hidden w-[110px] shrink-0 text-[12px] text-rk-mute lg:block">
                    <p>{s.guests} tamu</p>
                    <p>{s.wishes} ucapan</p>
                  </div>
                  <div className="hidden w-[120px] shrink-0 text-[12px] text-rk-mute lg:block">
                    <p>Aktif s.d.</p>
                    <p className="font-semibold text-rk-ink">{s.status === "published" ? (s.expiresAt ? fmtDate(s.expiresAt) : "Selamanya") : "–"}</p>
                  </div>
                  <div className="relative ml-auto flex shrink-0 items-center gap-1.5">
                    <a href={`/${s.slug}/admin`} className={ghost}>
                      <Pencil className="h-4 w-4" /> Admin
                    </a>
                    <button type="button" disabled={pending} onClick={() => togglePublish(s)} className={s.status === "published" ? ghost : primary}>
                      {s.status === "published" ? "Jadikan draft" : "Terbitkan"}
                    </button>
                    <button type="button" aria-label="Menu" onClick={() => setMenu(menu === s.slug ? null : s.slug)} className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-rk-ivory">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {menu === s.slug && (
                      <>
                        <button type="button" aria-label="Tutup menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenu(null)} />
                        <div className="rk-fade-in absolute right-0 top-11 z-20 w-56 overflow-hidden rounded-2xl border border-rk-line bg-white py-1.5 shadow-xl">
                          {[
                            { icon: ExternalLink, label: "Lihat pratinjau", on: () => window.open(`/${s.slug}/preview`, "_blank") },
                            { icon: Pencil, label: "Ubah paket & klien", on: () => setModal({ kind: "edit", site: s }) },
                            { icon: KeyRound, label: "Reset password & kirim akses", on: () => setModal({ kind: "access", site: s }) },
                            { icon: Trash2, label: "Hapus undangan", on: () => setModal({ kind: "delete", site: s }), danger: true },
                          ].map((m) => (
                            <button
                              key={m.label}
                              type="button"
                              onClick={() => {
                                setMenu(null);
                                m.on();
                              }}
                              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-rk-ivory ${m.danger ? "text-red-700" : ""}`}
                            >
                              <m.icon className="h-4 w-4" /> {m.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {modal?.kind === "new" && (
        <NewSiteModal
          plans={plans}
          onClose={() => setModal(null)}
          onCreated={(r) => {
            setModal({ kind: "created", ...r });
            router.refresh();
          }}
        />
      )}
      {modal?.kind === "created" && <AccessModal title="Undangan dibuat" slug={modal.slug} password={modal.password} phone={modal.phone} coupleTitle={modal.title} onClose={() => setModal(null)} />}
      {modal?.kind === "access" && <ResetAccessModal site={modal.site} onClose={() => setModal(null)} />}
      {modal?.kind === "edit" && (
        <EditSiteModal
          site={modal.site}
          plans={plans}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            router.refresh();
          }}
        />
      )}
      {modal?.kind === "delete" && (
        <DeleteModal
          site={modal.site}
          onClose={() => setModal(null)}
          onDeleted={() => {
            setModal(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
