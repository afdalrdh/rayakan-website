import { Check } from "lucide-react";
import Link from "next/link";
import { activeLabel, rupiah, type Plan } from "@/lib/content";
import type { AppSettings } from "@/lib/records";
import { contactHref, Eyebrow, Title } from "../chrome";
import { Branch } from "../paintings";
import { Reveal } from "../Reveal";

/** Promo runs until the end of `endsAt` (WIB). No end date means always on. */
export function isPromoActive(endsAt: string, now = new Date()) {
  return !endsAt || new Date(`${endsAt}T23:59:59+07:00`).getTime() > now.getTime();
}

/** Free and self-edit plans start in the free editor; "Siap Pakai" is ordered over WhatsApp. */
function planCta(p: Plan, settings: Pick<AppSettings, "adminWhatsapp" | "instagram">) {
  if (p.id === "siap") return { href: contactHref(settings, `Halo Rayakan.my.id, saya tertarik paket ${p.name} (${rupiah(p.price)}). Boleh dibantu?`), label: `Pesan ${p.name}`, external: true };
  return { href: "/buat", label: p.price ? `Mulai ${p.name}` : "Coba gratis sekarang", external: false };
}

export function PricingSection({ plans, settings, consultHref }: { plans: Plan[]; settings: AppSettings; consultHref: string }) {
  const promo = isPromoActive(settings.promoEndsAt);
  return (
    <section id="harga" className="relative scroll-mt-16 overflow-hidden bg-[#efe7da] px-4 py-24 sm:px-6 lg:py-32">
      <div className="pointer-events-none absolute -left-2 top-10 hidden w-[100px] -rotate-[24deg] lg:block xl:left-[4%]">
        <Branch className="rk-sway h-auto w-full -scale-x-100" />
      </div>
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal variant="blur" className="text-center">
          <Eyebrow>Harga</Eyebrow>
          <Title className="mt-4 text-[clamp(40px,6vw,76px)]">Sekali bayar, aktif selamanya.</Title>
          <p className="mx-auto mt-4 max-w-[540px] text-[15px] text-rk-ink/65">Semua tema dan fitur sama di setiap paket. Bedanya hanya siapa yang menyusun undangannya.</p>
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((p, i) => {
            const cta = planCta(p, settings);
            const dark = !!p.highlight;
            const ctaCls = `mt-8 inline-flex h-12 items-center justify-center rounded-full text-[14px] font-semibold transition ${dark ? "bg-rk-sand text-rk-ink hover:bg-rk-ivory" : "bg-rk-ink text-white hover:bg-rk-plum"}`;
            return (
              <Reveal key={p.id} delay={i * 90} className={`relative flex flex-col rounded-[28px] p-7 ${dark ? "bg-rk-ink text-rk-ivory shadow-[0_40px_80px_-40px_rgba(18,13,16,0.8)] lg:-my-4 lg:py-11" : "border border-rk-line bg-[#fffdf9]"}`}>
                {dark && <span className="absolute right-6 top-6 rounded-full bg-rk-sand px-3 py-1 text-[11px] font-bold text-rk-ink">Paling hemat</span>}
                <h3 className="font-rk-display text-[38px] font-light leading-none tracking-[-0.02em]">{p.name}</h3>
                <p className={`mt-2 text-[14px] ${dark ? "text-rk-ivory/70" : "text-rk-ink/65"}`}>{p.tagline}</p>
                <div className="mt-7">
                  {promo && p.normalPrice > p.price && <p className={`text-[14px] line-through ${dark ? "text-rk-ivory/50" : "text-rk-ink/55"}`}>{rupiah(p.normalPrice)}</p>}
                  <p className="text-[42px] font-semibold leading-none tracking-tight">{p.price === 0 ? "Gratis" : rupiah(promo ? p.price : p.normalPrice)}</p>
                  <p className={`mt-2 text-[13px] ${dark ? "text-rk-ivory/70" : "text-rk-ink/65"}`}>{p.price === 0 ? "Simpan sebagai draf" : `Aktif ${activeLabel(p).toLowerCase()}`}</p>
                </div>
                <ul className="mt-7 flex-1 space-y-3 text-[14px]">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-rk-sand" : "text-rk-bronze"}`} />
                      <span className={dark ? "text-rk-ivory/85" : "text-rk-ink/80"}>{b}</span>
                    </li>
                  ))}
                </ul>
                {cta.external ? (
                  <a href={cta.href} target="_blank" rel="noreferrer" className={ctaCls}>
                    {cta.label}
                  </a>
                ) : (
                  <Link prefetch={false} href={cta.href} className={ctaCls}>
                    {cta.label}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
        <p className="mt-10 text-center text-[13px] text-rk-ink/65">
          Pembayaran via transfer bank / e-wallet setelah admin membalas. Bingung pilih yang mana?{" "}
          <a href={consultHref} target="_blank" rel="noreferrer" className="font-semibold text-rk-ink underline underline-offset-4">
            Konsultasi gratis
          </a>
          .
        </p>
      </div>
    </section>
  );
}
