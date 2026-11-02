import type { BlockKey } from "@/lib/content/schema";

/**
 * Layout options per section (no React here so the server can validate ids).
 * Every option renders the same content fields — only the arrangement differs —
 * so clients can switch freely without re-entering anything.
 */

export interface LayoutOption {
  id: string;
  name: string;
  desc: string;
  /** Short tip shown in the picker, e.g. what kind of photo or name length suits it. */
  hint?: string;
  /** Story layouts: how many photos per chapter are shown (1 or a 2×2 grid). */
  storyPhotos?: 1 | 4;
  /** Hero layouts that draw the heart ornament (can be hidden / resized). */
  heart?: boolean;
  /** Hero layouts that use the 3D cut-out photo. */
  cutout?: boolean;
}

export const LAYOUTS: Record<BlockKey, LayoutOption[]> = {
  cover: [
    { id: "kaca", name: "Kaca Buram", desc: "Foto utama diburamkan, kartu nama tamu bergaris tipis." },
    { id: "amplop", name: "Amplop", desc: "Sampul seperti amplop dengan segel inisial di tengah." },
    { id: "lengkung", name: "Bingkai Lengkung", desc: "Latar warna polos, foto dalam bingkai lengkung." },
    { id: "sinema", name: "Sinematik", desc: "Foto penuh, nama tamu dan tombol di bagian bawah." },
  ],
  hero: [
    { id: "sinematik", name: "Sinematik", desc: "Nama besar bergradasi warna aksen, ornamen bunga di bawah nama.", hint: "Cocok untuk nama sampai ±8 huruf.", cutout: true },
    { id: "raksasa", name: "Nama Raksasa", desc: "Nama sangat besar memenuhi layar dengan hiasan hati.", hint: "Paling bagus untuk nama pendek (±5 huruf). Nama panjang akan mengecil.", heart: true, cutout: true },
    { id: "tengah", name: "Klasik Tengah", desc: "Nama di tengah foto, tanggal acara di bawahnya.", hint: "Aman untuk nama panjang." },
    { id: "lengkung", name: "Bingkai Lengkung", desc: "Foto dalam bingkai lengkung di atas latar warna tema.", hint: "Bagus untuk foto berdiri (portrait)." },
    { id: "editorial", name: "Editorial", desc: "Nama di kiri bawah ala majalah, tanggal di kanan.", hint: "Bagus bila wajah ada di tengah atau atas foto." },
  ],
  couple: [
    { id: "kartu", name: "Kartu Foto", desc: "Dua kartu dengan foto lebar di atas nama." },
    { id: "ringkas", name: "Kartu Ringkas", desc: "Foto kecil di samping nama, hemat tempat." },
    { id: "bulat", name: "Potret Bulat", desc: "Foto bulat berhadapan dengan tanda & di tengah." },
    { id: "editorial", name: "Editorial Besar", desc: "Foto tinggi bergantian kiri-kanan dengan nama besar." },
  ],
  story: [
    { id: "linimasa", name: "Linimasa", desc: "Garis waktu vertikal, cerita bergantian kiri-kanan." },
    { id: "bab", name: "Bab Bergulir", desc: "Halaman berhenti, tiap bab berganti saat digulir. Bisa 4 foto per bab.", storyPhotos: 4 },
    { id: "geser", name: "Kartu Geser", desc: "Kartu cerita berderet yang bisa digeser ke samping." },
    { id: "zigzag", name: "Zig-zag", desc: "Foto besar dan teks bergantian dengan nomor bab." },
  ],
  event: [
    { id: "kotak", name: "Hitung Mundur", desc: "Tanggal besar dengan empat kotak hitung mundur." },
    { id: "kalender", name: "Kalender", desc: "Hari, tanggal, dan bulan disusun seperti kalender." },
    { id: "angka", name: "Angka Besar", desc: "Hitung mundur angka besar dipisah titik dua." },
    { id: "foto", name: "Di Atas Foto", desc: "Tanggal dan hitung mundur di atas foto utama." },
  ],
  venue: [
    { id: "berdampingan", name: "Gambar & Info", desc: "Gambar tempat di samping alamat dan jadwal." },
    { id: "tengah", name: "Tengah", desc: "Gambar melebar di atas, info di tengah." },
    { id: "linimasa", name: "Linimasa Acara", desc: "Jadwal tersusun sebagai garis waktu." },
    { id: "kartu", name: "Kartu Acara", desc: "Satu kartu per acara, lengkap dengan tombol peta." },
  ],
  gallery: [
    { id: "mozaik", name: "Mozaik", desc: "Ritme foto kecil-besar bergantian." },
    { id: "rapi", name: "Grid Rapi", desc: "Setiap baris selalu penuh, cocok campuran foto berdiri & mendatar." },
    { id: "masonry", name: "Masonry", desc: "Kolom bertumpuk dengan tinggi foto berbeda-beda." },
    { id: "geser", name: "Slider", desc: "Satu foto besar dengan deretan foto kecil di bawahnya." },
  ],
  rsvp: [
    { id: "berdampingan", name: "Form & Ucapan", desc: "Form di kiri, daftar ucapan di kanan." },
    { id: "tengah", name: "Tengah", desc: "Form di tengah, ucapan dua kolom di bawahnya." },
    { id: "tab", name: "Tab", desc: "Satu kartu dengan tab Kirim Ucapan dan Lihat Ucapan." },
    { id: "obrolan", name: "Gelembung Chat", desc: "Ucapan tampil seperti percakapan." },
  ],
  gift: [
    { id: "kartu", name: "Kartu Bank", desc: "Kartu rekening ala kartu debit dalam grid." },
    { id: "samping", name: "Kartu & Hadiah", desc: "Kartu rekening di kiri, kartu kirim hadiah di kanan." },
    { id: "amplop", name: "Amplop Terbuka", desc: "Rekening muncul setelah tamu menekan tombol." },
    { id: "daftar", name: "Daftar Sederhana", desc: "Baris rekening ringkas dengan tombol salin." },
  ],
  closing: [
    { id: "foto", name: "Foto Penuh", desc: "Kalimat penutup di atas foto penuh layar." },
    { id: "lengkung", name: "Bingkai Lengkung", desc: "Foto dalam bingkai lengkung di atas latar warna." },
    { id: "belah", name: "Foto Samping", desc: "Foto di satu sisi, kalimat di sisi lain." },
    { id: "polos", name: "Teks Saja", desc: "Tanpa foto, nama besar dan ornamen garis." },
  ],
};

export type SiteLayouts = Record<BlockKey, string>;

export const DEFAULT_LAYOUTS: SiteLayouts = {
  cover: "kaca",
  hero: "sinematik",
  couple: "kartu",
  story: "linimasa",
  event: "kotak",
  venue: "berdampingan",
  gallery: "mozaik",
  rsvp: "berdampingan",
  gift: "kartu",
  closing: "foto",
};

export function layoutOf(block: BlockKey, id: string | undefined): LayoutOption {
  const list = LAYOUTS[block];
  return list.find((o) => o.id === id) ?? list[0];
}

/** Keep only known ids; unknown ones fall back to the default layout. */
export function cleanLayouts(input: unknown, fallback: SiteLayouts = DEFAULT_LAYOUTS): SiteLayouts {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out = { ...fallback };
  for (const k of Object.keys(LAYOUTS) as BlockKey[]) {
    const v = src[k];
    if (typeof v === "string" && LAYOUTS[k].some((o) => o.id === v)) out[k] = v;
  }
  return out;
}
