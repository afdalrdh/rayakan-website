"use client";

/**
 * Storage for the public sandbox editor (/demo/admin): content in localStorage,
 * uploaded files in IndexedDB. Nothing leaves the visitor's browser.
 * Real sites use server actions + Vercel Blob instead (see useContentStore).
 */

import { demoContent, normalizeContent, THEME_IDS, type PlanId, type ThemeId, type WeddingContent } from "./content";

const CONTENT_KEY = "rayakan:demo:content:v1";
const PLAN_KEY = "rayakan:demo:plan";
const DB_NAME = "rayakan-media";
const STORE = "files";

const asTheme = (t?: string | null): ThemeId | null => ((THEME_IDS as readonly string[]).includes(t ?? "") ? (t as ThemeId) : null);

/**
 * Saved sandbox content. When a specific theme is asked for (`?tema=afdal`)
 * and the saved draft uses another theme, the sample for that theme is
 * returned instead; the saved draft is only replaced once the visitor edits.
 */
export function loadContent(theme?: string | null): WeddingContent {
  const wanted = asTheme(theme);
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (raw) {
      const saved = normalizeContent(JSON.parse(raw));
      if (!wanted || saved.theme === wanted) return saved;
    }
  } catch {
    /* ignore */
  }
  return demoContent(wanted ?? "arya");
}

export function saveContent(c: WeddingContent) {
  try {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(c));
    return true;
  } catch {
    return false;
  }
}

export function resetContent() {
  try {
    localStorage.removeItem(CONTENT_KEY);
  } catch {
    /* ignore */
  }
}

export function loadPlan(): PlanId {
  try {
    const p = localStorage.getItem(PLAN_KEY);
    if (p === "esensial" || p === "premium" || p === "eksklusif") return p;
  } catch {
    /* ignore */
  }
  return "premium";
}

export function savePlan(p: PlanId) {
  try {
    localStorage.setItem(PLAN_KEY, p);
  } catch {
    /* ignore */
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putMedia(id: string, blob: Blob) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadAllMedia(): Promise<Record<string, string>> {
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const out: Record<string, string> = {};
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).openCursor();
      req.onsuccess = () => {
        const cur = req.result;
        if (cur) {
          out[`media:${String(cur.key)}`] = URL.createObjectURL(cur.value as Blob);
          cur.continue();
        } else resolve(out);
      };
      req.onerror = () => resolve(out);
    });
  } catch {
    return {};
  }
}
