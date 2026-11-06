"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

/** Something failed while rendering a page: say so kindly and offer a retry. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-rk-paper px-6 py-16 text-center font-rk-sans text-rk-ink">
      <Image src="/brand/logo.png" alt="" width={36} height={29} className="h-8 w-auto" />
      <h1 className="mt-8 font-rk-display text-[clamp(30px,6vw,44px)] font-light leading-tight">Maaf, ada yang tidak beres.</h1>
      <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed text-rk-ink/70">Halaman ini gagal dimuat, mungkin karena koneksi sedang lemah. Coba muat ulang sebentar lagi.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="inline-flex h-12 items-center justify-center rounded-full bg-rk-ink px-6 text-[14px] font-semibold text-white">
          Coba lagi
        </button>
        <Link href="/" className="inline-flex h-12 items-center justify-center rounded-full border border-rk-ink/15 bg-white px-6 text-[14px] font-semibold">
          Ke beranda
        </Link>
      </div>
      {error.digest && <p className="mt-8 text-[12px] text-rk-ink/45">Kode: {error.digest}</p>}
    </main>
  );
}
