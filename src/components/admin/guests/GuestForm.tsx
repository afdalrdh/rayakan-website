"use client";

import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import type { GuestRecord } from "@/lib/records";
import { btnGhost, btnPrimary, Field, formatPhone, inputCls } from "../ui";

export function GuestForm({ initial, submitLabel, busy, onSubmit, onCancel }: { initial?: GuestRecord; submitLabel: string; busy: boolean; onSubmit: (f: { name: string; phone: string; groupLabel: string }) => void; onCancel?: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(formatPhone(initial?.phone));
  const [group, setGroup] = useState(initial?.groupLabel ?? "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) onSubmit({ name, phone, groupLabel: group });
      }}
      className="space-y-3.5"
    >
      <Field label="Nama tamu">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Bapak/Ibu/Saudara/i" className={inputCls} />
      </Field>
      <Field label="Nomor WhatsApp" optional hint="Jika diisi, tombol Kirim langsung membuka chat nomor ini.">
        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" placeholder="0812-3456-7890" className={`${inputCls} tabular-nums`} />
      </Field>
      <Field label="Grup" optional hint="Contoh: Keluarga, Teman Kantor. Membantu mencari dan menyaring.">
        <input value={group} onChange={(e) => setGroup(e.target.value)} maxLength={40} placeholder="Keluarga" className={inputCls} />
      </Field>
      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className={`${btnGhost} h-10`}>
            Batal
          </button>
        )}
        <button type="submit" disabled={busy || !name.trim()} className={`${btnPrimary} h-10 ${onCancel ? "" : "w-full"}`}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : !initial && <Plus className="h-4 w-4" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
