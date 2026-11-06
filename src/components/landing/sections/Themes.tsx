import type { Occasion } from "@/lib/content";
import { Title } from "../chrome";
import { Bloom } from "../paintings";
import { Reveal } from "../Reveal";
import { ThemeCatalog } from "../ThemeCatalog";

/** Theme catalogue: a short title, the occasion filter and the cards. `occasion` preselects the filter. */
export function ThemesSection({ occasion, title = "Pilih tema undanganmu." }: { occasion?: Occasion; title?: string }) {
  return (
    <section id="tema" className="relative scroll-mt-16 overflow-hidden px-4 py-20 sm:px-6 lg:py-28">
      <div className="pointer-events-none absolute left-[3%] top-14 hidden w-[130px] -rotate-12 lg:block xl:left-[6%]">
        <Bloom className="rk-sway h-auto w-full" />
      </div>
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal variant="blur" className="text-center">
          <Title className="mx-auto max-w-[720px] text-[clamp(38px,5.2vw,64px)]">{title}</Title>
        </Reveal>
        <div className="mt-8">
          <ThemeCatalog initialOccasion={occasion ?? "semua"} />
        </div>
        <p className="mt-12 text-center text-[13px] text-rk-ink/65">Semua tema bisa dipakai untuk acara apa pun. Warna, ornamen, dan tata letak tiap bagian bisa diubah kapan saja.</p>
      </div>
    </section>
  );
}
