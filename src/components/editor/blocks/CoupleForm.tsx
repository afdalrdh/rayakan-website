"use client";

import { useState } from "react";
import { getOccasion, layoutOf, type Person } from "@/lib/content";
import { useEditor } from "../context";
import { Area, Field, Group, ImageField, Segmented, Text, Toggle, inputCls } from "../fields";

function PersonFields({ which }: { which: "first" | "second" }) {
  const { content: c, update, resolve, upload } = useEditor();
  const p = c.couple[which];
  const set = (k: keyof Person, v: string) => update((d) => void (d.couple[which][k] = v));
  const single = getOccasion(c.occasion).single;
  const optional = layoutOf("couple", c.layouts.couple).noPhoto;
  const kecil = layoutOf("hero", c.layouts.hero).id === "polaroid";
  return (
    <div className="space-y-3.5">
      <ImageField
        label={kecil ? "Foto masa kecil" : "Foto"}
        optional={optional}
        hint={kecil ? "Dipakai juga di polaroid foto utama. Bisa foto masa kecil asli atau versi anak buatan AI." : optional ? "Boleh dikosongkan: inisial nama akan tampil di dalam medali." : undefined}
        value={p.photo}
        resolve={resolve}
        upload={upload}
        maxSide={1400}
        onChange={(v) => set("photo", v)}
      />
      <Field label={single ? "Nama lengkap" : "Nama lengkap & gelar"}>
        <Text value={p.fullName} onChange={(v) => set("fullName", v)} placeholder={single ? "Alea Kirana Putri" : "Almalia Marcela, S.T."} />
      </Field>
      <Field label="Keterangan orang tua">
        <Area rows={2} value={p.parents} onChange={(v) => set("parents", v)} placeholder={single ? "Putri pertama dari Bapak … dan Ibu …" : "Putri kedua dari Bapak … dan Ibu …"} />
      </Field>
      <Field label="Instagram" hint="Kosongkan bila tidak ingin ditampilkan.">
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-rk-sans text-[15px] text-rk-mute">@</span>
          <input value={p.instagram} onChange={(e) => set("instagram", e.target.value.replace(/^@/, ""))} className={`${inputCls} pl-8`} placeholder="username" />
        </div>
      </Field>
    </div>
  );
}

export function CoupleForm() {
  const { content: c, update, resolve, upload } = useEditor();
  const [tab, setTab] = useState<"first" | "second">("first");
  const o = getOccasion(c.occasion);
  return (
    <div className="space-y-7">
      <Group title="Pembuka">
        <Toggle
          label="Tampilkan kaligrafi Bismillah"
          hint="Matikan untuk undangan non-muslim."
          checked={c.couple.showBismillah}
          onChange={(v) => update((d) => void (d.couple.showBismillah = v))}
        />
        <Field label="Kalimat undangan">
          <Area rows={2} value={c.couple.headline} onChange={(v) => update((d) => void (d.couple.headline = v))} />
        </Field>
      </Group>
      {o.single ? (
        <Group title={`Profil ${o.person[0].toLowerCase()}`}>
          <PersonFields which="first" />
        </Group>
      ) : (
        <Group title="Profil mempelai">
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { value: "first", label: c.couple.first.fullName.split(" ")[0] || o.person[0] },
              { value: "second", label: c.couple.second.fullName.split(" ")[0] || o.person[1] },
            ]}
          />
          <PersonFields key={tab} which={tab} />
        </Group>
      )}
      <Group title="Video (opsional)">
        <Field label="Link YouTube" hint={o.single ? "Contoh: video ucapan atau momen lucu. Kosongkan bila tidak ada." : "Contoh: video prewedding atau teaser. Kosongkan bila tidak ada."}>
          <Text value={c.couple.videoUrl} onChange={(v) => update((d) => void (d.couple.videoUrl = v.trim()))} placeholder="https://youtu.be/…" />
        </Field>
        {c.couple.videoUrl && (
          <ImageField
            label="Gambar sampul video"
            optional
            hint="Kosongkan untuk memakai gambar dari YouTube."
            value={c.couple.videoThumb}
            resolve={resolve}
            upload={upload}
            maxSide={1600}
            aspect="aspect-video"
            onChange={(v) => update((d) => void (d.couple.videoThumb = v))}
          />
        )}
      </Group>
      <Group title="Kutipan">
        <Field label="Ayat / kutipan" hint="Contoh: QS Ar-Rum 21, Kidung Agung 8:6, atau kutipan favorit kalian.">
          <Area rows={5} value={c.couple.quote} onChange={(v) => update((d) => void (d.couple.quote = v))} />
        </Field>
      </Group>
    </div>
  );
}
