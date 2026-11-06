import { Check } from "lucide-react";
import Image from "next/image";
import { GUEST_POINTS } from "@/lib/marketing";
import { Eyebrow, Title } from "../chrome";
import { Breath } from "../paintings";
import { Reveal } from "../Reveal";

/** Guest list & WhatsApp sending, with a mock chat bubble. */
export function GuestsPromoSection() {
  return (
    <section className="relative overflow-hidden border-y border-rk-line/70 bg-[#fbf8f2] px-4 py-24 sm:px-6 lg:py-32">
      <div className="pointer-events-none absolute -bottom-6 right-[2%] hidden w-[120px] lg:block">
        <Breath className="rk-sway h-auto w-full" />
      </div>
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-2">
        <Reveal variant="left" className="order-2 lg:order-1">
          <div className="mx-auto max-w-[420px] rounded-[28px] bg-[#e9e2d6] p-5">
            <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-rk-ink/60">WhatsApp</p>
            <div className="ml-auto mt-4 max-w-[330px] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-1.5 shadow-sm">
              <div className="overflow-hidden rounded-xl bg-white/70">
                <div className="rk-shimmer relative aspect-[1.91/1]">
                  <Image src="/demo/afdal/og.jpg" alt="" fill sizes="330px" className="object-cover" />
                </div>
                <div className="px-3 py-2">
                  <p className="text-[13px] font-semibold">The Wedding of Afdal &amp; Putri</p>
                  <p className="text-[12px] text-[#54656f]">Kepada Yth. Keluarga Wijaya · Sabtu, 4 Juli 2026</p>
                </div>
              </div>
              <p className="px-2 pb-1 pt-2 text-[13px] leading-relaxed">
                Kepada Yth.
                <br />
                <b>Keluarga Wijaya</b>
                <br />
                <br />
                Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami…
              </p>
              <p className="px-2 pb-1 text-right text-[10px] text-[#54656f]">09.41 ✓✓</p>
            </div>
          </div>
        </Reveal>
        <Reveal variant="right" delay={120} className="order-1 lg:order-2">
          <Eyebrow>Kelola tamu</Eyebrow>
          <Title className="mt-4 text-[clamp(40px,5.5vw,68px)]">Setiap tamu disapa dengan namanya.</Title>
          <ul className="mt-9 space-y-4 text-[15px]">
            {GUEST_POINTS.map((t) => (
              <li key={t} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-rk-bronze" />
                <span className="leading-relaxed text-rk-ink/75">{t}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
