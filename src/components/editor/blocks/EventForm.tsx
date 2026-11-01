"use client";

import { useEditor } from "../context";
import { Field, Group, Segmented, Text, inputCls } from "../fields";

export function EventForm() {
  const { content: c, update } = useEditor();
  return (
    <Group>
      <Field label="Tanggal acara utama">
        <input type="date" value={c.event.date} onChange={(e) => update((d) => void (d.event.date = e.target.value))} className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Jam mulai" hint="Untuk hitung mundur.">
          <input type="time" value={c.event.time} onChange={(e) => update((d) => void (d.event.time = e.target.value))} className={inputCls} />
        </Field>
        <Field label="Zona waktu">
          <Segmented
            value={c.event.timezone}
            onChange={(v) => update((d) => void (d.event.timezone = v))}
            options={[
              { value: "WIB", label: "WIB" },
              { value: "WITA", label: "WITA" },
              { value: "WIT", label: "WIT" },
            ]}
          />
        </Field>
      </div>
      <Field label="Label kecil di atas tanggal">
        <Text value={c.event.eyebrow} onChange={(v) => update((d) => void (d.event.eyebrow = v))} />
      </Field>
    </Group>
  );
}
