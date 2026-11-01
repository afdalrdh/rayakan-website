"use client";

import { SITE_HOST } from "@/lib/messages";
import { useEditor } from "../context";
import { Field, Group, ImageField, Segmented, Text } from "../fields";

function WhatsappPreview() {
  const { content: c, resolve, slug } = useEditor();
  const img = resolve(c.hero.ogImage || c.hero.imageDesktop);
  return (
    <div className="rounded-2xl bg-[#e5ddd5] p-3">
      <p className="mb-2 font-rk-sans text-[11px] font-semibold uppercase tracking-wider text-[#54656f]">Tampilan saat link dibagikan di WhatsApp</p>
      <div className="ml-auto max-w-[290px] overflow-hidden rounded-lg rounded-tr-none bg-[#d9fdd3] shadow-sm">
        <div className="m-1 overflow-hidden rounded-md bg-[#f0f2f5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {img ? <img src={img} alt="" className="aspect-[1.91/1] w-full object-cover" /> : <div className="aspect-[1.91/1] w-full bg-[#cfd8dc]" />}
          <div className="px-2.5 py-2">
            <p className="line-clamp-1 font-sans text-[13px] font-semibold text-[#111b21]">
              The Wedding of {c.hero.firstName || "…"} &amp; {c.hero.secondName || "…"}
            </p>
            <p className="line-clamp-2 font-sans text-[12px] text-[#667781]">Undangan pernikahan · rayakan.my.id</p>
          </div>
        </div>
        <p className="px-2.5 pb-1.5 font-sans text-[13px] text-[#111b21]">{SITE_HOST}/{slug}</p>
      </div>
    </div>
  );
}

export function HeroForm() {
  const { content: c, update, resolve, upload, uploadOg } = useEditor();
  return (
    <div className="space-y-7">
      <Group title="Nama di foto utama">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nama panggilan 1">
            <Text value={c.hero.firstName} maxLength={14} onChange={(v) => update((d) => void (d.hero.firstName = v))} placeholder="Arya" />
          </Field>
          <Field label="Nama panggilan 2">
            <Text value={c.hero.secondName} maxLength={14} onChange={(v) => update((d) => void (d.hero.secondName = v))} placeholder="Almalia" />
          </Field>
        </div>
      </Group>
      <Group title="Foto utama">
        <ImageField
          label="Foto untuk layar lebar (laptop)"
          hint="Foto mendatar. Foto ini juga dipakai sebagai gambar saat link dibagikan di WhatsApp."
          value={c.hero.imageDesktop}
          resolve={resolve}
          upload={upload}
          maxSide={2400}
          aspect="aspect-[16/9]"
          onChange={(v) => update((d) => void (d.hero.imageDesktop = v))}
          onFile={async (f) => {
            const og = await uploadOg(f).catch(() => "");
            if (og) update((d) => void (d.hero.ogImage = og));
          }}
        />
        <WhatsappPreview />
        <div className="grid grid-cols-2 gap-3">
          <ImageField
            label="Foto untuk HP"
            hint="Foto berdiri (portrait)."
            value={c.hero.imageMobile}
            resolve={resolve}
            upload={upload}
            maxSide={1600}
            aspect="aspect-[9/16]"
            onChange={(v) =>
              update((d) => {
                d.hero.imageMobile = v;
                // The 3D cutout is made from the phone photo, so it no longer matches.
                d.hero.imageCutout = "";
              })
            }
          />
          <ImageField
            label="Foto efek 3D"
            optional
            hint="PNG tanpa latar dari foto HP yang sama, agar badan tampil di depan nama. Otomatis dilepas saat foto HP diganti."
            value={c.hero.imageCutout}
            resolve={resolve}
            upload={upload}
            maxSide={1600}
            fit="contain"
            aspect="aspect-[9/16]"
            onChange={(v) => update((d) => void (d.hero.imageCutout = v))}
          />
        </div>
      </Group>
      <Group title="Tata letak di HP">
        <Segmented
          value={c.hero.namePosition}
          onChange={(v) => update((d) => void (d.hero.namePosition = v))}
          options={[
            { value: "top", label: "Nama di atas" },
            { value: "bottom", label: "Nama di bawah" },
          ]}
        />
        <p className="font-rk-sans text-[12px] text-rk-mute">Pilih &quot;di bawah&quot; bila nama menutupi wajah di foto HP.</p>
        <Field label="Teks di bawah foto">
          <Text value={c.hero.scrollLabel} maxLength={32} onChange={(v) => update((d) => void (d.hero.scrollLabel = v))} />
        </Field>
      </Group>
    </div>
  );
}
