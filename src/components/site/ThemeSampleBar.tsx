"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Floating bar on /tema/<id>: back to all themes, or start with this one.
 * Appears after the cover is opened and the visitor scrolls past the opening
 * photo, so it never covers "Buka Undangan" or the names.
 */
export function ThemeSampleBar({ themeId, themeName }: { themeId: string; themeName: string }) {
  const [opened, setOpened] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const open = () => setOpened(true);
    const scroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("rk:cover-open", open);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("rk:cover-open", open);
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  const shown = opened && scrolled;
  return (
    <div
      data-sample-bar
      className={`fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+84px)] z-[120] flex justify-center px-4 transition duration-500 md:bottom-8 ${shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      aria-hidden={!shown}
    >
      <div className="flex items-center gap-1 rounded-full bg-[#15110e]/90 p-1.5 font-rk-sans text-white shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <Link href="/#tema" prefetch={false} className="flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold text-white/80 transition hover:text-white" tabIndex={shown ? 0 : -1}>
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Semua tema</span>
          <span className="sm:hidden">Tema lain</span>
        </Link>
        <Link href={`/buat?tema=${themeId}`} prefetch={false} className="flex h-10 items-center gap-1.5 rounded-full bg-[#f3eadb] px-4 text-[13.5px] font-bold text-[#120d10] transition hover:bg-white" tabIndex={shown ? 0 : -1}>
          Pakai {themeName} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
