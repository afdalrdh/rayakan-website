"use client";

import { useEffect, useRef, useState } from "react";
import { youtubeId } from "./hooks";
import { Img, useTheme } from "./context";
import { PlayIcon } from "./icons";

/**
 * YouTube player that only loads the iframe when it scrolls into view
 * (or is tapped). Keeps the page fast: no YouTube scripts until needed.
 */
export function VideoEmbed({ url, thumb, title, className = "" }: { url: string; thumb: string; title: string; className?: string }) {
  const { mode } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const id = youtubeId(url);

  useEffect(() => {
    const el = ref.current;
    if (!el || open || mode === "edit" || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setOpen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [open, mode]);

  if (!id) return null;
  return (
    <div ref={ref} className={`relative aspect-video w-full overflow-hidden bg-[#15110f] ${className}`}>
      {open ? (
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" aria-label="Putar video" onClick={() => setOpen(true)} className="group absolute inset-0 cursor-pointer">
          {thumb ? (
            <Img src={thumb} alt="" fill sizes="(min-width: 768px) 1040px, 100vw" className="object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <span className="absolute inset-0 bg-black/20" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-white transition-transform group-hover:scale-105 md:h-20 md:w-20">
            <PlayIcon />
          </span>
        </button>
      )}
    </div>
  );
}
