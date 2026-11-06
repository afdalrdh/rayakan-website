import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { EDITOR_POINTS } from "@/lib/marketing";
import { Eyebrow, Title } from "../chrome";
import { Reveal } from "../Reveal";
import { Phone } from "./Phone";

/** "Edit dari HP": how the editor works, with a screenshot. */
export function EditorPromoSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-[1fr_0.8fr]">
        <Reveal variant="left">
          <Eyebrow>Edit dari HP</Eyebrow>
          <Title className="mt-4 text-[clamp(40px,5.5vw,68px)]">Ketuk bagian yang ingin diubah. Selesai.</Title>
          <ol className="mt-10 space-y-7">
            {EDITOR_POINTS.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[44px_1fr] gap-4">
                <span className="font-rk-display text-[34px] font-light leading-none text-rk-bronze/70">0{i + 1}</span>
                <span>
                  <span className="block text-[17px] font-semibold">{t}</span>
                  <span className="mt-1.5 block text-[15px] leading-relaxed text-rk-ink/65">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <Link prefetch={false} href="/buat" className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-rk-ink px-6 text-[14px] font-semibold text-white">
            Coba gratis sekarang <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <Reveal variant="right" delay={150} className="mx-auto w-full max-w-[320px]">
          <Phone src="/landing/editor-arya.webp" alt="Editor undangan di HP" sizes="320px" />
        </Reveal>
      </div>
    </section>
  );
}
