/** Common page frame for the non-canvas tabs (Tamu, Ucapan, Lainnya). */
export function TabShell({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[560px] space-y-5 px-4 py-6 lg:py-10">
      <h1 className="font-rk-serif text-[34px] leading-none text-rk-ink">{title}</h1>
      <p className="rounded-2xl bg-rk-cream px-4 py-3 font-rk-sans text-[13px] leading-snug text-rk-mute">{note}</p>
      {children}
    </div>
  );
}
