import { Plus } from "lucide-react";
import type { Faq } from "@/lib/marketing";
import { Eyebrow, Title } from "../chrome";
import { Bloom } from "../paintings";
import { Reveal } from "../Reveal";

/** Questions as native <details> (works without JavaScript, readable by search engines). */
export function FaqSection({ items, consultHref, title = "Yang sering ditanyakan." }: { items: readonly Faq[]; consultHref: string; title?: string }) {
  return (
    <section id="faq" className="relative scroll-mt-16 overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
      <div className="pointer-events-none absolute -left-8 bottom-6 hidden w-[140px] rotate-[18deg] lg:block">
        <Bloom className="rk-sway h-auto w-full" />
      </div>
      <div className="relative mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal variant="blur">
          <Eyebrow>Pertanyaan</Eyebrow>
          <Title className="mt-4 text-[clamp(40px,5.5vw,68px)]">{title}</Title>
          <p className="mt-5 max-w-[340px] text-[15px] leading-relaxed text-rk-ink/65">
            Masih ada pertanyaan?{" "}
            <a href={consultHref} target="_blank" rel="noreferrer" className="text-rk-ink underline underline-offset-4">
              Chat kami di WhatsApp
            </a>
            .
          </p>
        </Reveal>
        <div className="divide-y divide-rk-line border-y border-rk-line">
          {items.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
                <h3>{q}</h3>
                <Plus className="h-5 w-5 shrink-0 text-rk-bronze transition duration-300 group-open:rotate-45" />
              </summary>
              <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-rk-ink/70">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
