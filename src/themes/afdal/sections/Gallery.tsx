"use client";

import { Block, Img, Lightbox, useLightbox, useTheme } from "../../shared";
import { CONTAINER, Heading, SECTION_Y } from "./Heading";

/**
 * Decide which photos are wide (2 of 4 columns) so every row of the grid is
 * full: rows cycle "2 portrait + wide", "4 portrait", "wide + 2 portrait",
 * "4 portrait" (14 photos fill exactly 4 rows, wide at photo 3 and 8, the
 * spots the editor suggests for landscape photos). The last row is adjusted
 * so nothing is left hanging. Every row holds an even number of portrait
 * tiles, so the 2-column phone layout has no gaps either.
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
    else if (prev && prev.length === 3) {
      rows.splice(rows.length - 2, 2, [false, false, false, false]);
    } else if (prev && prev.length === 4) {
      rows.splice(rows.length - 2, 2, [true, false, false], [true, true]);
    }
  }
  return rows.flat().slice(0, n);
}

export function Gallery() {
  const { content: c } = useTheme();
  const photos = c.gallery.photos;
  const box = useLightbox(photos.length);
  const sel = box.index === null ? null : photos[box.index];
  const wide = wideFlags(photos.length);
  return (
    <Block id="gallery">
      <section id="memories" className={`bg-t-bg px-5 md:px-8 ${SECTION_Y}`}>
        <div className={CONTAINER}>
          <Heading eyebrow={c.gallery.eyebrow} title={c.gallery.title} />
          <div className="mt-12 grid grid-cols-2 gap-2.5 md:mt-14 md:grid-cols-4 md:gap-3">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => box.open(i)}
                aria-label={`Perbesar foto ${i + 1}`}
                className={`group relative w-full cursor-zoom-in overflow-hidden rounded-[6px] bg-t-input md:aspect-auto md:h-[clamp(240px,26vw,330px)] ${wide[i] ? "col-span-2 aspect-[3/2]" : "aspect-[3/4]"}`}
              >
                <Img src={p.src} alt={`Foto ${i + 1}`} fill sizes={wide[i] ? "(min-width: 768px) 560px, 100vw" : "(min-width: 768px) 280px, 50vw"} className="object-cover transition duration-700 ease-out group-hover:scale-105" />
                <span className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/15" />
              </button>
            ))}
          </div>
        </div>
        {sel && <Lightbox src={sel.src} alt="Galeri foto" onClose={box.close} onPrev={box.prev} onNext={box.next} />}
      </section>
    </Block>
  );
}
