"use client";

import { Block, Img, useTheme } from "../../shared";

export function Closing() {
  const { content: c } = useTheme();
  const cl = c.closing;
  return (
    <Block id="closing">
      <footer className="relative isolate flex min-h-[100svh] overflow-hidden bg-black text-center text-white">
        {cl.image && <Img src={cl.image} alt={cl.displayName} fill sizes="100vw" className="absolute inset-0 z-0 object-cover object-center" />}
        <div className="absolute inset-0 z-10 bg-black/58" />
        <div className="absolute inset-0 z-10 bg-linear-to-b from-black/20 via-transparent to-black/25" />
        <div className="relative z-20 flex min-h-[100svh] w-full flex-col items-center justify-center px-5 pb-28 pt-20 md:px-16 md:pt-24">
          <p className="font-sans text-[14px] uppercase leading-[20px] tracking-[3px] text-white/75 md:text-[15px] md:tracking-[3.4px]">{cl.eyebrow}</p>
          <p className="mt-9 max-w-[350px] font-serif text-[23px] italic leading-[1.42] md:mt-10 md:max-w-[1100px] md:text-[40px] md:leading-[1.32]">{cl.quote}</p>
          <div className="mt-10 h-20 w-px bg-white/85 md:mt-12" />
          <p className="mt-10 font-display text-[58px] uppercase leading-none md:mt-12 md:text-[76px]">{cl.displayName}</p>
          {cl.hashtag && <p className="mt-3 font-serif text-[20px] text-white/80">{cl.hashtag}</p>}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-30 flex h-[70px] items-center justify-center border-t border-white/35 px-6">
          <p className="font-sans text-[16px] leading-[26px] md:text-[18px]">
            Made With <span className="px-2 text-[20px] leading-none">♥</span>
            <a href="https://rayakan.my.id" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
              Rayakan.my.id
            </a>
          </p>
        </div>
      </footer>
    </Block>
  );
}
