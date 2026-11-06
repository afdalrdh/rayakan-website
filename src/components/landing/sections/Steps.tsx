import { STEPS } from "@/lib/marketing";
import { Eyebrow, Title } from "../chrome";
import { Envelope } from "../illustrations";
import { Reveal } from "../Reveal";

/** "Cara pesan": three steps from free trial to publishing. */
export function StepsSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
      <div className="rk-parallax pointer-events-none absolute right-[6%] top-20 hidden text-rk-bronze/45 md:block">
        <Envelope className="rk-float h-[120px] w-auto" />
      </div>
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal variant="blur">
          <Eyebrow>Cara pesan</Eyebrow>
          <Title className="mt-4 max-w-[640px] text-[clamp(40px,5.5vw,68px)]">Coba dulu, bayar saat siap disebar.</Title>
        </Reveal>
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li key={t}>
              <Reveal delay={i * 100} className="h-full rounded-[26px] border border-rk-line/80 bg-[#fffdf9] p-7 sm:p-9">
                <span className="font-rk-display text-[64px] font-light leading-none text-rk-bronze/70">{i + 1}</span>
                <h3 className="mt-6 text-[19px] font-semibold">{t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-rk-ink/65">{d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
