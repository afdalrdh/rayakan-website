"use client";

import { getOccasion } from "@/lib/content";
import { useEditor } from "../context";
import { Field, Group, ImageField, Text } from "../fields";

export function CoverForm() {
  const { content: c, update, resolve, upload } = useEditor();
  const sticker = c.layouts.cover === "stiker";
  const o = getOccasion(c.occasion).sticker;
  return (
    <div className="space-y-7">
      <Group>
        <Field label="Sapaan" hint="Nama tamu muncul otomatis di bawah sapaan ini, dari link undangan masing-masing tamu.">
          <Text value={c.cover.greeting} onChange={(v) => update((d) => void (d.cover.greeting = v))} />
        </Field>
        <Field label="Teks tombol">
          <Text value={c.cover.buttonLabel} maxLength={24} onChange={(v) => update((d) => void (d.cover.buttonLabel = v))} />
        </Field>
      </Group>
      {sticker && (
        <>
          <Group title="Foto stiker">
            <ImageField
              label="Foto tanpa latar (PNG)"
              hint="Garis putih ala stiker dibuat otomatis. Paling lucu dengan foto masa kecil berdua atau versi anak buatan AI. Latar foto bisa dihapus gratis di remove.bg. Foto biasa juga bisa, tampil sebagai kartu foto."
              value={c.cover.photo}
              resolve={resolve}
              upload={upload}
              maxSide={1600}
              fit="contain"
              aspect="aspect-[3/4]"
              onChange={(v) => update((d) => void (d.cover.photo = v))}
            />
          </Group>
          <Group title="Teks sampul">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Teks kecil">
                <Text value={c.cover.kicker} maxLength={24} placeholder={o.kicker} onChange={(v) => update((d) => void (d.cover.kicker = v))} />
              </Field>
              <Field label="Judul">
                <Text value={c.cover.title} maxLength={28} placeholder={o.title} onChange={(v) => update((d) => void (d.cover.title = v))} />
              </Field>
            </div>
            <Field label="Gelembung obrolan kiri" hint="Kosongkan bila tidak ingin memakai gelembung.">
              <Text value={c.cover.bubbleA} maxLength={40} placeholder={o.bubbles[0]} onChange={(v) => update((d) => void (d.cover.bubbleA = v))} />
            </Field>
            <Field label="Gelembung obrolan kanan">
              <Text value={c.cover.bubbleB} maxLength={40} placeholder={o.bubbles[1]} onChange={(v) => update((d) => void (d.cover.bubbleB = v))} />
            </Field>
          </Group>
        </>
      )}
    </div>
  );
}
