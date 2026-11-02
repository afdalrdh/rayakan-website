"use client";

import { Block, EmptyPhoto, Img, Ornament, T, useHas, useTheme } from "../shared";

/* Closing words with the couple name. */

type Closing = () => React.JSX.Element;

function Credit({ tone }: { tone: "photo" | "theme" }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 z-30 flex h-[64px] items-center justify-center border-t px-6 ${tone === "photo" ? "border-white/25 text-white" : "border-t-line text-t-fg2"}`}>
      <p className="text-[14px] md:text-[15px]">
        Made With <span className="px-1.5">♥</span>
        <a href="https://rayakan.my.id" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
          Rayakan.my.id
        </a>
      </p>
    </div>
  );
}

function Words({ tone }: { tone: "photo" | "theme" }) {
  const { content: c } = useTheme();
  const has = useHas();
  const cl = c.closing;
  const onPhoto = tone === "photo";
  return (
    <>
      <p className={`text-[12px] uppercase tracking-[0.26em] md:text-[13px] ${onPhoto ? "text-white/75" : "text-t-muted"}`}>{cl.eyebrow}</p>
      {has(cl.quote) && (
        <p className={`t-head mt-8 max-w-[880px] text-[21px] italic leading-[1.45] md:mt-10 md:text-[32px] ${onPhoto ? "text-white/95" : "text-t-fg"}`}>
          <T v={cl.quote} ph="Kalimat penutup" />
        </p>
      )}
      <div className={`mt-10 h-16 w-px md:mt-12 ${onPhoto ? "bg-white/70" : "bg-t-muted/60"}`} />
      <p className={`t-display mt-8 text-[calc(52px*var(--t-display-scale))] leading-none md:mt-10 md:text-[calc(80px*var(--t-display-scale))] ${onPhoto ? "text-white" : "text-t-accent"}`}>
        <T v={cl.displayName} ph="Nama penutup" />
      </p>
      {cl.hashtag && <p className={`t-head mt-3 text-[18px] md:text-[22px] ${onPhoto ? "text-white/80" : "text-t-muted"}`}>{cl.hashtag}</p>}
    </>
  );
}

/** "Foto Penuh": closing words on a full-screen photo. */
const Foto: Closing = () => {
  const { content: c } = useTheme();
  const cl = c.closing;
  return (
    <Block id="closing">
      <footer className="relative isolate flex min-h-[100svh] overflow-hidden bg-neutral-950 text-center">
        {cl.image ? <Img src={cl.image} alt={cl.displayName} fill sizes="100vw" className="absolute inset-0 z-0 object-cover object-[center_35%]" /> : <EmptyPhoto label="Foto latar penutup belum diisi" className="!bg-neutral-800" />}
        <div className="absolute inset-0 z-10 bg-black/58" />
        <div className="relative z-20 flex min-h-[100svh] w-full flex-col items-center justify-center px-6 pb-28 pt-20 md:px-16">
          <Words tone="photo" />
        </div>
        <Credit tone="photo" />
      </footer>
    </Block>
  );
};

/** "Bingkai Lengkung": arch-framed photo on the theme background. */
const Lengkung: Closing = () => {
  const { content: c } = useTheme();
  const cl = c.closing;
  return (
    <Block id="closing">
      <footer className="relative flex min-h-[100svh] flex-col items-center justify-center bg-t-alt px-6 pb-28 pt-20 text-center">
        <div className="relative mb-10 aspect-[3/4] w-[min(64vw,280px)] overflow-hidden rounded-t-full border border-t-line bg-t-input">
          {cl.image ? <Img src={cl.image} alt={cl.displayName} fill sizes="300px" className="object-cover" /> : <EmptyPhoto label="Foto penutup" />}
        </div>
        <Words tone="theme" />
        <Credit tone="theme" />
      </footer>
    </Block>
  );
};

/** "Foto Samping": photo on one side, words on the other. */
const Belah: Closing = () => {
  const { content: c } = useTheme();
  const cl = c.closing;
  return (
    <Block id="closing">
      <footer className="relative grid min-h-[100svh] bg-t-bg pb-16 md:grid-cols-2">
        <div className="relative min-h-[55svh] bg-t-input md:min-h-0">{cl.image ? <Img src={cl.image} alt={cl.displayName} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" /> : <EmptyPhoto label="Foto penutup" />}</div>
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center md:px-14">
          <Words tone="theme" />
        </div>
        <Credit tone="theme" />
      </footer>
    </Block>
  );
};

/** "Teks Saja": no photo, big name between ornaments. */
const Polos: Closing = () => (
  <Block id="closing">
    <footer className="relative flex min-h-[90svh] flex-col items-center justify-center bg-t-bg px-6 pb-28 pt-20 text-center">
      <Ornament className="mb-10" />
      <Words tone="theme" />
      <Ornament className="mt-10" />
      <Credit tone="theme" />
    </footer>
  </Block>
);

export const CLOSING_LAYOUTS: Record<string, Closing> = { foto: Foto, lengkung: Lengkung, belah: Belah, polos: Polos };
