import Image from "next/image";
import type { CSSProperties } from "react";

/*
 * Loading placeholders in the Rayakan look: warm cream blocks with a soft
 * sheen (`.rk-shimmer` in globals.css), the brand mark, and layouts that match
 * the real screens, so a slow connection still feels designed.
 * Server components only: they render before any JavaScript arrives.
 */

/** One placeholder block. Size and shape come from `className`. */
export function Bone({ className = "", style, dark = false }: { className?: string; style?: CSSProperties; dark?: boolean }) {
  return <span aria-hidden="true" style={style} className={`block rounded-[10px] ${dark ? "rk-shimmer-dark" : "rk-shimmer"} rk-shimmer-loop ${className}`} />;
}

/** Logo + wordmark that breathes gently while the page loads. */
export function BrandMark({ label = "Memuat…", className = "", tone = "dark" }: { label?: string; className?: string; tone?: "dark" | "light" }) {
  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-center gap-3 ${className}`}>
      <span className="flex items-center gap-2.5 motion-safe:animate-pulse">
        <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" priority />
        <span className={`font-rk-display text-[22px] font-light leading-none tracking-[-0.01em] ${tone === "light" ? "text-white" : "text-rk-ink"}`}>Rayakan.my.id</span>
      </span>
      <span className={`text-[13px] ${tone === "light" ? "text-white/70" : "text-rk-ink/60"}`}>{label}</span>
    </div>
  );
}

/** Guest-facing invitation (/nama, /nama/tamu, /tema/x): a sealed envelope waiting to open. `fill` = fit the parent (editor preview). */
export function InvitationSkeleton({ fill = false }: { fill?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-10 bg-rk-ivory px-6 py-14 font-rk-sans ${fill ? "h-full" : "min-h-[100svh]"}`}>
      <div className="flex w-full max-w-[300px] flex-col items-center gap-3">
        <Bone className="h-3 w-28" />
        <Bone className="h-10 w-56 rounded-[14px]" />
      </div>
      <div className="relative aspect-[1.3] w-[min(84vw,360px)]">
        <div className="absolute inset-0 rounded-[16px] bg-[#efe4d2] shadow-[0_30px_60px_-30px_rgba(60,40,20,0.45)]" />
        <svg viewBox="0 0 380 292" preserveAspectRatio="none" aria-hidden className="absolute inset-0 h-full w-full">
          <path d="M0 292 L0 6 L190 175 L380 6 L380 292 Z" fill="#f6efe3" />
          <path d="M0 6 L190 175 L380 6" fill="none" stroke="#e1d3bd" strokeWidth="1.5" />
        </svg>
        <span className="absolute left-1/2 top-[60%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#b9965f] shadow-[0_8px_18px_-6px_rgba(0,0,0,0.4)] ring-[5px] ring-[#b9965f]/40 motion-safe:animate-pulse">
          <Image src="/brand/logo.png" alt="" width={26} height={21} className="h-5 w-auto brightness-0 invert" />
        </span>
        <div className="absolute inset-x-0 bottom-[8%] flex flex-col items-center gap-2 px-8">
          <Bone className="h-2.5 w-36" />
          <Bone className="h-5 w-44" />
        </div>
      </div>
      <BrandMark label="Menyiapkan undangan…" className="opacity-80 [&_span:first-child]:scale-90" />
    </div>
  );
}

/** Marketing pages (/buat, /portofolio…): nav bar, headline and a grid of phone cards. */
export function MarketingSkeleton() {
  return (
    <div className="min-h-[100svh] bg-rk-paper font-rk-sans">
      <div className="flex h-16 items-center gap-3 border-b border-rk-line/70 px-5 sm:px-8">
        <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" priority />
        <span className="font-rk-display text-[22px] font-light leading-none text-rk-ink">Rayakan.my.id</span>
        <Bone className="ml-auto h-9 w-36 rounded-full" />
      </div>
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <Bone className="h-3 w-32" />
          <Bone className="h-12 w-[min(90%,560px)] rounded-[16px]" />
          <Bone className="h-12 w-[min(70%,420px)] rounded-[16px]" />
          <Bone className="mt-2 h-4 w-[min(80%,460px)]" />
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={i >= 4 ? "hidden md:block" : ""}>
              <div className="mx-auto aspect-[390/800] w-full max-w-[250px] rounded-[28px] bg-[#0d0b0a] p-[5px]">
                <Bone className="h-full w-full rounded-[23px]" />
              </div>
              <Bone className="mx-auto mt-4 h-6 w-3/4 max-w-[180px]" />
              <Bone className="mx-auto mt-2 h-3 w-1/2 max-w-[140px]" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only" role="status">
        Memuat…
      </span>
    </div>
  );
}

/** Design editor (/nama/editor, /demo/admin): top bar, tool chips, phone canvas, bottom tabs. */
export function EditorSkeleton() {
  return (
    <div className="flex h-[100dvh] flex-col bg-rk-ivory font-rk-sans">
      <div className="flex h-[58px] shrink-0 items-center gap-3 border-b border-rk-line bg-white px-4">
        <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" priority />
        <div className="flex flex-col gap-1.5">
          <Bone className="h-3.5 w-32" />
          <Bone className="h-2.5 w-20" />
        </div>
        <Bone className="ml-auto h-10 w-10 rounded-[14px]" />
        <span className="flex h-10 w-24 items-center justify-center rounded-[14px] bg-rk-ink">
          <span className="h-2.5 w-12 rounded-full bg-white/30" />
        </span>
      </div>
      <div className="flex shrink-0 gap-2 overflow-hidden border-b border-rk-line bg-white px-3 py-2.5">
        {[96, 120, 88, 104].map((w, i) => (
          <Bone key={i} className="h-10 shrink-0 rounded-full" style={{ width: w }} />
        ))}
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center bg-[#ece4d6] sm:p-6">
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-rk-ivory px-8 sm:h-[min(760px,100%)] sm:w-[390px] sm:rounded-[28px] sm:shadow-[0_30px_60px_-20px_rgba(18,13,16,0.45)] sm:ring-[6px] sm:ring-rk-ink">
          <Bone className="h-3 w-28" />
          <Bone className="h-10 w-52 rounded-[14px]" />
          <Bone className="aspect-[1.3] w-full max-w-[300px] rounded-[16px]" />
          <Bone className="h-11 w-44 rounded-[12px]" />
        </div>
      </div>
      <div className="grid h-[64px] shrink-0 grid-cols-4 border-t border-rk-line bg-white sm:hidden">
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className="flex flex-col items-center justify-center gap-1.5">
            <Bone className="h-5 w-5 rounded-md" />
            <Bone className="h-2 w-10" />
          </span>
        ))}
      </div>
      <span className="sr-only" role="status">
        Membuka editor…
      </span>
    </div>
  );
}

/** Client admin (/nama/admin/…): header, menu and content cards. */
export function AdminSkeleton() {
  return (
    <div className="min-h-[60vh] font-rk-sans">
      <div className="space-y-5">
        <div className="space-y-2">
          <Bone className="h-7 w-48 rounded-[12px]" />
          <Bone className="h-3.5 w-64" />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-[20px] border border-rk-line bg-white p-4">
              <Bone className="h-3 w-20" />
              <Bone className="mt-3 h-8 w-14 rounded-[12px]" />
            </div>
          ))}
        </div>
        <div className="divide-y divide-rk-line overflow-hidden rounded-[20px] border border-rk-line bg-white">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Bone className="h-9 w-9 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Bone className="h-3.5 w-2/5" />
                <Bone className="h-2.5 w-1/4" />
              </div>
              <Bone className="h-8 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only" role="status">
        Memuat…
      </span>
    </div>
  );
}

/** Owner Studio: header with tabs and a list of invitation cards. */
export function StudioSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-rk-ivory font-rk-sans">
      <div className="border-b border-rk-line bg-white">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-4 px-4 sm:px-6">
          <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" priority />
          <span className="font-rk-serif text-[20px] leading-none text-rk-ink">Studio</span>
          <div className="ml-2 flex gap-2 overflow-hidden">
            {[78, 96, 64, 104].map((w, i) => (
              <Bone key={i} className="h-8 shrink-0 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1180px] space-y-4 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex gap-3">
          <Bone className="h-11 flex-1 rounded-xl" />
          <Bone className="h-11 w-36 rounded-xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-[20px] border border-rk-line bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <Bone className="h-5 w-40" />
                  <Bone className="h-3 w-52" />
                </div>
                <Bone className="h-6 w-20 rounded-full" />
              </div>
              <div className="mt-5 flex gap-2">
                {[92, 84, 64, 96].map((w, j) => (
                  <Bone key={j} className="h-10 rounded-xl" style={{ width: w }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only" role="status">
        Memuat Studio…
      </span>
    </div>
  );
}

/** Neutral full-screen loader for anything without its own skeleton. */
export function PageLoader({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-rk-paper px-6 font-rk-sans">
      <BrandMark label={label} />
      <div className="flex w-[min(70vw,260px)] flex-col items-center gap-2">
        <Bone className="h-2 w-full rounded-full" />
        <Bone className="h-2 w-2/3 rounded-full" />
      </div>
    </div>
  );
}
