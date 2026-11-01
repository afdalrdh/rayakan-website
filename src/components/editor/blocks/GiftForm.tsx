"use client";

import { BANKS, uid, type BankId } from "@/lib/content";
import { useEditor } from "../context";
import { AddButton, Area, Field, Group, ImageField, ItemCard, Text, inputCls } from "../fields";

export function GiftForm() {
  const { content: c, update, resolve, upload } = useEditor();
  return (
    <div className="space-y-7">
      <Group title="Teks">
        <Field label="Judul">
          <Text value={c.gift.title} onChange={(v) => update((d) => void (d.gift.title = v))} />
        </Field>
        <Field label="Keterangan">
          <Area rows={3} value={c.gift.body} onChange={(v) => update((d) => void (d.gift.body = v))} />
        </Field>
      </Group>
      <Group title="Rekening / e-wallet">
        {c.gift.accounts.map((a, i) => (
          <ItemCard key={a.id} title={BANKS[a.bank]?.name ?? "Rekening"} onRemove={() => update((d) => void d.gift.accounts.splice(i, 1))}>
            <Field label="Bank / e-wallet">
              <select value={a.bank} onChange={(e) => update((d) => void (d.gift.accounts[i].bank = e.target.value as BankId))} className={inputCls}>
                {(Object.keys(BANKS) as BankId[]).map((b) => (
                  <option key={b} value={b}>
                    {BANKS[b].name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Nomor rekening">
              <input inputMode="numeric" value={a.number} onChange={(e) => update((d) => void (d.gift.accounts[i].number = e.target.value))} className={inputCls} placeholder="1234 5678 90" />
            </Field>
            <Field label="Atas nama">
              <Text value={a.holder} onChange={(v) => update((d) => void (d.gift.accounts[i].holder = v.toUpperCase()))} />
            </Field>
          </ItemCard>
        ))}
        <AddButton disabled={c.gift.accounts.length >= 4} onClick={() => update((d) => void d.gift.accounts.push({ id: uid(), bank: "bca", number: "", holder: "" }))}>
          + Tambah rekening
        </AddButton>
      </Group>
      <Group title="Kirim hadiah (opsional)">
        <Field label="Link daftar hadiah / alamat" hint="Misalnya link wishlist marketplace atau Google Maps alamat rumah. Kosongkan bila tidak perlu.">
          <Text value={c.gift.registry.url} onChange={(v) => update((d) => void (d.gift.registry.url = v.trim()))} placeholder="https://…" />
        </Field>
        {c.gift.registry.url && (
          <>
            <Field label="Judul">
              <Text value={c.gift.registry.title} onChange={(v) => update((d) => void (d.gift.registry.title = v))} placeholder="Kirim ke Rumah" />
            </Field>
            <Field label="Keterangan">
              <Area rows={3} value={c.gift.registry.body} onChange={(v) => update((d) => void (d.gift.registry.body = v))} />
            </Field>
            <ImageField label="Gambar" optional value={c.gift.registry.image} resolve={resolve} upload={upload} maxSide={1000} onChange={(v) => update((d) => void (d.gift.registry.image = v))} />
          </>
        )}
      </Group>
    </div>
  );
}
