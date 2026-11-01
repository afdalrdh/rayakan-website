import type { Metadata } from "next";
import { contactHref, Eyebrow, GENERAL_ENQUIRY, LandingFooter, LandingNav, portfolioCards } from "@/components/landing/chrome";
import { BlurInTitle, FadeUp } from "@/components/landing/motion";
import { PortfolioGrid } from "@/components/landing/Portfolio";
import { getSettings } from "@/lib/server/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Portofolio · Rayakan.my.id",
  description: "Momen bahagia yang sudah kami rayakan: undangan pernikahan digital dari Rayakan.my.id.",
};

/** All weddings, newest first. Cards open a detail popup. */
export default async function PortfolioPage() {
  const settings = await getSettings();
  const orderHref = contactHref(settings, GENERAL_ENQUIRY);
  const items = portfolioCards(settings);

  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-rk-paper font-rk-sans text-rk-ink">
      <LandingNav orderHref={orderHref} />
      <main className="mx-auto max-w-[1200px] px-4 pb-16 pt-28 sm:px-6 md:pt-36">
        <FadeUp>
          <Eyebrow>Portofolio · {items.length} undangan</Eyebrow>
        </FadeUp>
        <BlurInTitle lines={["Momen bahagia,", "*dirayakan.*"]} className="mt-5 font-rk-display text-[clamp(52px,9vw,112px)] font-light leading-[0.98] tracking-[-0.03em]" />
        <FadeUp delay={0.4}>
          <p className="mt-6 max-w-[520px] text-[16px] leading-relaxed text-rk-ink/65">Kumpulan undangan yang sudah kami rayakan bersama para pasangan. Ketuk salah satu untuk melihat detailnya.</p>
        </FadeUp>
        <PortfolioGrid items={items} className="mt-14" />
      </main>
      <LandingFooter settings={settings} orderHref={orderHref} />
    </div>
  );
}
