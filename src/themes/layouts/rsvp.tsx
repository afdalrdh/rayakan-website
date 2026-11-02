"use client";

import { useState } from "react";
import { Eyebrow, MoreWishes, Rule, RsvpFields, Section, T, useTheme, useWishes, WishCard, WishEmpty, WishStats } from "../shared";

/* RSVP form + guest wishes. All layouts use the same form and wish data. */

type Rsvp = () => React.JSX.Element;

function Title({ align = "left" }: { align?: "left" | "center" }) {
  const { content: c } = useTheme();
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <Eyebrow>{c.rsvp.eyebrow}</Eyebrow>
      <h2 className="t-head mt-4 text-[30px] leading-[1.1] text-t-accent md:text-[40px]">
        <T v={c.rsvp.title} ph="Judul RSVP" />
      </h2>
      <Rule center={align === "center"} className="mt-5" />
    </div>
  );
}

/** "Form & Ucapan" (Malam Emas and Putih Marun): form card left, wishes right. */
const Berdampingan: Rsvp = () => {
  const w = useWishes();
  return (
    <Section block="rsvp" tone="alt">
      <div className="mx-auto grid w-full max-w-[1160px] gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="self-start rounded-[22px] border border-t-line bg-t-card p-6 sm:p-8 md:p-9">
          <Title />
          <div className="mt-6">
            <RsvpFields w={w} />
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="t-head text-[22px] text-t-fg">Doa &amp; Ucapan</h3>
            <WishStats w={w} />
          </div>
          <div className="mt-6 max-h-[640px] space-y-4 overflow-y-auto pr-1">
            {w.wishes.map((x) => (
              <WishCard key={x.id} x={x} />
            ))}
            {!w.wishes.length && <WishEmpty />}
          </div>
          <MoreWishes w={w} />
        </div>
      </div>
    </Section>
  );
};

/** "Tengah": centred form, wishes in two columns underneath. */
const Tengah: Rsvp = () => {
  const w = useWishes();
  return (
    <Section block="rsvp">
      <div className="mx-auto max-w-[620px]">
        <Title align="center" />
        <div className="mt-10 rounded-[22px] border border-t-line bg-t-card p-6 sm:p-8">
          <RsvpFields w={w} />
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-[1000px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <h3 className="t-head text-[24px] text-t-fg">Doa &amp; Ucapan</h3>
          <WishStats w={w} />
        </div>
        <div className="mt-8 grid max-h-[720px] gap-4 overflow-y-auto pr-1 md:grid-cols-2">
          {w.wishes.map((x) => (
            <WishCard key={x.id} x={x} />
          ))}
        </div>
        {!w.wishes.length && <WishEmpty />}
        <MoreWishes w={w} />
      </div>
    </Section>
  );
};

/** "Tab": one card with "Kirim Ucapan" and "Lihat Ucapan" tabs. */
const Tab: Rsvp = () => {
  const w = useWishes();
  const [tab, setTab] = useState<"form" | "list">("form");
  return (
    <Section block="rsvp" tone="alt">
      <div className="mx-auto max-w-[680px]">
        <Title align="center" />
        <div className="mt-10 overflow-hidden rounded-[22px] border border-t-line bg-t-card">
          <div className="grid grid-cols-2 border-b border-t-line">
            {(
              [
                ["form", "Kirim Ucapan"],
                ["list", `Lihat Ucapan (${w.stats.total})`],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" onClick={() => setTab(id)} className={`relative py-4 text-[14px] font-semibold transition ${tab === id ? "text-t-accent" : "text-t-fg2 hover:text-t-fg"}`}>
                {label}
                {tab === id && <span className="absolute inset-x-6 bottom-0 h-0.5 rounded-full bg-t-accent" />}
              </button>
            ))}
          </div>
          <div className="p-6 sm:p-8">
            {tab === "form" ? (
              <RsvpFields w={w} />
            ) : (
              <>
                <WishStats w={w} />
                <div className="mt-5 max-h-[520px] space-y-4 overflow-y-auto pr-1">
                  {w.wishes.map((x) => (
                    <WishCard key={x.id} x={x} />
                  ))}
                  {!w.wishes.length && <WishEmpty />}
                </div>
                <MoreWishes w={w} />
              </>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

/** "Gelembung Chat": wishes shown like a conversation, form at the bottom. */
const Obrolan: Rsvp = () => {
  const w = useWishes();
  return (
    <Section block="rsvp">
      <div className="mx-auto max-w-[720px]">
        <Title align="center" />
        <div className="mt-6 flex justify-center">
          <WishStats w={w} />
        </div>
        <div className="mt-8 max-h-[560px] space-y-4 overflow-y-auto rounded-[22px] bg-t-alt p-4 sm:p-6">
          {w.wishes.map((x, i) => (
            <div key={x.id} className={`flex ${i % 2 ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-[18px] px-4 py-3 ${i % 2 ? "rounded-br-[4px] bg-t-accent text-t-on-accent" : "rounded-bl-[4px] border border-t-line bg-t-card text-t-fg"}`}>
                <p className="text-[12px] font-bold opacity-85">
                  {x.name} · <span className="font-medium">{x.attendance}</span>
                </p>
                <p className="mt-1 whitespace-pre-line text-[14px] leading-relaxed">{x.message}</p>
              </div>
            </div>
          ))}
          {!w.wishes.length && <WishEmpty />}
          <MoreWishes w={w} />
        </div>
        <div className="mt-8 rounded-[22px] border border-t-line bg-t-card p-6 sm:p-8">
          <RsvpFields w={w} />
        </div>
      </div>
    </Section>
  );
};

export const RSVP_LAYOUTS: Record<string, Rsvp> = { berdampingan: Berdampingan, tengah: Tengah, tab: Tab, obrolan: Obrolan };
