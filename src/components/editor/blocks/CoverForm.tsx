"use client";

import { useEditor } from "../context";
import { Field, Group, Text } from "../fields";

export function CoverForm() {
  const { content: c, update } = useEditor();
  return (
    <Group>
      <Field label="Sapaan" hint="Nama tamu muncul otomatis di bawah sapaan ini, dari link undangan masing-masing tamu.">
        <Text value={c.cover.greeting} onChange={(v) => update((d) => void (d.cover.greeting = v))} />
      </Field>
      <Field label="Teks tombol">
        <Text value={c.cover.buttonLabel} maxLength={24} onChange={(v) => update((d) => void (d.cover.buttonLabel = v))} />
      </Field>
    </Group>
  );
}
