"use client";

import { CalendarCheck, ChevronDown, Download, MessageCircleHeart, Search, Trash2, UserX } from "lucide-react";
import { useMemo, useState } from "react";
import { deleteWishAction } from "@/app/actions/site";
import type { WishRecord } from "@/lib/server/data";
import { ResponsiveDialog } from "./ResponsiveDialog";
import { btnGhost, card, formatDateTime, inputCls, StatCard, useAdminSite, useToast } from "./ui";

type Filter = "all" | "Hadir" | "Tidak Hadir";

function Attendance({ a }: { a: WishRecord["attendance"] }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${a === "Hadir" ? "bg-emerald-50 text-emerald-700" : "bg-rk-cream text-rk-mute"}`}>{a}</span>;
}

/** Reservasi: RSVP answers and wishes from guests. */
export function WishesManager({ initial }: { initial: WishRecord[] }) {
  const { slug } = useAdminSite();
  const [wishes, setWishes] = useState(initial);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [removing, setRemoving] = useState<WishRecord | null>(null);
  const toast = useToast();

  const stats = useMemo(() => {
    const present = wishes.filter((w) => w.attendance === "Hadir").length;
    return { total: wishes.length, present, absent: wishes.length - present };
  }, [wishes]);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return wishes.filter((w) => (filter === "all" || w.attendance === filter) && (!n || w.name.toLowerCase().includes(n) || w.message.toLowerCase().includes(n) || (w.location ?? "").toLowerCase().includes(n)));
  }, [wishes, q, filter]);
  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  const cur = Math.min(page, pages);
  const shown = list.slice((cur - 1) * pageSize, cur * pageSize);

  const exportExcel = async () => {
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Reservasi", { views: [{ state: "frozen", ySplit: 1 }] });
    ws.columns = [
      { header: "Nama", key: "name", width: 28 },
      { header: "Kehadiran", key: "a", width: 14 },
      { header: "Kota", key: "city", width: 18 },
      { header: "Ucapan", key: "msg", width: 70 },
      { header: "Waktu", key: "time", width: 20 },
    ];
    for (const w of wishes) ws.addRow({ name: w.name, a: w.attendance, city: w.location ?? "", msg: w.message, time: new Date(w.createdAt).toLocaleString("id-ID") });
    ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF120D10" } };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([await wb.xlsx.writeBuffer()], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    a.download = `reservasi-${slug}.xlsx`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const remove = async (w: WishRecord) => {
    setRemoving(null);
    setWishes((l) => l.filter((x) => x.id !== w.id));
    const r = await deleteWishAction(slug, w.id);
    if (r.ok) toast.show("Ucapan dihapus", w.name);
    else {
      setWishes((l) => [w, ...l]);
      toast.show("Gagal menghapus", r.error, "error");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <StatCard label="Total ucapan" value={stats.total} icon={<MessageCircleHeart className="h-4 w-4" />} />
        <StatCard label="Hadir" value={stats.present} icon={<CalendarCheck className="h-4 w-4" />} tone="green" />
        <StatCard label="Tidak hadir" value={stats.absent} icon={<UserX className="h-4 w-4" />} tone="mute" />
      </div>

      <section className={`${card} p-4 sm:p-5`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[15px] font-bold">Daftar Reservasi</h2>
            <p className="mt-0.5 text-[12px] text-rk-mute">{list.length} data ditemukan</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rk-mute" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama, ucapan, kota..."
                className={`${inputCls} h-9 pl-8`}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value as Filter);
                    setPage(1);
                  }}
                  className="h-9 w-full cursor-pointer appearance-none rounded-xl border border-rk-line bg-white pl-3 pr-8 text-[13px] font-medium outline-none"
                >
                  <option value="all">Semua kehadiran</option>
                  <option value="Hadir">Hadir</option>
                  <option value="Tidak Hadir">Tidak hadir</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rk-mute" />
              </div>
              <button type="button" onClick={exportExcel} disabled={!wishes.length} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-[13px] font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-40">
                <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Ekspor Excel</span>
              </button>
            </div>
          </div>
        </div>

        {shown.length ? (
          <>
            <div className="mt-4 hidden overflow-hidden md:block">
              <table className="w-full table-fixed text-left">
                <thead>
                  <tr className="border-b border-rk-line text-[10px] font-bold uppercase tracking-wider text-rk-mute">
                    <th className="w-[26%] px-3 py-2.5">Nama</th>
                    <th className="w-[112px] px-3 py-2.5">Kehadiran</th>
                    <th className="px-3 py-2.5">Ucapan</th>
                    <th className="w-[112px] px-2 py-2.5">Waktu</th>
                    <th className="w-12 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-rk-line/70">
                  {shown.map((w) => {
                    const t = formatDateTime(w.createdAt);
                    return (
                      <tr key={w.id} className="align-top hover:bg-rk-ivory">
                        <td className="px-3 py-3">
                          <p className="truncate text-[13px] font-bold">{w.name}</p>
                          {w.location && <p className="mt-0.5 truncate text-[11px] text-rk-mute">{w.location}</p>}
                        </td>
                        <td className="px-3 py-3">
                          <Attendance a={w.attendance} />
                        </td>
                        <td className="px-3 py-3 text-[12px] leading-relaxed text-rk-ink/85">
                          <p className="line-clamp-3 whitespace-pre-line" title={w.message}>
                            {w.message}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-[11px] leading-tight">
                          <div className="font-medium">{t.date}</div>
                          <div className="mt-0.5 text-[10px] text-rk-mute">{t.time}</div>
                        </td>
                        <td className="py-3 pr-2 text-right">
                          <button type="button" onClick={() => setRemoving(w)} aria-label="Hapus ucapan" className="rounded-lg p-1.5 text-rk-mute hover:bg-red-50 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 space-y-2.5 md:hidden">
              {shown.map((w) => {
                const t = formatDateTime(w.createdAt);
                return (
                  <article key={w.id} className="rounded-xl border border-rk-line bg-rk-ivory p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold">{w.name}</p>
                        <p className="text-[10px] text-rk-mute">
                          {w.location ? `${w.location} · ` : ""}
                          {t.date} {t.time}
                        </p>
                      </div>
                      <Attendance a={w.attendance} />
                    </div>
                    <p className="mt-2 whitespace-pre-line text-[12px] leading-relaxed">{w.message}</p>
                    <button type="button" onClick={() => setRemoving(w)} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-red-700">
                      <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="mt-4 flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-rk-line bg-rk-ivory px-6 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rk-cream text-rk-bronze">
              <MessageCircleHeart className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-[14px] font-bold">{wishes.length ? "Tidak ada yang cocok" : "Belum ada reservasi"}</h3>
            <p className="mt-1 max-w-[320px] text-[12px] text-rk-mute">{wishes.length ? "Coba kata kunci lain atau ubah filter kehadiran." : "Konfirmasi kehadiran dan ucapan dari tamu akan muncul di sini secara otomatis."}</p>
          </div>
        )}

        <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-rk-line pt-4 text-[12px] text-rk-mute sm:flex-row">
          <div className="flex items-center gap-1.5">
            Tampilkan
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-7 rounded-lg border border-rk-line bg-white px-2 font-bold text-rk-ink"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            dari {list.length} data
          </div>
          {pages > 1 && (
            <div className="flex items-center gap-1">
              <button type="button" disabled={cur <= 1} onClick={() => setPage(cur - 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-rk-line bg-white disabled:opacity-40">
                ‹
              </button>
              <span className="px-2 font-bold text-rk-ink">
                {cur} / {pages}
              </span>
              <button type="button" disabled={cur >= pages} onClick={() => setPage(cur + 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-rk-line bg-white disabled:opacity-40">
                ›
              </button>
            </div>
          )}
        </div>
      </section>

      <ResponsiveDialog open={!!removing} onClose={() => setRemoving(null)} title="Hapus ucapan" description={removing?.name} icon={<Trash2 className="h-4 w-4" />}>
        <p className="text-[13px] text-rk-mute">Ucapan ini akan hilang dari undangan dan tidak bisa dikembalikan.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => setRemoving(null)} className={`${btnGhost} h-10`}>
            Batal
          </button>
          <button type="button" onClick={() => removing && remove(removing)} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-red-700 px-4 text-[13px] font-bold text-white">
            <Trash2 className="h-4 w-4" /> Hapus
          </button>
        </div>
      </ResponsiveDialog>
      {toast.node}
    </div>
  );
}
