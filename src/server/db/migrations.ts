import "server-only";

/**
 * Database schema history. Never edit a released migration: add a new one at
 * the end. Every statement is idempotent (IF NOT EXISTS), so databases created
 * before this list existed simply replay them once.
 */
export const MIGRATIONS: { version: number; name: string; sql: string[] }[] = [
  {
    version: 1,
    name: "initial tables",
    sql: [
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
    ],
  },
  {
    version: 2,
    name: "self-serve drafts and reviews (Nov 2026)",
    sql: [
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
    ],
  },
  {
    version: 3,
    name: "indexes for lists and rate limits",
    sql: [
      `CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews (status, created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS sites_ip_idx ON sites (created_ip, created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS guests_site_idx ON guests (site_id, created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS wishes_site_idx ON wishes (site_id, created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS wishes_ip_idx ON wishes (ip_hash, created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS sites_status_idx ON sites (status, created_at DESC)`,
    ],
  },
];

export const SCHEMA_VERSION = MIGRATIONS[MIGRATIONS.length - 1].version;
