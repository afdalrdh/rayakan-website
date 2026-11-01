"use client";

import { useEffect } from "react";
import { Img } from "./context";
import { ChevronIcon, CloseIcon } from "./icons";

/** Full-screen photo viewer used by every theme's gallery and story. */
export function Lightbox({ src, alt, onClose, onPrev, onNext }: { src: string; alt: string; onClose: () => void; onPrev?: () => void; onNext?: () => void }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  const nav = (dir: "left" | "right", fn?: () => void) =>
    fn && (
      <button
        type="button"
        aria-label={dir === "left" ? "Foto sebelumnya" : "Foto berikutnya"}
        onClick={(e) => {
          e.stopPropagation();
          fn();
        }}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 md:h-12 md:w-12"
      >
        <ChevronIcon dir={dir} />
      </button>
    );

  return (
    <div role="dialog" aria-modal="true" aria-label={alt} onClick={onClose} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-4 py-8 backdrop-blur-md">
      <button type="button" aria-label="Tutup" onClick={onClose} className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20">
        <CloseIcon />
      </button>
      <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 md:block">{nav("left", onPrev)}</div>
      <div className="relative h-[82svh] w-[min(92vw,1100px)]" onClick={(e) => e.stopPropagation()}>
        <Img src={src} alt={alt} fill quality={85} sizes="92vw" className="object-contain" priority />
      </div>
      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 md:block">{nav("right", onNext)}</div>
      {(onPrev || onNext) && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-4 md:hidden">
          {nav("left", onPrev)}
          {nav("right", onNext)}
        </div>
      )}
    </div>
  );
}
