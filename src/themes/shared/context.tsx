"use client";

import Image, { type ImageLoader, type ImageProps } from "next/image";
import { createContext, useContext, useState, type CSSProperties, type ReactNode } from "react";
import type { BlockKey, WeddingContent } from "@/lib/content";
import { getFontPair, styleVars } from "../style";

export interface SiteInfo {
  slug: string;
  guestSlug?: string;
  guestName?: string;
}

/** Everything a theme section needs, provided once at the top of the page. */
export interface ThemeCtxValue {
  content: WeddingContent;
  /**
   * "live" = guests; "edit" = editor canvas (sections become tap targets);
   * "thumb" = small read-only layout thumbnail; "preview" = read-only full
   * site without the opening overlay (admin overview).
   */
  mode: "live" | "edit" | "thumb" | "preview";
  /** Browser-local uploads (demo editor only): "media:<id>" → blob URL. */
  media: Record<string, string>;
  selected?: BlockKey | null;
  locked?: BlockKey[];
  onSelect?: (key: BlockKey) => void;
  /** Present on real sites: enables live RSVP. */
  site?: SiteInfo;
  /**
   * Unpaid preview (theme samples, sandbox, drafts): guests' actions such as
   * sending RSVP, copying account numbers or opening maps are switched off.
   */
  trial?: boolean;
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
export function Img({ src, alt, className = "", onLoad, ...rest }: Omit<ImageProps, "src"> & { src: string }) {
  const url = useSrc(src);
  // A soft sheen in the theme's colours until the photo has arrived (slow connections).
  const [loadedUrl, setLoadedUrl] = useState("");
  if (!url) return null;
  const props = {
    ...rest,
    src: url,
    alt,
    className: loadedUrl === url ? className : `t-skeleton ${className}`,
    onLoad: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setLoadedUrl(url);
      onLoad?.(e);
    },
  };
  if (CLOUDINARY_IMAGE.test(url)) return <Image {...props} alt={alt} loader={cloudinaryLoader} />;
  return <Image {...props} alt={alt} unoptimized={!url.startsWith("/")} />;
}

/** CSS variables for colours and fonts (see themes/style.ts and globals.css). */
export function siteStyle(c: WeddingContent): CSSProperties {
  return styleVars(c.style) as CSSProperties;
}

/** Font pair of the current site (for name sizing). */
export function useFontPair() {
  return getFontPair(useTheme().content.style.fonts);
}

/** Editor and thumbnails show placeholders for empty fields; guests never see them. */
export function useShowEmpty() {
  return useTheme().mode !== "live";
}
