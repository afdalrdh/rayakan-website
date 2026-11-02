"use client";

import { useState } from "react";
import { CONTAINER, EmptyPhoto, Heading, Img, Lightbox, Section, useLightbox, useShowEmpty, useTheme } from "../shared";

/* Photo gallery with a lightbox. */

type Gallery = () => React.JSX.Element;

function useGallery() {
  const { content: c } = useTheme();
  const photos = c.gallery.photos;
  const box = useLightbox(photos.length);
  const sel = box.index === null ? null : photos[box.index];
  return { c, photos, box, sel };
}

function NoPhotos({ cols = 4 }: { cols?: number }) {
  const showEmpty = useShowEmpty();
  if (!showEmpty) return null;
  return (
    <div className="mt-12 grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {Array.from({ length: cols }, (_, i) => (
        <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-[10px]">
          <EmptyPhoto label={i === 0 ? "Galeri belum diisi" : ""} />
        </div>
      ))}
    </div>
  );
}

function Tile({ src, i, onOpen, sizes, className }: { src: string; i: number; onOpen: () => void; sizes: string; className: string }) {
  return (
    <button type="button" onClick={onOpen} aria-label={`Perbesar foto ${i + 1}`} className={`group relative w-full cursor-zoom-in overflow-hidden bg-t-input ${className}`}>
      <Img src={src} alt={`Foto ${i + 1}`} fill quality={75} sizes={sizes} className="object-cover transition duration-700 ease-out group-hover:scale-105" />
    </button>
  );
}

/** "Mozaik" (from Malam Emas): rhythm [P P L] then [L P P]. */
const SPAN = ["p", "p", "l", "l", "p", "p"] as const;
const Mozaik: Gallery = () => {
  const { c, photos, box, sel } = useGallery();
  return (
    <Section block="gallery">
      <div className="mx-auto max-w-[1200px]">
        <Heading eyebrow={c.gallery.eyebrow} title={c.gallery.title} />
        {!photos.length && <NoPhotos />}
        <div className="mt-12 grid auto-rows-[160px] grid-cols-2 gap-2.5 sm:auto-rows-[210px] sm:gap-3.5 md:mt-16 md:auto-rows-[260px] md:grid-cols-4 md:gap-4 lg:auto-rows-[300px]">
          {photos.map((p, i) => {
            const wide = SPAN[i % SPAN.length] === "l";
            return <Tile key={p.id} src={p.src} i={i} onOpen={() => box.open(i)} sizes={wide ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} className={`h-full rounded-[10px] border border-t-line md:rounded-[14px] ${wide ? "col-span-2" : ""}`} />;
          })}
        </div>
      </div>
      {sel && <Lightbox src={sel.src} alt="Galeri foto" onClose={box.close} onPrev={box.prev} onNext={box.next} />}
    </Section>
  );
};

/**
 * "Grid Rapi" (from Putih Marun): rows cycle "2 portrait + wide", "4 portrait",
 * "wide + 2 portrait", "4 portrait" and the last row is adjusted so every row is full.
 */
const ROWS = [
  [false, false, true],
  [false, false, false, false],
  [true, false, false],
  [false, false, false, false],
];
function wideFlags(n: number): boolean[] {
  const rows: boolean[][] = [];
  let left = n;
  for (let r = 0; left > 0; r++) {
    const t = ROWS[r % ROWS.length];
    rows.push(t.slice(0, Math.min(left, t.length)));
    left -= t.length;
  }
  const last = rows[rows.length - 1];
  const cells = (row: boolean[]) => row.reduce((a, w) => a + (w ? 2 : 1), 0);
  if (last && cells(last) < 4) {
    const k = last.length;
    const prev = rows[rows.length - 2];
    if (k === 3) rows[rows.length - 1] = rows.length % 2 ? [true, false, false] : [false, false, true];
    else if (k === 2) rows[rows.length - 1] = [true, true];
    else if (prev && prev.length === 3) rows.splice(rows.length - 2, 2, [false, false, false, false]);
    else if (prev && prev.length === 4) rows.splice(rows.length - 2, 2, [true, false, false], [true, true]);
  }
  return rows.flat().slice(0, n);
}
const Rapi: Gallery = () => {
  const { c, photos, box, sel } = useGallery();
  const wide = wideFlags(photos.length);
  return (
    <Section block="gallery">
      <div className={CONTAINER}>
        <Heading eyebrow={c.gallery.eyebrow} title={c.gallery.title} />
        {!photos.length && <NoPhotos />}
        <div className="mt-12 grid grid-cols-2 gap-2.5 md:mt-14 md:grid-cols-4 md:gap-3">
          {photos.map((p, i) => (
            <Tile key={p.id} src={p.src} i={i} onOpen={() => box.open(i)} sizes={wide[i] ? "(min-width: 768px) 560px, 100vw" : "(min-width: 768px) 280px, 50vw"} className={`rounded-[6px] md:aspect-auto md:h-[clamp(240px,26vw,330px)] ${wide[i] ? "col-span-2 aspect-[3/2]" : "aspect-[3/4]"}`} />
          ))}
        </div>
      </div>
      {sel && <Lightbox src={sel.src} alt="Galeri foto" onClose={box.close} onPrev={box.prev} onNext={box.next} />}
    </Section>
  );
};

/** "Masonry": columns with photos of varying height. */
const HEIGHTS = ["aspect-[3/4]", "aspect-[4/5]", "aspect-square", "aspect-[2/3]", "aspect-[4/3]"];
const Masonry: Gallery = () => {
  const { c, photos, box, sel } = useGallery();
  return (
    <Section block="gallery" tone="alt">
      <div className="mx-auto max-w-[1200px]">
        <Heading eyebrow={c.gallery.eyebrow} title={c.gallery.title} />
        {!photos.length && <NoPhotos />}
        <div className="mt-12 columns-2 gap-3 md:mt-16 md:columns-3 md:gap-4 lg:columns-4">
          {photos.map((p, i) => (
            <div key={p.id} className="mb-3 break-inside-avoid md:mb-4">
              <Tile src={p.src} i={i} onOpen={() => box.open(i)} sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw" className={`block rounded-[14px] ${HEIGHTS[i % HEIGHTS.length]}`} />
            </div>
          ))}
        </div>
      </div>
      {sel && <Lightbox src={sel.src} alt="Galeri foto" onClose={box.close} onPrev={box.prev} onNext={box.next} />}
    </Section>
  );
};

/** "Slider": one large photo with a strip of thumbnails. */
const Geser: Gallery = () => {
  const { c, photos, box, sel } = useGallery();
  const [cur, setCur] = useState(0);
  const i = Math.min(cur, Math.max(0, photos.length - 1));
  const main = photos[i];
  return (
    <Section block="gallery">
      <div className="mx-auto max-w-[1000px]">
        <Heading eyebrow={c.gallery.eyebrow} title={c.gallery.title} />
        <div className="relative mt-12 aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-t-input sm:aspect-[3/2] md:mt-16">
          {main ? (
            <button type="button" onClick={() => box.open(i)} aria-label="Perbesar foto" className="absolute inset-0 cursor-zoom-in">
              <Img key={main.id} src={main.src} alt={`Foto ${i + 1}`} fill sizes="(min-width: 1024px) 1000px, 100vw" className="rk-fade-in object-cover" />
            </button>
          ) : (
            <EmptyPhoto label="Galeri belum diisi" />
          )}
          {photos.length > 1 && (
            <>
              <button type="button" aria-label="Foto sebelumnya" onClick={() => setCur((i - 1 + photos.length) % photos.length)} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-[22px] text-white backdrop-blur">
                ‹
              </button>
              <button type="button" aria-label="Foto berikutnya" onClick={() => setCur((i + 1) % photos.length)} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-[22px] text-white backdrop-blur">
                ›
              </button>
              <span className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1 text-[12px] text-white">
                {i + 1} / {photos.length}
              </span>
            </>
          )}
        </div>
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {photos.map((p, k) => (
            <button key={p.id} type="button" onClick={() => setCur(k)} aria-label={`Lihat foto ${k + 1}`} className={`relative aspect-square w-[72px] shrink-0 overflow-hidden rounded-[10px] transition md:w-[88px] ${k === i ? "ring-2 ring-t-accent ring-offset-2 ring-offset-t-bg" : "opacity-60 hover:opacity-100"}`}>
              <Img src={p.src} alt="" fill sizes="88px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
      {sel && <Lightbox src={sel.src} alt="Galeri foto" onClose={box.close} onPrev={box.prev} onNext={box.next} />}
    </Section>
  );
};

export const GALLERY_LAYOUTS: Record<string, Gallery> = { mozaik: Mozaik, rapi: Rapi, masonry: Masonry, geser: Geser };
