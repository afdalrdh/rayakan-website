"use client";

import Image, { type ImageLoader, type ImageProps } from "next/image";
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import type { BlockKey, WeddingContent } from "@/lib/content";
import { resolvePalette } from "../meta";

export interface SiteInfo {
  slug: string;
  guestSlug?: string;
  guestName?: string;
}

/** Everything a theme section needs, provided once at the top of the page. */
export interface ThemeCtxValue {
  content: WeddingContent;
  /** "edit" = inside the editor canvas: sections become tap targets. */
  mode: "live" | "edit";
  /** Browser-local uploads (demo editor only): "media:<id>" → blob URL. */
  media: Record<string, string>;
  selected?: BlockKey | null;
  locked?: BlockKey[];
  onSelect?: (key: BlockKey) => void;
  /** Present on real sites: enables live RSVP. */
  site?: SiteInfo;
}

const ThemeCtx = createContext<ThemeCtxValue | null>(null);

export function ThemeProvider({ value, children }: { value: ThemeCtxValue; children: ReactNode }) {
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error("useTheme must be used inside <ThemeProvider>");
  return v;
}

export function useSrc(src: string | undefined) {
  const { media } = useTheme();
  if (!src) return "";
  return src.startsWith("media:") ? media[src] ?? "" : src;
}

/** next/image for bundled assets; uploads are already compressed, so they skip the optimizer. */
const CLOUDINARY_IMAGE = /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//;

/** Let Cloudinary resize and pick the format (AVIF/WebP) on its own CDN. */
const cloudinaryLoader: ImageLoader = ({ src, width }) => src.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);

/**
 * Image for theme content. Local files go through Next's optimizer,
 * Cloudinary files through Cloudinary, anything else (Blob, sandbox blobs) as is.
 */
export function Img({ src, alt, ...rest }: Omit<ImageProps, "src"> & { src: string }) {
  const url = useSrc(src);
  if (!url) return null;
  if (CLOUDINARY_IMAGE.test(url)) return <Image src={url} alt={alt} loader={cloudinaryLoader} {...rest} />;
  return <Image src={url} alt={alt} unoptimized={!url.startsWith("/")} {...rest} />;
}

/** CSS variables consumed by the `t-*` Tailwind colours (see globals.css). */
export function paletteStyle(c: WeddingContent): CSSProperties {
  const p = resolvePalette(c.theme, c.palette, c.customAccent);
  return {
    "--t-bg": p.bg,
    "--t-alt": p.alt,
    "--t-card": p.card,
    "--t-input": p.input,
    "--t-accent": p.accent,
    "--t-muted": p.muted,
  } as CSSProperties;
}
