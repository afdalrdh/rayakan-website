import "server-only";

/** Row helpers: Neon returns dates and JSON as strings, PGlite as objects. */
export const iso = (v: string | Date | null) => (v ? new Date(v).toISOString() : null);
export const json = <T,>(v: T | string): T => (typeof v === "string" ? (JSON.parse(v) as T) : v);
