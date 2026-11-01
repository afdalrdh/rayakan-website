"use client";

import { Block, Img, Lightbox, useLightbox, useTheme } from "../../shared";
import { Heading } from "./Heading";

/** Rhythm [P P L] then [L P P]; clients never choose sizes. */
const SPAN_PATTERN = ["p", "p", "l", "l", "p", "p"] as const;

export function Gallery() {
  const { content: c } = useTheme();
  const photos = c.gallery.photos;
  const box = useLightbox(photos.length);
  const sel = box.index === null ? null : photos[box.index];
  return (
    <Block id="gallery">
      <section id="memories" className="relative bg-t-bg px-4 py-20 text-center font-sans text-neutral-200 sm:px-6 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <Heading eyebrow={c.gallery.eyebrow} title={c.gallery.title} />
          <div className="mt-12 grid auto-rows-[160px] grid-cols-2 gap-2.5 sm:auto-rows-[210px] sm:gap-3.5 md:mt-16 md:auto-rows-[260px] md:grid-cols-4 md:gap-4 lg:auto-rows-[300px]">
            {photos.map((p, i) => {
              const wide = SPAN_PATTERN[i % SPAN_PATTERN.length] === "l";
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => box.open(i)}
                  aria-label={`Perbesar foto ${i + 1}`}
                  className={`group relative h-full w-full cursor-zoom-in overflow-hidden rounded-[10px] border border-white/10 bg-t-card shadow-[0_8px_22px_rgba(0,0,0,0.3)] transition duration-500 hover:scale-[1.015] hover:border-t-accent/40 md:rounded-[14px] ${wide ? "col-span-2" : "col-span-1"}`}
                >
                  <Img src={p.src} alt={`Foto ${i + 1}`} fill quality={75} sizes={wide ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]" />
                </button>
              );
            })}
          </div>
        </div>
        {sel && <Lightbox src={sel.src} alt="Galeri foto" onClose={box.close} onPrev={box.prev} onNext={box.next} />}
      </section>
    </Block>
  );
}
