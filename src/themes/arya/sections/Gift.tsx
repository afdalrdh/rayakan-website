"use client";

import { BankCard, Block, GiftIcon, Img, useTheme, validThru } from "../../shared";

/** Bank / e-wallet cards, plus an optional gift-list card. */
export function Gift() {
  const { content: c } = useTheme();
  const g = c.gift;
  const reg = g.registry;
  return (
    <Block id="gift">
      <section id="gift" className="relative bg-t-bg px-4 py-20 font-sans text-neutral-200 sm:px-6 md:px-8 md:py-28">
        <div className="mx-auto w-full max-w-[960px]">
          <p className="text-[12px] uppercase tracking-[3px] text-t-muted md:text-[13px]">{g.eyebrow}</p>
          <h2 className="mt-3 font-serif text-[36px] font-semibold leading-tight text-t-accent sm:text-[46px] md:text-[52px]">{g.title}</h2>
          <p className="mt-4 max-w-[820px] text-[14px] leading-[1.75] text-neutral-300 sm:text-[15px] md:text-[16px]">{g.body}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:gap-8">
            {g.accounts.map((a) => (
              <BankCard key={a.id} account={a} validThru={validThru(c.event.date)} />
            ))}
          </div>
          {reg.url && (
            <article className="mt-8 grid items-center gap-6 overflow-hidden rounded-[22px] border border-white/10 bg-t-card p-6 sm:grid-cols-[200px_1fr] md:p-7">
              {reg.image && <Img src={reg.image} alt="" width={400} height={320} className="h-auto w-full rounded-[14px]" />}
              <div>
                <h3 className="font-serif text-[26px] font-semibold text-t-accent">{reg.title || "Kirim Hadiah"}</h3>
                {reg.body && <p className="mt-2 text-[14px] leading-relaxed text-neutral-300">{reg.body}</p>}
                <a href={reg.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-t-accent px-5 py-3 text-[13px] font-bold uppercase tracking-[1.5px] text-neutral-950 transition hover:brightness-90">
                  Pilih Hadiah <GiftIcon />
                </a>
              </div>
            </article>
          )}
        </div>
      </section>
    </Block>
  );
}
