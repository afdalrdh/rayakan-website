"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { eventDateTime, NAV_LABELS, SECTION_ANCHORS, type WeddingContent } from "@/lib/content";
import { useTheme } from "./context";

/* ------------------------------ Countdown ------------------------------ */

export const COUNTDOWN_UNITS = ["days", "hours", "minutes", "seconds"] as const;
export type CountdownUnit = (typeof COUNTDOWN_UNITS)[number];

export function useCountdown(event: WeddingContent["event"]) {
  const target = useMemo(() => eventDateTime(event).getTime(), [event]);
  const [left, setLeft] = useState<Record<CountdownUnit, number>>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [target]);
  return left;
}

/* ------------------------------ Navigation ------------------------------ */

export function useNavLinks() {
  const { content: c } = useTheme();
  return c.order
    .filter((s) => !c.hidden.includes(s) && NAV_LABELS[s])
    .map((s) => ({ label: NAV_LABELS[s]!, href: `#${SECTION_ANCHORS[s]}` }));
}

/* ------------------------------ Copy to clipboard ------------------------------ */

export function useCopy(timeout = 1800) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback(
    async (text: string, key = text) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), timeout);
      } catch {
        setCopied(null);
      }
    },
    [timeout],
  );
  return { copied, copy };
}

/* ------------------------------ Lightbox state ------------------------------ */

export function useLightbox(count: number) {
  const [index, setIndex] = useState<number | null>(null);
  return {
    index,
    open: setIndex,
    close: () => setIndex(null),
    prev: () => setIndex((i) => (i === null ? null : (i - 1 + count) % count)),
    next: () => setIndex((i) => (i === null ? null : (i + 1) % count)),
  };
}

/* ------------------------------ Wishes (RSVP) ------------------------------ */

export interface Wish {
  id: string | number;
  name: string;
  attendance: "Hadir" | "Tidak Hadir";
  location: string | null;
  message: string;
  createdAt: string;
}

const SAMPLE_WISHES: Wish[] = [
  { id: "w1", name: "Keluarga Wijaya", attendance: "Hadir", location: "Bandung", message: "Selamat menempuh hidup baru, semoga menjadi keluarga sakinah, mawaddah, warahmah.", createdAt: "2026-10-30" },
  { id: "w2", name: "Rina & Bagus", attendance: "Hadir", location: "Cimahi", message: "Turut berbahagia! Semoga langgeng sampai kakek nenek.", createdAt: "2026-10-29" },
];

const PAGE_SIZE = 30;

/**
 * Form + list state for the "Ucapan & Doa" section.
 * Real sites talk to /api/sites/<slug>/wishes; the editor and demos use sample data.
 */
export function useWishes() {
  const { mode, site } = useTheme();
  const live = mode === "live" && !!site;
  const [wishes, setWishes] = useState<Wish[]>(live ? [] : SAMPLE_WISHES);
  const [stats, setStats] = useState(live ? { total: 0, present: 0 } : { total: 2, present: 2 });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [form, setForm] = useState({ name: site?.guestName ?? "", attendance: "Hadir" as Wish["attendance"], location: "", message: "" });
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!live || !site) return;
    let alive = true;
    fetch(`/api/sites/${site.slug}/wishes?page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setWishes((w) => (page === 0 ? d.wishes : [...w, ...d.wishes]));
        setStats(d.stats);
        setHasMore(d.wishes.length === PAGE_SIZE);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [live, site, page]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const add = (w: Wish) => {
    setWishes((list) => [w, ...list]);
    setStats((s) => ({ total: s.total + 1, present: s.present + (w.attendance === "Hadir" ? 1 : 0) }));
    setForm((f) => ({ ...f, location: "", message: "" }));
    setStatus({ ok: true, text: "Terima kasih, ucapan Anda sudah tersimpan." });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "edit" || busy || !form.name.trim() || !form.message.trim()) return;
    if (!site) {
      add({ id: Math.random().toString(36), ...form, createdAt: new Date().toISOString() });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch(`/api/sites/${site.slug}/wishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, guestSlug: site.guestSlug }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Ucapan belum bisa dikirim.");
      add(d.wish);
    } catch (err) {
      setStatus({ ok: false, text: err instanceof Error ? err.message : "Ucapan belum bisa dikirim." });
    } finally {
      setBusy(false);
    }
  };

  return { wishes, stats, form, set, submit, status, busy, hasMore, loadMore: () => setPage((p) => p + 1) };
}

/* ------------------------------ Misc ------------------------------ */

/** "https://youtu.be/ID", "watch?v=ID", "/shorts/ID", "/embed/ID" → "ID". */
export function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
  return m?.[1] ?? "";
}

/** MM/YY shown on the bank cards, taken from the event date. */
export function validThru(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return Number.isNaN(d.getTime()) ? "--/--" : `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(2)}`;
}
