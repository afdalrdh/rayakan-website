import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Heart, Lock, Palette, Plus, Sparkles, Wand2 } from "lucide-react";
import { contactHref, Eyebrow, GENERAL_ENQUIRY, LandingFooter, LandingNav, portfolioCards, Title } from "@/components/landing/chrome";
import { Hero } from "@/components/landing/Hero";
import { Envelope, Rings } from "@/components/landing/illustrations";
import { Bloom, Branch, Breath } from "@/components/landing/paintings";
import { Features } from "@/components/landing/Features";
import { PortfolioGrid } from "@/components/landing/Portfolio";
import { Reveal } from "@/components/landing/Reveal";
import { ReviewGrid, ReviewSummary } from "@/components/landing/Reviews";
import { ThemeCatalog } from "@/components/landing/ThemeCatalog";
import { activeLabel, DECOR_IDS, FONT_PAIR_IDS, PALETTE_IDS, rupiah, THEME_IDS, type Plan } from "@/lib/content";
import { countSites, getPlans, getSettings, getShownReviews } from "@/lib/server/data";
import { faqLd, JsonLd, organizationLd, serviceLd, websiteLd } from "@/lib/seo/jsonld";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Undangan Digital Nikah, Ulang Tahun & Khitanan · Coba Gratis | Rayakan.my.id" },
  description:
    "Buat undangan digital pernikahan, ulang tahun, dan khitanan sendiri dari HP. Tema adat Jawa & Sunda, lukisan & ilustrasi, animasi pembuka, RSVP & amplop digital. Coba gratis, mulai Rp69rb, aktif selamanya.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Undangan Digital Nikah, Ulang Tahun & Khitanan",
    description: "Coba gratis, atur sendiri dari HP, kirim ke tamu dengan nama masing-masing. Mulai Rp69rb, aktif selamanya.",
    url: "/",
    images: [{ url: "/demo/afdal/og.jpg", width: 1200, height: 630, alt: "Contoh undangan digital Rayakan.my.id" }],
  },
};

const SECTIONS = [
  { src: "/landing/sec-arya-invitation.webp", label: "Profil" },
  { src: "/landing/sec-arya-story.webp", label: "Kisah cinta" },
  { src: "/landing/sec-arya-date.webp", label: "Hitung mundur" },
  { src: "/landing/sec-arya-venue.webp", label: "Lokasi & jadwal" },
  { src: "/landing/sec-arya-memories.webp", label: "Galeri foto" },
  { src: "/landing/sec-arya-gift.webp", label: "Amplop digital" },
];

const FAQ = [
  ["Apa bedanya Coba Gratis, Edit Sendiri, dan Siap Pakai?", "Coba Gratis: pakai semua tema dan editor, lalu simpan draf, tapi belum bisa dikirim ke tamu. Edit Sendiri (Rp69rb): kamu yang mengatur, kami terbitkan. Siap Pakai (Rp149rb): kirim data & foto, admin yang menyusunkan sampai jadi."],
  ["Bisa untuk acara selain pernikahan?", "Bisa. Ada tema khusus ulang tahun dan khitanan, dan semua tema bisa dipakai untuk acara apa pun. Label, jumlah nama, dan teks bawaan menyesuaikan jenis acaranya."],
  ["Saya tidak punya foto prewedding. Bagaimana?", "Pakai tema lukisan seperti Dua Sejoli, Taman Lukis, atau tema adat: foto utamanya diganti lukisan atau ilustrasi AI kalian. Tidak ingin memakai gambar wajah sama sekali? Pilih tata letak Ilustrasi tanpa wajah. Bisa juga memakai foto masa kecil atau versi anak-anak buatan AI dengan tema Kenangan Kecil."],
  ["Berapa lama undangan bisa jadi?", "Pilih tema, isi nama dan tanggal, undangan langsung tampil. Kebanyakan selesai dilengkapi dalam 15–30 menit. Di paket Siap Pakai, admin yang menyusunkan untukmu."],
  ["Apakah perlu install aplikasi atau daftar akun?", "Tidak. Editor dibuka dari browser HP atau laptop. Untuk menyimpan draf cukup isi nama dan nomor WhatsApp."],
  ["Bisa diubah setelah dibagikan?", "Bisa, kapan saja sampai hari H dan sesudahnya. Link undangan tetap sama, jadi tamu langsung melihat versi terbaru."],
  ["Bagaimana mengirim ke tamu dengan nama masing-masing?", "Masukkan daftar tamu (atau import dari Excel), lalu tekan tombol WhatsApp di samping nama. Pesan dan link berisi nama tamu sudah otomatis terisi."],
  ["Bagaimana cara bayar?", "Tekan Kirim ke admin di editor dan pilih paket. Admin membalas lewat WhatsApp dengan info pembayaran (transfer bank / e-wallet). Undangan terbit setelah dikonfirmasi dan aktif selamanya."],
];

const PILLARS = [
  { icon: Wand2, title: "Gampang dibuat", body: "Pilih tema, isi nama dan tanggal, undangan langsung jadi. Edit cukup dengan mengetuk bagian yang ingin diubah." },
  { icon: Palette, title: "Custom sesukamu", body: `Campur tata letak tiap bagian, ${PALETTE_IDS.length} palet warna, ${FONT_PAIR_IDS.length} pasangan huruf, dan ${DECOR_IDS.length - 1} set ornamen beranimasi.` },
  { icon: Sparkles, title: "Tema yang memikat", body: "Adat Jawa & Sunda, lukisan cat air, stiker foto masa kecil, sampai pesta ulang tahun anak. Dibuka dengan animasi amplop, gerbang, atau stiker." },
];

const TRUST = ["Coba gratis tanpa daftar", "Bayar setelah jadi", "Bisa diubah sampai hari H", "Aktif selamanya"];

/** Promo runs until the end of `endsAt` (WIB). No end date means always on. */
function promoEnd(endsAt: string) {
  return endsAt ? new Date(`${endsAt}T23:59:59+07:00`) : null;
}
function isPromoActive(end: Date | null, now = new Date()) {
  return !end || end.getTime() > now.getTime();
}

function Phone({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative aspect-[390/844] overflow-hidden rounded-[32px] bg-[#0d0b0a] p-[6px] shadow-[0_30px_60px_-30px_rgba(60,40,20,0.55)] ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-white">
        <Image src={src} alt={alt} fill unoptimized className="object-cover object-top" />
      </div>
    </div>
  );
}

export default async function Landing() {
  const [plans, settings, reviews, made] = await Promise.all([getPlans(), getSettings(), getShownReviews(), countSites()]);
  const cheapest = Math.min(...plans.filter((p) => p.price > 0).map((p) => p.price));
  const promoEnds = promoEnd(settings.promoEndsAt);
  const promoActive = isPromoActive(promoEnds);
  const order = (p?: Plan) => contactHref(settings, p ? `Halo Rayakan.my.id, saya tertarik paket ${p.name} (${rupiah(p.price)}). Boleh dibantu?` : GENERAL_ENQUIRY);
  const consult = contactHref(settings, "Halo Rayakan.my.id, saya mau konsultasi undangan digital.");
  const planCta = (p: Plan) => (p.id === "siap" ? { href: order(p), label: `Pesan ${p.name}`, external: true } : { href: "/buat", label: p.price ? `Mulai ${p.name}` : "Coba gratis sekarang", external: false });
  const portfolio = portfolioCards(settings).slice(0, 4);

  return (
    <div className="overflow-x-clip bg-rk-paper font-rk-sans text-rk-ink selection:bg-rk-sand selection:text-rk-ink">
      <JsonLd data={[organizationLd(settings.instagram ? [`https://instagram.com/${settings.instagram}`] : []), websiteLd(), serviceLd(plans), faqLd(FAQ)]} />
      <LandingNav orderHref={consult} overlay />

      <Hero tryHref="/buat" consultHref={consult} priceFrom={rupiah(cheapest)} />

      {/* ------------------------------ Pillars + trust ------------------------------ */}
      <section className="relative px-4 pb-6 pt-20 sm:px-6 lg:pt-28">
        <div className="mx-auto max-w-[1200px]">
          <Reveal variant="blur" className="text-center">
            <Eyebrow>Kenapa Rayakan.my.id</Eyebrow>
            <Title className="mx-auto mt-4 max-w-[760px] text-[clamp(38px,5.4vw,66px)]">Gampang dibuat, bebas diatur, cantik dilihat.</Title>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 100} className="flex gap-4 rounded-[24px] border border-rk-line/80 bg-[#fffdf9] p-5 sm:p-7 md:flex-col">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rk-ink text-[#f3d8a7]">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[18px] font-semibold">{title}</span>
                  <span className="mt-1.5 block text-[14px] leading-relaxed text-rk-ink/65">{body}</span>
                </span>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2.5 rounded-[22px] bg-[#efe7da] px-5 py-4 text-[13.5px] font-semibold text-rk-ink/80">
            {TRUST.map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-rk-bronze" /> {t}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ Theme catalogue ------------------------------ */}
      <section id="tema" className="relative scroll-mt-16 overflow-hidden px-4 py-20 sm:px-6 lg:py-28">
        <div className="pointer-events-none absolute left-[3%] top-14 hidden w-[130px] -rotate-12 lg:block xl:left-[6%]">
          <Bloom className="rk-sway h-auto w-full" />
        </div>
        <div className="relative mx-auto max-w-[1200px]">
          <Reveal variant="blur" className="text-center">
            <Eyebrow>{THEME_IDS.length} tema pilihan</Eyebrow>
            <Title className="mx-auto mt-4 max-w-[720px] text-[clamp(40px,5.5vw,68px)]">Satu tema untuk setiap momen.</Title>
            <p className="mx-auto mt-4 max-w-[560px] text-[15px] text-rk-ink/60">Elegan, adat, lukisan & ilustrasi, foto masa kecil, sampai pesta anak. Ketuk untuk melihat contohnya, lalu pakai dan atur sesukamu.</p>
          </Reveal>
          <div className="mt-10">
            <ThemeCatalog />
          </div>
          <p className="mt-10 text-center text-[13px] text-rk-mute">Semua tema bisa dipakai untuk acara apa pun, dan tiap bagian bisa diganti tata letaknya kapan saja.</p>
        </div>
      </section>

      <Features />

      {/* ------------------------------ Sections ------------------------------ */}
      <section className="relative overflow-hidden border-y border-rk-line/70 bg-[#fbf8f2] py-24 lg:py-32">
        <div className="pointer-events-none absolute -top-4 right-[3%] hidden w-[100px] rotate-[28deg] lg:block">
          <Branch className="rk-sway h-auto w-full" />
        </div>
        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal variant="blur" className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Eyebrow>Bukan template biasa</Eyebrow>
              <Title className="mt-4 max-w-[640px] text-[clamp(40px,5.5vw,68px)]">Setiap bagian dirancang seperti majalah.</Title>
            </div>
            <p className="max-w-[460px] text-pretty text-[15px] leading-relaxed text-rk-ink/60 lg:pb-2">Tipografi, jarak, dan animasi diatur dengan teliti. Kamu cukup mengisi, tampilannya tetap rapi di layar mana pun.</p>
          </Reveal>
        </div>
        <div className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:mx-auto lg:grid lg:max-w-[1200px] lg:grid-cols-6 lg:overflow-visible">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.src} delay={i * 80} variant="scale" className={`w-[58vw] max-w-[240px] shrink-0 snap-start lg:w-auto ${i % 2 ? "lg:mt-10" : ""}`}>
              <Phone src={s.src} alt={s.label} />
              <p className="mt-4 text-center text-[13px] text-rk-ink/60">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------ Portfolio + reviews ------------------------------ */}
      <section id="ulasan" className="relative scroll-mt-16 overflow-hidden bg-[#efe7da] px-4 py-24 sm:px-6 lg:py-32">
        <div className="rk-parallax pointer-events-none absolute left-[42%] top-14 hidden text-rk-bronze/45 lg:block">
          <Rings className="rk-float h-[110px] w-auto" />
        </div>
        <div className="relative mx-auto max-w-[1200px]">
          <Reveal variant="blur" className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>Portofolio & ulasan</Eyebrow>
              <Title className="mt-4 text-[clamp(44px,6.5vw,84px)]">
                Momen bahagia, <em className="text-rk-bronze">dirayakan.</em>
              </Title>
            </div>
            {reviews.length > 0 && <ReviewSummary reviews={reviews} made={made} />}
          </Reveal>
          <PortfolioGrid items={portfolio} fillTo={portfolio.length < 3 ? 3 : 4} ctaHref="/buat" className="mt-14" />
          {reviews.length > 0 && (
            <div className="mt-16">
              <ReviewGrid reviews={reviews.slice(0, 9)} />
            </div>
          )}
          <p className="mx-auto mt-10 flex max-w-[620px] items-start justify-center gap-2 text-center text-[13px] leading-relaxed text-rk-mute">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Sebagian besar undangan bersifat privat. Kami hanya menampilkan undangan yang sudah diizinkan pemiliknya.
          </p>
        </div>
      </section>

      {/* ------------------------------ Editor ------------------------------ */}
      <section className="px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-[1fr_0.8fr]">
          <Reveal variant="left">
            <Eyebrow>Edit dari HP</Eyebrow>
            <Title className="mt-4 text-[clamp(40px,5.5vw,68px)]">Ketuk bagian yang ingin diubah. Selesai.</Title>
            <ol className="mt-10 space-y-7">
              {[
                ["Langsung di atas desain", "Tidak ada formulir panjang. Kamu melihat undangannya sendiri, ketuk foto atau nama, lalu ubah di panel kecil."],
                ["Foto otomatis ringan", "Foto dari kamera HP diperkecil otomatis, jadi undangan tetap cepat dibuka tamu meski sinyal lemah."],
                ["Tema, ornamen, dan lagu", "Ganti tema kapan saja, pilih ornamen beranimasi, warna, logo inisial, dan lagu latar. Bagian yang tidak perlu bisa disembunyikan."],
                ["Tersimpan otomatis", "Setiap perubahan langsung tersimpan dan tampil di link yang sama."],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[44px_1fr] gap-4">
                  <span className="font-rk-display text-[34px] font-light leading-none text-rk-bronze/70">0{i + 1}</span>
                  <span>
                    <span className="block text-[17px] font-semibold">{t}</span>
                    <span className="mt-1.5 block text-[15px] leading-relaxed text-rk-ink/60">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Link prefetch={false} href="/buat" className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-rk-ink px-6 text-[14px] font-semibold text-white">
              Coba gratis sekarang <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal variant="right" delay={150} className="mx-auto w-full max-w-[320px]">
            <Phone src="/landing/editor-arya.webp" alt="Editor undangan di HP" />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ Guests ------------------------------ */}
      <section className="relative overflow-hidden border-y border-rk-line/70 bg-[#fbf8f2] px-4 py-24 sm:px-6 lg:py-32">
        <div className="pointer-events-none absolute -bottom-6 right-[2%] hidden w-[120px] lg:block">
          <Breath className="rk-sway h-auto w-full" />
        </div>
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-2">
          <Reveal variant="left" className="order-2 lg:order-1">
            <div className="mx-auto max-w-[420px] rounded-[28px] bg-[#e9e2d6] p-5">
              <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-rk-mute">WhatsApp</p>
              <div className="ml-auto mt-4 max-w-[330px] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-1.5 shadow-sm">
                <div className="overflow-hidden rounded-xl bg-white/70">
                  <div className="relative aspect-[1.91/1]">
                    <Image src="/demo/afdal/og.jpg" alt="" fill sizes="330px" className="object-cover" />
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-[13px] font-semibold">The Wedding of Afdal &amp; Putri</p>
                    <p className="text-[12px] text-[#667781]">Kepada Yth. Keluarga Wijaya · Sabtu, 4 Juli 2026</p>
                  </div>
                </div>
                <p className="px-2 pb-1 pt-2 text-[13px] leading-relaxed">
                  Kepada Yth.
                  <br />
                  <b>Keluarga Wijaya</b>
                  <br />
                  <br />
                  Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami…
                </p>
                <p className="px-2 pb-1 text-right text-[10px] text-[#667781]">09.41 ✓✓</p>
              </div>
            </div>
          </Reveal>
          <Reveal variant="right" delay={120} className="order-1 lg:order-2">
            <Eyebrow>Kelola tamu</Eyebrow>
            <Title className="mt-4 text-[clamp(40px,5.5vw,68px)]">Setiap tamu disapa dengan namanya.</Title>
            <ul className="mt-9 space-y-4 text-[15px]">
              {[
                "Tambah tamu satu per satu, tempel banyak nama, atau import dari Excel",
                "Link khusus per tamu, nama tampil di sampul undangan",
                "Kirim lewat WhatsApp sekali ketuk, status terkirim tercatat",
                "Rekap hadir / tidak hadir dan semua ucapan di satu tempat",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-rk-bronze" />
                  <span className="leading-relaxed text-rk-ink/75">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ Steps ------------------------------ */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
        <div className="rk-parallax pointer-events-none absolute right-[6%] top-20 hidden text-rk-bronze/45 md:block">
          <Envelope className="rk-float h-[120px] w-auto" />
        </div>
        <div className="relative mx-auto max-w-[1200px]">
          <Reveal variant="blur">
            <Eyebrow>Cara pesan</Eyebrow>
            <Title className="mt-4 max-w-[640px] text-[clamp(40px,5.5vw,68px)]">Coba dulu, bayar saat siap disebar.</Title>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              ["Pilih tema & coba gratis", "Pilih acara dan tema, isi nama dan tanggal. Undangan kamu langsung tampil, tanpa daftar akun."],
              ["Atur & simpan draf", "Ganti foto, teks, warna, ornamen, dan tata letak dari HP. Simpan draf dengan nama dan nomor WhatsApp."],
              ["Kirim ke admin & bagikan", "Pilih Edit Sendiri atau Siap Pakai. Setelah pembayaran dikonfirmasi, undangan terbit dan aktif selamanya."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 100} className="rounded-[26px] border border-rk-line/80 bg-[#fffdf9] p-7 sm:p-9">
                <span className="font-rk-display text-[64px] font-light leading-none text-rk-bronze/70">{i + 1}</span>
                <p className="mt-6 text-[19px] font-semibold">{t}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-rk-ink/60">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Pricing ------------------------------ */}
      <section id="harga" className="relative scroll-mt-16 overflow-hidden bg-[#efe7da] px-4 py-24 sm:px-6 lg:py-32">
        <div className="pointer-events-none absolute -left-2 top-10 hidden w-[100px] -rotate-[24deg] lg:block xl:left-[4%]">
          <Branch className="rk-sway h-auto w-full -scale-x-100" />
        </div>
        <div className="relative mx-auto max-w-[1200px]">
          <Reveal variant="blur" className="text-center">
            <Eyebrow>Harga</Eyebrow>
            <Title className="mt-4 text-[clamp(40px,6vw,76px)]">Sekali bayar, aktif selamanya.</Title>
            <p className="mx-auto mt-4 max-w-[540px] text-[15px] text-rk-ink/60">Semua tema dan fitur sama di setiap paket. Bedanya hanya siapa yang menyusun undangannya.</p>
          </Reveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.id} delay={i * 90} className={`relative flex flex-col rounded-[28px] p-7 ${p.highlight ? "bg-rk-ink text-rk-ivory shadow-[0_40px_80px_-40px_rgba(18,13,16,0.8)] lg:-my-4 lg:py-11" : "border border-rk-line bg-[#fffdf9]"}`}>
                {p.highlight && <span className="absolute right-6 top-6 rounded-full bg-rk-sand px-3 py-1 text-[11px] font-bold text-rk-ink">Paling hemat</span>}
                <p className="font-rk-display text-[38px] font-light leading-none tracking-[-0.02em]">{p.name}</p>
                <p className={`mt-2 text-[14px] ${p.highlight ? "text-rk-ivory/60" : "text-rk-mute"}`}>{p.tagline}</p>
                <div className="mt-7">
                  {promoActive && p.normalPrice > p.price && <p className={`text-[14px] line-through ${p.highlight ? "text-rk-ivory/40" : "text-rk-mute"}`}>{rupiah(p.normalPrice)}</p>}
                  <p className="text-[42px] font-semibold leading-none tracking-tight">{p.price === 0 ? "Gratis" : rupiah(promoActive ? p.price : p.normalPrice)}</p>
                  <p className={`mt-2 text-[13px] ${p.highlight ? "text-rk-ivory/60" : "text-rk-mute"}`}>{p.price === 0 ? "Simpan sebagai draf" : `Aktif ${activeLabel(p).toLowerCase()}`}</p>
                </div>
                <ul className="mt-7 flex-1 space-y-3 text-[14px]">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.highlight ? "text-rk-sand" : "text-rk-bronze"}`} />
                      <span className={p.highlight ? "text-rk-ivory/85" : "text-rk-ink/80"}>{b}</span>
                    </li>
                  ))}
                </ul>
                {(() => {
                  const cta = planCta(p);
                  const cls = `mt-8 inline-flex h-12 items-center justify-center rounded-full text-[14px] font-semibold transition ${p.highlight ? "bg-rk-sand text-rk-ink hover:bg-rk-ivory" : "bg-rk-ink text-white hover:bg-rk-plum"}`;
                  return cta.external ? (
                    <a href={cta.href} target="_blank" rel="noreferrer" className={cls}>
                      {cta.label}
                    </a>
                  ) : (
                    <Link prefetch={false} href={cta.href} className={cls}>
                      {cta.label}
                    </Link>
                  );
                })()}
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center text-[13px] text-rk-mute">
            Pembayaran via transfer bank / e-wallet setelah admin membalas. Bingung pilih yang mana?{" "}
            <a href={consult} target="_blank" rel="noreferrer" className="font-semibold text-rk-ink underline underline-offset-4">
              Konsultasi gratis
            </a>
            .
          </p>
        </div>
      </section>

      {/* ------------------------------ FAQ ------------------------------ */}
      <section id="faq" className="relative scroll-mt-16 overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
        <div className="pointer-events-none absolute -left-8 bottom-6 hidden w-[140px] rotate-[18deg] lg:block">
          <Bloom className="rk-sway h-auto w-full" />
        </div>
        <div className="relative mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal variant="blur">
            <Eyebrow>Pertanyaan</Eyebrow>
            <Title className="mt-4 text-[clamp(40px,5.5vw,68px)]">Yang sering ditanyakan.</Title>
            <p className="mt-5 max-w-[340px] text-[15px] leading-relaxed text-rk-ink/60">
              Masih ada pertanyaan?{" "}
              <a href={consult} target="_blank" rel="noreferrer" className="text-rk-ink underline underline-offset-4">
                Chat kami di WhatsApp
              </a>
              .
            </p>
          </Reveal>
          <div className="divide-y divide-rk-line border-y border-rk-line">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
                  {q}
                  <Plus className="h-5 w-5 shrink-0 text-rk-bronze transition duration-300 group-open:rotate-45" />
                </summary>
                <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-rk-ink/65">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ CTA + footer ------------------------------ */}
      <section className="px-4 sm:px-6">
        <Reveal variant="scale" className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[32px]">
          <Image src="/demo/afdal/closing.webp" alt="" fill sizes="1200px" className="rk-zoom-in object-cover object-[center_40%]" />
          <div className="absolute inset-0 bg-[#1d1714]/65" />
          <div className="relative px-6 py-20 text-center text-white sm:py-28">
            <h2 className="mx-auto max-w-[760px] font-rk-display text-[clamp(42px,6.5vw,84px)] font-light leading-[1] tracking-[-0.02em]">Siap merayakan momenmu?</h2>
            <p className="mx-auto mt-5 max-w-[440px] text-[15px] text-white/75">Coba gratis sekarang. Undanganmu langsung jadi, dan baru bayar saat siap disebar.</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link prefetch={false} href="/buat" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-rk-ink">
                <Heart className="h-4 w-4" /> Coba gratis
              </Link>
              <a href={consult} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-full border border-white/35 px-7 text-[15px] font-semibold">
                Konsultasi sekarang
              </a>
            </div>
          </div>
        </Reveal>
      </section>
      <LandingFooter settings={settings} orderHref={consult} />
    </div>
  );
}
