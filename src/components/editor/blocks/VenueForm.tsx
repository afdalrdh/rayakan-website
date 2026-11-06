"use client";

import { getOccasion } from "@/lib/content";

import { uid } from "@/lib/content";
import { useEditor } from "../context";
import { AddButton, Area, Field, Group, ImageField, ItemCard, Text } from "../fields";

export function VenueForm() {
  const { content: c, update, resolve, upload } = useEditor();
  const v = c.venue;
  return (
    <div className="space-y-7">
      <Group title="Tempat">
        <Field label="Nama tempat">
          <Text value={v.name} onChange={(x) => update((d) => void (d.venue.name = x))} placeholder="Bale Pancaniti" />
        </Field>
        <Field label="Alamat">
          <Area rows={2} value={v.address} onChange={(x) => update((d) => void (d.venue.address = x))} />
        </Field>
        <Field label="Link Google Maps" hint="Buka Google Maps → cari tempatnya → Bagikan → Salin link, lalu tempel di sini.">
          <Text value={v.mapsUrl} onChange={(x) => update((d) => void (d.venue.mapsUrl = x.trim()))} placeholder="https://maps.app.goo.gl/…" />
        </Field>
        <Field label="Catatan untuk tamu" hint="Opsional, misalnya info parkir atau dress code.">
          <Area rows={2} value={v.note} onChange={(x) => update((d) => void (d.venue.note = x))} />
        </Field>
        <ImageField label="Foto / ilustrasi tempat" optional value={v.image} resolve={resolve} upload={upload} maxSide={1400} fit="contain" onChange={(x) => update((d) => void (d.venue.image = x))} />
      </Group>
      <Group title="Jadwal acara">
        {v.schedules.map((s, i) => (
          <ItemCard key={s.id} title={s.label || "Acara"} onRemove={() => update((d) => void d.venue.schedules.splice(i, 1))}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nama acara">
                <Text value={s.label} onChange={(x) => update((d) => void (d.venue.schedules[i].label = x))} placeholder={getOccasion(c.occasion).schedules[i % 2]} />
              </Field>
              <Field label="Waktu">
                <Text value={s.time} onChange={(x) => update((d) => void (d.venue.schedules[i].time = x))} placeholder="08.00 – 10.00 WIB" />
              </Field>
            </div>
          </ItemCard>
        ))}
        <AddButton disabled={v.schedules.length >= 4} onClick={() => update((d) => void d.venue.schedules.push({ id: uid(), label: "", time: "" }))}>
          + Tambah acara
        </AddButton>
      </Group>
    </div>
  );
}
