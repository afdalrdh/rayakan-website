import type { Occasion } from "./content";

/*
 * Copy for the marketing pages (landing + one page per occasion). Kept apart
 * from the components so wording can be changed without touching layout.
 * Only true statements: no invented numbers, reviews or guarantees.
 */

export type Faq = readonly [question: string, answer: string];

export const GENERAL_FAQ: Faq[] = [
  ["Apa bedanya Coba Gratis, Edit Sendiri, dan Siap Pakai?", "Coba Gratis: pakai semua tema dan editor, lalu simpan draf, tapi belum bisa dikirim ke tamu. Edit Sendiri (Rp69rb): kamu yang mengatur, kami terbitkan. Siap Pakai (Rp149rb): kirim data & foto, admin yang menyusunkan sampai jadi."],
  ["Bisa untuk acara selain pernikahan?", "Bisa. Ada tema khusus ulang tahun dan khitanan, dan semua tema bisa dipakai untuk acara apa pun. Label, jumlah nama, dan teks bawaan menyesuaikan jenis acaranya."],
  ["Saya tidak punya foto prewedding. Bagaimana?", "Pakai tema lukisan seperti Dua Sejoli, Taman Lukis, atau tema adat: foto utamanya diganti lukisan atau ilustrasi AI kalian. Tidak ingin memakai gambar wajah sama sekali? Pilih tata letak Ilustrasi tanpa wajah. Bisa juga memakai foto masa kecil atau versi anak-anak buatan AI dengan tema Kenangan Kecil."],
  ["Berapa lama undangan bisa jadi?", "Pilih tema, isi nama dan tanggal, undangan langsung tampil. Kebanyakan selesai dilengkapi dalam 15–30 menit. Di paket Siap Pakai, admin yang menyusunkan untukmu."],
  ["Apakah perlu install aplikasi atau daftar akun?", "Tidak. Editor dibuka dari browser HP atau laptop. Untuk menyimpan draf cukup isi nama dan nomor WhatsApp."],
  ["Bisa diubah setelah dibagikan?", "Bisa, kapan saja sampai hari H dan sesudahnya. Link undangan tetap sama, jadi tamu langsung melihat versi terbaru."],
  ["Bagaimana mengirim ke tamu dengan nama masing-masing?", "Masukkan daftar tamu (atau import dari Excel), lalu tekan tombol WhatsApp di samping nama. Pesan dan link berisi nama tamu sudah otomatis terisi."],
  ["Bagaimana cara bayar?", "Tekan Kirim ke admin di editor dan pilih paket. Admin membalas lewat WhatsApp dengan info pembayaran (transfer bank / e-wallet). Undangan terbit setelah dikonfirmasi dan aktif selamanya."],
];

export const TRUST = ["Coba gratis tanpa daftar", "Bayar setelah jadi", "Bisa diubah sampai hari H", "Aktif selamanya"];

export const STEPS: Faq[] = [
  ["Pilih tema & coba gratis", "Pilih acara dan tema, isi nama dan tanggal. Undangan kamu langsung tampil, tanpa daftar akun."],
  ["Atur & simpan draf", "Ganti foto, teks, warna, ornamen, dan tata letak dari HP. Simpan draf dengan nama dan nomor WhatsApp."],
  ["Kirim ke admin & bagikan", "Pilih Edit Sendiri atau Siap Pakai. Setelah pembayaran dikonfirmasi, undangan terbit dan aktif selamanya."],
];

export const EDITOR_POINTS: Faq[] = [
  ["Langsung di atas desain", "Tidak ada formulir panjang. Kamu melihat undangannya sendiri, ketuk foto atau nama, lalu ubah di panel kecil."],
  ["Foto otomatis ringan", "Foto dari kamera HP diperkecil otomatis, jadi undangan tetap cepat dibuka tamu meski sinyal lemah."],
  ["Tema, ornamen, dan lagu", "Ganti tema kapan saja, pilih ornamen beranimasi, warna, logo inisial, dan lagu latar. Bagian yang tidak perlu bisa disembunyikan."],
  ["Tersimpan otomatis", "Setiap perubahan langsung tersimpan dan tampil di link yang sama."],
];

export const GUEST_POINTS = [
  "Tambah tamu satu per satu, tempel banyak nama, atau import dari Excel",
  "Link khusus per tamu, nama tampil di sampul undangan",
  "Kirim lewat WhatsApp sekali ketuk, status terkirim tercatat",
  "Rekap hadir / tidak hadir dan semua ucapan di satu tempat",
];

export const SHOWCASE = [
  { src: "/landing/sec-arya-invitation.webp", label: "Profil" },
  { src: "/landing/sec-arya-story.webp", label: "Kisah cinta" },
  { src: "/landing/sec-arya-date.webp", label: "Hitung mundur" },
  { src: "/landing/sec-arya-venue.webp", label: "Lokasi & jadwal" },
  { src: "/landing/sec-arya-memories.webp", label: "Galeri foto" },
  { src: "/landing/sec-arya-gift.webp", label: "Amplop digital" },
];

/* ------------------------------ One page per occasion (SEO) ------------------------------ */

export interface OccasionPage {
  occasion: Occasion;
  path: `/${string}`;
  /** Short name used in breadcrumbs and links. */
  name: string;
  title: string;
  description: string;
  hero: { badge: string; title: [string, string]; lead: string };
  /** Sample shown on the hero laptop and phone. */
  devices: { url: string; desktop: string; mobile: string };
  ogImage: string;
  intro: { title: string; body: string };
  /** What makes the invitation fit this occasion. */
  points: Faq[];
  faq: Faq[];
}

export const OCCASION_PAGES: Record<Occasion, OccasionPage> = {
  nikah: {
    occasion: "nikah",
    path: "/undangan-pernikahan",
    name: "Undangan Pernikahan",
    title: "Undangan Pernikahan Digital, Bisa Edit Sendiri dari HP",
    description: "Buat undangan pernikahan digital dengan tema elegan, adat Jawa & Sunda, atau lukisan cat air. Nama tamu otomatis, RSVP, amplop digital. Coba gratis, mulai Rp69rb, aktif selamanya.",
    hero: {
      badge: "Undangan pernikahan · mulai Rp69rb",
      title: ["Undangan nikah", "seindah harinya."],
      lead: "Tema elegan, adat Jawa & Sunda, sampai lukisan cat air untuk yang tidak punya foto prewedding. Atur sendiri dari HP, kirim ke setiap tamu dengan namanya.",
    },
    devices: { url: "rayakan.my.id/afdal-putri", desktop: "/landing/afdal-desktop.webp", mobile: "/landing/afdal-mobile.webp" },
    ogImage: "/og/undangan-pernikahan.jpg",
    intro: {
      title: "Semua yang dibutuhkan undangan nikah, dalam satu link.",
      body: "Sampul dengan nama tamu, profil kedua mempelai, kisah cinta, hitung mundur ke akad, lokasi dengan tombol peta, galeri, buku ucapan & RSVP, sampai amplop digital. Semua bagian bisa diganti tata letaknya dan disembunyikan bila tidak perlu.",
    },
    points: [
      ["Akad & resepsi dalam satu undangan", "Jadwal akad, resepsi, atau ngunduh mantu tersusun rapi dengan jam dan alamat masing-masing."],
      ["Tema adat & islami", "Sekar Kedhaton (Jawa), Pasundan Asri (Sunda), dan ornamen islami, lengkap dengan bismillah dan ayat Ar-Rum 21 bila ingin."],
      ["Tanpa foto prewedding? Tetap cantik", "Pakai lukisan, ilustrasi chibi, atau foto masa kecil berdua sebagai pengganti foto utama."],
      ["Amplop digital & kado", "Nomor rekening dan e-wallet dengan tombol salin, plus kartu kirim kado ke alamat."],
    ],
    faq: [
      ["Berapa harga undangan pernikahan digital di Rayakan.my.id?", "Coba gratis untuk menyusun dan menyimpan draf. Untuk dikirim ke tamu: Edit Sendiri Rp69.000 atau Siap Pakai Rp149.000 (disusunkan admin). Sekali bayar, aktif selamanya."],
      ["Bisa memuat akad dan resepsi sekaligus?", "Bisa. Jadwal akad dan resepsi tampil di satu undangan, dan tamu bisa diberi label grup (mis. Keluarga, Kantor) supaya mudah dipilah saat mengirim."],
      ["Apakah ada tema adat Jawa dan Sunda?", "Ada: Sekar Kedhaton untuk adat Jawa dan Pasundan Asri untuk adat Sunda, lengkap dengan ornamen dan animasi pembukanya."],
    ],
  },
  ultah: {
    occasion: "ultah",
    path: "/undangan-ulang-tahun",
    name: "Undangan Ulang Tahun",
    title: "Undangan Ulang Tahun Digital untuk Anak & Dewasa",
    description: "Undangan ulang tahun digital yang ceria: tema pesta konfeti, astronaut cilik, animasi kotak kado, RSVP, dan nama tamu otomatis. Bisa edit sendiri dari HP. Coba gratis.",
    hero: {
      badge: "Undangan ulang tahun · mulai Rp69rb",
      title: ["Pesta ulang tahun,", "dimulai dari undangannya."],
      lead: "Tema ceria dengan balon, kue, dan konfeti, atau petualangan angkasa untuk si kecil. Dibuka dengan kotak kado yang meletup, dan setiap teman diundang dengan namanya.",
    },
    devices: { url: "rayakan.my.id/alea-5", desktop: "/landing/konfeti-desktop.webp", mobile: "/landing/konfeti-mobile.webp" },
    ogImage: "/og/undangan-ulang-tahun.jpg",
    intro: {
      title: "Satu link untuk undangan, lokasi, dan ucapan.",
      body: "Nama dan usia yang berulang tahun, hitung mundur ke pesta, lokasi dengan tombol peta, konfirmasi kehadiran, dan buku ucapan yang bisa dibaca bersama setelah acara.",
    },
    points: [
      ["Tema anak yang ceria", "Pesta Konfeti dengan balon dan kue, Petualang Angkasa dengan roket dan planet, semuanya beranimasi."],
      ["Satu nama, tampilan pas", "Undangan menyesuaikan untuk satu orang: satu nama besar, profil tunggal, ucapan untuk yang berulang tahun, dan judul bebas seperti \"Ulang Tahun ke-5\"."],
      ["Konfirmasi kehadiran", "Tamu mengisi hadir atau tidak beserta ucapannya, dan rekapnya langsung terlihat di admin."],
      ["Cocok juga untuk dewasa", "Ganti palet dan huruf ke gaya elegan untuk ulang tahun ke-17, ke-40, atau syukuran keluarga."],
    ],
    faq: [
      ["Apakah undangan ulang tahun bisa dibuat untuk anak?", "Bisa. Ada tema khusus anak seperti Pesta Konfeti dan Petualang Angkasa, dan semua tema lain juga bisa dipakai untuk ulang tahun."],
      ["Bisa menulis usia yang berulang tahun?", "Bisa. Isi teks di atas nama, misalnya \"Ulang Tahun ke-5\", dan nama panggilannya akan tampil besar di halaman utama."],
      ["Berapa harga undangan ulang tahun digital?", "Coba gratis untuk menyusun dan menyimpan draf. Untuk dikirim: Edit Sendiri Rp69.000 atau Siap Pakai Rp149.000. Sekali bayar, aktif selamanya."],
    ],
  },
  khitan: {
    occasion: "khitan",
    path: "/undangan-khitanan",
    name: "Undangan Khitanan",
    title: "Undangan Khitanan Digital, Islami & Ceria",
    description: "Undangan khitanan dan tasyakuran digital bernuansa islami: ornamen masjid & lampion, doa untuk ananda, jadwal acara, RSVP, dan nama tamu otomatis. Coba gratis dari HP.",
    hero: {
      badge: "Undangan khitanan · mulai Rp69rb",
      title: ["Tasyakuran khitanan,", "penuh doa & ceria."],
      lead: "Bernuansa islami dengan kubah, lampion, dan bintang. Lengkap dengan jadwal khitan dan tasyakuran, buku doa untuk ananda, dan link khusus untuk setiap tamu.",
    },
    devices: { url: "rayakan.my.id/rafa", desktop: "/landing/khitan-desktop.webp", mobile: "/landing/khitan-mobile.webp" },
    ogImage: "/og/undangan-khitanan.jpg",
    intro: {
      title: "Undangan yang sopan, hangat, dan mudah dibagikan.",
      body: "Bismillah dan kalimat pembuka yang bisa diubah, profil ananda, jadwal khitan dan tasyakuran, lokasi dengan tombol peta, serta buku doa yang bisa dibaca keluarga setelah acara.",
    },
    points: [
      ["Nuansa islami", "Tema Khitan Ceria dengan masjid dan lampion, atau ornamen islami di tema lain. Bismillah bisa ditampilkan di bagian pembuka."],
      ["Doa untuk ananda", "Tamu menulis doa dan ucapan langsung di undangan, terekap rapi di admin."],
      ["Jadwal khitan & tasyakuran", "Susun beberapa acara dalam satu hari, lengkap dengan jam dan lokasi."],
      ["Mudah dikirim ke keluarga besar", "Import daftar tamu dari Excel dan kirim lewat WhatsApp dengan nama masing-masing."],
    ],
    faq: [
      ["Apa isi undangan khitanan digital?", "Sampul dengan nama tamu, profil ananda, jadwal khitan dan tasyakuran, lokasi, buku doa & RSVP, dan amplop digital bila diperlukan."],
      ["Apakah bisa menampilkan bismillah dan ayat?", "Bisa. Bismillah dan kalimat pembuka bisa diaktifkan dan diubah teksnya di editor."],
      ["Berapa harga undangan khitanan digital?", "Coba gratis untuk menyusun dan menyimpan draf. Untuk dikirim: Edit Sendiri Rp69.000 atau Siap Pakai Rp149.000. Sekali bayar, aktif selamanya."],
    ],
  },
};

export const OCCASION_PAGE_LIST = Object.values(OCCASION_PAGES);
