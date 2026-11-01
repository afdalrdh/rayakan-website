"use client";

import { Download, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { deleteWishAction, listWishesAction } from "@/app/actions/site";
import type { WishRecord } from "@/lib/server/data";
import { useEditor } from "../context";
import { Segmented } from "../fields";
import { TabShell } from "./TabShell";
import { btnGhost, useToast } from "./ui";

export function WishesTab() {
  const { slug } = useEditor();
  const [data, setData] = useState<{ wishes: WishRecord[]; stats: { total: number; present: number; absent: number } } | null>(null);
  const [filter, setFilter] = useState<"all" | "Hadir" | "Tidak Hadir">("all");
  const toast = useToast();
  const reload = useCallback(() => {
    listWishesAction(slug).then(setData).catch(() => setData({ wishes: [], stats: { total: 0, present: 0, absent: 0 } }));
  }, [slug]);
  useEffect(reload, [reload]);
  const shown = (data?.wishes ?? []).filter((w) => filter === "all" || w.attendance === filter);

  const exportCsv = () => {
    const rows = [["Nama", "Kehadiran", "Kota", "Ucapan", "Waktu"], ...(data?.wishes ?? []).map((w) => [w.name, w.attendance, w.location ?? "", w.message, new Date(w.createdAt).toLocaleString("id-ID")])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
    a.download = `ucapan-${slug}.csv`;
    a.click();
  };

  return (
    <TabShell title="Ucapan & Kehadiran" note="Semua ucapan dan konfirmasi kehadiran dari tamu muncul di sini secara otomatis.">
      <div className="grid grid-cols-3 gap-2.5">
        {[
          [data?.stats.total ?? "–", "Ucapan"],
          [data?.stats.present ?? "–", "Hadir"],
          [data?.stats.absent ?? "–", "Tidak hadir"],
        ].map(([n, l]) => (
          <div key={String(l)} className="rounded-2xl border border-rk-line bg-white p-3.5">
            <p className="font-rk-sans text-[24px] font-semibold leading-none tracking-tight tabular-nums text-rk-ink">{n}</p>
            <p className="mt-1 font-rk-sans text-[12px] text-rk-mute">{l}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "Semua" },
              { value: "Hadir", label: "Hadir" },
              { value: "Tidak Hadir", label: "Tidak hadir" },
            ]}
          />
        </div>
        <button type="button" onClick={exportCsv} className={btnGhost} disabled={!data?.wishes.length}>
          <Download className="h-4 w-4" /> <span className="hidden sm:inline">Unduh</span>
        </button>
      </div>
      <div className="space-y-3">
        {data === null && (
          <p className="flex items-center justify-center gap-2 p-8 font-rk-sans text-[14px] text-rk-mute">
            <Loader2 className="h-4 w-4 animate-spin" /> Memuat ucapan…
          </p>
        )}
        {data && !shown.length && <p className="rounded-2xl border border-rk-line bg-white p-8 text-center font-rk-sans text-[14px] text-rk-mute">Belum ada ucapan.</p>}
        {shown.map((w) => (
          <article key={w.id} className="rounded-2xl border border-rk-line bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-rk-sans text-[14px] font-bold text-rk-ink">{w.name}</p>
                <p className="font-rk-sans text-[12px] text-rk-mute">
                  {[w.location, new Date(w.createdAt).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })].filter(Boolean).join(" · ")}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 font-rk-sans text-[11px] font-bold ${w.attendance === "Hadir" ? "bg-emerald-50 text-emerald-700" : "bg-rk-cream text-rk-mute"}`}>{w.attendance}</span>
            </div>
            <p className="mt-2 whitespace-pre-line font-rk-sans text-[14px] leading-relaxed text-rk-ink">{w.message}</p>
            <button
              type="button"
              onClick={async () => {
                if (!confirm("Hapus ucapan ini dari undangan?")) return;
                const r = await deleteWishAction(slug, w.id);
                if (r.ok) {
                  reload();
                  toast.show("Ucapan dihapus");
                }
              }}
              className="mt-2 font-rk-sans text-[12px] font-semibold text-red-700"
            >
              Hapus
            </button>
          </article>
        ))}
      </div>
      {toast.node}
    </TabShell>
  );
}
