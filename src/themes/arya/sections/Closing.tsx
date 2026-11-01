"use client";

import { Block, Img, useTheme } from "../../shared";

/** Full-bleed photo footer with the closing words and couple name. */
export function Closing() {
  const { content: c } = useTheme();
  const cl = c.closing;
  return (
    <Block id="closing">
      <footer className="relative isolate flex min-h-[90svh] overflow-hidden bg-black text-center text-white">
        {cl.image && <Img src={cl.image} alt={cl.displayName} fill quality={80} sizes="100vw" className="absolute inset-0 z-0 object-cover object-[center_35%] brightness-75" />}
        <div className="absolute inset-0 z-10 bg-black/65" />
        <div className="absolute inset-0 z-10 bg-linear-to-b from-[var(--t-bg)] via-transparent to-black/80" />
        <div className="relative z-20 flex min-h-[90svh] w-full flex-col items-center justify-center px-6 pb-28 pt-20 md:px-16 md:pt-24">
          <p className="font-sans text-[12px] uppercase tracking-[3px] text-t-muted md:text-[13px]">{cl.eyebrow}</p>
          <p className="mt-8 max-w-[340px] font-serif text-[20px] italic leading-[1.6] text-neutral-200 sm:max-w-[680px] sm:text-[28px] md:mt-10 md:max-w-[880px] md:text-[34px] md:leading-[1.4]">&quot;{cl.quote}&quot;</p>
          <div className="mt-10 h-16 w-px bg-t-muted/60 md:mt-12" />
          <p className="mt-8 font-display text-[54px] uppercase tracking-wider text-white sm:text-[72px] md:mt-10 md:text-[88px]">{cl.displayName}</p>
          {cl.hashtag && <p className="mt-2 font-serif text-[18px] tracking-wide text-t-accent sm:text-[20px] md:text-[24px]">{cl.hashtag}</p>}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-30 flex h-[65px] items-center justify-center border-t border-white/15 bg-black/40 px-6 backdrop-blur-xs">
          <p className="font-sans text-[13px] text-neutral-400 md:text-[14px]">
            Made With <span className="px-1 text-red-500">♥</span>{" "}
            <a href="https://rayakan.my.id" target="_blank" rel="noreferrer" className="text-white hover:underline">
              Rayakan.my.id
            </a>
          </p>
        </div>
      </footer>
    </Block>
  );
}
