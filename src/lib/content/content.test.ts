import { describe, expect, it } from "vitest";
import { applyOccasion, blockStatus, DEFAULT_TRACK, demoContent, MUSIC_LIBRARY, namesOf, normalizeContent, samplePhotos, slugify, THEME_IDS, THEMES } from "./index";
import { cleanLayouts } from "@/themes/layouts/catalog";

describe("slugify", () => {
  it("makes URL-safe addresses", () => {
    expect(slugify("Arya & Almalia!")).toBe("arya-almalia");
    expect(slugify("  Éva  ")).toBe("eva");
  });
});

describe("occasions", () => {
  it("single-person occasions use one name", () => {
    const c = demoContent("konfeti");
    expect(namesOf(c).single).toBe(true);
    const nikah = structuredClone(c);
    applyOccasion(nikah, "nikah");
    expect(nikah.occasion).toBe("nikah");
  });
});

describe("music", () => {
  it("every theme starts with a song that exists, matching its occasion", () => {
    for (const id of THEME_IDS) {
      const t = THEMES[id];
      expect(MUSIC_LIBRARY.some((m) => m.id === t.defaultTrack)).toBe(true);
      expect(t.defaultTrack).toBe(DEFAULT_TRACK[t.occasion]);
    }
  });
  it("sites saved with a removed song get their occasion's song", () => {
    const old = { ...demoContent("konfeti"), music: { mode: "library", trackId: "afdal-background", upload: "", uploadName: "" } };
    expect(normalizeContent(old).music.trackId).toBe(DEFAULT_TRACK.ultah);
  });
  it("switching occasion switches to that occasion's song", () => {
    const c = demoContent("konfeti");
    applyOccasion(c, "khitan");
    expect(c.music.trackId).toBe(DEFAULT_TRACK.khitan);
  });
});

describe("themes", () => {
  it("every preset only uses layouts that exist", () => {
    for (const id of THEME_IDS) {
      const layouts = THEMES[id].layouts;
      expect(cleanLayouts(layouts)).toEqual(layouts);
    }
  });
  it("unknown layout ids fall back to the default", () => {
    expect(cleanLayouts({ hero: "tidak-ada" }).hero).toBe("sinematik");
  });
});

describe("checklist", () => {
  it("asks for the sticker photo only on the sticker cover", () => {
    const c = demoContent("kecil");
    c.cover.photo = "";
    expect(blockStatus(c, "cover").missing).toContain("Foto stiker");
    c.layouts.cover = "kaca";
    expect(blockStatus(c, "cover").missing).not.toContain("Foto stiker");
  });
  it("reminds about sample photos, including the cover", () => {
    expect(samplePhotos(demoContent("kecil"))).toContain("Foto sampul");
  });
});
