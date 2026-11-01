import Image from "next/image";

/**
 * A laptop window with a phone tucked into its lower-right corner, both showing
 * the same invitation. Used for theme cards and the portfolio popup.
 */
export function DeviceDuo({ desktop, mobile, alt, url, className = "" }: { desktop: string; mobile: string; alt: string; url?: string; className?: string }) {
  return (
    <div className={`relative w-full pb-[10%] pr-[9%] ${className}`}>
      <div className="overflow-hidden rounded-[10px] bg-[#211b19] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
        <div className="flex h-6 items-center gap-1.5 px-3">
          <span className="h-2 w-2 rounded-full bg-[#ec6a5e]" />
          <span className="h-2 w-2 rounded-full bg-[#f4bf4f]" />
          <span className="h-2 w-2 rounded-full bg-[#61c554]" />
          {url && <span className="ml-2 truncate rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[9px] text-white/55">{url}</span>}
        </div>
        <div className="relative aspect-[16/10]">
          <Image src={desktop} alt={`${alt} di laptop`} fill unoptimized className="object-cover object-top" />
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-[27%] rounded-[16px] bg-[#0d0b0a] p-[4px] shadow-[0_26px_44px_-14px_rgba(0,0,0,0.85)] ring-1 ring-white/15">
        <div className="relative aspect-[390/844] overflow-hidden rounded-[12px]">
          <Image src={mobile} alt={`${alt} di HP`} fill unoptimized className="object-cover object-top" />
        </div>
      </div>
    </div>
  );
}

/** Blurred photo backdrop for a DeviceDuo, like a product shot. */
export function DuoStage({ backdrop, children, className = "" }: { backdrop: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-[#1d1714] ${className}`}>
      <Image src={backdrop} alt="" fill sizes="600px" className="scale-110 object-cover opacity-45 blur-[8px]" />
      <div className="relative w-full max-w-[470px]">{children}</div>
    </div>
  );
}
