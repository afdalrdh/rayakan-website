import { layoutOf } from "@/themes/layouts/catalog";
import { DEFAULT_TRACK, MUSIC_LIBRARY } from "@/themes/meta";
import { getOccasion, OCCASION_IDS, OCCASIONS, type Occasion } from "./occasion";
import { BLOCK_LABELS, type BlockKey, type Person, type WeddingContent } from "./schema";

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

/* ------------------------------------------------------------------ */
/* Occasion-aware helpers                                              */
/* ------------------------------------------------------------------ */

/** Editor name of a block, e.g. "Mempelai" for weddings, "Yang Berulang Tahun" for birthdays. */
export function blockLabel(key: BlockKey, occasion: Occasion | string = "nikah") {
  const o = getOccasion(occasion);
  if (key === "couple") return o.coupleBlock;
  if (key === "story") return o.storyBlock;
  return BLOCK_LABELS[key];
}

/** Names for the hero, cover and titles. Birthdays and circumcisions have one name. */
export function namesOf(c: Pick<WeddingContent, "occasion" | "hero">) {
  const single = getOccasion(c.occasion).single;
  const first = c.hero.firstName.trim();
  const second = single ? "" : c.hero.secondName.trim();
  return { first, second, single, joined: single ? first : [first, second].filter(Boolean).join(" & ") };
}

/** People shown in the profile section (one or two). */
export function peopleOf(c: Pick<WeddingContent, "occasion" | "couple">): Person[] {
  return getOccasion(c.occasion).single ? [c.couple.first] : [c.couple.first, c.couple.second];
}

/** Line above the names: the site's own text, or the occasion default. */
export function eyebrowOf(c: Pick<WeddingContent, "occasion" | "hero">) {
  return c.hero.eyebrow?.trim() || getOccasion(c.occasion).eyebrow;
}

/** Title for browser tabs and WhatsApp previews. */
export function shareTitle(c: Pick<WeddingContent, "occasion" | "hero">) {
  const n = namesOf(c);
  if (c.occasion === "nikah") return `The Wedding of ${n.joined}`;
  return `${eyebrowOf(c)} ${n.joined}`.trim();
}

/** One-line description of the event for previews: "Undangan pernikahan A & B". */
export function shareKind(c: Pick<WeddingContent, "occasion" | "hero">) {
  const n = namesOf(c);
  if (c.occasion === "nikah") return `Undangan pernikahan ${n.joined}`;
  if (c.occasion === "ultah") return `Undangan ulang tahun ${n.joined}`;
  return `Undangan tasyakuran khitanan ${n.joined}`;
}

/**
 * Switch occasion. Texts still on a default value (from any occasion) are
 * replaced with the new occasion's defaults; anything the client typed stays.
 */
export function applyOccasion(c: WeddingContent, next: Occasion) {
  const o = OCCASIONS[next];
  const all = OCCASION_IDS.map((id) => OCCASIONS[id]);
  const swap = (current: string, pick: (x: (typeof all)[number]) => string) => (!current.trim() || all.some((x) => pick(x) === current) ? pick(o) : current);
  c.occasion = next;
  c.couple.headline = swap(c.couple.headline, (x) => x.copy.headline);
  c.story.eyebrow = swap(c.story.eyebrow, (x) => x.copy.storyEyebrow);
  c.story.title = swap(c.story.title, (x) => x.copy.storyTitle);
  c.rsvp.eyebrow = swap(c.rsvp.eyebrow, (x) => x.copy.rsvpEyebrow);
  c.gift.eyebrow = swap(c.gift.eyebrow, (x) => x.copy.giftEyebrow);
  c.gift.title = swap(c.gift.title, (x) => x.copy.giftTitle);
  c.closing.eyebrow = swap(c.closing.eyebrow, (x) => x.copy.closingEyebrow);
  c.closing.quote = swap(c.closing.quote, (x) => x.copy.closingQuote);
  c.hero.scrollLabel = swap(c.hero.scrollLabel, (x) => x.copy.scrollLabel);
  if (all.some((x) => x.eyebrow === c.hero.eyebrow.trim())) c.hero.eyebrow = "";
  const labels = c.venue.schedules.map((s) => s.label);
  if (!labels.length || labels.every((l) => !l.trim() || all.some((x) => x.schedules.includes(l)))) {
    c.venue.schedules = o.schedules.map((label, i) => ({ id: c.venue.schedules[i]?.id ?? `j${i + 1}`, label, time: c.venue.schedules[i]?.time ?? "" }));
  }
  c.rsvp.askCity = next === "nikah" ? c.rsvp.askCity : false;
  // Each occasion has its own song: swap it unless the client picked another one themselves.
  const ownPick = MUSIC_LIBRARY.some((t) => t.id === c.music.trackId) && !Object.values(DEFAULT_TRACK).includes(c.music.trackId);
  if (c.music.mode === "library" && !ownPick) c.music.trackId = DEFAULT_TRACK[next];
  if (o.single) c.closing.displayName = c.closing.displayName.includes("&") ? c.hero.firstName : c.closing.displayName;
}

/** Image fields that still point at sample photos (public/demo). Shown as a reminder before publishing. */
export function samplePhotos(c: WeddingContent): string[] {
  const out: string[] = [];
  const is = (u: string) => u.startsWith("/demo/");
  if (is(c.cover.photo)) out.push("Foto sampul");
  if (is(c.hero.imageDesktop) || is(c.hero.imageMobile)) out.push("Foto utama");
  if (peopleOf(c).some((p) => is(p.photo))) out.push("Foto profil");
  if (c.story.items.some((s) => is(s.image))) out.push("Foto cerita");
  if (c.gallery.photos.some((g) => is(g.src))) out.push("Galeri");
  if (is(c.venue.image)) out.push("Foto lokasi");
  if (is(c.closing.image)) out.push("Foto penutup");
  return out;
}

/** Simple completeness check used by the "Isian" list and publish checklist. */
export function blockStatus(c: WeddingContent, key: BlockKey): { done: number; total: number; missing: string[] } {
  const o = getOccasion(c.occasion);
  const checks: [boolean, string][] = (() => {
    switch (key) {
      case "cover": {
        const button: [boolean, string] = [!!c.cover.buttonLabel.trim(), "Teks tombol"];
        return c.layouts.cover === "stiker" ? [button, [!!c.cover.photo, "Foto stiker"]] : [button];
      }
      case "hero": {
        const l = layoutOf("hero", c.layouts.hero);
        const names: [boolean, string][] = o.single ? [[!!c.hero.firstName.trim(), "Nama panggilan"]] : [[!!c.hero.firstName.trim(), "Nama panggilan pertama"], [!!c.hero.secondName.trim(), "Nama panggilan kedua"]];
        if (l.noPhoto) return names;
        if (l.id === "polaroid") return [...names, ...peopleOf(c).map((p, i): [boolean, string] => [!!p.photo, `Foto profil ${i + 1}`])];
        if (l.id === "lukisan") return [...names, [!!(c.hero.imageMobile || c.hero.imageDesktop), "Gambar lukisan"]];
        return [...names, [!!c.hero.imageDesktop, "Foto layar lebar"], [!!c.hero.imageMobile, "Foto layar HP"]];
      }
      case "couple": {
        const photos = !layoutOf("couple", c.layouts.couple).noPhoto;
        return peopleOf(c).flatMap((p, i): [boolean, string][] => {
          const who = o.single ? "" : ` ${o.person[i]?.toLowerCase()}`;
          return [[!!p.fullName.trim(), `Nama lengkap${who}`], ...(photos ? [[!!p.photo, `Foto${who}`] as [boolean, string]] : [])];
        });
      }
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
        return layoutOf("closing", c.layouts.closing).id === "polos"
          ? [[!!c.closing.displayName.trim(), "Nama penutup"]]
          : [
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
