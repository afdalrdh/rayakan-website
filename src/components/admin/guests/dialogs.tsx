"use client";

import { Download, FileSpreadsheet, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { ResponsiveDialog } from "../ResponsiveDialog";
import { btnGhost, btnPrimary, Field, inputCls, useAdminSite } from "../ui";

export function ImportDialog({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: (msg: string) => void }) {
  const { slug } = useAdminSite();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const upload = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch(`/api/sites/${slug}/guests/import`, { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Gagal mengimpor.");
      onDone(`${d.added} tamu ditambahkan${d.skipped ? `, ${d.skipped} baris dilewati` : ""}${d.overLimit ? `, ${d.overLimit} melebihi batas paket` : ""}.`);
      setFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengimpor.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <ResponsiveDialog open={open} onClose={onClose} title="Import Excel" description="Tambah banyak tamu sekaligus" icon={<FileSpreadsheet className="h-4 w-4" />}>
      <ol className="space-y-2 text-[13px] text-rk-mute">
        <li>
          1. Unduh{" "}
          <a href={`/api/sites/${slug}/guests/template`} className="font-semibold text-rk-ink underline">
            template Excel
          </a>
          .
        </li>
        <li>2. Isi kolom Nama, Nomor WhatsApp (opsional), dan Grup (opsional).</li>
        <li>3. Pilih file lalu tekan Import.</li>
      </ol>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className="mt-4 flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-rk-line bg-rk-ivory px-4 py-8 text-center transition hover:border-rk-ink/40"
      >
        <Upload className="h-6 w-6 text-emerald-700" />
        <span className="text-[13px] font-semibold">{file ? file.name : "Pilih atau tarik file .xlsx / .csv"}</span>
        <span className="text-[11px] text-rk-mute">Maksimal 2 MB</span>
      </button>
      <input ref={ref} type="file" accept=".xlsx,.csv" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-700">{error}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onClose} className={`${btnGhost} h-10`}>
          Batal
        </button>
        <button type="button" disabled={!file || busy} onClick={upload} className={`${btnPrimary} h-10`}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Import
        </button>
      </div>
    </ResponsiveDialog>
  );
}

export function ConfirmDelete({ open, count, all, onClose, onConfirm, onBackup }: { open: boolean; count: number; all?: boolean; onClose: () => void; onConfirm: () => void; onBackup?: () => void }) {
  const [text, setText] = useState("");
  const need = "Hapus semua data";
  const ok = !all || text === need;
  return (
    <ResponsiveDialog open={open} onClose={onClose} title={all ? "Hapus semua tamu" : count > 1 ? `Hapus ${count} tamu` : "Hapus tamu"} description={`${count} tamu akan dihapus permanen`} icon={<Trash2 className="h-4 w-4" />}>
      <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-[12px] leading-relaxed text-red-800">Tindakan ini tidak bisa dibatalkan. Link undangan yang sudah dibagikan ke tamu tersebut tidak akan menampilkan nama mereka lagi.</p>
      {all && (
        <Field label={`Ketik "${need}" untuk melanjutkan`}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={need} className={`${inputCls} mt-1`} />
        </Field>
      )}
      <div className="mt-5 flex flex-col gap-2">
        {onBackup && (
          <button type="button" onClick={onBackup} className={`${btnGhost} h-10`}>
            <Download className="h-4 w-4 text-emerald-700" /> Unduh backup Excel dulu
          </button>
        )}
        <button type="button" disabled={!ok} onClick={onConfirm} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-red-700 text-[13px] font-bold text-white hover:bg-red-800 disabled:opacity-40">
          <Trash2 className="h-4 w-4" /> Hapus
        </button>
        <button type="button" onClick={onClose} className={`${btnGhost} h-10`}>
          Batal
        </button>
      </div>
    </ResponsiveDialog>
  );
}

/* ------------------------------ main ------------------------------ */
