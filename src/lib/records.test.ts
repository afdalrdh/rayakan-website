import { describe, expect, it } from "vitest";
import { OCCASION_PAGE_LIST } from "./marketing";
import { claimSlug, computeExpiry, isExpired, normalizePhone, RESERVED_GUEST_SLUGS, RESERVED_SLUGS } from "./records";

describe("claimSlug", () => {
  it("uses the base when free and numbers it when taken", () => {
    const taken = new Set(["budi"]);
    expect(claimSlug("budi", taken)).toBe("budi-2");
    expect(claimSlug("budi", taken)).toBe("budi-3");
    expect(claimSlug("sari", taken)).toBe("sari");
  });
  it("never returns a reserved guest path", () => {
    expect(RESERVED_GUEST_SLUGS.has(claimSlug("admin", new Set()))).toBe(false);
  });
});

describe("expiry", () => {
  it("forever plans never expire", () => {
    expect(computeExpiry({ activeMonths: null })).toBeNull();
    expect(isExpired({ expiresAt: null })).toBe(false);
  });
  it("adds months and compares with now", () => {
    const end = computeExpiry({ activeMonths: 2 }, new Date("2026-01-15T00:00:00Z"))!;
    expect(end.startsWith("2026-03-15")).toBe(true);
    expect(isExpired({ expiresAt: end }, Date.parse("2026-04-01"))).toBe(true);
  });
});

describe("normalizePhone", () => {
  it("turns local numbers into 62…", () => {
    expect(normalizePhone("0812-3456-7890")).toBe("6281234567890");
    expect(normalizePhone("812 3456 7890")).toBe("6281234567890");
    expect(normalizePhone("123")).toBe("");
  });
});

describe("reserved addresses", () => {
  it("covers every marketing page", () => {
    for (const p of OCCASION_PAGE_LIST) expect(RESERVED_SLUGS.has(p.path.slice(1))).toBe(true);
  });
});
