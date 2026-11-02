import type { ReactNode } from "react";

/**
 * One heading style for every section of "Putih Marun", so eyebrow, title,
 * divider and intro text keep the same sizes and gaps everywhere.
 */
export function Heading({ eyebrow, title, body, align = "center", className = "" }: { eyebrow?: string; title?: ReactNode; body?: ReactNode; align?: "center" | "left"; className?: string }) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : "text-left"} ${className}`}>
      {eyebrow && <p className="font-sans text-[12px] font-medium uppercase leading-none tracking-[0.24em] text-t-muted md:text-[13px]">{eyebrow}</p>}
      {title && <h2 className={`mt-4 font-serif text-[36px] font-semibold leading-[1.08] text-t-accent sm:text-[44px] md:mt-5 md:text-[54px] ${center ? "mx-auto max-w-[760px]" : "max-w-[760px]"}`}>{title}</h2>}
      <div className={`mt-6 h-px w-12 bg-t-muted/40 md:mt-7 ${center ? "mx-auto" : ""}`} />
      {body && <p className={`mt-6 max-w-[640px] font-sans text-[15px] leading-[1.75] text-[#5f5250] md:mt-7 md:text-[16px] ${center ? "mx-auto" : ""}`}>{body}</p>}
    </div>
  );
}

/** Same vertical rhythm for every section. */
export const SECTION_Y = "py-20 md:py-28 lg:py-32";
export const CONTAINER = "mx-auto w-full max-w-[1120px]";
