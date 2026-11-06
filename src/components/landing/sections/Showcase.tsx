import { SHOWCASE } from "@/lib/marketing";
import { Eyebrow, Title } from "../chrome";
import { Branch } from "../paintings";
import { Reveal } from "../Reveal";
import { Phone } from "./Phone";

/** Six phones showing the sections of a finished invitation. */
export function ShowcaseSection() {
  return (
    <section className="relative overflow-hidden border-y border-rk-line/70 bg-[#fbf8f2] py-24 lg:py-32">
      <div className="pointer-events-none absolute -top-4 right-[3%] hidden w-[100px] rotate-[28deg] lg:block">
        <Branch className="rk-sway h-auto w-full" />
      </div>
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        <Reveal variant="blur" className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>Bukan template biasa</Eyebrow>
            <Title className="mt-4 max-w-[640px] text-[clamp(40px,5.5vw,68px)]">Setiap bagian dirancang seperti majalah.</Title>
          </div>
          <p className="max-w-[460px] text-pretty text-[15px] leading-relaxed text-rk-ink/65 lg:pb-2">Tipografi, jarak, dan animasi diatur dengan teliti. Kamu cukup mengisi, tampilannya tetap rapi di layar mana pun.</p>
        </Reveal>
      </div>
      <div className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:mx-auto lg:grid lg:max-w-[1200px] lg:grid-cols-6 lg:overflow-visible">
        {SHOWCASE.map((s, i) => (
          <Reveal key={s.src} delay={i * 80} variant="scale" className={`w-[58vw] max-w-[240px] shrink-0 snap-start lg:w-auto ${i % 2 ? "lg:mt-10" : ""}`}>
            <Phone src={s.src} alt={`Bagian ${s.label} di undangan`} />
            <p className="mt-4 text-center text-[13px] text-rk-ink/65">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
