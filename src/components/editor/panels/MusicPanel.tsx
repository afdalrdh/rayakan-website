"use client";

import { Check, Lock, Music2, Pause, Play, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { MUSIC_LIBRARY } from "@/lib/content";
import { useEditor } from "../context";
import { Group, UpgradeNote } from "../fields";

export function MusicPanel() {
  const { content: c, update, upload, plan, resolve } = useEditor();
  const ref = useRef<HTMLInputElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const canUpload = plan.musicUpload;
  const preview = (src: string, key: string) => {
    const el = audio.current;
    if (!el) return;
    if (playing === key) {
      el.pause();
      setPlaying(null);
      return;
    }
    el.src = src;
    el.play().then(() => setPlaying(key)).catch(() => setPlaying(null));
  };
  return (
    <div className="space-y-6">
      <audio ref={audio} onEnded={() => setPlaying(null)} />
      <Group title="Pilih lagu">
        {MUSIC_LIBRARY.map((t) => {
          const sel = c.music.mode === "library" && c.music.trackId === t.id;
          return (
            <div key={t.id} className={`flex items-center gap-3 rounded-2xl border p-3 ${sel ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line"}`}>
              <button type="button" aria-label="Putar contoh" onClick={() => preview(t.src, t.id)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rk-ink text-white">
                {playing === t.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button type="button" className="flex-1 text-left" onClick={() => update((d) => void (d.music = { ...d.music, mode: "library", trackId: t.id }))}>
                <span className="block font-rk-sans text-[14px] font-semibold text-rk-ink">{t.title}</span>
                <span className="block font-rk-sans text-[12px] text-rk-mute">{t.artist}</span>
              </button>
              {sel && <Check className="h-5 w-5 text-rk-ink" />}
            </div>
          );
        })}
        <p className="font-rk-sans text-[12px] text-rk-mute">Daftar lagu akan ditambah dari /studio.</p>
      </Group>
      <Group title="Lagu sendiri">
        <div className={`flex items-center gap-3 rounded-2xl border p-3 ${c.music.mode === "upload" ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line"}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rk-cream text-rk-ink">
            <Music2 className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-rk-sans text-[14px] font-semibold text-rk-ink">{c.music.uploadName || "Unggah file MP3"}</span>
            <span className="block font-rk-sans text-[12px] text-rk-mute">MP3, maksimal 4 MB.</span>
          </span>
          {c.music.upload && (
            <button type="button" onClick={() => preview(resolve(c.music.upload), "upload")} className="flex h-9 w-9 items-center justify-center rounded-full border border-rk-line">
              {playing === "upload" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          )}
          <button
            type="button"
            disabled={!canUpload}
            onClick={() => ref.current?.click()}
            className="flex h-9 items-center gap-1.5 rounded-full bg-rk-ink px-3.5 font-rk-sans text-[13px] font-semibold text-white disabled:opacity-40"
          >
            {canUpload ? <Upload className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />} Pilih
          </button>
        </div>
        <input
          ref={ref}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            if (f.size > 4 * 1024 * 1024) {
              alert("Ukuran lagu maksimal 4 MB. Coba kompres atau potong lagunya dulu.");
              return;
            }
            try {
              const src = await upload(f);
              update((d) => void (d.music = { ...d.music, mode: "upload", upload: src, uploadName: f.name.slice(0, 80) }));
            } catch (err) {
              alert(err instanceof Error ? err.message : "Gagal mengunggah lagu.");
            }
          }}
        />
        {!canUpload && <UpgradeNote>Unggah lagu sendiri tersedia mulai paket Premium.</UpgradeNote>}
      </Group>
      <button type="button" onClick={() => update((d) => void (d.music.mode = "none"))} className={`w-full rounded-2xl border p-3 text-left font-rk-sans text-[14px] font-semibold ${c.music.mode === "none" ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line"} text-rk-ink`}>
        Tanpa musik
      </button>
    </div>
  );
}
