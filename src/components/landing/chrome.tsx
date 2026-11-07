import Image from "next/image";
import Link from "next/link";
import { THEMES } from "@/lib/content";
import { OCCASION_PAGE_LIST } from "@/lib/marketing";
import { portfolioNewestFirst } from "@/lib/portfolio";
import type { AppSettings } from "@/lib/records";
import type { PortfolioCard } from "./Portfolio";

/** WhatsApp chat with the admin, or Instagram when no number is set yet. */
export function contactHref(settings: Pick<AppSettings, "adminWhatsapp" | "instagram">, text: string) {
  return settings.adminWhatsapp ? `https://wa.me/${settings.adminWhatsapp}?text=${encodeURIComponent(text)}` : `https://instagram.com/${settings.instagram}`;
}

export const GENERAL_ENQUIRY = "Halo Rayakan.my.id, saya ingin tanya-tanya soal undangan digital.";

export { LandingNav } from "./Nav";

const FOOTER_THEMES = ["jawa", "sunda", "lukis", "kecil", "konfeti", "khitan"] as const;

/** Footer with links to every public page (helps visitors and search engines find them). */
export function LandingFooter({ settings, orderHref }: { settings: Pick<AppSettings, "instagram">; orderHref: string }) {
  const heading = "text-[12px] font-semibold uppercase tracking-[2px] text-rk-ink";
  const link = "text-rk-ink/65 transition hover:text-rk-ink";
  return (
    <footer className="mt-16 border-t border-rk-line/70 bg-[#fbf8f2]">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 text-[14px] sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" />
            <span className="font-rk-display text-[22px] font-light leading-none">Rayakan.my.id</span>
          </Link>
          <p className="mt-4 max-w-[300px] leading-relaxed text-rk-ink/65">Undangan digital pernikahan, ulang tahun, dan khitanan yang bisa kamu buat dan atur sendiri dari HP.</p>
        </div>
        <nav aria-label="Jenis undangan">
          <p className={heading}>Undangan</p>
          <ul className="mt-4 space-y-2.5">
            {OCCASION_PAGE_LIST.map((p) => (
              <li key={p.path}>
                <Link href={p.path} prefetch={false} className={link}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Tema">
          <p className={heading}>Tema</p>
          <ul className="mt-4 space-y-2.5">
            {FOOTER_THEMES.map((id) => (
              <li key={id}>
                <Link href={`/tema/${id}`} prefetch={false} className={link}>
                  {THEMES[id].name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Rayakan.my.id">
          <p className={heading}>Rayakan</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/buat" prefetch={false} className={link}>
                Coba gratis
              </Link>
            </li>
            <li>
              <Link href="/portofolio" prefetch={false} className={link}>
                Portofolio
              </Link>
            </li>
            <li>
              <Link href="/#ulasan" prefetch={false} className={link}>
                Ulasan
              </Link>
            </li>
            <li>
              <Link href="/#harga" prefetch={false} className={link}>
                Harga
              </Link>
            </li>
            <li>
              <a href={orderHref} target="_blank" rel="noreferrer" className={link}>
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" className={link}>
                Instagram
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <p className="border-t border-rk-line/70 px-4 py-6 text-center text-[12.5px] text-rk-ink/60">© {new Date().getFullYear()} Rayakan.my.id · Dibuat dengan sepenuh hati di Indonesia</p>
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
