"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uid } from "@/lib/content";
import { useEditor } from "../context";
import { Field, Group, Text, UpgradeNote, move } from "../fields";

export function GalleryForm() {
  const { content: c, update, resolve, upload, plan } = useEditor();
  const limit = plan.galleryLimit;
  const photos = c.gallery.photos;
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");
  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).slice(0, Math.max(0, limit - photos.length));
    setBusy(list.length);
    setError("");
    for (const f of list) {
      try {
        const src = await upload(f, { maxSide: 1600 });
        update((d) => void d.gallery.photos.push({ id: uid(), src }));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sebagian foto gagal diunggah.");
      }
      setBusy((b) => b - 1);
    }
  };
  return (
    <div className="space-y-7">
      <Group title="Judul bagian">
        <Field label="Judul">
          <Text value={c.gallery.title} onChange={(v) => update((d) => void (d.gallery.title = v))} />
        </Field>
      </Group>
      <Group title={`Foto · ${photos.length}/${limit}`}>
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p, i) => (
            <div key={p.id} className="group relative aspect-square overflow-hidden rounded-xl bg-rk-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resolve(p.src)} alt="" className="h-full w-full object-cover" />
              <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-2 py-0.5 font-rk-sans text-[11px] font-semibold text-white">{i + 1}</span>
              <button
                type="button"
                aria-label="Hapus foto"
                onClick={() => update((d) => void d.gallery.photos.splice(i, 1))}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between">
                {i > 0 ? (
                  <button type="button" onClick={() => update((d) => void (d.gallery.photos = move(d.gallery.photos, i, -1)))} className="rounded-full bg-white/90 px-2 py-0.5 font-rk-sans text-[11px] font-bold text-rk-ink">
                    ←
                  </button>
                ) : (
                  <span />
                )}
                {i < photos.length - 1 && (
                  <button type="button" onClick={() => update((d) => void (d.gallery.photos = move(d.gallery.photos, i, 1)))} className="rounded-full bg-white/90 px-2 py-0.5 font-rk-sans text-[11px] font-bold text-rk-ink">
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
          {photos.length < limit && (
            <button type="button" onClick={() => ref.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-rk-ink/30 text-rk-ink">
              {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" strokeWidth={1.6} />}
              <span className="font-rk-sans text-[12px] font-semibold">{busy ? `Sisa ${busy}` : "Tambah"}</span>
            </button>
          )}
        </div>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {error && <p className="font-rk-sans text-[12px] font-semibold text-red-700">{error}</p>}
        <p className="font-rk-sans text-[12px] text-rk-mute">Bisa pilih banyak foto sekaligus. Susunan besar–kecil diatur otomatis agar tetap rapi.</p>
        {photos.length >= limit && <UpgradeNote>Batas {limit} foto tercapai. Hapus foto lain untuk menambah.</UpgradeNote>}
      </Group>
    </div>
  );
}
