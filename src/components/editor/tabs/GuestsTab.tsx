"use client";

import { Check, Copy, Download, FileSpreadsheet, Loader2, MessageSquareText, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { addGuestsAction, deleteGuestsAction, listGuestsAction, markSentAction, saveWaTemplateAction, updateGuestAction } from "@/app/actions/site";
import { DEFAULT_WA_TEMPLATE, renderWaMessage, SITE_HOST, SITE_URL, waLink } from "@/lib/messages";
import type { GuestRecord } from "@/lib/server/data";
import { useEditor } from "../context";
import { Area, Field, Group, Segmented, Text, inputCls } from "../fields";
import { TabShell } from "./TabShell";
import { btnGhost, btnPrimary, Modal, useToast } from "./ui";

export function GuestsTab({ waTemplate: initialTemplate }: { waTemplate: string | null }) {
  const { slug, plan, status } = useEditor();
  const [guests, setGuests] = useState<GuestRecord[] | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "unsent" | "sent">("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [modal, setModal] = useState<null | "add" | "import" | "template" | { edit: GuestRecord }>(null);
  const [template, setTemplate] = useState(initialTemplate ?? "");
  const [pending, start] = useTransition();
  const toast = useToast();

  const reload = useCallback(() => {
    listGuestsAction(slug).then(setGuests).catch(() => setGuests([]));
  }, [slug]);
  useEffect(reload, [reload]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (guests ?? []).filter(
      (g) =>
        (!needle || g.name.toLowerCase().includes(needle) || (g.groupLabel ?? "").toLowerCase().includes(needle)) &&
        (filter === "all" || (filter === "sent" ? !!g.sentAt : !g.sentAt)),
    );
  }, [guests, q, filter]);

  const linkOf = (g: GuestRecord) => `${SITE_URL}/${slug}/${g.slug}`;
  const messageOf = (g: GuestRecord) => renderWaMessage(template, g.name, linkOf(g));

  const sendWa = (g: GuestRecord) => {
    const text = messageOf(g);
    const url = g.phone ? waLink(g.phone, text) : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
    if (!g.sentAt) {
      setGuests((list) => list?.map((x) => (x.id === g.id ? { ...x, sentAt: new Date().toISOString() } : x)) ?? null);
      markSentAction(slug, g.id, true);
    }
  };

  const total = guests?.length ?? 0;
  const sentCount = guests?.filter((g) => g.sentAt).length ?? 0;
  const limitText = plan.guestLimit === null ? "tanpa batas" : `maks. ${plan.guestLimit}`;

  return (
    <TabShell title="Tamu & Kirim WA" note={status === "published" ? "Setiap tamu punya link sendiri dengan namanya di sampul undangan. Tekan tombol WhatsApp untuk mengirim." : "Undangan belum terbit. Kamu sudah bisa menyiapkan daftar tamu; link tamu aktif setelah undangan diterbitkan."}>
      <div className="grid grid-cols-3 gap-2.5">
        {[
          [total, `Tamu · ${limitText}`],
          [sentCount, "Terkirim"],
          [total - sentCount, "Belum dikirim"],
        ].map(([n, l]) => (
          <div key={String(l)} className="rounded-2xl border border-rk-line bg-white p-3.5">
            <p className="font-rk-sans text-[24px] font-semibold leading-none tracking-tight tabular-nums text-rk-ink">{n}</p>
            <p className="mt-1 font-rk-sans text-[12px] text-rk-mute">{l}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setModal("add")} className={btnPrimary}>
          <Plus className="h-4 w-4" /> Tambah tamu
        </button>
        <button type="button" onClick={() => setModal("import")} className={btnGhost}>
          <FileSpreadsheet className="h-4 w-4" /> Import Excel
        </button>
        <button type="button" onClick={() => setModal("template")} className={btnGhost}>
          <MessageSquareText className="h-4 w-4" /> Pesan WhatsApp
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rk-mute" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama atau grup" className={`${inputCls} pl-10`} />
        </div>
        <div className="sm:w-[300px]">
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "Semua" },
              { value: "unsent", label: "Belum" },
              { value: "sent", label: "Terkirim" },
            ]}
          />
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-2xl bg-rk-ink px-4 py-2.5 text-white">
          <span className="font-rk-sans text-[13px] font-semibold">{selected.size} dipilih</span>
          <span className="flex gap-2">
            <button type="button" onClick={() => setSelected(new Set())} className="rounded-lg px-3 py-1.5 font-rk-sans text-[13px] hover:bg-white/10">
              Batal
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (!confirm(`Hapus ${selected.size} tamu?`)) return;
                start(async () => {
                  const r = await deleteGuestsAction(slug, [...selected]);
                  if (r.ok) {
                    setSelected(new Set());
                    reload();
                    toast.show("Tamu dihapus");
                  } else toast.show(r.error);
                });
              }}
              className="rounded-lg bg-red-600 px-3 py-1.5 font-rk-sans text-[13px] font-semibold"
            >
              Hapus
            </button>
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-rk-line bg-white">
        {guests === null ? (
          <p className="flex items-center justify-center gap-2 p-8 font-rk-sans text-[14px] text-rk-mute">
            <Loader2 className="h-4 w-4 animate-spin" /> Memuat tamu…
          </p>
        ) : shown.length === 0 ? (
          <div className="p-8 text-center font-rk-sans">
            <p className="text-[15px] font-semibold text-rk-ink">{total ? "Tidak ada yang cocok" : "Belum ada tamu"}</p>
            <p className="mt-1 text-[13px] text-rk-mute">{total ? "Coba kata kunci lain." : "Tambah satu per satu, tempel banyak nama sekaligus, atau import dari Excel."}</p>
          </div>
        ) : (
          <ul className="divide-y divide-rk-line">
            {shown.map((g) => {
              const sel = selected.has(g.id);
              return (
                <li key={g.id} className={`flex items-center gap-3 px-3 py-3 sm:px-4 ${sel ? "bg-rk-cream" : ""}`}>
                  <button
                    type="button"
                    aria-label="Pilih"
                    onClick={() =>
                      setSelected((s) => {
                        const n = new Set(s);
                        if (n.has(g.id)) n.delete(g.id);
                        else n.add(g.id);
                        return n;
                      })
                    }
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${sel ? "border-rk-ink bg-rk-ink text-white" : "border-rk-line"}`}
                  >
                    {sel && <Check className="h-3.5 w-3.5" />}
                  </button>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-rk-sans text-[14px] font-semibold text-rk-ink">{g.name}</span>
                      {g.groupLabel && <span className="hidden shrink-0 rounded-full bg-rk-cream px-2 py-0.5 font-rk-sans text-[11px] font-semibold text-rk-mute sm:inline">{g.groupLabel}</span>}
                    </span>
                    <span className="block truncate font-rk-sans text-[12px] text-rk-mute">
                      {SITE_HOST}/{slug}/{g.slug}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label="Salin pesan"
                    onClick={() => navigator.clipboard.writeText(messageOf(g)).then(() => toast.show("Pesan undangan disalin"))}
                    className="hidden h-9 w-9 items-center justify-center rounded-lg text-rk-mute hover:bg-rk-ivory sm:flex"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Ubah" onClick={() => setModal({ edit: g })} className="flex h-9 w-9 items-center justify-center rounded-lg text-rk-mute hover:bg-rk-ivory">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => sendWa(g)}
                    className={`flex h-9 shrink-0 items-center gap-1 rounded-full px-3 font-rk-sans text-[12px] font-bold ${g.sentAt ? "bg-emerald-50 text-emerald-700" : "bg-[#25D366] text-white"}`}
                  >
                    {g.sentAt ? "✓ Terkirim" : "WhatsApp"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {modal === "add" && (
        <AddGuestModal
          onClose={() => setModal(null)}
          onDone={(n) => {
            setModal(null);
            reload();
            toast.show(`${n} tamu ditambahkan`);
          }}
        />
      )}
      {modal === "import" && (
        <ImportModal
          onClose={() => setModal(null)}
          onDone={(m) => {
            setModal(null);
            reload();
            toast.show(m);
          }}
        />
      )}
      {modal === "template" && (
        <TemplateModal
          value={template}
          onClose={() => setModal(null)}
          onSave={async (t) => {
            const r = await saveWaTemplateAction(slug, t);
            if (r.ok) {
              setTemplate(t);
              setModal(null);
              toast.show("Pesan WhatsApp disimpan");
            } else toast.show(r.error);
          }}
        />
      )}
      {modal && typeof modal === "object" && (
        <EditGuestModal
          guest={modal.edit}
          onClose={() => setModal(null)}
          onDone={() => {
            setModal(null);
            reload();
          }}
          onDelete={async () => {
            if (!confirm(`Hapus ${modal.edit.name}?`)) return;
            await deleteGuestsAction(slug, [modal.edit.id]);
            setModal(null);
            reload();
          }}
          onToggleSent={async () => {
            await markSentAction(slug, modal.edit.id, !modal.edit.sentAt);
            setModal(null);
            reload();
          }}
        />
      )}
      {toast.node}
    </TabShell>
  );
}

function AddGuestModal({ onClose, onDone }: { onClose: () => void; onDone: (n: number) => void }) {
  const { slug } = useEditor();
  const [mode, setMode] = useState<"one" | "many">("one");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("");
  const [many, setMany] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const submit = () =>
    start(async () => {
      setError("");
      const list =
        mode === "one"
          ? [{ name, phone, groupLabel: group }]
          : many
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean)
              .map((l) => {
                const [n, p] = l.split(/\s*[,;|]\s*/);
                return { name: n, phone: p ?? "", groupLabel: group };
              });
      if (!list.length || !list[0].name.trim()) return setError("Isi nama tamu dulu.");
      const r = await addGuestsAction(slug, list);
      if (r.ok) onDone(r.added);
      else setError(r.error);
    });
  return (
    <Modal title="Tambah tamu" onClose={onClose}>
      <div className="space-y-4">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "one", label: "Satu tamu" },
            { value: "many", label: "Banyak sekaligus" },
          ]}
        />
        {mode === "one" ? (
          <>
            <Field label="Nama tamu">
              <Text value={name} onChange={setName} placeholder="Bapak/Ibu Budi Santoso" />
            </Field>
            <Field label="Nomor WhatsApp" hint="Opsional. Kalau diisi, tombol WhatsApp langsung membuka chat ke nomor ini.">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="0812…" className={inputCls} />
            </Field>
          </>
        ) : (
          <Field label="Daftar nama" hint="Satu tamu per baris. Boleh tambahkan nomor setelah koma, contoh: Budi Santoso, 08123456789">
            <Area rows={8} value={many} onChange={setMany} placeholder={"Keluarga Wijaya\nBudi Santoso, 081234567890\nSinta & Partner"} />
          </Field>
        )}
        <Field label="Grup" hint="Opsional, misalnya Keluarga, Kantor, Teman kampus.">
          <Text value={group} onChange={setGroup} />
        </Field>
        {error && <p className="font-rk-sans text-[13px] font-semibold text-red-700">{error}</p>}
        <button type="button" disabled={pending} onClick={submit} className={`${btnPrimary} h-12 w-full`}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan tamu"}
        </button>
      </div>
    </Modal>
  );
}

function EditGuestModal({ guest, onClose, onDone, onDelete, onToggleSent }: { guest: GuestRecord; onClose: () => void; onDone: () => void; onDelete: () => void; onToggleSent: () => void }) {
  const { slug } = useEditor();
  const [name, setName] = useState(guest.name);
  const [phone, setPhone] = useState(guest.phone ?? "");
  const [group, setGroup] = useState(guest.groupLabel ?? "");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  return (
    <Modal title="Ubah tamu" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Nama tamu" hint="Link tamu tetap sama walau nama diubah.">
          <Text value={name} onChange={setName} />
        </Field>
        <Field label="Nomor WhatsApp">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className={inputCls} />
        </Field>
        <Field label="Grup">
          <Text value={group} onChange={setGroup} />
        </Field>
        {error && <p className="font-rk-sans text-[13px] font-semibold text-red-700">{error}</p>}
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await updateGuestAction(slug, guest.id, { name, phone, groupLabel: group });
              if (r.ok) onDone();
              else setError(r.error);
            })
          }
          className={`${btnPrimary} h-12 w-full`}
        >
          Simpan
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={onToggleSent} className={`${btnGhost} flex-1`}>
            {guest.sentAt ? "Tandai belum dikirim" : "Tandai terkirim"}
          </button>
          <button type="button" onClick={onDelete} className={`${btnGhost} text-red-700`}>
            <Trash2 className="h-4 w-4" /> Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ImportModal({ onClose, onDone }: { onClose: () => void; onDone: (msg: string) => void }) {
  const { slug } = useEditor();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const send = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", f);
      const r = await fetch(`/api/sites/${slug}/guests/import`, { method: "POST", body: form });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      onDone(`${d.added} tamu diimpor${d.overLimit ? ` · ${d.overLimit} melebihi batas paket` : ""}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import gagal.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title="Import dari Excel" onClose={onClose}>
      <ol className="mb-5 space-y-3 font-rk-sans text-[14px] text-rk-ink">
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rk-cream text-[12px] font-bold">1</span>
          <span>
            Unduh template, isi kolom <b>Nama Tamu</b> (wajib), <b>Nomor WhatsApp</b> dan <b>Grup</b> (opsional).
            <a href={`/api/sites/${slug}/guests/template`} className="mt-2 flex w-fit items-center gap-1.5 rounded-lg border border-rk-line px-3 py-1.5 text-[13px] font-semibold">
              <Download className="h-4 w-4" /> Unduh template Excel
            </a>
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rk-cream text-[12px] font-bold">2</span>
          <span>Unggah file .xlsx atau .csv. Tamu dengan nama sama otomatis dibuatkan link berbeda.</span>
        </li>
      </ol>
      {error && <p className="mb-3 font-rk-sans text-[13px] font-semibold text-red-700">{error}</p>}
      <button type="button" disabled={busy} onClick={() => ref.current?.click()} className={`${btnPrimary} h-12 w-full`}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pilih file Excel"}
      </button>
      <input
        ref={ref}
        type="file"
        accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
        className="hidden"
        onChange={(e) => {
          send(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </Modal>
  );
}

function TemplateModal({ value, onClose, onSave }: { value: string; onClose: () => void; onSave: (t: string) => Promise<void> }) {
  const { slug } = useEditor();
  const [t, setT] = useState(value || DEFAULT_WA_TEMPLATE);
  const [pending, start] = useTransition();
  return (
    <Modal title="Pesan WhatsApp" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Isi pesan" hint={<>Pakai <b>{"{{nama}}"}</b> untuk nama tamu dan <b>{"{{link}}"}</b> untuk link undangannya.</>}>
          <Area rows={10} value={t} onChange={setT} />
        </Field>
        <Group title="Contoh hasil">
          <div className="whitespace-pre-line rounded-2xl bg-[#d9fdd3] p-3.5 font-sans text-[13px] leading-relaxed text-[#111b21]">{renderWaMessage(t, "Bapak Budi Santoso", `${SITE_URL}/${slug}/bapak-budi-santoso`)}</div>
        </Group>
        <div className="flex gap-2">
          <button type="button" onClick={() => setT(DEFAULT_WA_TEMPLATE)} className={btnGhost}>
            Pakai contoh
          </button>
          <button type="button" disabled={pending} onClick={() => start(() => onSave(t))} className={`${btnPrimary} flex-1`}>
            Simpan pesan
          </button>
        </div>
      </div>
    </Modal>
  );
}
