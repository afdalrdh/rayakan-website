import Image from "next/image";
import Link from "next/link";
import { THEMES } from "@/lib/content";
import { portfolioNewestFirst } from "@/lib/portfolio";
import type { AppSettings } from "@/lib/server/data";
import type { PortfolioCard } from "./Portfolio";

/** WhatsApp chat with the admin, or Instagram when no number is set yet. */
export function contactHref(settings: Pick<AppSettings, "adminWhatsapp" | "instagram">, text: string) {
  return settings.adminWhatsapp ? `https://wa.me/${settings.adminWhatsapp}?text=${encodeURIComponent(text)}` : `https://instagram.com/${settings.instagram}`;
}

export const GENERAL_ENQUIRY = "Halo Rayakan.my.id, saya ingin tanya-tanya soal undangan digital.";

export { LandingNav } from "./Nav";

export function LandingFooter({ settings, orderHref }: { settings: Pick<AppSettings, "instagram">; orderHref: string }) {
  return (
    <footer className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 pb-10 pt-10 text-[13px] text-rk-mute sm:flex-row sm:px-6">
      <span className="flex items-center gap-2">
        <Image src="/brand/logo.png" alt="" width={22} height={18} className="h-4 w-auto" /> © {new Date().getFullYear()} Rayakan.my.id
      </span>
      <span className="flex gap-6">
        <Link href="/portofolio" className="hover:text-rk-ink">
          Portofolio
        </Link>
        <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" className="hover:text-rk-ink">
          Instagram
        </a>
        <a href={orderHref} target="_blank" rel="noreferrer" className="hover:text-rk-ink">
          WhatsApp
        </a>
      </span>
    </footer>
  );
}

/** Small uppercase label above section titles. */
export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[12px] font-semibold uppercase tracking-[3px] text-rk-bronze ${className}`}>{children}</p>;
}

/** Section title in the slim display serif. */
export function Title({ children, className = "", as: Tag = "h2" }: { children: React.ReactNode; className?: string; as?: "h1" | "h2" }) {
  return <Tag className={`font-rk-display font-light leading-[1.02] tracking-[-0.02em] text-rk-ink ${className}`}>{children}</Tag>;
}

/** Portfolio entries enriched for the cards (theme name + order link). */
export function portfolioCards(settings: Pick<AppSettings, "adminWhatsapp" | "instagram">): PortfolioCard[] {
  return portfolioNewestFirst().map((p) => {
    const themeName = THEMES[p.theme].name;
    return { ...p, themeName, orderHref: contactHref(settings, `Halo Rayakan.my.id, saya suka undangan ${p.couple} (tema ${themeName}). Boleh dibantu?`) };
  });
}
