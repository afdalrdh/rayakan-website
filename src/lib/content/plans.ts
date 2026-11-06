import type { SectionKey } from "./schema";

/* Packages (paket). These are defaults: the live values are edited in /studio. */

/**
 * - gratis: try the editor and save a draft; cannot be shared with guests.
 * - mandiri ("Edit Sendiri"): the client edits, Rayakan.my.id publishes after payment.
 * - siap ("Siap Pakai"): the admin builds the invitation from the client's data.
 */
export type PlanId = "gratis" | "mandiri" | "siap";
export const PLAN_IDS: PlanId[] = ["gratis", "mandiri", "siap"];
/** Packages a published invitation can have. */
export const PAID_PLAN_IDS: PlanId[] = ["mandiri", "siap"];

/** Old package ids (before Nov 2026) → current ones. */
const LEGACY_PLAN: Record<string, PlanId> = { esensial: "mandiri", premium: "mandiri", eksklusif: "siap" };
export function toPlanId(v: unknown): PlanId {
  const s = String(v ?? "");
  return (PLAN_IDS as string[]).includes(s) ? (s as PlanId) : LEGACY_PLAN[s] ?? "mandiri";
}

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

/** Every package gets the full editor; they differ in who builds it and whether it can be published. */
const FULL = { galleryLimit: 40, storyLimit: 8, guestLimit: null, locked: [] as SectionKey[], musicUpload: true, customColor: true, activeMonths: null };

/** Default packages. Seeded into the database once; edited later from /studio. */
export const PLANS: Record<PlanId, Plan> = {
  gratis: {
    id: "gratis",
    name: "Coba Gratis",
    tagline: "Coba semua tema & editor, tanpa daftar.",
    price: 0,
    normalPrice: 0,
    ...FULL,
    benefits: [
      "Semua tema, warna, huruf & tata letak",
      "Edit semua bagian langsung dari HP",
      "Pratinjau persis seperti yang dilihat tamu",
      "Simpan draf dengan link edit pribadi",
      "Belum bisa dikirim ke tamu",
    ],
    highlight: false,
  },
  mandiri: {
    id: "mandiri",
    name: "Edit Sendiri",
    tagline: "Kamu yang atur, kami yang terbitkan.",
    price: 69000,
    normalPrice: 69000,
    ...FULL,
    benefits: [
      "Semua fitur editor & semua tema",
      "Alamat sendiri: rayakan.my.id/nama-kalian",
      "Kirim ke tamu dengan nama masing-masing",
      "RSVP, buku ucapan & amplop digital",
      "Musik, galeri hingga 40 foto, peta lokasi",
      "Bisa diubah sendiri sampai hari H",
      "Aktif selamanya",
    ],
    highlight: true,
  },
  siap: {
    id: "siap",
    name: "Siap Pakai",
    tagline: "Kirim data & foto, admin yang menyusun.",
    price: 149000,
    normalPrice: 149000,
    ...FULL,
    benefits: [
      "Semua di Edit Sendiri",
      "Undangan disusun admin Rayakan.my.id",
      "Dibantu pilih tema, warna & tata letak",
      "Tinggal cek, minta perubahan lewat WhatsApp",
      "Tetap bisa kamu ubah sendiri kapan saja",
      "Aktif selamanya",
    ],
    highlight: false,
  },
};

export function rupiah(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}
