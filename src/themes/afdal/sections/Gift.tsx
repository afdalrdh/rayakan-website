"use client";

import { BankCard, Block, GiftIcon, Img, useTheme, validThru } from "../../shared";
import { CONTAINER, Heading, SECTION_Y } from "./Heading";

/**
 * Bank cards (real card proportions) on the left, optional "send a present"
 * card on the right. Both columns share the same height on desktop so there is
 * no empty space under either side.
 */
export function Gift() {
  const { content: c } = useTheme();
  const g = c.gift;
  const reg = g.registry;
  const accounts = g.accounts;
  const side = !!reg.url;
  return (
    <Block id="gift">
      <section id="gift" className={`bg-t-bg px-5 md:px-8 ${SECTION_Y}`}>
        <div className={CONTAINER}>
          <Heading eyebrow={g.eyebrow} title={g.title} body={g.body} />
          <div className={`mx-auto mt-12 grid gap-5 md:mt-14 lg:items-stretch lg:gap-8 ${side ? "max-w-[520px] lg:max-w-none lg:grid-cols-2" : "max-w-[1000px]"}`}>
            <div className={`grid content-center gap-5 ${side ? "" : accounts.length > 1 ? "md:grid-cols-2" : "mx-auto w-full max-w-[520px]"}`}>
              {accounts.map((a) => (
                <BankCard key={a.id} account={a} validThru={validThru(c.event.date)} className="shadow-[0_22px_45px_-18px_rgba(0,0,0,0.35)]" />
              ))}
            </div>
            {side && (
              <article className="flex flex-col overflow-hidden rounded-[20px] bg-t-alt text-[#6d625f] shadow-[0_22px_45px_-24px_rgba(0,0,0,0.2)]">
                {reg.image && (
                  <div className="relative min-h-[200px] flex-1 px-6 pt-6 md:px-8 md:pt-8">
                    <div className="relative h-full min-h-[200px] w-full">
                      <Img src={reg.image} alt="" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-contain" />
                    </div>
                  </div>
                )}
                <div className="px-6 pb-7 pt-6 md:px-8 md:pb-8">
                  <h3 className="font-serif text-[28px] font-semibold leading-[1.1] text-t-accent md:text-[32px]">{reg.title || "Kirim Hadiah"}</h3>
                  {reg.body && <p className="mt-3 font-sans text-[15px] leading-[1.7] text-[#544341]">{reg.body}</p>}
                  <a href={reg.url} target="_blank" rel="noreferrer" className="mt-6 flex h-[54px] w-full items-center justify-center gap-2 rounded-[12px] bg-t-accent px-6 font-sans text-[13px] font-bold uppercase tracking-[1.5px] text-white transition hover:brightness-90">
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
