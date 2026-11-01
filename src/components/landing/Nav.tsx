"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  ["/#tema", "Tema"],
  ["/portofolio", "Portofolio"],
  ["/#fitur", "Fitur"],
  ["/#harga", "Harga"],
  ["/#faq", "FAQ"],
] as const;

/**
 * Top bar. With `overlay` it starts transparent over the dark hero and turns
 * into the light bar once the page scrolls.
 */
export function LandingNav({ orderHref, overlay = false }: { orderHref: string; overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!overlay) return;
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [overlay]);
  const dark = overlay && !scrolled;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${dark ? "border-transparent bg-transparent text-white" : "border-rk-line/70 bg-rk-paper/85 text-rk-ink backdrop-blur-xl"}`}>
      <nav className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" priority />
          <span className="font-rk-display text-[22px] font-light leading-none tracking-[-0.01em]">Rayakan.my.id</span>
        </Link>
        <div className={`ml-auto hidden items-center gap-7 text-[14px] md:flex ${dark ? "text-white/75" : "text-rk-ink/65"}`}>
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} prefetch={false} className={`transition ${dark ? "hover:text-white" : "hover:text-rk-ink"}`}>
              {label}
            </Link>
          ))}
        </div>
        <a
          href={orderHref}
          target="_blank"
          rel="noreferrer"
          className={`ml-auto rounded-full px-4 py-2 text-[13px] font-semibold transition md:ml-0 ${dark ? "bg-[#f3eadb] text-rk-ink hover:bg-white" : "border border-rk-ink/15 bg-white text-rk-ink hover:border-rk-ink/40"}`}
        >
          Pesan sekarang
        </a>
      </nav>
    </header>
  );
}
