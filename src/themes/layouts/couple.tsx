"use client";

import { getOccasion, initials, peopleOf, type Person } from "@/lib/content";
import { CONTAINER, CoupleIntro, EmptyPhoto, Eyebrow, Img, Instagram, PersonText, Rule, Section, T, useDecor, useHas, useTheme } from "../shared";

/* Bride & groom. Every layout shows the same intro (Bismillah, invitation line, video, quote) and both profiles. */

type Couple = () => React.JSX.Element;

function Photo({ p, which, sizes, className = "" }: { p: Person; which: 1 | 2; sizes: string; className?: string }) {
  const o = getOccasion(useTheme().content.occasion);
  return (
    <div className={`relative overflow-hidden bg-t-input ${className}`}>
      {p.photo ? <Img src={p.photo} alt={p.fullName} fill quality={80} sizes={sizes} className="object-cover" /> : <EmptyPhoto label={o.single ? "Foto" : `Foto ${o.person[which - 1].toLowerCase()}`} />}
    </div>
  );
}

/** One or two people, depending on the occasion. */
function usePeople() {
  const { content: c } = useTheme();
  return peopleOf(c);
}

/** "Kartu Foto" (from Malam Emas): two cards, wide photo on top. */
const Kartu: Couple = () => {
  const people = usePeople();
  return (
    <Section block="couple" className="text-center">
      <CoupleIntro />
      <div className={`mx-auto mt-14 grid gap-6 md:gap-8 ${people.length > 1 ? "max-w-[960px] sm:grid-cols-2" : "max-w-[480px]"}`}>
        {people.map((p, i) => (
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
  const people = usePeople();
  return (
    <Section block="couple" className="text-center">
      <CoupleIntro />
      <Rule className="mt-16 md:mt-20" />
      <Eyebrow className="mt-8 md:mt-10">{getOccasion(c.occasion).peopleEyebrow}</Eyebrow>
      <div className={`mx-auto mt-8 grid max-w-[400px] gap-5 md:mt-10 md:gap-8 ${people.length > 1 ? "sm:max-w-[720px] sm:grid-cols-2 md:max-w-[1000px]" : "sm:max-w-[480px]"}`}>
        {people.map((p, i) => (
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
  const people = usePeople();
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
      {people.length > 1 ? (
        <div className="mx-auto mt-16 grid max-w-[920px] items-center gap-10 md:mt-20 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          {one(people[0], 1)}
          <span className="t-display text-center text-[calc(64px*var(--t-display-scale))] leading-none text-t-muted md:text-[calc(88px*var(--t-display-scale))]">&amp;</span>
          {one(people[1], 2)}
        </div>
      ) : (
        <div className="mx-auto mt-16 max-w-[420px] md:mt-20">{one(people[0], 1)}</div>
      )}
    </Section>
  );
};

/** "Editorial Besar": tall portraits alternating left/right with large names. */
const Editorial: Couple = () => {
  const { content: c } = useTheme();
  const has = useHas();
  const o = getOccasion(c.occasion);
  const people = usePeople();
  const row = (p: Person, which: 1 | 2, flip: boolean) => (
    <div className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}>
      <Photo p={p} which={which} sizes="(min-width: 768px) 520px, 92vw" className="aspect-[4/5] w-full rounded-[4px]" />
      <div className={flip ? "md:text-right" : ""}>
        <Eyebrow>{o.single ? o.peopleEyebrow : which === 1 ? "Mempelai Pertama" : "Mempelai Kedua"}</Eyebrow>
        <h3 className="t-display mt-4 text-[calc(48px*var(--t-display-scale))] leading-[1] text-t-accent md:text-[calc(68px*var(--t-display-scale))]">
          <T v={p.fullName.split(/[ ,]/)[0]} ph="Nama" />
        </h3>
        <p className="t-head mt-4 text-[18px] text-t-fg md:text-[20px]">
          <T v={p.fullName} ph={o.single ? "Nama lengkap" : `Nama lengkap ${o.person[which - 1].toLowerCase()}`} />
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
        {row(people[0], 1, false)}
        {people[1] && row(people[1], 2, true)}
      </div>
    </Section>
  );
};

/** Ornamental ring around a medallion: double circle, four small diamonds, decor-coloured. */
function MedalRing() {
  const decor = useDecor();
  const gold = decor === "jawa" || decor === "islami" ? "#C9A253" : "var(--t-muted)";
  return (
    <svg viewBox="0 0 200 200" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
      <circle cx="100" cy="100" r="96" fill="none" stroke={gold} strokeWidth="1.4" />
      <circle cx="100" cy="100" r="89" fill="none" stroke={gold} strokeOpacity="0.55" strokeWidth="0.9" strokeDasharray={decor === "doodle" || decor === "pesta" ? "3 5" : undefined} />
      {[0, 90, 180, 270].map((a) => (
        <rect key={a} x="96" y="-1" width="8" height="8" fill={gold} transform={`rotate(${a} 100 100) rotate(45 100 3)`} />
      ))}
    </svg>
  );
}

/** "Medali Inisial": initial (or photo) inside an ornamental medallion. Works without photos. */
const Medali: Couple = () => {
  const { content: c, mode } = useTheme();
  const o = getOccasion(c.occasion);
  const people = usePeople();
  const one = (p: Person, which: 1 | 2, big: boolean) => {
    const name = which === 1 ? c.hero.firstName : c.hero.secondName;
    const [letter = "?"] = initials(name || p.fullName, "");
    return (
      <div className="flex flex-col items-center text-center">
        <div className={`relative aspect-square ${big ? "w-[min(62vw,250px)]" : "w-[min(52vw,210px)]"}`}>
          <MedalRing />
          <div className="absolute inset-[11%] flex items-center justify-center overflow-hidden rounded-full bg-t-card shadow-[inset_0_0_0_1px_var(--t-line)]">
            {p.photo ? (
              <Img src={p.photo} alt={p.fullName} fill sizes="260px" className="object-cover" />
            ) : (
              <span className="t-display text-[calc(76px*var(--t-display-scale))] leading-none text-t-accent">{letter}</span>
            )}
            {!p.photo && mode !== "live" && <span className="absolute bottom-[14%] rounded-full bg-t-input px-2 py-0.5 font-sans text-[10px] text-t-fg2">foto opsional</span>}
          </div>
        </div>
        <div className="mt-6 max-w-[340px]">
          <PersonText p={p} which={which} nameClass="text-[22px] md:text-[26px]" parentsClass="mt-2 text-[13px] md:text-[14px]" />
        </div>
        <Instagram p={p} className="mt-4" />
      </div>
    );
  };
  return (
    <Section block="couple">
      <CoupleIntro />
      <Eyebrow className="mt-14 text-center md:mt-16">{o.peopleEyebrow}</Eyebrow>
      {people.length > 1 ? (
        <div className="mx-auto mt-10 grid max-w-[920px] items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          {one(people[0], 1, false)}
          <span className="t-display text-center text-[calc(56px*var(--t-display-scale))] leading-none text-t-muted md:text-[calc(80px*var(--t-display-scale))]">&amp;</span>
          {one(people[1], 2, false)}
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-[420px]">{one(people[0], 1, true)}</div>
      )}
    </Section>
  );
};

export const COUPLE_LAYOUTS: Record<string, Couple> = { kartu: Kartu, ringkas: Ringkas, bulat: Bulat, editorial: Editorial, medali: Medali };
