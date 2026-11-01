"use client";

import { useEditor } from "../context";
import { Area, Field, Group, ImageField, Text } from "../fields";

export function ClosingForm() {
  const { content: c, update, resolve, upload } = useEditor();
  return (
    <Group>
      <ImageField label="Foto latar" value={c.closing.image} resolve={resolve} upload={upload} maxSide={2000} aspect="aspect-[16/10]" onChange={(v) => update((d) => void (d.closing.image = v))} />
      <Field label="Kalimat penutup">
        <Area rows={4} value={c.closing.quote} onChange={(v) => update((d) => void (d.closing.quote = v))} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nama besar">
          <Text value={c.closing.displayName} maxLength={22} onChange={(v) => update((d) => void (d.closing.displayName = v))} />
        </Field>
        <Field label="Hashtag" hint="Opsional">
          <Text value={c.closing.hashtag} onChange={(v) => update((d) => void (d.closing.hashtag = v))} />
        </Field>
      </div>
    </Group>
  );
}
