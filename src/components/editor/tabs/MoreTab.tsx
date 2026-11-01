"use client";

import { ChevronDown } from "lucide-react";
import { useState, useTransition } from "react";
import { changePasswordAction, logoutSiteAction } from "@/app/actions/site";
import { activeLabel } from "@/lib/content";
import { SITE_HOST } from "@/lib/messages";
import { useEditor } from "../context";
import { Field, Group, Segmented, inputCls } from "../fields";
import { TabShell } from "./TabShell";
import { btnGhost, btnPrimary } from "./ui";

export function MoreTab() {
  const [tab, setTab] = useState<"settings" | "guide">("settings");
  return (
    <div>
      <div className="mx-auto w-full max-w-[560px] px-4 pt-6 lg:pt-10">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: "settings", label: "Pengaturan" },
            { value: "guide", label: "Cara Pakai" },
          ]}
        />
      </div>
      {tab === "settings" ? <SettingsTab /> : <GuideTab />}
    </div>
  );
}

function SettingsTab() {
  const { slug, plan, status, expiresAt, isOwner } = useEditor();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  return (
    <TabShell title="Pengaturan" note="Data akun dan keamanan undangan kamu.">
      <div className="divide-y divide-rk-line overflow-hidden rounded-2xl border border-rk-line bg-white font-rk-sans text-[14px]">
        {[
          ["Alamat", `${SITE_HOST}/${slug}`],
          ["Paket", `${plan.name} · aktif ${activeLabel(plan)}`],
          ["Status", status === "published" ? "Sudah terbit" : "Draft (belum terbit)"],
          ["Aktif sampai", expiresAt ? new Date(expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : status === "published" ? "Selamanya" : "Dihitung sejak terbit"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-3">
            <span className="text-rk-mute">{k}</span>
            <span className="text-right font-semibold text-rk-ink">{v}</span>
          </div>
        ))}
      </div>
      <Group title="Ganti password">
        {!isOwner && (
          <Field label="Password lama">
            <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} className={inputCls} autoComplete="current-password" />
          </Field>
        )}
        <Field label="Password baru" hint="Minimal 8 karakter.">
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className={inputCls} autoComplete="new-password" />
        </Field>
        {msg && <p className={`font-rk-sans text-[13px] font-semibold ${msg.ok ? "text-emerald-700" : "text-red-700"}`}>{msg.text}</p>}
        <button
          type="button"
          disabled={pending || next.length < 8}
          onClick={() =>
            start(async () => {
              const r = await changePasswordAction(slug, cur, next);
              setMsg(r.ok ? { ok: true, text: "Password berhasil diganti." } : { ok: false, text: r.error });
              if (r.ok) {
                setCur("");
                setNext("");
              }
            })
          }
          className={`${btnPrimary} h-11 w-full`}
        >
          Simpan password
        </button>
      </Group>
      <form action={logoutSiteAction.bind(null, slug)}>
        <button type="submit" className={`${btnGhost} h-11 w-full text-red-700`}>
          {isOwner ? "Kembali ke Studio" : "Keluar"}
        </button>
      </form>
    </TabShell>
  );
}

const GUIDE: { q: string; a: string[] }[] = [
  { q: "Mengubah isi undangan", a: ["Buka menu Undangan.", "Ketuk bagian undangan yang ingin diubah, misalnya foto utama atau nama mempelai.", "Ubah isian di panel yang muncul. Perubahan tersimpan otomatis (lihat tanda “Tersimpan” di atas)."] },
  { q: "Mengganti foto", a: ["Ketuk kotak foto lalu pilih dari galeri HP.", "Foto otomatis diperkecil agar undangan tetap cepat dibuka.", "Foto utama punya dua versi: untuk layar lebar (mendatar) dan untuk HP (berdiri)."] },
  { q: "Gambar saat link dibagikan di WhatsApp", a: ["Gambar preview diambil dari foto utama layar lebar.", "Setelah mengganti foto, WhatsApp kadang masih menampilkan gambar lama selama beberapa jam karena tersimpan di HP penerima."] },
  { q: "Warna, logo dan musik", a: ["Tekan tombol Warna & Logo untuk memilih palet warna dan logo inisial.", "Tekan tombol Musik untuk memilih lagu atau mengunggah lagu sendiri (sesuai paket)."] },
  { q: "Menyembunyikan atau mengurutkan bagian", a: ["Tekan tombol Urutan.", "Gunakan panah untuk memindah, ikon mata untuk menyembunyikan bagian dari tamu."] },
  { q: "Menambah tamu & import Excel", a: ["Buka menu Tamu → Tambah tamu, atau tempel banyak nama sekaligus.", "Untuk daftar panjang, pilih Import Excel dan gunakan template yang disediakan."] },
  { q: "Mengirim undangan lewat WhatsApp", a: ["Atur isi pesan di menu Tamu → Pesan WhatsApp.", "Tekan tombol WhatsApp di samping nama tamu. Pesan dan link berisi nama tamu sudah otomatis terisi.", "Tamu yang sudah dikirimi ditandai “Terkirim”."] },
  { q: "Melihat ucapan & kehadiran", a: ["Buka menu Ucapan. Ringkasan hadir / tidak hadir ada di bagian atas.", "Ucapan yang tidak pantas bisa dihapus."] },
  { q: "Menerbitkan undangan", a: ["Tekan Terbitkan di bagian atas.", "Kirim pesan ke admin Rayakan.my.id lewat WhatsApp untuk pembayaran.", "Setelah dikonfirmasi, undangan aktif dan bisa dibagikan."] },
];

function GuideTab() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <TabShell title="Cara Pakai" note="Panduan singkat mengelola undangan dari HP maupun laptop.">
      <div className="divide-y divide-rk-line overflow-hidden rounded-2xl border border-rk-line bg-white">
        {GUIDE.map((g, i) => (
          <div key={g.q}>
            <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rk-cream font-rk-sans text-[12px] font-bold">{i + 1}</span>
              <span className="flex-1 font-rk-sans text-[14px] font-semibold text-rk-ink">{g.q}</span>
              <ChevronDown className={`h-4 w-4 text-rk-mute transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <ol className="rk-fade-in space-y-2 px-4 pb-4 pl-14 font-rk-sans text-[14px] leading-relaxed text-rk-mute">
                {g.a.map((s) => (
                  <li key={s} className="list-disc">
                    {s}
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
    </TabShell>
  );
}
