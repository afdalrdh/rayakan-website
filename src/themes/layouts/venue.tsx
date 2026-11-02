"use client";

import { CONTAINER, EmptyPhoto, Eyebrow, Heading, Img, InfoIcon, MapsButton, Rule, Section, T, useHas, useTheme } from "../shared";

/* Venue, address, schedule, guest note, maps button. */

type Venue = () => React.JSX.Element;

function Note() {
  const { content: c } = useTheme();
  if (!c.venue.note) return null;
  return (
    <p className="mt-5 flex items-start gap-3 rounded-[14px] border border-t-line bg-t-card p-4 text-left text-[14px] leading-relaxed text-t-fg2">
      <InfoIcon className="mt-0.5 shrink-0 text-t-accent" />
      {c.venue.note}
    </p>
  );
}

function Address({ className = "" }: { className?: string }) {
  const { content: c } = useTheme();
  const has = useHas();
  if (!has(c.venue.address)) return null;
  return (
    <p className={`text-[15px] leading-[1.75] text-t-fg2 md:text-[16px] ${className}`}>
      <T v={c.venue.address} ph="Alamat lengkap" />
    </p>
  );
}

function ScheduleTiles({ className = "" }: { className?: string }) {
  const { content: c } = useTheme();
  const list = c.venue.schedules;
  if (!list.length) return null;
  return (
    <div className={`grid gap-3 md:gap-4 ${list.length > 1 ? "grid-cols-2" : ""} ${className}`}>
      {list.map((s) => (
        <div key={s.id} className="flex min-h-[112px] flex-col items-center justify-center rounded-[14px] border border-t-line bg-t-card px-4 py-6 text-center">
          <p className="t-head text-[18px] leading-tight text-t-accent">
            <T v={s.label} ph="Nama acara" />
          </p>
          <p className="mt-2.5 text-[15px] font-semibold text-t-fg md:text-[16px]">
            <T v={s.time} ph="Jam" />
          </p>
        </div>
      ))}
    </div>
  );
}

/** "Gambar & Info": venue picture beside address and schedule. */
const Berdampingan: Venue = () => {
  const { content: c } = useTheme();
  const v = c.venue;
  return (
    <Section block="venue" tone="alt">
      <div className={`mx-auto grid max-w-[1120px] items-center gap-12 lg:gap-16 ${v.image ? "md:grid-cols-[0.95fr_1fr]" : ""}`}>
        {v.image && (
          <div className="mx-auto w-full max-w-[480px]">
            <Img src={v.image} alt={v.name} width={1000} height={1250} sizes="(min-width: 768px) 45vw, 92vw" className="h-auto w-full rounded-[18px]" />
          </div>
        )}
        <div className={`mx-auto w-full max-w-[560px] text-center ${v.image ? "md:mx-0 md:text-left" : ""}`}>
          <Heading eyebrow={v.eyebrow} title={v.name} phTitle="Nama tempat" align="center" className={v.image ? "md:hidden" : ""} />
          {v.image && <Heading eyebrow={v.eyebrow} title={v.name} phTitle="Nama tempat" align="left" className="hidden md:block" />}
          <Address className="mt-6" />
          <ScheduleTiles className="mt-8" />
          <Note />
          <MapsButton className="mt-8" />
        </div>
      </div>
    </Section>
  );
};

/** "Tengah": wide picture on top, everything centred below. */
const Tengah: Venue = () => {
  const { content: c } = useTheme();
  const v = c.venue;
  return (
    <Section block="venue">
      <div className="mx-auto max-w-[820px] text-center">
        <Heading eyebrow={v.eyebrow} title={v.name} phTitle="Nama tempat" />
        {v.image && (
          <div className="relative mx-auto mt-10 aspect-[16/9] w-full overflow-hidden rounded-[22px]">
            <Img src={v.image} alt={v.name} fill sizes="(min-width: 768px) 820px, 92vw" className="object-cover" />
          </div>
        )}
        <Address className="mx-auto mt-8 max-w-[560px]" />
        {c.venue.schedules.length > 0 && (
          <div className="mx-auto mt-8 max-w-[520px] divide-y divide-t-line border-y border-t-line">
            {c.venue.schedules.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-4 py-4">
                <span className="t-head text-[18px] text-t-accent md:text-[20px]">
                  <T v={s.label} ph="Nama acara" />
                </span>
                <span className="text-[15px] font-semibold text-t-fg">
                  <T v={s.time} ph="Jam" />
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="mx-auto max-w-[520px]">
          <Note />
        </div>
        <MapsButton className="mt-8" />
      </div>
    </Section>
  );
};

/** "Linimasa Acara": the schedule as a timeline next to the venue details. */
const Linimasa: Venue = () => {
  const { content: c } = useTheme();
  const v = c.venue;
  return (
    <Section block="venue" tone="alt">
      <div className={`${CONTAINER} grid gap-12 md:grid-cols-2 md:gap-20`}>
        <div>
          <Heading eyebrow={v.eyebrow} title={v.name} phTitle="Nama tempat" align="left" />
          <Address className="mt-6" />
          <Note />
          <MapsButton className="mt-8" />
          {v.image && (
            <div className="relative mt-10 aspect-[4/3] w-full overflow-hidden rounded-[18px]">
              <Img src={v.image} alt={v.name} fill sizes="(min-width: 768px) 520px, 92vw" className="object-cover" />
            </div>
          )}
        </div>
        <div>
          <Eyebrow>Rangkaian Acara</Eyebrow>
          <ol className="relative mt-8 space-y-8 border-l border-t-muted/50 pl-8">
            {v.schedules.map((s, i) => (
              <li key={s.id} className="relative">
                <span className="absolute -left-[41px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-t-muted bg-t-alt">
                  <span className="h-2 w-2 rounded-full bg-t-accent" />
                </span>
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-t-muted">
                  <T v={s.time} ph="Jam" />
                </p>
                <p className="t-head mt-1.5 text-[24px] leading-tight text-t-accent md:text-[28px]">
                  <T v={s.label} ph={`Acara ${i + 1}`} />
                </p>
              </li>
            ))}
            {!v.schedules.length && <li className="text-[14px] text-t-fg2"><T v="" ph="Jadwal acara" /></li>}
          </ol>
        </div>
      </div>
    </Section>
  );
};

/** "Kartu Acara": one card per event, each with the venue and a maps button. */
const Kartu: Venue = () => {
  const { content: c } = useTheme();
  const v = c.venue;
  const list = v.schedules.length ? v.schedules : [{ id: "x", label: "", time: "" }];
  return (
    <Section block="venue">
      <div className={CONTAINER}>
        <Heading eyebrow={v.eyebrow} title="Waktu & Tempat" />
        <div className={`mx-auto mt-12 grid gap-6 md:mt-16 ${list.length > 1 ? "md:grid-cols-2" : "max-w-[520px]"}`}>
          {list.map((s) => (
            <article key={s.id} className="overflow-hidden rounded-[22px] border border-t-line bg-t-card text-center">
              <div className="relative aspect-[16/9] bg-t-input">{v.image ? <Img src={v.image} alt={v.name} fill sizes="560px" className="object-cover" /> : <EmptyPhoto label="Gambar tempat (opsional)" />}</div>
              <div className="px-6 pb-8 pt-7">
                <h3 className="t-head text-[28px] text-t-accent">
                  <T v={s.label} ph="Nama acara" />
                </h3>
                <p className="mt-2 text-[16px] font-semibold text-t-fg">
                  <T v={s.time} ph="Jam" />
                </p>
                <Rule className="mt-5" />
                <p className="t-head mt-5 text-[18px] text-t-fg">
                  <T v={v.name} ph="Nama tempat" />
                </p>
                <Address className="mx-auto mt-2 max-w-[400px] !text-[14px]" />
                <MapsButton className="mt-6" />
              </div>
            </article>
          ))}
        </div>
        <div className="mx-auto max-w-[620px]">
          <Note />
        </div>
      </div>
    </Section>
  );
};

export const VENUE_LAYOUTS: Record<string, Venue> = { berdampingan: Berdampingan, tengah: Tengah, linimasa: Linimasa, kartu: Kartu };
