import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { OCCASION_PAGE_LIST, type OccasionPage } from "@/lib/marketing";
import { Eyebrow, Title } from "../chrome";
import { Reveal } from "../Reveal";

const CARD = {
  nikah: { image: "/demo/ilustrasi/jawa.webp", blurb: "Elegan, adat Jawa & Sunda, sampai lukisan cat air." },
  ultah: { image: "/demo/ilustrasi/konfeti.webp", blurb: "Balon, kue, konfeti, dan petualangan angkasa." },
  khitan: { image: "/demo/ilustrasi/khitan.webp", blurb: "Nuansa islami dengan kubah, lampion, dan doa." },
} as const;

/** Links to the three occasion pages (also good internal links for search engines). */
export function OccasionLinksSection({ exclude }: { exclude?: OccasionPage["occasion"] }) {
  const pages = OCCASION_PAGE_LIST.filter((p) => p.occasion !== exclude);
  return (
    <section className="px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <Reveal variant="blur" className="text-center">
          <Eyebrow>{exclude ? "Acara lainnya" : "Untuk acara apa?"}</Eyebrow>
          <Title className="mx-auto mt-4 max-w-[720px] text-[clamp(36px,5vw,60px)]">{exclude ? "Rayakan juga momen lainnya." : "Satu tempat untuk semua perayaan."}</Title>
        </Reveal>
        <div className={`mt-12 grid gap-4 ${pages.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
          {pages.map((p, i) => (
            <Reveal key={p.path} delay={i * 90}>
              <Link href={p.path} prefetch={false} className="group relative flex h-[300px] overflow-hidden rounded-[26px] bg-[#2a221d] text-white sm:h-[360px]">
                <Image src={CARD[p.occasion].image} alt="" fill sizes="(min-width: 768px) 380px, 100vw" className="object-cover object-[50%_30%] transition duration-[1200ms] ease-out group-hover:scale-[1.04]" />
                <span className="absolute inset-0 bg-linear-to-t from-[#15110e]/90 via-[#15110e]/35 to-transparent" />
                <span className="relative mt-auto block p-6">
                  <span className="block font-rk-display text-[30px] font-light leading-tight">{p.name}</span>
                  <span className="mt-1 block text-[14px] text-white/80">{CARD[p.occasion].blurb}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#f3d8a7]">
                    Lihat tema & contoh <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Occasion page: what the invitation contains and why it fits this occasion. */
export function OccasionIntroSection({ page }: { page: OccasionPage }) {
  return (
    <section className="px-4 pb-6 pt-20 sm:px-6 lg:pt-28">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal variant="blur">
          <Eyebrow>{page.name}</Eyebrow>
          <Title className="mt-4 text-[clamp(36px,5vw,60px)]">{page.intro.title}</Title>
          <p className="mt-5 max-w-[520px] text-[15px] leading-relaxed text-rk-ink/70">{page.intro.body}</p>
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2">
          {page.points.map(([t, d], i) => (
            <li key={t}>
              <Reveal delay={i * 80} className="h-full rounded-[24px] border border-rk-line/80 bg-[#fffdf9] p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rk-ink text-[#f3d8a7]">
                  <Check className="h-4 w-4" />
                </span>
                <h3 className="mt-4 text-[17px] font-semibold">{t}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-rk-ink/65">{d}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
