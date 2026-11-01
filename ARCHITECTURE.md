# Arsitektur

Panduan singkat agar menambah fitur atau tema tidak perlu membaca seluruh kode.

## Prinsip

1. **Satu sumber data.** Semua tema membaca objek `WeddingContent` yang sama (`src/lib/content/schema.ts`). Klien bisa ganti tema tanpa mengisi ulang.
2. **Tema tidak tahu soal database.** Tema hanya menerima `content` lewat `ThemeProvider` (`src/themes/shared/context.tsx`). Halaman publik, editor, dan demo memakai `ThemeRenderer` yang sama.
3. **Server selalu memvalidasi.** Apa pun yang dikirim editor dibersihkan di `src/lib/server/validate.ts` sebelum disimpan. Batas paket diterapkan lagi saat dirender untuk tamu (`components/site/PublicSite.tsx`).
4. **Data lama tetap terbaca.** `normalizeContent()` mengisi kolom baru dengan nilai bawaan, jadi skema bisa bertambah tanpa migrasi database.

## Peta folder

```
src/
├─ app/                       Routing (Next.js App Router)
│  ├─ page.tsx                Landing page (bagian-bagiannya di components/landing/)
│  ├─ portofolio/             Daftar semua portofolio
│  ├─ tema/[id]/              Contoh asli tiap tema (statis), mis. /tema/afdal
│  ├─ demo/ · demo/admin/     Sandbox: editor & hasilnya, disimpan di browser
│  ├─ studio/                 Dashboard pemilik
│  ├─ [slug]/…                Undangan klien, /[slug]/[tamu], /admin, /preview
│  ├─ canvas/                 Isi iframe pratinjau di editor
│  ├─ actions/                Server actions: site.ts (klien), studio.ts (pemilik)
│  └─ api/                    Upload, media lokal, ucapan, impor/template Excel
├─ lib/
│  ├─ content/                Skema, paket, helper, contoh isi (tanpa React)
│  ├─ server/                 db (Neon/PGlite), auth, data, validate, media, excel
│  ├─ sandbox-store.ts        Penyimpanan sandbox /demo (localStorage + IndexedDB)
│  ├─ upload-client.ts        Kompres foto & buat gambar OG di browser
│  └─ messages.ts             Teks WhatsApp & URL situs
├─ themes/
│  ├─ meta.ts                 Katalog tema: id, nama, palet warna, gambar pratinjau
│  ├─ index.tsx               ThemeRenderer (satu-satunya pintu masuk ke tema)
│  ├─ shared/                 Kit bersama: Block, Img, Cover, Video, BankCard, hooks
│  ├─ arya/                   Tema "Malam Emas"
│  └─ afdal/                  Tema "Putih Marun"
└─ components/
   ├─ editor/                 Editor klien
   │  ├─ EditorApp.tsx        Rangka editor (tab, panel, kanvas)
   │  ├─ useContentStore.ts   State isi + autosave + upload
   │  ├─ canvas/              Iframe pratinjau & protokol postMessage
   │  ├─ blocks/              Form isian per bagian undangan (BLOCK_FORMS)
   │  ├─ panels/              Tema & Warna, Musik, Urutan, Checklist, Terbitkan
   │  └─ tabs/                Tamu, Ucapan, Lainnya (+ versi demo)
   ├─ studio/                 Dashboard pemilik
   ├─ site/PublicSite.tsx     Render undangan untuk tamu (status, masa aktif, batas paket)
   └─ landing/                Komponen kecil landing page
```

## Resep

### Menambah tema baru

1. `src/themes/meta.ts`: tambahkan id ke `THEME_IDS` dan isi `THEMES[id]` (nama, palet, `storyPhotos`, `defaultTrack`, gambar pratinjau).
2. Buat `src/themes/<id>/<Nama>Theme.tsx` + `sections/`. Ambil data dengan `useTheme()`, bungkus tiap bagian dengan `<Block id="...">` agar bisa diketuk di editor, dan pakai `<Img>` untuk semua foto (mendukung foto sandbox `media:`).
3. Daftarkan komponennya di `COMPONENTS` pada `src/themes/index.tsx`.
4. Tambahkan contoh isi di `src/lib/content/demo.ts` (`DEMO_BY_THEME`) dan aset di `public/demo/<id>/`.
5. Buat tangkapan layar `public/landing/<id>-desktop.webp` dan `-mobile.webp`. Landing page, pilihan tema di Studio, dan panel Tema & Warna otomatis menampilkannya.

TypeScript akan menandai setiap tempat yang belum lengkap karena `Record<ThemeId, …>`.

### Menambah kolom isian (mis. "dress code")

1. Tambahkan field di `schema.ts` dan nilai bawaannya di `withDefaults` (`helpers.ts`).
2. Bersihkan di `sanitizeContent` (`lib/server/validate.ts`): batasi panjang, cek URL.
3. Tambahkan input di form bagian terkait (`components/editor/blocks/*Form.tsx`).
4. Tampilkan di tema yang mau memakainya. Tema lain boleh mengabaikannya.

### Menambah bagian baru (section)

1. Tambahkan key di `SECTION_KEYS` dan label di `BLOCK_LABELS` (`schema.ts`).
2. Buat form di `components/editor/blocks/` dan daftarkan di `BLOCK_FORMS`.
3. Render di tiap tema, dibungkus `<Block id="key">`, dan hormati `content.hidden`.
4. Jika hanya untuk paket tertentu, kunci lewat `locked` pada paket di Studio.

### Menambah portofolio

Tambahkan satu entri di `src/lib/portfolio.ts` (nama pasangan, tanggal, lokasi, tema, foto sampul, dua tangkapan layar). Landing page menampilkan 3 terbaru, halaman `/portofolio` menampilkan semuanya. Kartu membuka popup detail, bukan website aslinya, jadi tidak ada undangan yang perlu tetap aktif.

### Landing page

`src/app/page.tsx` menyusun bagian-bagian dari `src/components/landing/`: `chrome.tsx` (nav, footer, judul), `DeviceShowcase.tsx` (laptop + HP di hero, klik untuk ganti fokus), `Features.tsx`, `Portfolio.tsx`, `motion.tsx` (animasi judul). Tangkapan layar ada di `public/landing/`; contoh undangan yang dipakai adalah Afdal & Putri.

### Mengubah harga atau benefit paket

Tidak perlu kode: Studio → **Paket & Harga**. Nilai bawaan ada di `lib/content/plans.ts`.

## Cache

- Halaman undangan di-cache dengan tag `site:<slug>`; setiap simpan memanggil `updateTag`, sehingga tamu melihat versi baru tanpa membebani database.
- Paket dan pengaturan di-cache dengan tag `plans` dan `settings`.

## Pemeriksaan sebelum deploy

```bash
npm run check   # typecheck + eslint + next build
```
