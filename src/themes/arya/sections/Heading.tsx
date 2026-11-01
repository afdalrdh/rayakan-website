/** Eyebrow + serif title + short rule — the heading used by most Malam Emas sections. */
export function Heading({ eyebrow, title, center = true }: { eyebrow: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && <p className="font-sans text-[12px] uppercase tracking-[3px] text-t-muted md:text-[13px]">{eyebrow}</p>}
      <h2 className="mt-3 font-serif text-[34px] font-semibold leading-tight text-t-accent sm:text-[44px] md:text-[50px]">{title}</h2>
      <div className={`mt-5 h-px w-14 bg-t-muted/60 md:mt-6 ${center ? "mx-auto" : ""}`} />
    </div>
  );
}
