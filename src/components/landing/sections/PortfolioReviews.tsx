import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import type { ReviewRecord } from "@/lib/records";
import { Eyebrow, Title } from "../chrome";
import { Rings } from "../illustrations";
import { PortfolioGrid, type PortfolioCard } from "../Portfolio";
import { Reveal } from "../Reveal";
import { ReviewGrid, ReviewsEmpty, ReviewSummary } from "../Reviews";

/** Live portfolio (only sites whose owners allowed it) and real, approved reviews. */
export function PortfolioReviewsSection({ portfolio, reviews, made }: { portfolio: PortfolioCard[]; reviews: ReviewRecord[]; made: number }) {
  return (
    <section id="ulasan" className="relative scroll-mt-16 overflow-hidden bg-[#efe7da] px-4 py-24 sm:px-6 lg:py-32">
      <div className="rk-parallax pointer-events-none absolute left-[42%] top-14 hidden text-rk-bronze/45 lg:block">
        <Rings className="rk-float h-[110px] w-auto" />
      </div>
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal variant="blur" className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Portofolio & ulasan</Eyebrow>
            <Title className="mt-4 text-[clamp(44px,6.5vw,84px)]">
              Momen bahagia, <em className="text-rk-bronze">dirayakan.</em>
            </Title>
          </div>
          {reviews.length > 0 && <ReviewSummary reviews={reviews} made={made} />}
        </Reveal>
        <PortfolioGrid items={portfolio} fillTo={portfolio.length < 3 ? 3 : 4} ctaHref="/buat" className="mt-14" />
        <div className="mt-16">
          {reviews.length > 0 ? (
            <>
              <ReviewGrid reviews={reviews.slice(0, 6)} />
              <div className="mt-8 text-center">
                <Link href="/ulasan" prefetch={false} className="inline-flex h-11 items-center gap-2 rounded-full border border-rk-ink/15 bg-white px-5 text-[14px] font-semibold transition hover:border-rk-ink/40">
                  Baca semua ulasan <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <ReviewsEmpty />
          )}
        </div>
        <p className="mx-auto mt-10 flex max-w-[620px] items-start justify-center gap-2 text-center text-[13px] leading-relaxed text-rk-ink/65">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Sebagian besar undangan bersifat privat. Kami hanya menampilkan undangan dan ulasan yang sudah diizinkan pemiliknya.
        </p>
      </div>
    </section>
  );
}
