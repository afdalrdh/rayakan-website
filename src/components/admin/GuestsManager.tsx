"use client";

import { CheckCheck, ChevronDown, Download, FileSpreadsheet, Info, MailPlus, MoreVertical, Pencil, Plus, RotateCcw, Search, Send, Trash2, Undo2, Upload, Users, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { addGuestsAction, deleteGuestsAction, listGuestsAction, markSentAction, markSentBulkAction, updateGuestAction } from "@/app/actions/guests";
import { normalizePhone, renderWaMessage } from "@/lib/messages";
import type { GuestRecord } from "@/lib/records";
import { ResponsiveDialog } from "./ResponsiveDialog";
import { SendConfirmPopover, type SendConfirmAnchor } from "./SendConfirmPopover";
import { useSendPreference, writeSendPreference } from "./send-preference";
import { TableOptionsMenu } from "./TableOptionsMenu";
import { btnGhost, btnPrimary, card, copyText, formatDateTime, formatPhone, inputCls, StatCard, useAdminSite, useToast } from "./ui";
import { ConfirmDelete, ImportDialog } from "./guests/dialogs";
import { GuestForm } from "./guests/GuestForm";
import { Checkbox, EmptyIllustration, ShareButtons, sortIcon, StatusBadge } from "./guests/parts";

type StatusFilter = "all" | "unsent" | "sent";
type SortField = "name" | "createdAt";

export function GuestsManager({ initialGuests, waTemplate }: { initialGuests: GuestRecord[]; waTemplate: string | null }) {
  const { slug, plan, status, siteUrl } = useAdminSite();
  const [guests, setGuests] = useState(initialGuests);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [flash, setFlash] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [dialog, setDialog] = useState<null | "add" | "import" | "deleteAll" | "deleteSelected" | { edit: GuestRecord } | { remove: GuestRecord }>(null);
  const [menu, setMenu] = useState<{ g: GuestRecord; top: number; right: number } | null>(null);
  const [confirm, setConfirm] = useState<{ g: GuestRecord; kind: "copy" | "send"; anchor: SendConfirmAnchor } | null>(null);
  const pref = useSendPreference();
  const toast = useToast();
  const closeConfirm = useCallback(() => setConfirm(null), []);

  const reload = useCallback(() => listGuestsAction(slug).then(setGuests).catch(() => {}), [slug]);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [menu]);

  const linkOf = (g: GuestRecord) => `${siteUrl}/${slug}/${g.slug}`;
  const messageOf = (g: GuestRecord) => renderWaMessage(waTemplate, g.name, linkOf(g));

  const stats = useMemo(() => {
    const sent = guests.filter((g) => g.sentAt).length;
    return { total: guests.length, sent, unsent: guests.length - sent };
  }, [guests]);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    const qd = q.replace(/\D/g, "");
    const out = guests.filter((g) => {
      if (filter === "sent" && !g.sentAt) return false;
      if (filter === "unsent" && g.sentAt) return false;
      if (!q) return true;
      const phone = normalizePhone(g.phone);
      return g.name.toLowerCase().includes(q) || (g.groupLabel ?? "").toLowerCase().includes(q) || (qd.length >= 3 && (phone.includes(qd) || `0${phone.slice(2)}`.includes(qd)));
    });
    out.sort((a, b) => {
      const cmp = sortField === "name" ? a.name.localeCompare(b.name, "id") : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortAsc ? cmp : -cmp;
    });
    return out;
  }, [guests, search, filter, sortField, sortAsc]);

  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  const cur = Math.min(page, pages);
  const shown = list.slice((cur - 1) * pageSize, cur * pageSize);
  const allShownSelected = shown.length > 0 && shown.every((g) => selected.includes(g.id));

  const flashKey = (k: string) => {
    setFlash(k);
    setTimeout(() => setFlash(null), 1800);
  };

  const setSent = async (g: GuestRecord, sent: boolean) => {
    const prev = g.sentAt;
    if (sent && prev) return;
    setGuests((l) => l.map((x) => (x.id === g.id ? { ...x, sentAt: sent ? new Date().toISOString() : null } : x)));
    const r = await markSentAction(slug, g.id, sent).catch(() => ({ ok: false as const, error: "" }));
    if (!r.ok) setGuests((l) => l.map((x) => (x.id === g.id ? { ...x, sentAt: prev } : x)));
  };

  const bulkSent = async (sent: boolean) => {
    const ids = [...selected];
    const now = new Date().toISOString();
    setGuests((l) => l.map((x) => (ids.includes(x.id) ? { ...x, sentAt: sent ? x.sentAt ?? now : null } : x)));
    setSelected([]);
    const r = await markSentBulkAction(slug, ids, sent);
    if (r.ok) toast.show(sent ? "Ditandai terkirim" : "Ditandai belum dikirim", `${ids.length} tamu diperbarui.`);
    else reload();
  };

  const runShare = (g: GuestRecord, kind: "copy" | "send", mark: boolean) => {
    const text = messageOf(g);
    if (kind === "copy") {
      copyText(text).then(() => {
        flashKey(`${g.id}-wa`);
        toast.show(mark ? "Pesan disalin · ditandai terkirim" : "Pesan WhatsApp disalin", `Pesan untuk "${g.name}" siap ditempel.`, "wa");
      });
    } else {
      const phone = normalizePhone(g.phone);
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
      flashKey(`${g.id}-send`);
      toast.show(mark ? "WhatsApp dibuka · ditandai terkirim" : "WhatsApp dibuka", phone ? `Chat ${formatPhone(g.phone)} dibuka.` : `Pilih kontak "${g.name}" lalu kirim.`, "wa");
    }
    if (mark) setSent(g, true);
  };

  const requestShare = (e: React.MouseEvent<HTMLButtonElement>, g: GuestRecord, kind: "copy" | "send") => {
    if (g.sentAt || pref !== "ask") {
      runShare(g, kind, !g.sentAt && pref === "mark");
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    setConfirm({ g, kind, anchor: { top: r.top, bottom: r.bottom, left: r.left, right: r.right } });
  };

  const add = async (f: { name: string; phone: string; groupLabel: string }) => {
    setBusy(true);
    const r = await addGuestsAction(slug, [f]);
    setBusy(false);
    if (!r.ok) return toast.show("Tamu belum bisa ditambahkan", r.error, "error");
    toast.show("Tamu ditambahkan", f.name);
    setFormKey((k) => k + 1);
    setDialog(null);
    reload();
  };

  const saveEdit = async (g: GuestRecord, f: { name: string; phone: string; groupLabel: string }) => {
    setBusy(true);
    const r = await updateGuestAction(slug, g.id, f);
    setBusy(false);
    if (!r.ok) return toast.show("Perubahan belum tersimpan", r.error, "error");
    setDialog(null);
    toast.show("Tamu diperbarui", f.name);
    reload();
  };

  const remove = async (ids: number[]) => {
    setGuests((l) => l.filter((g) => !ids.includes(g.id)));
    setSelected((s) => s.filter((id) => !ids.includes(id)));
    setDialog(null);
    const r = await deleteGuestsAction(slug, ids);
    if (r.ok) toast.show(`${ids.length} tamu dihapus`);
    else {
      toast.show("Gagal menghapus", r.error, "error");
      reload();
    }
  };

  const exportExcel = async () => {
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Daftar Tamu", { views: [{ state: "frozen", ySplit: 1 }] });
    ws.columns = [
      { header: "Nama", key: "name", width: 30 },
      { header: "Nomor WhatsApp", key: "phone", width: 18 },
      { header: "Grup", key: "group", width: 18 },
      { header: "Status", key: "status", width: 12 },
      { header: "Link Undangan", key: "link", width: 48 },
      { header: "Pesan WhatsApp", key: "wa", width: 60 },
    ];
    for (const g of guests) ws.addRow({ name: g.name, phone: formatPhone(g.phone).replace(/-/g, ""), group: g.groupLabel ?? "", status: g.sentAt ? "Terkirim" : "Belum", link: linkOf(g), wa: messageOf(g) });
    const head = ws.getRow(1);
    head.font = { bold: true, color: { argb: "FFFFFFFF" } };
    head.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF120D10" } };
    const blob = new Blob([await wb.xlsx.writeBuffer()], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `daftar-tamu-${slug}.xlsx`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const sortBy = (f: SortField) => {
    if (sortField === f) setSortAsc((v) => !v);
    else {
      setSortField(f);
      setSortAsc(f === "name");
    }
  };

  const openMenu = (e: React.MouseEvent<HTMLButtonElement>, g: GuestRecord) => {
    e.stopPropagation();
    if (menu?.g.id === g.id) return setMenu(null);
    const r = e.currentTarget.getBoundingClientRect();
    setMenu({ g, top: r.top >= 170 ? r.top - 150 : r.bottom + 4, right: Math.max(8, window.innerWidth - r.right) });
  };

  return (
    <div className="space-y-4">
      {status !== "published" && (
        <p className="flex items-start gap-2.5 rounded-2xl border border-[#f0e2c0] bg-[#fdf7e8] px-4 py-3 text-[13px] text-[#7a5a17]">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Undangan belum terbit. Daftar tamu sudah bisa disiapkan; link tamu aktif setelah undangan diterbitkan.
        </p>
      )}

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <StatCard label="Total" value={plan.guestLimit === null ? stats.total : `${stats.total}/${plan.guestLimit}`} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Sudah dikirim" value={stats.sent} icon={<CheckCheck className="h-4 w-4" />} tone="green" />
        <StatCard label="Belum dikirim" value={stats.unsent} icon={<Send className="h-4 w-4" />} tone="mute" />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[320px_1fr] lg:gap-5">
        <div className="hidden space-y-4 lg:block">
          <section className={`${card} p-4`}>
            <div className="mb-3.5 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rk-cream">
                <MailPlus className="h-4 w-4" />
              </span>
              <h2 className="text-[14px] font-bold">Tambah Tamu</h2>
            </div>
            <GuestForm key={formKey} submitLabel={busy ? "Menyimpan..." : "Tambah tamu"} busy={busy} onSubmit={add} />
          </section>
          <section className={`${card} p-4`}>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <FileSpreadsheet className="h-4 w-4" />
              </span>
              <h2 className="text-[14px] font-bold">Import Excel</h2>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-rk-mute">Tambahkan banyak tamu sekaligus dari file Excel.</p>
            <button type="button" onClick={() => setDialog("import")} className={`${btnGhost} mt-3 w-full`}>
              <Upload className="h-4 w-4" /> Import Excel
            </button>
          </section>
          <section className="rounded-2xl border border-dashed border-rk-line p-4 text-[12px] leading-relaxed text-rk-mute">
            Isi pesan WhatsApp diatur di{" "}
            <Link href={`/${slug}/admin/pengaturan`} className="font-semibold text-rk-ink underline">
              Pengaturan
            </Link>
            .
          </section>
        </div>

        <section className={`${card} min-w-0 p-4 sm:p-5`}>
          {selected.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rk-sand bg-rk-cream px-3.5 py-2.5">
              <span className="flex items-center gap-2.5 text-[13px] font-bold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rk-ink text-[11px] text-white">{selected.length}</span>
                tamu dipilih
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => setSelected([])} className={btnGhost}>
                  <X className="h-3.5 w-3.5" /> Batal
                </button>
                <button type="button" onClick={() => bulkSent(false)} className={btnGhost} title="Tandai belum dikirim">
                  <Undo2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Belum dikirim</span>
                </button>
                <button type="button" onClick={() => bulkSent(true)} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 text-[13px] font-semibold text-emerald-800 hover:bg-emerald-100">
                  <CheckCheck className="h-3.5 w-3.5" /> Tandai terkirim
                </button>
                <button type="button" onClick={() => setDialog("deleteSelected")} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-red-700 px-3.5 text-[13px] font-bold text-white hover:bg-red-800">
                  <Trash2 className="h-3.5 w-3.5" /> Hapus
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="shrink-0">
                <h2 className="text-[15px] font-bold">Daftar Tamu</h2>
                <p className="mt-0.5 text-[12px] text-rk-mute">{list.length} data ditemukan</p>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <div className="relative w-full sm:max-w-80 sm:flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rk-mute" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Cari nama, grup, nomor..."
                    className={`${inputCls} h-9 pl-8`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative min-w-0 flex-1 sm:flex-initial">
                    <select
                      value={filter}
                      onChange={(e) => {
                        setFilter(e.target.value as StatusFilter);
                        setPage(1);
                      }}
                      className="h-9 w-full cursor-pointer appearance-none rounded-xl border border-rk-line bg-white pl-3 pr-8 text-[13px] font-medium outline-none hover:border-rk-ink/40"
                    >
                      <option value="all">Semua status</option>
                      <option value="unsent">Belum dikirim</option>
                      <option value="sent">Sudah dikirim</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rk-mute" />
                  </div>
                  <button type="button" onClick={exportExcel} disabled={!guests.length} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-[13px] font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-40" title="Ekspor daftar tamu ke Excel">
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Ekspor Excel</span>
                  </button>
                  <TableOptionsMenu preference={pref} onChangePreference={(m) => writeSendPreference(m)} totalCount={guests.length} onDeleteAll={() => setDialog("deleteAll")} />
                </div>
              </div>
            </div>
          )}

          {list.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="mt-4 hidden overflow-hidden md:block">
                <table className="w-full table-fixed border-collapse text-left">
                  <thead>
                    <tr className="border-b border-rk-line text-[10px] font-bold uppercase tracking-wider text-rk-mute">
                      <th className="w-9 py-2.5 pl-3 pr-1">
                        <Checkbox checked={allShownSelected} partial={selected.length > 0 && !allShownSelected} onClick={() => setSelected(allShownSelected ? [] : shown.map((g) => g.id))} label="Pilih semua" />
                      </th>
                      <th className="whitespace-nowrap px-3 py-2.5">
                        <button type="button" onClick={() => sortBy("name")} className="inline-flex items-center uppercase hover:text-rk-ink">
                          Nama tamu {sortIcon(sortField === "name", sortAsc)}
                        </button>
                      </th>
                      <th className="w-[116px] py-2.5 pl-3 pr-4">Status</th>
                      <th className="w-[108px] px-2 py-2.5">
                        <button type="button" onClick={() => sortBy("createdAt")} className="inline-flex items-center uppercase hover:text-rk-ink">
                          Dibuat {sortIcon(sortField === "createdAt", sortAsc)}
                        </button>
                      </th>
                      <th className="w-[216px] px-2 py-2.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rk-line/70">
                    {shown.map((g) => {
                      const sel = selected.includes(g.id);
                      const t = formatDateTime(g.createdAt);
                      return (
                        <tr key={g.id} className={`transition hover:bg-rk-ivory ${sel ? "bg-rk-cream/60" : ""}`}>
                          <td className="py-2.5 pl-3 pr-1">
                            <Checkbox checked={sel} onClick={() => setSelected((s) => (sel ? s.filter((x) => x !== g.id) : [...s, g.id]))} label="Pilih tamu" />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="truncate text-[13px] font-bold" title={g.name}>
                                {g.name}
                              </span>
                              {g.groupLabel && <span className="shrink-0 rounded-full bg-rk-cream px-2 py-0.5 text-[10px] font-semibold text-rk-bronze">{g.groupLabel}</span>}
                            </div>
                            {g.phone && <span className="mt-0.5 block text-[11px] tabular-nums text-rk-mute">{formatPhone(g.phone)}</span>}
                          </td>
                          <td className="whitespace-nowrap py-2.5 pl-3 pr-4">
                            <StatusBadge g={g} onToggle={() => setSent(g, !g.sentAt)} />
                          </td>
                          <td className="whitespace-nowrap px-2 py-2.5 text-[11px] leading-tight">
                            <div className="font-medium">{t.date}</div>
                            <div className="mt-0.5 text-[10px] text-rk-mute">{t.time}</div>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2.5 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <ShareButtons
                                g={g}
                                flash={flash}
                                onLink={() => copyText(linkOf(g)).then(() => (flashKey(`${g.id}-link`), toast.show("Link disalin", g.name)))}
                                onCopy={(e) => requestShare(e, g, "copy")}
                                onSend={(e) => requestShare(e, g, "send")}
                              />
                              <button type="button" onClick={(e) => openMenu(e, g)} aria-label="Menu lainnya" className="flex h-7 w-7 items-center justify-center rounded-lg border border-rk-line bg-white text-rk-mute hover:bg-rk-ivory hover:text-rk-ink">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Phone cards */}
              <div className="mt-3 space-y-2.5 md:hidden">
                {shown.map((g) => {
                  const sel = selected.includes(g.id);
                  const t = formatDateTime(g.createdAt);
                  return (
                    <div key={g.id} className={`space-y-2.5 rounded-xl border p-3 ${sel ? "border-rk-sand bg-rk-cream/60" : "border-rk-line bg-rk-ivory"}`}>
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5">
                          <Checkbox checked={sel} onClick={() => setSelected((s) => (sel ? s.filter((x) => x !== g.id) : [...s, g.id]))} label="Pilih tamu" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-bold leading-snug">{g.name}</p>
                          {g.phone && <p className="text-[11px] tabular-nums text-rk-mute">{formatPhone(g.phone)}</p>}
                          <p className="mt-0.5 text-[10px] text-rk-mute">
                            {g.groupLabel ? `${g.groupLabel} · ` : ""}
                            {t.date} {t.time}
                          </p>
                        </div>
                        <StatusBadge g={g} onToggle={() => setSent(g, !g.sentAt)} />
                        <button type="button" onClick={(e) => openMenu(e, g)} aria-label="Menu lainnya" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-rk-line bg-white text-rk-mute">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShareButtons
                          full
                          g={g}
                          flash={flash}
                          onLink={() => copyText(linkOf(g)).then(() => (flashKey(`${g.id}-link`), toast.show("Link disalin", g.name)))}
                          onCopy={(e) => requestShare(e, g, "copy")}
                          onSend={(e) => requestShare(e, g, "send")}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="mt-4 flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-rk-line bg-rk-ivory px-6 py-8 text-center">
              <EmptyIllustration searching={guests.length > 0} />
              <h3 className="mt-4 text-[14px] font-bold">{guests.length ? "Tidak ada tamu yang cocok" : "Belum ada tamu"}</h3>
              <p className="mt-1 max-w-[320px] text-[12px] leading-[18px] text-rk-mute">{guests.length ? "Coba kata kunci lain atau ubah filter status." : "Tambahkan tamu pertama atau impor daftar tamu sekaligus dari Excel."}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {guests.length ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                    className={btnGhost}
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset pencarian
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={() => setDialog("add")} className={btnPrimary}>
                      <Plus className="h-3.5 w-3.5" /> Tambah tamu
                    </button>
                    <button type="button" onClick={() => setDialog("import")} className={btnGhost}>
                      <Upload className="h-3.5 w-3.5 text-emerald-700" /> Import Excel
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-rk-line pt-4 text-[12px] text-rk-mute sm:flex-row">
            <div className="flex items-center gap-1.5">
              Tampilkan
              <span className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="h-7 cursor-pointer appearance-none rounded-lg border border-rk-line bg-white pl-2.5 pr-6 font-bold text-rk-ink outline-none"
                >
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2" />
              </span>
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
      </div>

      {/* Row menu */}
      {menu && (
        <div style={{ position: "fixed", top: menu.top, right: menu.right, zIndex: 80 }} onClick={(e) => e.stopPropagation()} className="rk-fade-in w-48 rounded-xl border border-rk-line bg-white py-1 text-[12px] font-semibold shadow-2xl">
          <button type="button" onClick={() => (setDialog({ edit: menu.g }), setMenu(null))} className="flex w-full items-center gap-2 px-3 py-2 hover:bg-rk-ivory">
            <Pencil className="h-3.5 w-3.5 text-rk-bronze" /> Edit tamu
          </button>
          <button type="button" onClick={() => (setSent(menu.g, !menu.g.sentAt), setMenu(null))} className="flex w-full items-center gap-2 px-3 py-2 hover:bg-rk-ivory">
            {menu.g.sentAt ? <Undo2 className="h-3.5 w-3.5 text-rk-mute" /> : <CheckCheck className="h-3.5 w-3.5 text-emerald-700" />}
            {menu.g.sentAt ? "Tandai belum dikirim" : "Tandai sudah dikirim"}
          </button>
          <button type="button" onClick={() => (setDialog({ remove: menu.g }), setMenu(null))} className="flex w-full items-center gap-2 px-3 py-2 text-red-700 hover:bg-red-50">
            <Trash2 className="h-3.5 w-3.5" /> Hapus tamu
          </button>
        </div>
      )}

      {confirm && <SendConfirmPopover key={`${confirm.g.id}-${confirm.kind}`} anchor={confirm.anchor} guestName={confirm.g.name} kind={confirm.kind} onClose={closeConfirm} onChoose={(mark, remember) => {
        const c = confirm;
        setConfirm(null);
        if (remember) writeSendPreference(mark ? "mark" : "skip");
        runShare(c.g, c.kind, mark);
      }} />}

      <ResponsiveDialog open={dialog === "add"} onClose={() => setDialog(null)} title="Tambah Tamu" icon={<MailPlus className="h-4 w-4" />}>
        <GuestForm key={`m${formKey}`} submitLabel="Tambah tamu" busy={busy} onSubmit={add} />
      </ResponsiveDialog>
      {dialog && typeof dialog === "object" && "edit" in dialog && (
        <ResponsiveDialog open onClose={() => setDialog(null)} title="Edit Tamu" description={dialog.edit.name} icon={<Pencil className="h-4 w-4" />}>
          <GuestForm initial={dialog.edit} submitLabel="Simpan perubahan" busy={busy} onSubmit={(f) => saveEdit(dialog.edit, f)} onCancel={() => setDialog(null)} />
        </ResponsiveDialog>
      )}
      {dialog && typeof dialog === "object" && "remove" in dialog && <ConfirmDelete open count={1} onClose={() => setDialog(null)} onConfirm={() => remove([dialog.remove.id])} />}
      {dialog === "deleteSelected" && <ConfirmDelete open count={selected.length} onClose={() => setDialog(null)} onConfirm={() => remove(selected)} />}
      {dialog === "deleteAll" && <ConfirmDelete open all count={guests.length} onClose={() => setDialog(null)} onBackup={exportExcel} onConfirm={() => remove(guests.map((g) => g.id))} />}
      <ImportDialog
        open={dialog === "import"}
        onClose={() => setDialog(null)}
        onDone={(msg) => {
          setDialog(null);
          toast.show("Import selesai", msg);
          reload();
        }}
      />

      <button type="button" onClick={() => setDialog("add")} aria-label="Tambah tamu" className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-rk-ink text-white shadow-2xl transition active:scale-95 lg:hidden">
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </button>
      {toast.node}
    </div>
  );
}
