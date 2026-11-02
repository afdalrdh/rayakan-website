"use client";

import type { Person } from "@/lib/content";
import { CONTAINER, CoupleIntro, EmptyPhoto, Eyebrow, Img, Instagram, PersonText, Rule, Section, T, useHas, useTheme } from "../shared";

/* Bride & groom. Every layout shows the same intro (Bismillah, invitation line, video, quote) and both profiles. */

type Couple = () => React.JSX.Element;

function Photo({ p, which, sizes, className = "" }: { p: Person; which: 1 | 2; sizes: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-t-input ${className}`}>
      {p.photo ? <Img src={p.photo} alt={p.fullName} fill quality={80} sizes={sizes} className="object-cover" /> : <EmptyPhoto label={`Foto mempelai ${which}`} />}
    </div>
  );
}

/** "Kartu Foto" (from Malam Emas): two cards, wide photo on top. */
const Kartu: Couple = () => {
  const { content: c } = useTheme();
  const cp = c.couple;
  return (
    <Section block="couple" className="text-center">
      <CoupleIntro />
      <div className="mx-auto mt-14 grid max-w-[960px] gap-6 sm:grid-cols-2 md:gap-8">
        {([cp.first, cp.second] as const).map((p, i) => (
          <article key={i} className="flex flex-col overflow-hidden rounded-[22px] border border-t-line bg-t-card p-4 text-left shadow-[0_20px_40px_-24px_rgba(0,0,0,0.45)] md:p-5">
            <Photo p={p} which={(i + 1) as 1 | 2} sizes="(min-width: 768px) 460px, 92vw" className="aspect-[4/3] w-full rounded-[16px]" />
            <div className="flex flex-1 flex-col justify-between pt-5">
              <div>
                <PersonText p={p} which={(i + 1) as 1 | 2} nameClass="text-[20px] md:text-[23px]" parentsClass="mt-2 text-[13px] md:text-[14px]" />
              </div>
              <Instagram p={p} className="mt-4" />
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
};

/** "Kartu Ringkas" (from Putih Marun): small portrait beside the name. */
const Ringkas: Couple = () => {
  const { content: c } = useTheme();
  const cp = c.couple;
  return (
    <Section block="couple" className="text-center">
      <CoupleIntro />
      <Rule className="mt-16 md:mt-20" />
      <Eyebrow className="mt-8 md:mt-10">The Bride &amp; Groom</Eyebrow>
      <div className="mx-auto mt-8 grid max-w-[400px] gap-5 sm:max-w-[720px] sm:grid-cols-2 md:mt-10 md:max-w-[1000px] md:gap-8">
        {([cp.first, cp.second] as const).map((p, i) => (
          <article key={i} className="grid grid-cols-[108px_1fr] items-center gap-4 rounded-[18px] border border-t-line bg-t-card p-3.5 text-left md:grid-cols-[150px_1fr] md:gap-6 md:p-4">
            <Photo p={p} which={(i + 1) as 1 | 2} sizes="300px" className="aspect-[3/4] rounded-[12px]" />
            <div className="min-w-0">
              <PersonText p={p} which={(i + 1) as 1 | 2} nameClass="text-[17px] md:text-[22px]" parentsClass="mt-2 text-[12.5px] md:mt-3 md:text-[14px]" />
              <Instagram p={p} className="mt-3" />
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
};

/** "Potret Bulat": round portraits facing each other with a big ampersand. */
const Bulat: Couple = () => {
  const { content: c } = useTheme();
  const cp = c.couple;
  const one = (p: Person, which: 1 | 2) => (
    <div className="flex flex-col items-center text-center">
      <div className="rounded-full border border-t-muted/40 p-2">
        <Photo p={p} which={which} sizes="260px" className="aspect-square w-[min(56vw,230px)] rounded-full" />
      </div>
      <div className="mt-6 max-w-[320px]">
        <PersonText p={p} which={which} nameClass="text-[22px] md:text-[26px]" parentsClass="mt-2 text-[13px] md:text-[14px]" />
      </div>
      <Instagram p={p} className="mt-4" />
    </div>
  );
  return (
    <Section block="couple" tone="alt">
      <CoupleIntro />
      <div className="mx-auto mt-16 grid max-w-[920px] items-center gap-10 md:mt-20 md:grid-cols-[1fr_auto_1fr] md:gap-6">
        {one(cp.first, 1)}
        <span className="t-display text-center text-[calc(64px*var(--t-display-scale))] leading-none text-t-muted md:text-[calc(88px*var(--t-display-scale))]">&amp;</span>
        {one(cp.second, 2)}
      </div>
    </Section>
  );
};

/** "Editorial Besar": tall portraits alternating left/right with large names. */
const Editorial: Couple = () => {
  const { content: c } = useTheme();
  const has = useHas();
  const cp = c.couple;
  const row = (p: Person, which: 1 | 2, flip: boolean) => (
    <div className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}>
      <Photo p={p} which={which} sizes="(min-width: 768px) 520px, 92vw" className="aspect-[4/5] w-full rounded-[4px]" />
      <div className={flip ? "md:text-right" : ""}>
        <Eyebrow>{which === 1 ? "Mempelai Pertama" : "Mempelai Kedua"}</Eyebrow>
        <h3 className="t-display mt-4 text-[calc(48px*var(--t-display-scale))] leading-[1] text-t-accent md:text-[calc(68px*var(--t-display-scale))]">
          <T v={p.fullName.split(/[ ,]/)[0]} ph="Nama" />
        </h3>
        <p className="t-head mt-4 text-[18px] text-t-fg md:text-[20px]">
          <T v={p.fullName} ph={`Nama lengkap mempelai ${which}`} />
        </p>
        {has(p.parents) && (
          <p className="mt-3 text-[14px] leading-[1.7] text-t-fg2 md:text-[15px]">
            <T v={p.parents} ph="Keterangan orang tua" />
          </p>
        )}
        <Instagram p={p} className={`mt-5 ${flip ? "md:ml-auto" : ""}`} />
      </div>
    </div>
  );
  return (
    <Section block="couple">
      <CoupleIntro />
      <div className={`${CONTAINER} mt-16 space-y-16 md:mt-24 md:space-y-24`}>
        {row(cp.first, 1, false)}
        {row(cp.second, 2, true)}
      </div>
    </Section>
  );
};

export const COUPLE_LAYOUTS: Record<string, Couple> = { kartu: Kartu, ringkas: Ringkas, bulat: Bulat, editorial: Editorial };
