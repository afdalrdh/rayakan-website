/**
 * Ornament & animation sets ("dekorasi"). A set adds corner ornaments to every
 * section, a small divider under titles, a gently moving particle layer, and
 * the illustrated scene used by photo-free layouts. No React here, so the
 * server can validate ids. Artwork lives in ./art.tsx.
 */

export const DECOR_IDS = ["none", "bunga", "jawa", "sunda", "islami", "pesta", "angkasa", "doodle"] as const;
export type DecorId = (typeof DECOR_IDS)[number];

export interface DecorMeta {
  id: DecorId;
  name: string;
  desc: string;
  /** Particles that float over the page (none = no layer). */
  particles: "none" | "petals" | "jasmine" | "leaves" | "stars" | "confetti" | "hearts";
}

export const DECORS: Record<DecorId, DecorMeta> = {
  none: { id: "none", name: "Tanpa ornamen", desc: "Bersih, fokus pada foto dan huruf.", particles: "none" },
  bunga: { id: "bunga", name: "Bunga Lukis", desc: "Rangkaian bunga & daun, kelopak berguguran.", particles: "petals" },
  jawa: { id: "jawa", name: "Adat Jawa", desc: "Gunungan, motif kawung, melati berguguran.", particles: "jasmine" },
  sunda: { id: "sunda", name: "Adat Sunda", desc: "Mega mendung, bambu, gunung & daun melayang.", particles: "leaves" },
  islami: { id: "islami", name: "Islami", desc: "Lampion, bintang segi delapan, kubah.", particles: "stars" },
  pesta: { id: "pesta", name: "Pesta Konfeti", desc: "Balon, bendera, konfeti berjatuhan.", particles: "confetti" },
  angkasa: { id: "angkasa", name: "Angkasa", desc: "Planet, roket, bintang berkelip.", particles: "stars" },
  doodle: { id: "doodle", name: "Doodle Hati", desc: "Coretan tangan, hati & kilau melayang.", particles: "hearts" },
};

export const isDecor = (v: unknown): v is DecorId => typeof v === "string" && (DECOR_IDS as readonly string[]).includes(v);
export const getDecor = (id: string | undefined) => DECORS[(id as DecorId) ?? "none"] ?? DECORS.none;
