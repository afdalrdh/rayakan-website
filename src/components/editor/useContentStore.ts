"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveContentAction } from "@/app/actions/site";
import { uid, type WeddingContent } from "@/lib/content";
import { loadAllMedia, loadContent, putMedia, saveContent } from "@/lib/sandbox-store";
import { compressImage, makeOgBlob, uploadToServer } from "@/lib/upload-client";

export type SaveState = "saved" | "saving" | "error";

/**
 * Owns the content being edited: debounced autosave and uploads.
 *  - "site": saves through a server action, uploads to /api/upload.
 *  - "demo": the public sandbox, keeps everything in this browser.
 */
export function useContentStore({ mode, slug, initial, demoTheme }: { mode: "demo" | "site"; slug: string; initial?: WeddingContent; demoTheme?: string }) {
  const [content, setContent] = useState<WeddingContent | null>(mode === "site" ? initial ?? null : null);
  const [media, setMedia] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<SaveState>("saved");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef<WeddingContent | null>(null);

  useEffect(() => {
    if (mode !== "demo") return;
    // Sandbox data lives in this browser only, so it loads after mount.
    let alive = true;
    loadAllMedia().then((m) => {
      if (!alive) return;
      setMedia(m);
      setContent(loadContent(demoTheme));
    });
    return () => {
      alive = false;
    };
  }, [mode, demoTheme]);

  const persist = useCallback(
    async (next: WeddingContent) => {
      if (mode === "demo") {
        saveContent(next);
        setSaved("saved");
        return;
      }
      const r = await saveContentAction(slug, next).catch(() => ({ ok: false as const, error: "Koneksi terputus." }));
      if (latest.current !== next) return; // a newer edit is already queued
      setSaved(r.ok ? "saved" : "error");
    },
    [mode, slug],
  );

  /** Apply an edit: `update(d => { d.hero.firstName = "Afdal" })`. */
  const update = useCallback(
    (recipe: (draft: WeddingContent) => void) => {
      setContent((prev) => {
        if (!prev) return prev;
        const next = structuredClone(prev);
        recipe(next);
        latest.current = next;
        setSaved("saving");
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => persist(next), mode === "demo" ? 500 : 900);
        return next;
      });
    },
    [persist, mode],
  );

  // Warn before leaving while a save is still pending.
  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (saved !== "saved") e.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [saved]);

  const store = useCallback(
    async (blob: Blob, name: string) => {
      if (mode === "site") return uploadToServer(slug, blob, name);
      const id = uid();
      await putMedia(id, blob);
      const key = `media:${id}`;
      setMedia((m) => ({ ...m, [key]: URL.createObjectURL(blob) }));
      return key;
    },
    [mode, slug],
  );

  const upload = useCallback(
    async (file: File, opts?: { maxSide?: number }) => store(file.type.startsWith("image/") ? await compressImage(file, opts?.maxSide) : file, file.name),
    [store],
  );

  const uploadOg = useCallback(
    async (file: File) => {
      const blob = await makeOgBlob(file);
      return blob ? store(blob, "og.jpg") : "";
    },
    [store],
  );

  const resolve = useCallback((src: string) => (src?.startsWith("media:") ? media[src] ?? "" : src), [media]);

  return { content, setContent, update, saved, media, upload, uploadOg, resolve };
}

export function useIsWide(query = "(min-width: 1024px)") {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return wide;
}
