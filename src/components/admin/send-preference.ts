"use client";

import { useSyncExternalStore } from "react";

/**
 * Pilihan otomatis saat klik Salin/Kirim WA:
 * - "ask"  : tanya setiap kali (default)
 * - "mark" : langsung tandai terkirim
 * - "skip" : jangan ubah status
 * "mark"/"skip" hanya berlaku sampai hari ini berakhir (disimpan per browser).
 */
export type SendPreference = "ask" | "mark" | "skip";

const STORAGE_KEY = "rayakan-admin-send-pref";
const EVENT = "rayakan-send-pref-change";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function readSendPreference(): SendPreference {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return "ask";
    const parsed = JSON.parse(raw) as { mode?: string; date?: string };
    if (parsed.date !== todayKey()) return "ask";
    return parsed.mode === "mark" || parsed.mode === "skip" ? parsed.mode : "ask";
  } catch {
    return "ask";
  }
}

export function writeSendPreference(mode: SendPreference) {
  try {
    if (mode === "ask") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ mode, date: todayKey() }),
      );
    }
  } catch {
    // localStorage tidak tersedia (mode privat) — abaikan.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  // Cek ulang saat tab kembali aktif (bisa sudah ganti hari).
  window.addEventListener("focus", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener("focus", callback);
  };
}

export function useSendPreference(): SendPreference {
  return useSyncExternalStore(subscribe, readSendPreference, () => "ask");
}
