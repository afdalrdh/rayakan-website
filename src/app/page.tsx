import type { Metadata } from "next";
import { contactHref, LandingFooter, LandingNav, portfolioCards } from "@/components/landing/chrome";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { EditorPromoSection } from "@/components/landing/sections/EditorPromo";
import { FaqSection } from "@/components/landing/sections/Faq";
import { FinalCtaSection } from "@/components/landing/sections/FinalCta";
import { GuestsPromoSection } from "@/components/landing/sections/GuestsPromo";
import { PortfolioSection, TestimonialsSection } from "@/components/landing/sections/PortfolioReviews";
import { PricingSection } from "@/components/landing/sections/Pricing";
import { ShowcaseSection } from "@/components/landing/sections/Showcase";
import { StepsSection } from "@/components/landing/sections/Steps";
import { ThemesSection } from "@/components/landing/sections/Themes";
import { rupiah } from "@/lib/content";
import { GENERAL_FAQ } from "@/lib/marketing";
import { faqLd, JsonLd, organizationLd, serviceLd, websiteLd } from "@/lib/seo/jsonld";
import { getPlans } from "@/server/repositories/plans";
import { getShownReviews } from "@/server/repositories/reviews";
import { getSettings } from "@/server/repositories/settings";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Undangan Digital Nikah, Ulang Tahun & Khitanan · Coba Gratis | Rayakan.my.id" },
  description:
    "Buat undangan digital pernikahan, ulang tahun, dan khitanan sendiri dari HP. Tema adat Jawa & Sunda, lukisan & ilustrasi, animasi pembuka, RSVP & amplop digital. Coba gratis, mulai Rp69rb, aktif selamanya.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Undangan Digital Nikah, Ulang Tahun & Khitanan",
    description: "Coba gratis, atur sendiri dari HP, kirim ke tamu dengan nama masing-masing. Mulai Rp69rb, aktif selamanya.",
    url: "/",
    images: [{ url: "/og/rayakan.jpg", width: 1200, height: 630, alt: "Rayakan.my.id: undangan digital nikah, ulang tahun, dan khitanan" }],
  },
};

export default async function Landing() {
  const [plans, settings, reviews] = await Promise.all([getPlans(), getSettings(), getShownReviews()]);
  const cheapest = Math.min(...plans.filter((p) => p.price > 0).map((p) => p.price));
  const consult = contactHref(settings, "Halo Rayakan.my.id, saya mau konsultasi undangan digital.");

  return (
    <div className="overflow-x-clip bg-rk-paper font-rk-sans text-rk-ink selection:bg-rk-sand selection:text-rk-ink">
      <JsonLd data={[organizationLd(settings.instagram ? [`https://instagram.com/${settings.instagram}`] : []), websiteLd(), serviceLd(plans), faqLd(GENERAL_FAQ)]} />
      <LandingNav orderHref={consult} overlay />
      <main>
        <Hero tryHref="/buat" consultHref={consult} priceFrom={rupiah(cheapest)} />
        <Features />
        <ThemesSection />
        <ShowcaseSection />
        <PortfolioSection portfolio={portfolioCards(settings).slice(0, 4)} />
        <TestimonialsSection reviews={reviews} />
        <EditorPromoSection />
        <GuestsPromoSection />
        <StepsSection />
        <PricingSection plans={plans} settings={settings} consultHref={consult} />
        <FaqSection items={GENERAL_FAQ} consultHref={consult} />
        <FinalCtaSection consultHref={consult} />
      </main>
      <LandingFooter settings={settings} orderHref={consult} />
    </div>
  );
}
