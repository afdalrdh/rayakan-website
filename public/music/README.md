# Lagu latar

Lagu di folder ini bisa dipilih oleh **semua klien**, jadi hanya taruh lagu yang
boleh dipakai ulang untuk umum:

- rekaman sendiri / dibuat khusus untuk Rayakan.my.id, atau
- musik bebas royalti yang lisensinya mengizinkan dipakai di website/produk,
  misalnya Pixabay Music atau YouTube Audio Library (cek syarat atribusinya).

Lagu populer (mis. lagu pernikahan dari penyanyi terkenal) dilindungi hak cipta.
Klien yang ingin memakai lagu seperti itu bisa mengunggahnya sendiri lewat
editor → Musik → Lagu sendiri.

## Menambah lagu

1. Simpan file `.mp3` (atau `.m4a`) di folder ini, ukuran ideal di bawah 3 MB
   (128 kbps cukup untuk HP). Nama file huruf kecil tanpa spasi, mis. `gamelan-tenang.mp3`.
2. Tambahkan satu baris di `MUSIC_LIBRARY` (`src/themes/meta.ts`):

   ```ts
   { id: "gamelan-tenang", title: "Gamelan Tenang", artist: "Instrumental", src: "/music/gamelan-tenang.mp3", occasions: ["nikah"], mood: "Gamelan · adat Jawa" },
   ```

   `occasions` menentukan lagu ini disarankan untuk acara apa (`nikah`, `ultah`, `khitan`).
3. Opsional: jadikan lagu bawaan sebuah tema dengan mengganti `defaultTrack` di tema itu.
