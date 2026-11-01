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

const LINKS = [
  ["/#tema", "Tema"],
  ["/portofolio", "Portofolio"],
  ["/#fitur", "Fitur"],
  ["/#harga", "Harga"],
  ["/#faq", "FAQ"],
] as const;

export function LandingNav({ orderHref }: { orderHref: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rk-line/70 bg-rk-paper/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" priority />
          <span className="font-rk-display text-[22px] leading-none tracking-[-0.01em]">Rayakan.my.id</span>
        </Link>
        <div className="ml-auto hidden items-center gap-7 text-[14px] text-rk-ink/65 md:flex">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="transition hover:text-rk-ink">
              {label}
            </Link>
          ))}
        </div>
        <a href={orderHref} target="_blank" rel="noreferrer" className="ml-auto rounded-full border border-rk-ink/15 bg-white px-4 py-2 text-[13px] font-semibold text-rk-ink shadow-[0_1px_0_rgba(0,0,0,0.04)] transition hover:border-rk-ink/40 md:ml-0">
          Pesan sekarang
        </a>
      </nav>
    </header>
  );
}

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
