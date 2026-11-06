import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { OCCASION_PAGE_LIST } from "@/lib/marketing";

export const metadata: Metadata = { title: "Halaman tidak ditemukan", robots: { index: false } };

/** Wrong address: most often a mistyped invitation link. */
export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-rk-paper px-6 py-16 text-center font-rk-sans text-rk-ink">
      <Link href="/" className="flex items-center gap-2.5">
        <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" />
        <span className="font-rk-display text-[22px] font-light leading-none">Rayakan.my.id</span>
      </Link>
      <p className="mt-14 font-rk-display text-[clamp(72px,16vw,140px)] font-light leading-none tracking-[-0.04em] text-rk-bronze/70">404</p>
      <h1 className="mt-4 font-rk-display text-[clamp(30px,6vw,44px)] font-light leading-tight">Undangan atau halaman ini tidak ditemukan.</h1>
      <p className="mt-4 max-w-[440px] text-[15px] leading-relaxed text-rk-ink/70">Periksa lagi ejaan link-nya, atau minta link terbaru dari yang mengundang. Kalau kamu sedang mencari undangan digital, mulai dari sini:</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="inline-flex h-12 items-center justify-center rounded-full bg-rk-ink px-6 text-[14px] font-semibold text-white">
          Ke beranda
        </Link>
        <Link href="/buat" prefetch={false} className="inline-flex h-12 items-center justify-center rounded-full border border-rk-ink/15 bg-white px-6 text-[14px] font-semibold">
          Coba buat undangan gratis
        </Link>
      </div>
      <nav aria-label="Jenis undangan" className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] text-rk-ink/65">
        {OCCASION_PAGE_LIST.map((p) => (
          <Link key={p.path} href={p.path} prefetch={false} className="underline-offset-4 hover:text-rk-ink hover:underline">
            {p.name}
          </Link>
        ))}
      </nav>
    </main>
  );
}
