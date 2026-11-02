"use client";

import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { card, inputCls } from "./ui";

const GUIDE: { q: string; a: string[] }[] = [
  { q: "Menambah tamu satu per satu", a: ["Buka menu Undangan.", "Isi Nama tamu, nomor WhatsApp (opsional), dan grup (opsional), lalu tekan Tambah tamu.", "Di HP, tekan tombol + di pojok kanan bawah."] },
  { q: "Menambah banyak tamu lewat Excel", a: ["Di menu Undangan, tekan Import Excel.", "Unduh template, isi kolom Nama, Nomor WhatsApp, dan Grup.", "Pilih file lalu tekan Import. Tamu langsung muncul di daftar."] },
  { q: "Mengirim undangan lewat WhatsApp", a: ["Tekan Salin untuk menyalin pesan, atau Kirim untuk membuka WhatsApp.", "Jika nomor tamu diisi, Kirim langsung membuka chat tamu tersebut.", "Akan muncul pertanyaan apakah status diubah jadi Terkirim. Centang “Pakai pilihan ini terus hari ini” agar tidak ditanya lagi, atau atur lewat tombol Opsi."] },
  { q: "Mengubah isi pesan WhatsApp", a: ["Buka menu Pengaturan → Pesan WhatsApp.", "Pakai {{nama}} untuk nama tamu dan {{link}} untuk link undangan.", "Lihat contoh tampilannya di sebelah kanan, lalu tekan Simpan pesan."] },
  { q: "Mengubah tampilan undangan", a: ["Buka menu Desain Undangan lalu tekan Edit Tampilan. Editor terbuka di tab baru.", "Ketuk bagian undangan yang ingin diubah. Di atas formulir ada kotak Tata letak: tekan Ganti untuk memilih susunan lain.", "Isi teks dan foto tetap sama saat tata letak diganti."] },
  { q: "Mengganti warna, mode gelap/terang, dan huruf", a: ["Di editor, tekan Gaya & Warna.", "Pilih mode Terang atau Gelap, palet warna, dan pasangan huruf.", "Pilihan “Mulai dari tema” mengganti semua sekaligus; teks dan foto tetap aman."] },
  { q: "Kotak bergaris putus-putus di editor", a: ["Itu tanda isian yang masih kosong, misalnya nama tempat atau foto.", "Tamu tidak melihat kotak ini. Ketuk bagiannya untuk mengisi."] },
  { q: "Menyembunyikan hiasan hati di foto utama", a: ["Di editor, ketuk Foto Utama.", "Pada tata letak Nama Raksasa, matikan Tampilkan hiasan hati atau pilih ukurannya.", "Untuk nama panjang, pilih tata letak Klasik Tengah agar nama tidak mengecil."] },
  { q: "Melihat konfirmasi kehadiran", a: ["Buka menu Reservasi. Jumlah hadir dan tidak hadir ada di bagian atas.", "Cari nama atau saring berdasarkan kehadiran, lalu Ekspor Excel bila perlu.", "Ucapan yang tidak pantas bisa dihapus."] },
  { q: "Menerbitkan undangan", a: ["Di editor tekan Terbitkan, lalu hubungi admin Rayakan.my.id lewat WhatsApp untuk pembayaran.", "Setelah dikonfirmasi, undangan aktif dan link tamu bisa dibagikan."] },
];

export function Guide() {
  const [open, setOpen] = useState<number | null>(0);
  const [q, setQ] = useState("");
  const shown = GUIDE.map((g, i) => ({ ...g, i })).filter((g) => !q.trim() || `${g.q} ${g.a.join(" ")}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="mx-auto max-w-[820px] space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rk-mute" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari panduan (contoh: excel, whatsapp, warna)..." className={`${inputCls} h-11 pl-10 text-[14px]`} />
      </div>
      <div className={`${card} divide-y divide-rk-line overflow-hidden`}>
        {shown.map((g) => (
          <div key={g.q}>
            <button type="button" onClick={() => setOpen(open === g.i ? null : g.i)} className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-rk-ivory sm:px-5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rk-cream text-[12px] font-bold">{g.i + 1}</span>
              <span className="flex-1 text-[14px] font-semibold">{g.q}</span>
              <ChevronDown className={`h-4 w-4 text-rk-mute transition ${open === g.i ? "rotate-180" : ""}`} />
            </button>
            {open === g.i && (
              <ol className="rk-fade-in list-disc space-y-2 px-4 pb-5 pl-[60px] text-[14px] leading-relaxed text-rk-mute sm:pr-8">
                {g.a.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            )}
          </div>
        ))}
        {!shown.length && <p className="px-5 py-8 text-center text-[13px] text-rk-mute">Tidak ada panduan yang cocok.</p>}
      </div>
    </div>
  );
}
