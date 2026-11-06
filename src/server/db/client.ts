import "server-only";
import { PLAN_IDS, PLANS } from "@/lib/content";
import { MIGRATIONS, SCHEMA_VERSION } from "./migrations";

/**
 * One tiny query function for the whole app.
 *  - Production: Neon serverless (HTTP), no connection pool to exhaust,
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

async function currentVersion() {
  try {
    const rows = await raw(`SELECT version FROM schema_meta WHERE id = 1`);
    return Number(rows[0]?.version ?? 0);
  } catch {
    return 0; // table not there yet: a fresh database or one made before versioning
  }
}

/**
 * Brings the database up to date once per process. When it already is, this
 * costs a single small query instead of replaying every statement.
 */
async function migrate() {
  const from = await currentVersion();
  if (from >= SCHEMA_VERSION) return;
  for (const m of MIGRATIONS) if (m.version > from) for (const stmt of m.sql) await raw(stmt);
  const have = await raw(`SELECT COUNT(*)::int AS n FROM plans`);
  if (Number(have[0]?.n ?? 0) === 0) {
    for (const [i, id] of PLAN_IDS.entries()) {
      await raw(`INSERT INTO plans (id, data, sort) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`, [id, JSON.stringify(PLANS[id]), i]);
    }
  }
  await raw(`CREATE TABLE IF NOT EXISTS schema_meta (id INT PRIMARY KEY, version INT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await raw(`INSERT INTO schema_meta (id, version) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET version = EXCLUDED.version, updated_at = NOW()`, [SCHEMA_VERSION]);
}

function ensureSchema() {
  if (!g.__rkReady)
    g.__rkReady = migrate().catch((e) => {
      g.__rkReady = null;
      throw e;
    });
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
