import type { Metadata } from "next";
import { contactHref, Eyebrow, GENERAL_ENQUIRY, LandingFooter, LandingNav, portfolioCards } from "@/components/landing/chrome";
import { BlurInTitle, FadeUp } from "@/components/landing/motion";
import { PortfolioGrid } from "@/components/landing/Portfolio";
import { getSettings } from "@/server/repositories/settings";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Portofolio Undangan Pernikahan Digital",
  description: "Contoh undangan pernikahan digital yang sudah kami buat bersama para pasangan. Lihat desain, fitur, dan tampilannya di HP maupun laptop.",
  alternates: { canonical: "/portofolio" },
  openGraph: { title: "Portofolio Undangan Pernikahan Digital", url: "/portofolio", images: [{ url: "/demo/afdal/og.jpg", width: 1200, height: 630 }] },
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
        <BlurInTitle lines={["Momen bahagia, *dirayakan.*"]} className="mt-5 font-rk-display text-[clamp(48px,6.6vw,92px)] font-light leading-[0.98] tracking-[-0.03em]" />
        <FadeUp delay={0.4}>
          <p className="mt-5 text-[16px] leading-relaxed text-rk-ink/65">Undangan yang sudah kami rayakan bersama para pasangan. Ketuk untuk melihat detail.</p>
        </FadeUp>
        <PortfolioGrid items={items} fillTo={4} ctaHref={orderHref} className="mt-14" />
      </main>
      <LandingFooter settings={settings} orderHref={orderHref} />
    </div>
  );
}
