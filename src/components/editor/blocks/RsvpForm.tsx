"use client";

import { useEditor } from "../context";
import { Field, Group, Text, Toggle } from "../fields";

export function RsvpForm() {
  const { content: c, update } = useEditor();
  return (
    <Group>
      <Field label="Judul">
        <Text value={c.rsvp.title} onChange={(v) => update((d) => void (d.rsvp.title = v))} />
      </Field>
      <Toggle label="Tanyakan kota tamu" checked={c.rsvp.askCity} onChange={(v) => update((d) => void (d.rsvp.askCity = v))} />
      <p className="font-rk-sans text-[12px] text-rk-mute">Ucapan dan konfirmasi kehadiran tamu bisa dilihat di menu Ucapan.</p>
    </Group>
  );
}
