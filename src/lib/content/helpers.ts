import type { BlockKey, WeddingContent } from "./schema";

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/** Keep slugs predictable: lowercase letters, numbers and single dashes. */
export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function formatEventDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "Tanggal belum diisi";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

const TZ_OFFSET = { WIB: "+07:00", WITA: "+08:00", WIT: "+09:00" } as const;

export function eventDateTime(c: WeddingContent["event"]) {
  return new Date(`${c.date}T${c.time || "08:00"}:00${TZ_OFFSET[c.timezone]}`);
}

export function initials(a: string, b: string) {
  const f = (s: string) => s.trim().charAt(0).toUpperCase();
  return [f(a), f(b)].filter(Boolean);
}

/** Simple completeness check used by the "Isian" list and publish checklist. */
export function blockStatus(c: WeddingContent, key: BlockKey): { done: number; total: number; missing: string[] } {
  const checks: [boolean, string][] = (() => {
    switch (key) {
      case "cover":
        return [[!!c.cover.buttonLabel.trim(), "Teks tombol"]];
      case "hero":
        return [
          [!!c.hero.firstName.trim(), "Nama panggilan pertama"],
          [!!c.hero.secondName.trim(), "Nama panggilan kedua"],
          [!!c.hero.imageDesktop, "Foto layar lebar"],
          [!!c.hero.imageMobile, "Foto layar HP"],
        ];
      case "couple":
        return [
          [!!c.couple.first.fullName.trim(), "Nama lengkap mempelai 1"],
          [!!c.couple.second.fullName.trim(), "Nama lengkap mempelai 2"],
          [!!c.couple.first.photo, "Foto mempelai 1"],
          [!!c.couple.second.photo, "Foto mempelai 2"],
        ];
      case "story":
        return [[c.story.items.length > 0, "Minimal 1 cerita"]];
      case "event":
        return [[!!c.event.date, "Tanggal acara"]];
      case "venue":
        return [
          [!!c.venue.name.trim(), "Nama tempat"],
          [!!c.venue.address.trim(), "Alamat"],
          [!!c.venue.mapsUrl.trim(), "Link Google Maps"],
          [c.venue.schedules.length > 0, "Jadwal acara"],
        ];
      case "gallery":
        return [[c.gallery.photos.length >= 3, "Minimal 3 foto"]];
      case "rsvp":
        return [[!!c.rsvp.title.trim(), "Judul"]];
      case "gift":
        return [[c.gift.accounts.length > 0 && c.gift.accounts.every((a) => a.number && a.holder), "Data rekening"]];
      case "closing":
        return [
          [!!c.closing.displayName.trim(), "Nama penutup"],
          [!!c.closing.image, "Foto latar"],
        ];
    }
  })();
  return {
    done: checks.filter(([ok]) => ok).length,
    total: checks.length,
    missing: checks.filter(([ok]) => !ok).map(([, l]) => l),
  };
}

/* ------------------------------------------------------------------ */
/* Schema evolution                                                    */
/* ------------------------------------------------------------------ */

function fill(value: unknown, template: unknown): unknown {
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return structuredClone(template);
    const item = template[0];
    return item !== null && typeof item === "object" && !Array.isArray(item) ? value.map((v) => fill(v, item)) : value;
  }
  if (template !== null && typeof template === "object") {
    const src = (value !== null && typeof value === "object" ? value : {}) as Record<string, unknown>;
    const out: Record<string, unknown> = { ...src };
    for (const [k, t] of Object.entries(template)) out[k] = fill(src[k], t);
    return out;
  }
  return value === undefined ? template : value;
}

/**
 * Content saved before a field existed won't have it. Fill every missing key
 * from a template so themes can rely on the full shape. Existing values win.
 */
export function withDefaults(content: unknown, template: WeddingContent): WeddingContent {
  return fill(content, template) as WeddingContent;
}
