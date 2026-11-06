"use client";

import { applyOccasion, getOccasion, layoutOf, OCCASION_IDS, OCCASIONS, shareKind, shareTitle, type Occasion } from "@/lib/content";
import { SITE_HOST } from "@/lib/messages";
import { useEditor } from "../context";
import { Field, Group, ImageField, Segmented, Text, Toggle } from "../fields";

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
            <p className="line-clamp-1 font-sans text-[13px] font-semibold text-[#111b21]">{shareTitle(c)}</p>
            <p className="line-clamp-2 font-sans text-[12px] text-[#667781]">{shareKind(c)} · rayakan.my.id</p>
          </div>
        </div>
        <p className="px-2.5 pb-1.5 font-sans text-[13px] text-[#111b21]">{SITE_HOST}/{slug}</p>
      </div>
    </div>
  );
}

export function HeroForm() {
  const { content: c, update, resolve, upload, uploadOg } = useEditor();
  const layout = layoutOf("hero", c.layouts.hero);
  const o = getOccasion(c.occasion);
  return (
    <div className="space-y-7">
      <Group title="Jenis acara">
        <Segmented<Occasion> value={c.occasion} onChange={(v) => update((d) => applyOccasion(d, v))} options={OCCASION_IDS.map((id) => ({ value: id, label: OCCASIONS[id].name }))} />
        <p className="font-rk-sans text-[12px] text-rk-mute">Teks bawaan (judul, ucapan, jadwal) ikut menyesuaikan. Teks yang sudah kamu ubah tidak disentuh.</p>
      </Group>
      <Group title={o.single ? "Nama" : "Nama di foto utama"}>
        {o.single ? (
          <Field label="Nama panggilan">
            <Text value={c.hero.firstName} maxLength={16} onChange={(v) => update((d) => void (d.hero.firstName = v))} placeholder={c.occasion === "khitan" ? "Rafa" : "Alea"} />
          </Field>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nama panggilan 1">
              <Text value={c.hero.firstName} maxLength={14} onChange={(v) => update((d) => void (d.hero.firstName = v))} placeholder="Arya" />
            </Field>
            <Field label="Nama panggilan 2">
              <Text value={c.hero.secondName} maxLength={14} onChange={(v) => update((d) => void (d.hero.secondName = v))} placeholder="Almalia" />
            </Field>
          </div>
        )}
        <Field label="Teks di atas nama" hint={`Kosongkan untuk memakai "${o.eyebrow}".${c.occasion === "ultah" ? ' Contoh: "Ulang Tahun ke-5".' : ""}`}>
          <Text value={c.hero.eyebrow} maxLength={40} onChange={(v) => update((d) => void (d.hero.eyebrow = v))} placeholder={o.eyebrow} />
        </Field>
      </Group>
      {layout.id === "lukisan" && (
        <Group title="Gambar lukisan">
          <ImageField
            label="Lukisan atau ilustrasi (berdiri)"
            hint="Gambar berdiri 2:3, misalnya lukisan cat air atau ilustrasi AI dari foto kalian. Wajah sebaiknya di sepertiga atas. Gambar ini juga dipakai saat link dibagikan di WhatsApp."
            value={c.hero.imageMobile || c.hero.imageDesktop}
            resolve={resolve}
            upload={upload}
            maxSide={1800}
            aspect="aspect-[2/3]"
            onChange={(v) =>
              update((d) => {
                d.hero.imageMobile = v;
                d.hero.imageDesktop = v;
                d.hero.imageCutout = "";
              })
            }
            onFile={async (f) => {
              const og = await uploadOg(f).catch(() => "");
              if (og) update((d) => void (d.hero.ogImage = og));
            }}
          />
          <WhatsappPreview />
        </Group>
      )}
      {layout.noPhoto && (
        <Group title="Gambar di dalam bingkai (opsional)">
          <ImageField
            label="Foto atau gambar AI"
            optional
            hint="Kosongkan untuk memakai ilustrasi tanpa wajah. Bisa diisi foto prewedding, foto masa kecil, atau gambar versi anak buatan AI."
            value={c.hero.imageMobile}
            resolve={resolve}
            upload={upload}
            maxSide={1600}
            aspect="aspect-square"
            onChange={(v) =>
              update((d) => {
                d.hero.imageMobile = v;
                d.hero.imageDesktop = v;
              })
            }
          />
        </Group>
      )}
      {layout.id === "polaroid" && (
        <p className="rounded-2xl bg-rk-cream p-4 font-rk-sans text-[13px] leading-snug text-rk-ink">
          Foto polaroid diambil dari foto di bagian <b>{o.coupleBlock}</b>. Pakai foto masa kecil, atau versi anak-anak buatan AI.
        </p>
      )}
      {!layout.noPhoto && layout.id !== "polaroid" && layout.id !== "lukisan" && <Group title="Foto utama">
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
        <div className={layout.cutout ? "grid grid-cols-2 gap-3" : ""}>
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
          {layout.cutout && <ImageField
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
          />}
        </div>
      </Group>}
      {layout.cutout && (
        <Group title="Posisi nama di HP">
          <Segmented
            value={c.hero.namePosition}
            onChange={(v) => update((d) => void (d.hero.namePosition = v))}
            options={[
              { value: "top", label: "Nama di atas" },
              { value: "bottom", label: "Nama di bawah" },
            ]}
          />
          <p className="font-rk-sans text-[12px] text-rk-mute">Pilih &quot;di bawah&quot; bila nama menutupi wajah di foto HP.</p>
        </Group>
      )}
      {layout.heart && (
        <Group title="Hiasan hati">
          <Toggle checked={c.hero.showHeart} onChange={(v) => update((d) => void (d.hero.showHeart = v))} label="Tampilkan hiasan hati" hint="Matikan bila kurang cocok dengan foto kalian." />
          {c.hero.showHeart && (
            <Segmented
              value={c.hero.heartSize}
              onChange={(v) => update((d) => void (d.hero.heartSize = v))}
              options={[
                { value: "s", label: "Kecil" },
                { value: "m", label: "Sedang" },
                { value: "l", label: "Besar" },
              ]}
            />
          )}
        </Group>
      )}
      <Group title="Teks bawah">
        <Field label="Teks di bawah foto">
          <Text value={c.hero.scrollLabel} maxLength={32} onChange={(v) => update((d) => void (d.hero.scrollLabel = v))} />
        </Field>
      </Group>
    </div>
  );
}
