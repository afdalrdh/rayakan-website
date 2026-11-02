# Arsitektur

Panduan singkat agar menambah fitur atau tema tidak perlu membaca seluruh kode.

## Prinsip

1. **Satu sumber data.** Semua tata letak membaca objek `WeddingContent` yang sama (`src/lib/content/schema.ts`). Klien bisa ganti tema, warna, huruf, atau tata letak tanpa mengisi ulang.
2. **Tampilan = gaya + tata letak.** `content.style` (mode terang/gelap, palet, pasangan huruf, aksen) dan `content.layouts` (satu id tata letak per bagian). Tema (`themes/meta.ts`) hanya preset awal untuk keduanya.
3. **Tata letak tidak tahu soal database.** Layout hanya menerima `content` lewat `ThemeProvider` (`src/themes/shared/context.tsx`). Halaman publik, editor, admin, dan demo memakai `ThemeRenderer` yang sama.
4. **Server selalu memvalidasi.** Apa pun yang dikirim editor dibersihkan di `src/lib/server/validate.ts` sebelum disimpan. Batas paket diterapkan lagi saat dirender untuk tamu (`components/site/PublicSite.tsx`).
5. **Data lama tetap terbaca.** `normalizeContent()` mengisi kolom baru dengan nilai bawaan dan mengubah `palette` lama menjadi `style` + `layouts`, jadi skema bisa bertambah tanpa migrasi database.

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
│  ├─ style.ts                Design system: 12 palet (terang & gelap), 8 pasangan huruf, token CSS
│  ├─ meta.ts                 Preset tema (gaya + tata letak awal), musik bawaan
│  ├─ index.tsx               ThemeRenderer + LayoutPreview (satu-satunya pintu masuk)
│  ├─ layouts/                catalog.ts (daftar & id) + satu file per bagian (hero.tsx, couple.tsx, …)
│  └─ shared/                 Kit bersama: Section, Heading, T (placeholder teks), EmptyPhoto, HeroChrome, BankCard, hooks
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

### Menambah tata letak untuk satu bagian

1. `src/themes/layouts/catalog.ts`: tambahkan `{ id, name, desc, hint? }` di `LAYOUTS[bagian]`.
2. Buat komponennya di `src/themes/layouts/<bagian>.tsx` dan daftarkan di objek `*_LAYOUTS` di bawah file itu.
3. Pakai hanya token warna `t-*` (bg, alt, card, input, accent, muted, fg, fg2, line, on-accent) dan kelas huruf `t-display`, `t-head`, `font-t-body`, supaya cocok di mode terang/gelap dan semua pasangan huruf.
4. Bungkus dengan `<Section block="...">` (atau `<Block id="...">`), pakai `<T v={...} ph="..."/>` untuk teks dan `<EmptyPhoto/>` untuk foto kosong agar editor menunjukkan isian yang belum diisi.

### Menambah preset tema

1. `src/themes/meta.ts`: tambahkan id ke `THEME_IDS` dan isi `THEMES[id]` (gaya, tata letak, musik, gambar pratinjau).
2. `src/lib/content/demo.ts`: tambahkan contoh isi di `DEMO_BY_THEME` (boleh memakai `presetDemo`).
3. Ambil tangkapan layar `/tema/<id>` ke `public/landing/<id>-desktop.webp` dan `-mobile.webp`.

### Menambah palet atau pasangan huruf

`src/themes/style.ts`: tambah entri di `PALETTES` (versi `light` dan `dark`) atau `FONT_PAIRS`. File huruf ditaruh di `public/fonts/` dan didaftarkan dengan `@font-face` di `globals.css`.

### Menambah kolom isian (mis. "dress code")

1. Tambahkan field di `schema.ts` dan nilai bawaannya di `withDefaults` (`helpers.ts`).
2. Bersihkan di `sanitizeContent` (`lib/server/validate.ts`): batasi panjang, cek URL.
3. Tambahkan input di form bagian terkait (`components/editor/blocks/*Form.tsx`).
4. Tampilkan di tema yang mau memakainya. Tema lain boleh mengabaikannya.

### Menambah bagian baru (section)

1. Tambahkan key di `SECTION_KEYS` dan label di `BLOCK_LABELS` (`schema.ts`).
2. Buat form di `components/editor/blocks/` dan daftarkan di `BLOCK_FORMS`.
3. Tambahkan daftar tata letaknya di `themes/layouts/catalog.ts`, komponennya di `themes/layouts/<bagian>.tsx`, dan daftarkan di `themes/layouts/index.tsx`. Hormati `content.hidden`.
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
