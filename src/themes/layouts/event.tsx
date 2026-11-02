"use client";

import { formatEventDate } from "@/lib/content";
import { COUNTDOWN_UNITS, Eyebrow, HeroPhoto, Ornament, Reveal, Section, T, useCountdown, useTheme } from "../shared";

/* Wedding date + live countdown. */

type Event = () => React.JSX.Element;

const LABELS = { days: "Hari", hours: "Jam", minutes: "Menit", seconds: "Detik" } as const;
const pad = (n: number) => String(n).padStart(2, "0");

function useDateParts() {
  const { content: c } = useTheme();
  const d = new Date(`${c.event.date}T00:00:00`);
  if (!c.event.date || Number.isNaN(d.getTime())) return null;
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("id-ID", o).format(d);
  return { weekday: f({ weekday: "long" }), day: f({ day: "numeric" }), month: f({ month: "long" }), year: f({ year: "numeric" }), full: formatEventDate(c.event.date) };
}

function TimeLine() {
  const { content: c } = useTheme();
  if (!c.event.time) return null;
  return (
    <p className="mt-4 text-[14px] text-t-fg2 md:text-[16px]">
      Pukul {c.event.time.replace(":", ".")} {c.event.timezone}
    </p>
  );
}

/** "Hitung Mundur": big date + four countdown tiles. */
const Kotak: Event = () => {
  const { content: c } = useTheme();
  const left = useCountdown(c.event);
  const d = useDateParts();
  return (
    <Section block="event" className="flex min-h-[80svh] items-center justify-center text-center">
      <div className="mx-auto w-full max-w-[980px]">
        <Reveal>
          <Eyebrow>{c.event.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="t-head mt-6 text-[38px] leading-[1.1] text-t-accent sm:text-[56px] md:mt-8 md:text-[76px]">
            <T v={d?.full} ph="Tanggal acara" />
          </h2>
        </Reveal>
        <Reveal delay={0.18} className="mx-auto mt-10 grid max-w-[560px] grid-cols-4 gap-2.5 sm:gap-4 md:mt-14 md:gap-5">
          {COUNTDOWN_UNITS.map((k) => (
            <div key={k} className="flex aspect-square min-w-0 flex-col items-center justify-center rounded-[16px] border border-t-line bg-t-card px-2 py-3">
              <span className="t-head text-[28px] leading-none tabular-nums text-t-accent sm:text-[36px] md:text-[44px]">{pad(left[k])}</span>
              <span className="mt-2 text-[10px] uppercase leading-none tracking-[0.16em] text-t-fg2 md:text-[11px]">{LABELS[k]}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
};

/** "Kalender": weekday, big day number between lines, month and year. */
const Kalender: Event = () => {
  const { content: c } = useTheme();
  const left = useCountdown(c.event);
  const d = useDateParts();
  return (
    <Section block="event" tone="alt" className="text-center">
      <Eyebrow>{c.event.eyebrow}</Eyebrow>
      <div className="mx-auto mt-10 grid max-w-[620px] grid-cols-[1fr_auto_1fr] items-center gap-4 md:mt-14 md:gap-8">
        <div className="border-y border-t-muted/50 py-3 text-[13px] uppercase tracking-[0.2em] text-t-fg md:text-[15px]">{d ? d.weekday : <T v="" ph="Hari" />}</div>
        <div className="t-display text-[calc(96px*var(--t-display-scale))] leading-none text-t-accent md:text-[calc(140px*var(--t-display-scale))]">{d ? d.day : "--"}</div>
        <div className="border-y border-t-muted/50 py-3 text-[13px] uppercase tracking-[0.2em] text-t-fg md:text-[15px]">{d ? d.month : <T v="" ph="Bulan" />}</div>
      </div>
      <p className="t-head mt-4 text-[22px] text-t-accent md:text-[28px]">{d?.year ?? ""}</p>
      <TimeLine />
      <Ornament className="mt-10" />
      <p className="mt-6 text-[13px] uppercase tracking-[0.2em] text-t-fg2">
        {left.days} hari · {left.hours} jam · {left.minutes} menit lagi
      </p>
    </Section>
  );
};

/** "Angka Besar": oversized countdown numerals separated by colons. */
const Angka: Event = () => {
  const { content: c } = useTheme();
  const left = useCountdown(c.event);
  const d = useDateParts();
  return (
    <Section block="event" className="text-center">
      <Eyebrow>{c.event.eyebrow}</Eyebrow>
      <div className="mx-auto mt-10 flex max-w-[900px] items-start justify-center gap-1 sm:gap-3 md:mt-14 md:gap-5">
        {COUNTDOWN_UNITS.map((k, i) => (
          <div key={k} className="flex items-start gap-1 sm:gap-3 md:gap-5">
            {i > 0 && <span className="t-display pt-[0.05em] text-[calc(44px*var(--t-display-scale))] leading-none text-t-muted/60 sm:text-[calc(64px*var(--t-display-scale))] md:text-[calc(96px*var(--t-display-scale))]">:</span>}
            <div className="min-w-[2.2ch]">
              <span className="t-display block text-[calc(48px*var(--t-display-scale))] leading-none tabular-nums text-t-accent sm:text-[calc(72px*var(--t-display-scale))] md:text-[calc(112px*var(--t-display-scale))]">{pad(left[k])}</span>
              <span className="mt-3 block text-[10px] uppercase tracking-[0.2em] text-t-fg2 md:text-[12px]">{LABELS[k]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 h-px w-full max-w-[560px] bg-t-line" />
      <p className="t-head mt-8 text-[22px] text-t-fg md:text-[30px]">
        <T v={d?.full} ph="Tanggal acara" />
      </p>
      <TimeLine />
    </Section>
  );
};

/** "Di Atas Foto": date and countdown on top of the main photo. */
const Foto: Event = () => {
  const { content: c } = useTheme();
  const left = useCountdown(c.event);
  const d = useDateParts();
  return (
    <Section block="event" tone="none" pad={false} className="isolate flex min-h-[90svh] items-center justify-center overflow-hidden bg-neutral-950 px-5 py-20 text-center text-white">
      <HeroPhoto overlay={false} />
      <div className="absolute inset-0 z-[5] bg-black/55" />
      <div className="relative z-10 w-full max-w-[880px]">
        <p className="text-[12px] uppercase tracking-[0.28em] text-white/75 md:text-[13px]">{c.event.eyebrow}</p>
        <h2 className="t-head mt-6 text-[36px] leading-[1.1] sm:text-[52px] md:text-[68px]">
          <T v={d?.full} ph="Tanggal acara" />
        </h2>
        <div className="mx-auto mt-10 grid max-w-[560px] grid-cols-4 gap-2.5 sm:gap-4">
          {COUNTDOWN_UNITS.map((k) => (
            <div key={k} className="rounded-[16px] border border-white/25 bg-white/10 px-2 py-4 backdrop-blur-md">
              <span className="t-head block text-[28px] leading-none tabular-nums sm:text-[38px]">{pad(left[k])}</span>
              <span className="mt-2 block text-[10px] uppercase tracking-[0.16em] text-white/75 md:text-[11px]">{LABELS[k]}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export const EVENT_LAYOUTS: Record<string, Event> = { kotak: Kotak, kalender: Kalender, angka: Angka, foto: Foto };
