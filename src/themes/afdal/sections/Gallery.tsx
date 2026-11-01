"use client";

import { Block, Img, Lightbox, useLightbox, useTheme } from "../../shared";

/** Mostly portrait tiles with a wide one every few photos. */
const SPAN_PATTERN = ["p", "p", "l", "p", "p", "p", "p", "l"] as const;

export function Gallery() {
  const { content: c } = useTheme();
  const photos = c.gallery.photos;
  const box = useLightbox(photos.length);
  const sel = box.index === null ? null : photos[box.index];
  return (
    <Block id="gallery">
      <section id="memories" className="bg-t-bg pb-20 pt-12 text-center md:px-8 md:py-24">
        <div className="mx-auto w-[354px] max-w-[calc(100vw-36px)] md:w-full md:max-w-[1000px]">
          <p className="font-sans text-[13px] uppercase leading-[20px] tracking-[1.8px] text-t-muted md:text-[14px] md:tracking-[2px]">{c.gallery.eyebrow}</p>
          <h2 className="mx-auto mt-6 max-w-[340px] font-serif text-[34px] font-semibold leading-[1.18] text-t-accent md:max-w-none md:text-[48px] md:leading-none">{c.gallery.title}</h2>
          <div className="mx-auto mt-6 h-px w-12 bg-t-muted md:mt-8" />
          <div className="mt-9 grid grid-cols-2 gap-[9px] md:mt-12 md:grid-cols-4 md:gap-3">
            {photos.map((p, i) => {
              const wide = SPAN_PATTERN[i % SPAN_PATTERN.length] === "l";
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => box.open(i)}
                  aria-label={`Perbesar foto ${i + 1}`}
                  className={`group relative h-[215px] w-full cursor-zoom-in overflow-hidden transition duration-500 ease-out hover:scale-[1.015] md:h-[292px] ${wide ? "col-span-2" : ""}`}
                >
                  <Img src={p.src} alt={`Foto ${i + 1}`} fill sizes={wide ? "(min-width: 768px) 494px, 100vw" : "(min-width: 768px) 241px, 50vw"} className="object-cover transition duration-500 ease-out group-hover:scale-105" />
                  <span className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/20" />
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
