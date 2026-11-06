# Arsitektur

Panduan singkat agar menambah fitur atau tema tidak perlu membaca seluruh kode.

## Prinsip

1. **Satu sumber data.** Semua tata letak membaca objek `WeddingContent` yang sama (`src/lib/content/schema.ts`). Klien bisa ganti tema, warna, huruf, atau tata letak tanpa mengisi ulang.
2. **Tampilan = gaya + tata letak.** `content.style` (mode terang/gelap, palet, pasangan huruf, aksen) dan `content.layouts` (satu id tata letak per bagian). Tema (`themes/meta.ts`) hanya preset awal untuk keduanya.
3. **Tata letak tidak tahu soal database.** Layout hanya menerima `content` lewat `ThemeProvider` (`src/themes/shared/context.tsx`). Halaman publik, editor, admin, dan demo memakai `ThemeRenderer` yang sama.
4. **Server selalu memvalidasi.** Apa pun yang dikirim editor dibersihkan di `src/lib/server/validate.ts` sebelum disimpan. Batas paket diterapkan lagi saat dirender untuk tamu (`components/site/PublicSite.tsx`).
5. **Satu model untuk semua acara.** `content.occasion` (`nikah` | `ultah` | `khitan`, lihat `lib/content/occasion.ts`) menentukan label, teks bawaan, dan apakah ada satu atau dua nama. Layout memakai helper `namesOf`, `peopleOf`, `useEyebrow` alih-alih menulis "The Wedding of" atau mengasumsikan dua mempelai.
6. **Ornamen adalah bagian gaya.** `content.style.decor` memilih set ornamen & animasi (`themes/decor/`). `Section` otomatis menggambar sudut + pola, `Rule` di judul berganti jadi pemisah ornamen, dan `ThemeRenderer` menambah lapisan partikel. Layout tanpa foto (Ilustrasi, Medali, sampul beranimasi) mengambil gambarnya dari set yang sama.
7. **Data lama tetap terbaca.** `normalizeContent()` mengisi kolom baru dengan nilai bawaan dan mengubah `palette` lama menjadi `style` + `layouts`, jadi skema bisa bertambah tanpa migrasi database.

## Peta folder

```
src/
├─ app/                       Routing (Next.js App Router)
│  ├─ page.tsx                Landing page (bagian-bagiannya di components/landing/)
│  ├─ buat/                   Wizard Coba Gratis: pilih acara → tema → isi 3 data → editor sandbox
│  ├─ portofolio/             Daftar semua portofolio
│  ├─ tema/[id]/              Contoh asli tiap tema (statis), mis. /tema/afdal
│  ├─ demo/ · demo/admin/     Sandbox: editor & hasilnya, disimpan di browser
│  ├─ studio/                 Dashboard pemilik
│  ├─ [slug]/…                Undangan klien, /[slug]/[tamu], /admin, /preview
│  ├─ canvas/                 Isi iframe pratinjau di editor
│  ├─ actions/                Server actions: site.ts (klien), studio.ts (pemilik), draft.ts (simpan draf publik)
│  └─ api/                    Upload, media lokal, ucapan, impor/template Excel
├─ lib/
│  ├─ content/                Skema, paket, helper, contoh isi (tanpa React)
│  ├─ server/                 db (Neon/PGlite), auth, data, validate, media, excel
│  ├─ sandbox-store.ts        Penyimpanan sandbox /demo (localStorage + IndexedDB)
│  ├─ upload-client.ts        Kompres foto & buat gambar OG di browser
│  └─ messages.ts             Teks WhatsApp & URL situs
├─ themes/
│  ├─ style.ts                Design system: 16 palet (terang & gelap), 9 pasangan huruf, token CSS
│  ├─ decor/                  Ornamen & animasi: catalog.ts (id), art.tsx (sudut, pemisah, pola, partikel, adegan), figures.tsx (figur tanpa wajah)
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

1. `src/themes/meta.ts`: tambahkan id ke `THEME_IDS` dan isi `THEMES[id]` (acara utama, tag filter, gaya + ornamen, tata letak, musik). `preview(id)` menunjuk ke tangkapan layar.
2. Contoh isi: tema lama di `lib/content/demo.ts`, tema baru di `lib/content/demo-extra.ts` (`build(theme, occasion, {...})`). Pakai orang & data fiktif.
3. Ambil tangkapan layar `/tema/<id>` sesudah sampul dibuka: `public/landing/<id>-mobile.webp` (390×844 @2x) dan `-desktop.webp` (1440×900).

### Gambar contoh AI (lukisan & foto anak)

- `public/demo/ilustrasi/<tema>.webp` (2:3) dipakai hero **Lukisan** tema Jawa, Sunda, Sejoli, Lukis, Konfeti, Angkasa, Khitan; `<tema>-og.webp` (1200×630) untuk pratinjau WhatsApp.
- `public/demo/kecil/`: `kid-boy.webp` / `kid-girl.webp` (polaroid & profil), `pair-cutout.webp` (PNG tanpa latar untuk sampul **Stiker**), `og.webp`.
- Semua wajah di gambar ini buatan AI dan fiktif (bukan foto klien). Sumber resolusi penuhnya ada di file Figma https://www.figma.com/design/g7ZicoVuaLWEjiN01wkPuQ. Path `/demo/` otomatis muncul sebagai pengingat "masih foto contoh" sebelum terbit.
- Sampul **Stiker** membaca `cover.photo` + `cover.kicker/title/bubbleA/bubbleB` (kosong = teks bawaan acara di `OCCASIONS[*].sticker`, gelembung kosong disembunyikan). Garis putihnya dari kelas CSS `.t-sticker`, jadi PNG klien tidak perlu diberi garis sendiri.
- Ganti gambar contoh dengan nama file baru (bukan menimpa), karena optimasi gambar Next menyimpan cache per URL.

### Menambah set ornamen

1. `themes/decor/catalog.ts`: tambah id di `DECOR_IDS` + nama, deskripsi, jenis partikel.
2. `themes/decor/art.tsx`: tambah gambar di `CornerArt`, `DecorDivider`, (opsional) `DecorPattern`, `Backdrop`, `PortalFrame` dan bentuk `PORTAL`. Warnai dengan `var(--t-accent)` / `var(--t-muted)` agar ikut palet; animasi pakai kelas `t-*` di `globals.css` (otomatis mati untuk reduced motion).

### Menambah jenis acara

`lib/content/occasion.ts`: tambah id dan teksnya (label, teks bawaan, jadwal). `applyOccasion` mengganti teks yang masih bawaan saat klien berpindah acara.

### Alur Coba Gratis → draf → terbit

1. `/buat` menulis isi ke sandbox browser lalu membuka `/demo/admin`.
2. **Simpan draf** (`components/editor/SaveDraft.tsx` → `actions/draft.ts`): membuat situs `status=draft`, `plan_id=gratis`, `source=self`, login otomatis, lalu memindahkan foto dari IndexedDB ke server.
3. **Kirim ke admin** (`PublishPanel` → `requestPublishAction`): menyimpan `request_plan` + `requested_at` dan membuka WhatsApp admin. Studio → Permintaan menampilkannya.
4. Studio → Terbitkan: paket `gratis` diganti paket yang diminta, masa aktif mulai.

### Ulasan

Tabel `reviews`. Klien menulis dari Admin → Pengaturan (status `pending`), pemilik menyetujui/menambah di Studio → Ulasan. Landing hanya menampilkan `shown` (cache tag `reviews`). Link "Lihat website" hanya bila pemiliknya mengizinkan; selain itu tampil "Privat". Jangan memasukkan ulasan karangan.

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
