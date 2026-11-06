import type { Metadata } from "next";
import { contactHref, LandingFooter, LandingNav, portfolioCards } from "@/components/landing/chrome";
import { Sparkle } from "@/components/landing/illustrations";
import { BlurInTitle, FadeUp } from "@/components/landing/motion";
import { PortfolioGrid } from "@/components/landing/Portfolio";
import { ReviewGrid, ReviewsEmpty, ReviewSummary } from "@/components/landing/Reviews";
import { FinalCtaSection } from "@/components/landing/sections/FinalCta";
import { breadcrumbLd, JsonLd, webPageLd } from "@/lib/seo/jsonld";
import { getShownReviews } from "@/server/repositories/reviews";
import { getSettings } from "@/server/repositories/settings";
import { countSites } from "@/server/repositories/sites";

export const revalidate = 3600;

const DESCRIPTION = "Ulasan asli dari klien Rayakan.my.id tentang undangan digital pernikahan, ulang tahun, dan khitanan mereka, beserta undangan yang boleh dilihat publik.";

export const metadata: Metadata = {
  title: "Ulasan Klien",
  description: DESCRIPTION,
  alternates: { canonical: "/ulasan" },
  openGraph: { title: "Ulasan Klien Rayakan.my.id", description: DESCRIPTION, url: "/ulasan", images: [{ url: "/og/rayakan.jpg", width: 1200, height: 630 }] },
};

/** All approved reviews and the public portfolio. */
export default async function ReviewsPage() {
  const [settings, reviews, made] = await Promise.all([getSettings(), getShownReviews(), countSites()]);
  const consult = contactHref(settings, "Halo Rayakan.my.id, saya mau konsultasi undangan digital.");
  return (
    <div className="overflow-x-clip bg-rk-paper font-rk-sans text-rk-ink">
      <JsonLd
        data={[
          webPageLd({ path: "/ulasan", name: "Ulasan Klien Rayakan.my.id", description: DESCRIPTION }),
          breadcrumbLd([
            { name: "Beranda", path: "/" },
            { name: "Ulasan", path: "/ulasan" },
          ]),
        ]}
      />
      <LandingNav orderHref={consult} />
      <main className="px-4 pb-24 pt-32 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <header className="text-center">
            <BlurInTitle lines={["Cerita *bahagia* dari", "yang sudah merayakan"]} className="font-rk-display text-[clamp(44px,6.4vw,84px)] font-light leading-[1] tracking-[-0.03em]" />
            <FadeUp delay={0.35} className="mx-auto mt-7 flex max-w-[260px] items-center gap-3 text-rk-bronze/70">
              <span className="h-px flex-1 bg-linear-to-r from-transparent to-current" />
              <Sparkle className="h-5 w-5" />
              <span className="h-px flex-1 bg-linear-to-l from-transparent to-current" />
            </FadeUp>
            {reviews.length > 0 && (
              <FadeUp delay={0.45} className="mt-6 flex justify-center">
                <ReviewSummary reviews={reviews} made={made} />
              </FadeUp>
            )}
          </header>
          <div className="mt-14">{reviews.length > 0 ? <ReviewGrid reviews={reviews} /> : <ReviewsEmpty />}</div>

          <section className="mt-24">
            <h2 className="text-center font-rk-display text-[clamp(34px,4.6vw,56px)] font-light leading-tight tracking-[-0.02em]">Undangan yang boleh kamu lihat</h2>
            <PortfolioGrid items={portfolioCards(settings)} fillTo={4} ctaHref="/buat" className="mt-12" />
          </section>
        </div>
      </main>
      <FinalCtaSection consultHref={consult} />
      <LandingFooter settings={settings} orderHref={consult} />
    </div>
  );
}
