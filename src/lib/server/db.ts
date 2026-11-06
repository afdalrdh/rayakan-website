import "server-only";

/**
 * One tiny query function for the whole app.
 *  - Production: Neon serverless (HTTP) — no connection pool to exhaust,
 *    scales with Vercel functions.
 *  - Local without DATABASE_URL: PGlite (Postgres in-process, files in .data/)
 *    so the project runs with zero setup.
 */

type Row = Record<string, unknown>;
type Runner = (text: string, params?: unknown[]) => Promise<Row[]>;

// Route handlers and pages can load separate copies of this module; keep ONE
// connection/database per process by storing it on globalThis.
const g = globalThis as unknown as { __rkRunner?: Promise<Runner> | null; __rkReady?: Promise<void> | null };

async function createRunner(): Promise<Runner> {
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const clean = url.replace(/([?&])channel_binding=[^&]+(&|$)/, "$1").replace(/[?&]$/, "");
    const sql = neon(clean);
    return async (text, params = []) => (await sql.query(text, params)) as Row[];
  }
  if (process.env.VERCEL) {
    throw new Error("DATABASE_URL belum diisi di Vercel (Settings → Environment Variables).");
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { mkdir } = await import("fs/promises");
  const dir = process.env.PGLITE_DIR || ".data/pglite";
  await mkdir(dir, { recursive: true });
  const db = new PGlite(dir);
  await db.waitReady;
  return async (text, params = []) => (await db.query<Row>(text, params)).rows;
}

async function raw(text: string, params?: unknown[]) {
  if (!g.__rkRunner)
    g.__rkRunner = createRunner().catch((e) => {
      g.__rkRunner = null;
      throw e;
    });
  return (await g.__rkRunner)(text, params);
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    sort INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS sites (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    theme TEXT NOT NULL DEFAULT 'arya',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
    content JSONB NOT NULL,
    wa_template TEXT,
    password_hash TEXT NOT NULL,
    client_name TEXT,
    client_phone TEXT,
    notes TEXT,
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS guests (
    id BIGSERIAL PRIMARY KEY,
    site_id BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    group_label TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (site_id, slug)
  )`,
  `CREATE TABLE IF NOT EXISTS wishes (
    id BIGSERIAL PRIMARY KEY,
    site_id BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    attendance TEXT NOT NULL CHECK (attendance IN ('Hadir','Tidak Hadir')),
    location TEXT,
    message TEXT NOT NULL,
    guest_slug TEXT,
    ip_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS login_attempts (
    key TEXT PRIMARY KEY,
    count INT NOT NULL,
    first_at TIMESTAMPTZ NOT NULL
  )`,
  // Self-serve drafts (Nov 2026): who made the site and whether they asked to publish it.
  `ALTER TABLE sites ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'studio'`,
  `ALTER TABLE sites ADD COLUMN IF NOT EXISTS request_plan TEXT`,
  `ALTER TABLE sites ADD COLUMN IF NOT EXISTS requested_at TIMESTAMPTZ`,
  `ALTER TABLE sites ADD COLUMN IF NOT EXISTS created_ip TEXT`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    site_id BIGINT REFERENCES sites(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    occasion TEXT NOT NULL DEFAULT 'nikah',
    city TEXT,
    rating INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    message TEXT NOT NULL,
    link TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','shown','hidden')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews (status, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS sites_ip_idx ON sites (created_ip, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS guests_site_idx ON guests (site_id, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS wishes_site_idx ON wishes (site_id, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS wishes_ip_idx ON wishes (ip_hash, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS sites_status_idx ON sites (status, created_at DESC)`,
];

async function ensureSchema() {
  if (!g.__rkReady) {
    g.__rkReady = (async () => {
      for (const stmt of SCHEMA) await raw(stmt);
      const { PLANS, PLAN_IDS } = await import("../content");
      const have = await raw(`SELECT COUNT(*)::int AS n FROM plans`);
      if (Number(have[0]?.n ?? 0) === 0) {
        for (const [i, id] of PLAN_IDS.entries()) {
          await raw(`INSERT INTO plans (id, data, sort) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [id, JSON.stringify(PLANS[id]), i]);
        }
      }
    })().catch((e) => {
      g.__rkReady = null;
      throw e;
    });
  }
  return g.__rkReady;
}

export async function query<T = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  await ensureSchema();
  return (await raw(text, params)) as T[];
}

export async function one<T = Row>(text: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
