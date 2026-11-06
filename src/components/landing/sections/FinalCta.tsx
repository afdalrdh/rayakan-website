import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "../Reveal";

/** Closing call to action over a photo. */
export function FinalCtaSection({ consultHref, title = "Siap merayakan momenmu?", image = "/demo/afdal/closing.webp" }: { consultHref: string; title?: string; image?: string }) {
  return (
    <section className="px-4 sm:px-6">
      <Reveal variant="scale" className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[32px] bg-[#2a221d]">
        <Image src={image} alt="" fill sizes="(min-width: 1200px) 1200px, 100vw" className="rk-zoom-in object-cover object-[center_40%]" />
        <div className="absolute inset-0 bg-[#1d1714]/65" />
        <div className="relative px-6 py-20 text-center text-white sm:py-28">
          <h2 className="mx-auto max-w-[760px] font-rk-display text-[clamp(42px,6.5vw,84px)] font-light leading-[1] tracking-[-0.02em]">{title}</h2>
          <p className="mx-auto mt-5 max-w-[440px] text-[15px] text-white/80">Coba gratis sekarang. Undanganmu langsung jadi, dan baru bayar saat siap disebar.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link prefetch={false} href="/buat" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-rk-ink">
              <Heart className="h-4 w-4" /> Coba gratis
            </Link>
            <a href={consultHref} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-full border border-white/35 px-7 text-[15px] font-semibold">
              Konsultasi sekarang
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
