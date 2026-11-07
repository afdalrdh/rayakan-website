import { Lock } from "lucide-react";
import type { ReviewRecord } from "@/lib/records";
import { Eyebrow, Title } from "../chrome";
import { Rings } from "../illustrations";
import { PortfolioGrid, type PortfolioCard } from "../Portfolio";
import { Reveal } from "../Reveal";
import { ReviewSlider, ReviewsEmpty } from "../Reviews";

/** Live portfolio (only sites whose owners allowed it). */
export function PortfolioSection({ portfolio }: { portfolio: PortfolioCard[] }) {
  return (
    <section id="portofolio" className="relative scroll-mt-16 overflow-hidden bg-[#efe7da] px-4 py-24 sm:px-6 lg:py-32">
      <div className="rk-parallax pointer-events-none absolute left-[42%] top-14 hidden text-rk-bronze/45 lg:block">
        <Rings className="rk-float h-[110px] w-auto" />
      </div>
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal variant="blur">
          <Eyebrow>Portofolio</Eyebrow>
          <Title className="mt-4 text-[clamp(44px,6.5vw,84px)]">
            Momen bahagia, <em className="text-rk-bronze">dirayakan.</em>
          </Title>
        </Reveal>
        <PortfolioGrid items={portfolio} fillTo={portfolio.length < 3 ? 3 : 4} ctaHref="/buat" className="mt-14" />
        <p className="mx-auto mt-10 flex max-w-[620px] items-start justify-center gap-2 text-center text-[13px] leading-relaxed text-rk-ink/65">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Sebagian besar undangan bersifat privat. Kami hanya menampilkan undangan dan ulasan yang sudah diizinkan pemiliknya.
        </p>
      </div>
    </section>
  );
}

/**
 * Real, approved reviews as auto-sliding cards (navbar "Ulasan" scrolls here).
 * Nothing in it is clickable: it is meant to be read in passing.
 */
export function TestimonialsSection({ reviews }: { reviews: ReviewRecord[] }) {
  return (
    <section id="ulasan" className="scroll-mt-16 overflow-hidden bg-rk-paper py-24 lg:py-32">
      <Reveal variant="blur" className="mx-auto max-w-[760px] px-4 text-center sm:px-6">
        <p className="inline-flex rounded-full bg-[#f3e7d7] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[2.5px] text-rk-ink/80">Ulasan pelanggan</p>
        <Title className="mt-5 text-[clamp(40px,5.6vw,72px)]">
          Ditulis langsung oleh <em className="text-rk-bronze">mereka.</em>
        </Title>
        <p className="mx-auto mt-5 max-w-[560px] text-[15.5px] leading-relaxed text-rk-ink/65">Cerita dan pengalaman nyata dari klien yang sudah merayakan momen bahagianya bersama Rayakan.my.id.</p>
      </Reveal>
      <div className="mt-14">
        {reviews.length > 0 ? (
          <ReviewSlider reviews={reviews} />
        ) : (
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <ReviewsEmpty />
          </div>
        )}
      </div>
    </section>
  );
}
