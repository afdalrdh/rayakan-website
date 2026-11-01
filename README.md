# Rayakan.my.id — Platform Undangan

Satu aplikasi Next.js untuk semua klien Rayakan.my.id. Klien baru cukup ditambah dari **/studio**, lalu klien mengubah sendiri undangannya dari HP.

## Halaman

| Alamat | Untuk siapa | Isi |
|---|---|---|
| `/` | Calon pembeli | Landing page: tema, fitur, harga (diambil dari database), FAQ |
| `/tema/arya` · `/tema/afdal` | Calon pembeli | Contoh asli tiap tema |
| `/demo/admin` · `/demo` | Calon pembeli | Editor untuk dicoba & hasilnya (tersimpan di browser saja). `?tema=afdal` mulai dari tema Putih Marun |
| `/studio` | Kamu (pemilik) | Daftar undangan, buat undangan baru, terbitkan, reset password, Paket & Harga, Pengaturan |
| `/[nama]` | Tamu | Undangan, contoh `rayakan.my.id/afdal-putri` |
| `/[nama]/[tamu]` | Tamu | Undangan dengan nama tamu di sampul, contoh `/afdal-putri/budi-santoso` |
| `/[nama]/admin` | Klien | Editor + Tamu & Kirim WA + Ucapan + Pengaturan + Cara Pakai |
| `/[nama]/preview` | Klien & kamu | Pratinjau walau belum terbit |

## Alur bisnis

1. Calon klien chat WhatsApp dari landing page.
2. Kamu buka `/studio` → **Undangan baru** → isi nama panggilan, paket, tanggal, nomor WA klien → **Buat undangan**.
3. Tekan **Kirim ke klien via WA**: klien menerima link admin + password.
4. Klien mengisi undangan (status Draft, tamu belum bisa membuka).
5. Klien menekan **Terbitkan** → pesan WhatsApp ke kamu. Setelah bayar, kamu tekan **Terbitkan** di Studio. Masa aktif mulai dihitung sesuai paket.

## Kenapa aman untuk banyak klien

- Halaman undangan dirender sekali lalu disimpan di cache CDN Vercel; tamu tidak membebani database. Cache diperbarui otomatis saat klien menyimpan.
- Database Neon via HTTP (tanpa batas koneksi), satu database untuk semua klien.
- Foto dikompres di HP sebelum diunggah (±5 MB → ±300 KB), disimpan di Cloudinary (atau Vercel Blob) dan diperkecil otomatis sesuai layar.
- Isi undangan divalidasi di server (panjang teks, URL foto, batas paket), password di-hash (scrypt), login dibatasi 5 percobaan / 15 menit, ucapan dibatasi per IP.

## Online-kan (Vercel)

1. Push folder ini ke GitHub (repo baru, private).
2. Vercel → **Add New Project** → pilih repo.
3. Database: Neon → project `rayakan` → **Integrations → Vercel** (mengisi `DATABASE_URL` otomatis). Foto: salin *API environment variable* dari Cloudinary → API Keys, simpan sebagai `CLOUDINARY_URL`.
4. **Settings → Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SITE_URL` = `https://rayakan.my.id`
   - `STUDIO_USERNAME` dan `STUDIO_PASSWORD` (password kuat)
   - `SESSION_SECRET` = teks acak minimal 24 karakter
5. Deploy. Tabel database dibuat otomatis saat pertama kali dibuka.
6. **Settings → Domains** → tambahkan `rayakan.my.id`, lalu arahkan DNS sesuai petunjuk Vercel.
7. Buka `/studio` → **Pengaturan** → isi nomor WhatsApp admin.

> Catatan: undangan Arya (`arya-alma.rayakan.my.id`) tetap di project Vercel-nya sendiri. Subdomain itu tidak terpengaruh selama domain utama `rayakan.my.id` yang dipindah ke project ini.

## Menjalankan di komputer

```bash
npm install
npm run dev
```

Tanpa `DATABASE_URL`, aplikasi otomatis memakai database lokal (folder `.data/`). Login studio lokal: `admin` / `admin123`.

Sebelum push: `npm run check` (typecheck + lint + build).

## Tema

| Id | Nama | Karakter |
|---|---|---|
| `arya` | Malam Emas | Gelap, sinematik, aksen emas · 6 palet |
| `afdal` | Putih Marun | Terang, tipografi besar, kisah cinta bergulir · 6 palet |

Struktur kode, cara menambah tema, kolom isian, atau bagian baru ada di **[ARCHITECTURE.md](./ARCHITECTURE.md)**.
