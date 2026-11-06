# Arsitektur

Panduan singkat agar menambah fitur atau tema tidak perlu membaca seluruh kode.

## Prinsip

1. **Satu sumber data.** Semua tata letak membaca objek `WeddingContent` yang sama (`src/lib/content/schema.ts`). Klien bisa ganti tema, warna, huruf, atau tata letak tanpa mengisi ulang.
2. **Tampilan = gaya + tata letak.** `content.style` (mode terang/gelap, palet, pasangan huruf, aksen) dan `content.layouts` (satu id tata letak per bagian). Tema (`themes/meta.ts`) hanya preset awal untuk keduanya.
3. **Tata letak tidak tahu soal database.** Layout hanya menerima `content` lewat `ThemeProvider` (`src/themes/shared/context.tsx`). Halaman publik, editor, admin, dan demo memakai `ThemeRenderer` yang sama.
4. **Server selalu memvalidasi.** Apa pun yang dikirim editor dibersihkan di `src/server/validate.ts` sebelum disimpan. Batas paket diterapkan lagi saat dirender untuk tamu (`components/site/PublicSite.tsx`).
5. **Satu model untuk semua acara.** `content.occasion` (`nikah` | `ultah` | `khitan`, lihat `lib/content/occasion.ts`) menentukan label, teks bawaan, dan apakah ada satu atau dua nama. Layout memakai helper `namesOf`, `peopleOf`, `useEyebrow` alih-alih menulis "The Wedding of" atau mengasumsikan dua mempelai.
6. **Ornamen adalah bagian gaya.** `content.style.decor` memilih set ornamen & animasi (`themes/decor/`). `Section` otomatis menggambar sudut + pola, `Rule` di judul berganti jadi pemisah ornamen, dan `ThemeRenderer` menambah lapisan partikel. Layout tanpa foto (Ilustrasi, Medali, sampul beranimasi) mengambil gambarnya dari set yang sama.
7. **Data lama tetap terbaca.** `normalizeContent()` mengisi kolom baru dengan nilai bawaan dan mengubah `palette` lama menjadi `style` + `layouts`, jadi skema bisa bertambah tanpa migrasi database.

## Lapisan (frontend ↔ backend)

Satu aplikasi Next.js, tapi lapisannya dipisah tegas. Panah = boleh memanggil.

```
Browser (komponen "use client")
   │  hanya lewat server action atau route API, tidak pernah import src/server
   ▼
src/app/actions/*  ·  src/app/api/*       ← pintu masuk backend: cek sesi → validasi → service/repository → revalidate cache
   ▼
src/server/services/*                     ← aturan bisnis yang dipakai >1 tempat (alamat undangan, tambah tamu)
   ▼
src/server/repositories/*                 ← SATU-SATUNYA tempat SQL. Satu file per tabel, mengembalikan record bertipe
   ▼
src/server/db/client.ts + migrations.ts   ← koneksi Neon/PGlite + riwayat skema bernomor
```

- `src/lib/*` = kode bersama tanpa rahasia (tipe record di `lib/records.ts`, model konten di `lib/content/`, teks marketing di `lib/marketing.ts`, SEO di `lib/seo/`). Boleh dipakai server dan browser.
- ESLint menolak `import "@/server/..."` dari `src/components`, `src/themes`, dan `src/lib` (kecuali `components/site/PublicSite.tsx`, server component). Semua file di `src/server` juga memakai `import "server-only"`, jadi build gagal bila tidak sengaja masuk ke bundel browser.
- Tag cache ada di `src/server/cache.ts` (`TAG.site(slug)`, `TAG.reviews`, …) supaya baca & tulis memakai nama yang sama.
- Server action mengembalikan `ActionResult` (`src/server/result.ts`): `{ ok: true, ... }` atau `{ ok: false, error }`.

## Peta folder

```
src/
├─ app/                       Routing (Next.js App Router), loading.tsx (skeleton), error.tsx, not-found.tsx
│  ├─ page.tsx                Landing (bagian-bagiannya di components/landing/sections/)
│  ├─ undangan-pernikahan/ …  Halaman SEO per acara (isi di lib/marketing.ts → OCCASION_PAGES)
│  ├─ ulasan/                 Semua ulasan asli + portofolio
│  ├─ buat/                   Wizard Coba Gratis: acara → tema → data → editor sandbox
│  ├─ tema/[id]/              Contoh tiap tema (statis, tombol tamu dikunci) + bar "Pakai tema ini"
│  ├─ demo/ · demo/admin/     Sandbox: hasil & editor, disimpan di browser
│  ├─ studio/                 Dashboard pemilik
│  ├─ [slug]/…                Undangan klien, /[slug]/[tamu], /admin, /editor, /preview
│  ├─ actions/                Server actions per fitur: site, guests, reviews, studio, draft
│  ├─ api/                    Upload, media lokal, ucapan, impor/template Excel
│  ├─ sitemap.ts · robots.ts · manifest.ts · icon.png · apple-icon.png
├─ server/                    BACKEND (server-only)
│  ├─ db/                     client.ts (query/one), migrations.ts (skema bernomor)
│  ├─ repositories/           sites, guests, wishes, reviews, plans, settings, login-attempts
│  ├─ services/               site-address.ts, guests.ts
│  ├─ auth.ts · validate.ts · media.ts · excel.ts · cache.ts · result.ts
├─ lib/                       Bersama (tanpa rahasia)
│  ├─ content/                Skema undangan, paket, acara, helper, contoh isi
│  ├─ records.ts              Tipe record DB + aturan murni (slug, masa aktif, nomor HP)
│  ├─ marketing.ts            FAQ, langkah, halaman per acara
│  ├─ seo/                    JSON-LD, metadata halaman acara
│  ├─ sandbox-store.ts · upload-client.ts · messages.ts · portfolio.ts
├─ themes/                    Tampilan undangan (lihat Prinsip 2 & 6)
│  └─ shared/TrialGuard.tsx   Mengunci tombol tamu di pratinjau yang belum dibayar
└─ components/
   ├─ ui/Skeleton.tsx         Skeleton bergaya brand (undangan, editor, admin, studio, marketing)
   ├─ landing/                Nav, Hero (+HeroDevices), ThemeCatalog, Reviews, sections/*, OccasionLanding
   ├─ editor/                 Editor (EditorApp, canvas/, blocks/, panels/, tabs/)
   ├─ studio/                 StudioApp + satu file per tab (SitesTab, RequestsTab, ReviewsTab, PlansTab, SettingsTab, SiteModals, ui)
   ├─ admin/                  Admin klien (GuestsManager + guests/, WishesManager, SettingsPanel…)
   └─ site/                   PublicSite (server), ThemeSampleBar
```

## Konvensi

- **Data baru di database**: tambah migrasi baru di akhir `MIGRATIONS` (jangan ubah yang sudah rilis), lalu fungsi di repository tabelnya. Saat server pertama jalan, migrasi dijalankan sekali dan versinya dicatat di tabel `schema_meta` (selanjutnya cukup 1 query).
- **Fitur baru di admin/studio**: action di `src/app/actions/<fitur>.ts` → repository/service; komponen di folder fiturnya. Jangan menulis SQL di action atau komponen.
- **Loading**: halaman yang menunggu data diberi `loading.tsx` memakai komponen dari `components/ui/Skeleton.tsx`. Jangan pasang `loading.tsx` di root atau di `[slug]` (membuat alamat salah tetap berstatus 200, bukan 404).
- **Gambar**: pakai `next/image` dengan `sizes` yang sesuai; jangan `unoptimized` untuk file lokal. Gambar tema memakai `Img` (ada shimmer sampai gambar tampil).
- **Animasi landing**: CSS saja (`rk-enter`, `rk-lift`, `Reveal`); jangan memakai `motion` di halaman marketing. Animasi undangan boleh memakai `motion`.
- **Ulasan**: hanya ulasan asli. Jangan menambah ulasan, angka, atau nama karangan.
- **Musik**: hanya lagu yang boleh dipakai ulang (lihat `public/music/README.md`).

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
2. Bersihkan di `sanitizeContent` (`src/server/validate.ts`): batasi panjang, cek URL.
3. Tambahkan input di form bagian terkait (`components/editor/blocks/*Form.tsx`).
4. Tampilkan di tema yang mau memakainya. Tema lain boleh mengabaikannya.

### Menambah bagian baru (section)

1. Tambahkan key di `SECTION_KEYS` dan label di `BLOCK_LABELS` (`schema.ts`).
2. Buat form di `components/editor/blocks/` dan daftarkan di `BLOCK_FORMS`.
3. Tambahkan daftar tata letaknya di `themes/layouts/catalog.ts`, komponennya di `themes/layouts/<bagian>.tsx`, dan daftarkan di `themes/layouts/index.tsx`. Hormati `content.hidden`.
4. Jika hanya untuk paket tertentu, kunci lewat `locked` pada paket di Studio.

### Menambah portofolio

Tambahkan satu entri di `src/lib/portfolio.ts` (nama pasangan, tanggal, lokasi, tema, foto sampul, dua tangkapan layar). Landing page menampilkan 3 terbaru, halaman `/portofolio` menampilkan semuanya. Kartu membuka popup detail, bukan website aslinya, jadi tidak ada undangan yang perlu tetap aktif.

### Landing page & halaman per acara

`src/app/page.tsx` hanya menyusun bagian dari `src/components/landing/sections/` (urutan: Hero → Fitur → Tema → contoh bagian → acara → portofolio & ulasan → editor → tamu → cara pesan → harga → FAQ → ajakan). Halaman `/undangan-*` memakai `OccasionLanding` dengan isi dari `OCCASION_PAGES` di `lib/marketing.ts`; menambah acara baru cukup menambah entri di sana dan satu file `page.tsx`. Gambar share (OG) ada di `public/og/` (dibuat dari template HTML, 1200×630).

### Mengubah harga atau benefit paket

Tidak perlu kode: Studio → **Paket & Harga**. Nilai bawaan ada di `lib/content/plans.ts`.

## Cache

- Halaman undangan di-cache dengan tag `site:<slug>`; setiap simpan memanggil `updateTag`, sehingga tamu melihat versi baru tanpa membebani database.
- Paket, pengaturan, ulasan, dan angka statistik di-cache dengan tag `plans`, `settings`, `reviews`, `stats` (lihat `src/server/cache.ts`).

## Pemeriksaan sebelum deploy

```bash
npm run check   # typecheck + eslint + unit test (vitest) + next build
npm test        # hanya unit test
```

Unit test ada di sebelah kodenya (`*.test.ts`): aturan record, isi tema, sanitasi (setiap contoh tema harus lolos tanpa berubah), dan riwayat migrasi.
