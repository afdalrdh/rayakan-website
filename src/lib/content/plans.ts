import type { SectionKey } from "./schema";

/* Packages (paket). These are defaults: the live values are edited in /studio. */

export type PlanId = "esensial" | "premium" | "eksklusif";
export const PLAN_IDS: PlanId[] = ["esensial", "premium", "eksklusif"];

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  price: number;
  normalPrice: number;
  /** null = selamanya */
  activeMonths: number | null;
  galleryLimit: number;
  storyLimit: number;
  /** null = tanpa batas */
  guestLimit: number | null;
  locked: SectionKey[];
  musicUpload: boolean;
  customColor: boolean;
  benefits: string[];
  highlight: boolean;
}

export function activeLabel(p: Pick<Plan, "activeMonths">) {
  if (p.activeMonths === null) return "Selamanya";
  if (p.activeMonths % 12 === 0) return `${p.activeMonths / 12} tahun`;
  return `${p.activeMonths} bulan`;
}

/** Default packages. Seeded into the database once; edited later from /studio. */
export const PLANS: Record<PlanId, Plan> = {
  esensial: {
    id: "esensial",
    name: "Esensial",
    tagline: "Semua yang penting, tetap premium.",
    price: 79000,
    normalPrice: 199000,
    activeMonths: 6,
    galleryLimit: 6,
    storyLimit: 0,
    guestLimit: 150,
    locked: ["story", "gift"],
    musicUpload: false,
    customColor: false,
    benefits: [
      "Desain premium, tampilan HP & laptop",
      "Foto utama + profil mempelai",
      "Hitung mundur, lokasi & jadwal acara",
      "Galeri hingga 6 foto",
      "RSVP & ucapan tamu",
      "Link nama tamu hingga 150 orang",
      "Musik dari pilihan lagu",
    ],
    highlight: false,
  },
  premium: {
    id: "premium",
    name: "Premium",
    tagline: "Pilihan paling banyak diambil.",
    price: 149000,
    normalPrice: 349000,
    activeMonths: 12,
    galleryLimit: 20,
    storyLimit: 4,
    guestLimit: null,
    locked: [],
    musicUpload: true,
    customColor: false,
    benefits: [
      "Semua di Esensial",
      "Kisah cinta hingga 4 babak",
      "Amplop digital (rekening & e-wallet)",
      "Galeri hingga 20 foto",
      "Link nama tamu tanpa batas + import Excel",
      "Unggah lagu sendiri",
      "Aktif 1 tahun",
    ],
    highlight: true,
  },
  eksklusif: {
    id: "eksklusif",
    name: "Eksklusif",
    tagline: "Terima beres, aktif selamanya.",
    price: 249000,
    normalPrice: 599000,
    activeMonths: null,
    galleryLimit: 40,
    storyLimit: 8,
    guestLimit: null,
    locked: [],
    musicUpload: true,
    customColor: true,
    benefits: [
      "Semua di Premium",
      "Konten diisikan tim Rayakan.my.id",
      "Warna aksen sesuai seragam / dekorasi",
      "Galeri hingga 40 foto, kisah hingga 8 babak",
      "Akses semua tema baru",
      "Prioritas bantuan via WhatsApp",
      "Aktif selamanya",
    ],
    highlight: false,
  },
};

export function rupiah(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}
