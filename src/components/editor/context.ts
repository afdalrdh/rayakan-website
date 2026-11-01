"use client";

import { createContext, useContext } from "react";
import type { Plan, WeddingContent } from "@/lib/content";
import type { Uploader } from "./fields";

/** What every editor form/panel can read and do. Provided by EditorApp. */
export interface EditorCtxValue {
  content: WeddingContent;
  update: (recipe: (draft: WeddingContent) => void) => void;
  resolve: (src: string) => string;
  upload: Uploader;
  /** Creates & uploads the 1200×630 WhatsApp preview from the desktop hero photo. */
  uploadOg: (file: File) => Promise<string>;
  plan: Plan;
  plans: Plan[];
  slug: string;
  mode: "demo" | "site";
  status: "draft" | "published";
  adminWhatsapp: string;
  isOwner: boolean;
  expiresAt: string | null;
}

export const EditorCtx = createContext<EditorCtxValue | null>(null);
export function useEditor() {
  const v = useContext(EditorCtx);
  if (!v) throw new Error("EditorCtx missing");
  return v;
}
