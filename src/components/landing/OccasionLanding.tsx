import { contactHref, LandingFooter, LandingNav } from "@/components/landing/chrome";
import { Hero } from "@/components/landing/Hero";
import { FaqSection } from "@/components/landing/sections/Faq";
import { FinalCtaSection } from "@/components/landing/sections/FinalCta";
import { GuestsPromoSection } from "@/components/landing/sections/GuestsPromo";
import { OccasionIntroSection, OccasionLinksSection } from "@/components/landing/sections/Occasions";
import { PricingSection } from "@/components/landing/sections/Pricing";
import { StepsSection } from "@/components/landing/sections/Steps";
import { ThemesSection } from "@/components/landing/sections/Themes";
import { rupiah, type Plan } from "@/lib/content";
import { GENERAL_FAQ, type OccasionPage } from "@/lib/marketing";
import type { AppSettings } from "@/lib/records";
import { breadcrumbLd, faqLd, JsonLd, occasionServiceLd, webPageLd } from "@/lib/seo/jsonld";

/**
 * One marketing page per occasion (/undangan-pernikahan, …): the same building
 * blocks as the landing page, with copy, sample and theme filter for that
 * occasion. Content lives in lib/marketing.ts.
 */
export function OccasionLanding({ page, plans, settings }: { page: OccasionPage; plans: Plan[]; settings: AppSettings }) {
  const cheapest = Math.min(...plans.filter((p) => p.price > 0).map((p) => p.price));
  const consult = contactHref(settings, `Halo Rayakan.my.id, saya mau konsultasi ${page.name.toLowerCase()} digital.`);
  // Occasion questions first, then the general ones that still apply (prices are already answered above).
  const faq = [...page.faq, ...GENERAL_FAQ.filter(([q]) => !q.startsWith("Apa bedanya") && !q.startsWith("Bisa untuk acara"))];

  return (
    <div className="overflow-x-clip bg-rk-paper font-rk-sans text-rk-ink selection:bg-rk-sand selection:text-rk-ink">
      <JsonLd
        data={[
          webPageLd({ path: page.path, name: page.title, description: page.description, image: page.ogImage }),
          occasionServiceLd(page, plans),
          faqLd(faq),
          breadcrumbLd([
            { name: "Beranda", path: "/" },
            { name: page.name, path: page.path },
          ]),
        ]}
      />
      <LandingNav orderHref={consult} overlay />
      <main>
        <Hero
          tryHref="/buat"
          consultHref={consult}
          priceFrom={rupiah(cheapest)}
          copy={{ ...page.hero, themesHref: "#tema", themesLabel: "Lihat tema" }}
          devices={page.devices}
        />
        <OccasionIntroSection page={page} />
        <ThemesSection occasion={page.occasion} title={`Tema ${page.name.toLowerCase()}.`} />
        <GuestsPromoSection />
        <StepsSection />
        <PricingSection plans={plans} settings={settings} consultHref={consult} />
        <FaqSection items={faq} consultHref={consult} title={`Tanya jawab ${page.name.toLowerCase()}.`} />
        <OccasionLinksSection exclude={page.occasion} />
        <FinalCtaSection consultHref={consult} />
      </main>
      <LandingFooter settings={settings} orderHref={consult} />
    </div>
  );
}
