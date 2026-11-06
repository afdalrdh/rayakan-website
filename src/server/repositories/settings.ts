import "server-only";
import { unstable_cache } from "next/cache";
import { DEFAULT_SETTINGS, type AppSettings } from "@/lib/records";
import { TAG } from "../cache";
import { one, query } from "../db/client";
import { json } from "./rows";

async function loadSettings(): Promise<AppSettings> {
  try {
    const row = await one<{ value: AppSettings | string }>(`SELECT value FROM app_settings WHERE key = 'app'`);
    return { ...DEFAULT_SETTINGS, ...(row ? json(row.value) : {}) };
  } catch (e) {
    console.error("[settings] fallback to defaults:", e);
    return DEFAULT_SETTINGS;
  }
}

/** Owner settings (admin WhatsApp, Instagram, promo). Cached; tag "settings". */
export const getSettings = unstable_cache(loadSettings, ["settings-v1"], { tags: [TAG.settings], revalidate: 3600 });

export async function saveSettings(s: AppSettings) {
  await query(
    `INSERT INTO app_settings (key, value, updated_at) VALUES ('app', $1, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [JSON.stringify(s)],
  );
}
