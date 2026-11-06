import { describe, expect, it } from "vitest";
import { demoContent, THEME_IDS } from "@/lib/content";
import { sanitizeContent, starterContent } from "./validate";

describe("sanitizeContent", () => {
  it("keeps every theme sample as it is (round trip)", () => {
    for (const id of THEME_IDS) {
      const c = demoContent(id);
      expect(sanitizeContent(structuredClone(c))).toEqual(c);
    }
  });
  it("drops unknown keys and unsafe image URLs", () => {
    const c = structuredClone(demoContent("arya")) as unknown as Record<string, unknown> & { hero: Record<string, unknown>; cover: Record<string, unknown> };
    c.evil = "x";
    c.hero.imageMobile = "javascript:alert(1)";
    c.cover.photo = "http://example.com/a.png";
    const out = sanitizeContent(c);
    expect("evil" in out).toBe(false);
    expect(out.hero.imageMobile).toBe("");
    expect(out.cover.photo).toBe("");
  });
  it("falls back for unknown occasion and theme", () => {
    const out = sanitizeContent({ ...demoContent("arya"), occasion: "pesta", theme: "zzz" });
    expect(out.occasion).toBe("nikah");
    expect(out.theme).toBe("arya");
  });
});

describe("starterContent", () => {
  it("starts with the client's names and no sample photos", () => {
    const c = starterContent("kecil", "Dimas", "Ayu", "2027-01-01");
    expect(c.hero.firstName).toBe("Dimas");
    expect(c.cover.photo).toBe("");
    expect(c.hero.imageMobile).toBe("");
    expect(c.gallery.photos).toEqual([]);
  });
});
