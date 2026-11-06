import { describe, expect, it } from "vitest";
import { MIGRATIONS, SCHEMA_VERSION } from "./migrations";

describe("migrations", () => {
  it("have strictly increasing versions and end at SCHEMA_VERSION", () => {
    MIGRATIONS.forEach((m, i) => i > 0 && expect(m.version).toBeGreaterThan(MIGRATIONS[i - 1].version));
    expect(SCHEMA_VERSION).toBe(MIGRATIONS[MIGRATIONS.length - 1].version);
  });
  it("are idempotent (safe to replay on old databases)", () => {
    for (const m of MIGRATIONS) for (const s of m.sql) expect(s).toMatch(/IF NOT EXISTS/);
  });
});
