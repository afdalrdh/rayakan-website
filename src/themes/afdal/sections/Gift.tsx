"use client";

import { BankCard, Block, GiftIcon, Img, useTheme, validThru } from "../../shared";

/** Bank cards on the left, optional "send a present" card on the right. */
export function Gift() {
  const { content: c } = useTheme();
  const g = c.gift;
  const reg = g.registry;
  return (
    <Block id="gift">
      <section id="gift" className="bg-t-bg px-6 py-14 md:px-8 lg:flex lg:min-h-[100svh] lg:items-center lg:py-10">
        <div className="mx-auto w-full max-w-[1160px]">
          <p className="font-sans text-[12px] uppercase leading-[16px] tracking-[1.2px] text-t-muted">{g.eyebrow}</p>
          <h2 className="mt-4 max-w-[780px] font-serif text-[42px] font-semibold leading-none text-t-accent md:text-[64px]">{g.title}</h2>
          <p className="mt-5 max-w-[890px] font-sans text-[16px] leading-[28px] text-[#544341]">{g.body}</p>
          <div className={`mt-8 grid gap-7 lg:items-stretch lg:gap-9 ${reg.url ? "lg:grid-cols-[0.92fr_1fr]" : ""}`}>
            <div className={`grid gap-4 ${reg.url ? "" : "md:grid-cols-2"}`}>
              {g.accounts.map((a) => (
                <BankCard key={a.id} account={a} validThru={validThru(c.event.date)} className="shadow-[0_20px_45px_rgba(0,0,0,0.22)]" />
              ))}
            </div>
            {reg.url && (
              <article className="overflow-hidden rounded-[18px] bg-t-alt text-[#6d625f] shadow-[0_20px_45px_rgba(0,0,0,0.12)]">
                {reg.image && (
                  <div className="px-6 pt-6 md:px-8">
                    <Img src={reg.image} alt="" width={1000} height={800} className="mx-auto h-auto w-full max-w-[460px]" />
                  </div>
                )}
                <div className="px-6 pb-8 pt-5 md:px-8">
                  <h3 className="font-serif text-[32px] font-semibold leading-none text-t-accent">{reg.title || "Kirim Hadiah"}</h3>
                  {reg.body && <p className="mt-4 font-sans text-[16px] leading-[26px] text-[#544341]">{reg.body}</p>}
                  <a href={reg.url} target="_blank" rel="noreferrer" className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-t-accent px-6 py-4 font-sans text-[13px] font-bold uppercase tracking-[1.5px] text-white transition hover:brightness-90">
                    Pilih Hadiah <GiftIcon />
                  </a>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>
    </Block>
  );
}
