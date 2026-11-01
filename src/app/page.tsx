import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Plus } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { activeLabel, rupiah, THEMES, type Plan } from "@/lib/content";
import { getPlans, getSettings, type AppSettings } from "@/lib/server/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Rayakan.my.id · Website Undangan Pernikahan Premium",
  description: "Undangan pernikahan digital dengan desain premium yang tidak terlihat template. Ubah sendiri dari HP, kirim ke tamu dengan nama masing-masing, RSVP & amplop digital. Mulai Rp79rb.",
  openGraph: {
    title: "Rayakan.my.id · Desain premium untuk momen bahagiamu",
    description: "Website undangan pernikahan yang bisa kamu ubah sendiri dari HP.",
    images: [{ url: "/landing/hero-desktop.webp", width: 1600, height: 1000 }],
    locale: "id_ID",
    type: "website",
  },
};

function wa(settings: AppSettings, text: string) {
  const n = settings.adminWhatsapp || "";
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : `https://instagram.com/${settings.instagram}`;
}

function Phone({ src, alt, className = "", priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <div className={`relative aspect-[390/844] overflow-hidden rounded-[34px] bg-black p-[7px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/10 ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-[28px]">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 320px, 60vw" className="object-cover object-top" priority={priority} />
      </div>
      <span className="absolute left-1/2 top-[14px] h-[18px] w-[70px] -translate-x-1/2 rounded-full bg-black" />
    </div>
  );
}

const SHOWCASE = [
  { src: "/landing/sec-invitation.webp", label: "Profil mempelai" },
  { src: "/landing/sec-date.webp", label: "Hitung mundur" },
  { src: "/landing/sec-story.webp", label: "Kisah cinta" },
  { src: "/landing/sec-memories.webp", label: "Galeri foto" },
  { src: "/landing/sec-venue.webp", label: "Lokasi & jadwal" },
  { src: "/landing/sec-gift.webp", label: "Amplop digital" },
];

const FAQ = [
  ["Berapa lama undangan bisa jadi?", "Begitu pembayaran dikonfirmasi, kamu langsung dapat akses editor. Kebanyakan pasangan selesai mengisi dalam 15–30 menit. Paket Eksklusif kami isikan untukmu."],
  ["Apakah perlu install aplikasi?", "Tidak. Editor dibuka dari browser HP atau laptop. Cukup ketuk bagian undangan, ganti foto dan teks, semuanya tersimpan otomatis."],
  ["Bisa diubah setelah dibagikan?", "Bisa, kapan saja selama masa aktif. Link undangan tetap sama, jadi tamu langsung melihat versi terbaru."],
  ["Bagaimana mengirim ke tamu dengan nama masing-masing?", "Masukkan daftar tamu (atau import dari Excel), lalu tekan tombol WhatsApp di samping nama. Pesan dan link berisi nama tamu sudah otomatis terisi."],
  ["Apakah cocok untuk pernikahan non-muslim?", "Cocok. Kaligrafi dan ayat bisa dimatikan atau diganti dengan kutipan lain, misalnya ayat Alkitab atau kutipan favorit kalian."],
  ["Bagaimana cara bayar?", "Pilih paket lalu chat kami di WhatsApp. Pembayaran lewat transfer bank atau e-wallet, undangan aktif setelah dikonfirmasi."],
  ["Apa yang terjadi setelah masa aktif habis?", "Undangan tidak lagi bisa dibuka tamu, dan bisa diperpanjang kapan saja. Paket Eksklusif aktif selamanya."],
];

/** Promo runs until the end of `endsAt` (WIB). No end date means always on. */
function promoEnd(endsAt: string) {
  return endsAt ? new Date(`${endsAt}T23:59:59+07:00`) : null;
}
function isPromoActive(end: Date | null, now = new Date()) {
  return !end || end.getTime() > now.getTime();
}

export default async function Landing() {
  const [plans, settings] = await Promise.all([getPlans(), getSettings()]);
  const cheapest = Math.min(...plans.map((p) => p.price));
  const promoEnds = promoEnd(settings.promoEndsAt);
  const promoActive = isPromoActive(promoEnds);
  const orderText = (p?: Plan) => (p ? `Halo Rayakan.my.id, saya tertarik paket ${p.name} (${rupiah(p.price)}). Boleh dibantu?` : "Halo Rayakan.my.id, saya ingin tanya-tanya soal undangan digital.");

  return (
    <div className="bg-rk-ink font-rk-sans text-rk-ivory selection:bg-rk-sand selection:text-rk-ink">
      {/* ------------------------------ Nav ------------------------------ */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-rk-ink/75 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" priority />
            <span className="font-rk-serif text-[21px] leading-none">Rayakan.my.id</span>
          </Link>
          <div className="ml-auto hidden items-center gap-7 text-[14px] text-rk-ivory/70 md:flex">
            <a href="#tema" className="hover:text-rk-ivory">Tema</a>
            <a href="#fitur" className="hover:text-rk-ivory">Fitur</a>
            <a href="#harga" className="hover:text-rk-ivory">Harga</a>
            <a href="#faq" className="hover:text-rk-ivory">FAQ</a>
          </div>
          <a href={wa(settings, orderText())} target="_blank" rel="noreferrer" className="ml-auto rounded-full bg-rk-ivory px-4 py-2 text-[13px] font-bold text-rk-ink transition hover:bg-rk-sand md:ml-0">
            Pesan sekarang
          </a>
        </nav>
      </header>

      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_75%_30%,rgba(243,216,167,0.10),transparent_70%)]" />
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-28 lg:pt-20">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[3px] text-rk-sand">Website undangan pernikahan</p>
            <h1 className="mt-5 font-rk-serif text-[clamp(46px,7.4vw,92px)] leading-[0.95] tracking-[-0.01em]">
              Desain premium untuk <em className="text-rk-sand">momen bahagiamu.</em>
            </h1>
            <p className="mt-6 max-w-[500px] text-[16px] leading-relaxed text-rk-ivory/70 sm:text-[17px]">
              Undangan yang tidak terlihat seperti template, dan bisa kamu ubah sendiri dari HP. Ganti foto, teks, warna, sampai lagu, lalu kirim ke setiap tamu dengan namanya.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/demo" className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-rk-sand px-7 text-[15px] font-bold text-rk-ink transition hover:bg-rk-ivory">
                Lihat contoh undangan <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/demo/admin" className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/20 px-7 text-[15px] font-semibold transition hover:border-white/50">
                Coba editornya
              </Link>
            </div>
            <p className="mt-6 text-[13px] text-rk-ivory/50">
              Mulai {rupiah(cheapest)} · tanpa aplikasi · bisa diubah kapan saja
            </p>
          </Reveal>
          <Reveal delay={150} className="relative mx-auto mb-10 w-full max-w-[560px]">
            <div className="relative aspect-[16/10] w-[88%] overflow-hidden rounded-[14px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
              <Image src="/landing/hero-desktop.webp" alt="Contoh undangan di laptop" fill sizes="(min-width: 1024px) 500px, 85vw" className="object-cover" priority />
            </div>
            <div className="absolute -bottom-10 right-0 w-[38%]">
              <Phone src="/landing/hero-mobile.webp" alt="Contoh undangan di HP" priority />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ Promises ------------------------------ */}
      <section className="border-y border-white/[0.07]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-px bg-white/[0.07] lg:grid-cols-4">
          {[
            ["Tampil rapi di HP & laptop", "Foto utama berbeda untuk layar HP dan laptop."],
            ["Ubah sendiri tanpa coding", "Ketuk bagian undangan, ganti, otomatis tersimpan."],
            ["Link nama per tamu", "Kirim lewat WhatsApp sekali ketuk."],
            ["RSVP & amplop digital", "Rekap kehadiran dan ucapan otomatis."],
          ].map(([t, d]) => (
            <div key={t} className="bg-rk-ink px-4 py-7 sm:px-6">
              <p className="text-[15px] font-semibold">{t}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-rk-ivory/55">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------ Showcase ------------------------------ */}
      <section id="tema" className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[3px] text-rk-sand">Bukan template biasa</p>
              <h2 className="mt-4 max-w-[640px] font-rk-serif text-[clamp(38px,5vw,64px)] leading-[1]">Setiap bagian dirancang seperti majalah, bukan formulir.</h2>
            </div>
            <p className="max-w-[380px] text-[15px] leading-relaxed text-rk-ivory/60">Tipografi, jarak, dan animasi diatur dengan teliti. Kamu cukup mengisi, tampilannya tetap rapi di layar mana pun.</p>
          </Reveal>
        </div>
        <div className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:mx-auto lg:max-w-[1200px] lg:grid lg:grid-cols-6 lg:overflow-visible">
          {SHOWCASE.map((s, i) => (
            <Reveal key={s.src} delay={i * 70} className="w-[62vw] max-w-[260px] shrink-0 snap-start lg:w-auto">
              <Phone src={s.src} alt={s.label} />
              <p className="mt-4 text-center text-[13px] text-rk-ivory/60">{s.label}</p>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2">
            {Object.values(THEMES).map((t, i) => (
              <Reveal key={t.id} delay={i * 120} className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={t.preview.desktop} alt={`Tema ${t.name}`} fill sizes="(min-width: 768px) 560px, 92vw" className="object-cover object-top transition duration-700 group-hover:scale-[1.03]" />
                </div>
                <div className="flex items-center justify-between gap-4 p-6">
                  <div className="min-w-0">
                    <p className="font-rk-serif text-[30px] leading-none">{t.name}</p>
                    <p className="mt-2 text-[13px] text-rk-ivory/55">
                      {t.tagline} · {Object.keys(t.palettes).length} pilihan warna
                    </p>
                    <div className="mt-3 flex gap-1.5" aria-hidden="true">
                      {Object.values(t.palettes).map((p) => (
                        <span key={p.name} className="h-3.5 w-3.5 rounded-full ring-1 ring-white/20" style={{ background: p.accent }} />
                      ))}
                    </div>
                  </div>
                  <Link href={`/tema/${t.id}`} className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-rk-ivory px-5 text-[13px] font-bold text-rk-ink">
                    Lihat demo <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-[13px] text-rk-ivory/50">Tema bisa diganti kapan saja tanpa mengisi ulang. Pemilik paket Eksklusif otomatis mendapat setiap tema baru.</p>
        </div>
      </section>

      {/* ------------------------------ Editor ------------------------------ */}
      <section id="fitur" className="bg-rk-ivory py-24 text-rk-ink lg:py-32">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[3px] text-rk-mute">Edit dari HP</p>
            <h2 className="mt-4 font-rk-serif text-[clamp(38px,5vw,64px)] leading-[1]">Ketuk bagian yang ingin diubah. Selesai.</h2>
            <ol className="mt-10 space-y-7">
              {[
                ["Langsung di atas desain", "Tidak ada formulir panjang. Kamu melihat undangannya sendiri, ketuk foto atau nama, lalu ubah di panel kecil."],
                ["Foto otomatis ringan", "Foto dari kamera HP diperkecil otomatis, jadi undangan tetap cepat dibuka tamu meski sinyal lemah."],
                ["Warna, logo, dan lagu", "Pilih palet warna, logo inisial nama kalian, dan lagu latar. Bagian yang tidak perlu bisa disembunyikan."],
                ["Tersimpan otomatis", "Setiap perubahan langsung tersimpan dan tampil di link yang sama."],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[40px_1fr] gap-4">
                  <span className="font-rk-serif text-[30px] leading-none text-rk-mute">0{i + 1}</span>
                  <span>
                    <span className="block text-[17px] font-semibold">{t}</span>
                    <span className="mt-1.5 block text-[15px] leading-relaxed text-rk-mute">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Link href="/demo/admin" className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-rk-ink px-6 text-[14px] font-bold text-white">
              Coba editornya sekarang <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={150} className="mx-auto w-full max-w-[340px]">
            <Phone src="/landing/editor-mobile.webp" alt="Editor undangan di HP" />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ Guests ------------------------------ */}
      <section className="bg-rk-cream py-24 text-rk-ink lg:py-32">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <div className="mx-auto max-w-[420px] rounded-[28px] bg-[#e9e2d6] p-5">
              <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-rk-mute">WhatsApp</p>
              <div className="ml-auto mt-4 max-w-[330px] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-1.5 shadow-sm">
                <div className="overflow-hidden rounded-xl bg-white/70">
                  <div className="relative aspect-[1.91/1]">
                    <Image src="/demo/arya/og.jpg" alt="" fill sizes="330px" className="object-cover" />
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-[13px] font-semibold">The Wedding of Arya &amp; Almalia</p>
                    <p className="text-[12px] text-[#667781]">Kepada Yth. Keluarga Wijaya · Minggu, 15 November 2026</p>
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
          <Reveal delay={120} className="order-1 lg:order-2">
            <p className="text-[12px] font-semibold uppercase tracking-[3px] text-rk-mute">Kelola tamu</p>
            <h2 className="mt-4 font-rk-serif text-[clamp(38px,5vw,64px)] leading-[1]">Setiap tamu disapa dengan namanya.</h2>
            <ul className="mt-9 space-y-4 text-[15px]">
              {[
                "Tambah tamu satu per satu, tempel banyak nama, atau import dari Excel",
                "Link khusus per tamu, nama tampil di sampul undangan",
                "Kirim lewat WhatsApp sekali ketuk, status terkirim tercatat",
                "Rekap hadir / tidak hadir dan semua ucapan di satu tempat",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0" />
                  <span className="leading-relaxed text-rk-ink/80">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ Steps ------------------------------ */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[3px] text-rk-sand">Cara pesan</p>
            <h2 className="mt-4 max-w-[640px] font-rk-serif text-[clamp(38px,5vw,64px)] leading-[1]">Tiga langkah, undangan siap dibagikan.</h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              ["Pilih paket", "Chat kami di WhatsApp. Kamu langsung mendapat link editor dan password."],
              ["Isi undangan", "Ganti foto dan teks dari HP. Di paket Eksklusif, tim kami yang mengisikan."],
              ["Terbitkan & bagikan", "Setelah pembayaran dikonfirmasi, undangan aktif. Kirim ke tamu lewat WhatsApp."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 100} className="bg-rk-ink p-7 sm:p-9">
                <span className="font-rk-serif text-[56px] leading-none text-rk-sand/80">{i + 1}</span>
                <p className="mt-6 text-[19px] font-semibold">{t}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-rk-ivory/60">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Pricing ------------------------------ */}
      <section id="harga" className="bg-rk-ivory py-24 text-rk-ink lg:py-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Reveal className="text-center">
            {promoActive && settings.promoLabel && (
              <p className="mx-auto inline-flex rounded-full bg-rk-ink px-4 py-1.5 text-[12px] font-bold text-rk-sand">
                {settings.promoLabel}
                {promoEnds ? ` · berakhir ${promoEnds.toLocaleDateString("id-ID", { day: "numeric", month: "long" })}` : ""}
              </p>
            )}
            <h2 className="mt-5 font-rk-serif text-[clamp(40px,5.5vw,68px)] leading-[1]">Satu kali bayar. Tanpa biaya bulanan.</h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[15px] text-rk-mute">Semua paket memakai desain yang sama premiumnya. Bedanya ada di fitur dan masa aktif.</p>
          </Reveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.id} delay={i * 90} className={`relative flex flex-col rounded-[28px] p-7 ${p.highlight ? "bg-rk-ink text-rk-ivory shadow-[0_40px_80px_-40px_rgba(18,13,16,0.8)] lg:-my-4 lg:py-11" : "border border-rk-line bg-white"}`}>
                {p.highlight && <span className="absolute right-6 top-6 rounded-full bg-rk-sand px-3 py-1 text-[11px] font-bold text-rk-ink">Paling laris</span>}
                <p className="font-rk-serif text-[34px] leading-none">{p.name}</p>
                <p className={`mt-2 text-[14px] ${p.highlight ? "text-rk-ivory/60" : "text-rk-mute"}`}>{p.tagline}</p>
                <div className="mt-7">
                  {promoActive && p.normalPrice > p.price && <p className={`text-[14px] line-through ${p.highlight ? "text-rk-ivory/40" : "text-rk-mute"}`}>{rupiah(p.normalPrice)}</p>}
                  <p className="text-[42px] font-semibold leading-none tracking-tight">{rupiah(promoActive ? p.price : p.normalPrice)}</p>
                  <p className={`mt-2 text-[13px] ${p.highlight ? "text-rk-ivory/60" : "text-rk-mute"}`}>Aktif {activeLabel(p).toLowerCase()}</p>
                </div>
                <ul className="mt-7 flex-1 space-y-3 text-[14px]">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.highlight ? "text-rk-sand" : ""}`} />
                      <span className={p.highlight ? "text-rk-ivory/85" : "text-rk-ink/80"}>{b}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={wa(settings, orderText(p))}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-8 inline-flex h-12 items-center justify-center rounded-full text-[14px] font-bold transition ${p.highlight ? "bg-rk-sand text-rk-ink hover:bg-rk-ivory" : "bg-rk-ink text-white hover:bg-rk-plum"}`}
                >
                  Pesan {p.name}
                </a>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center text-[13px] text-rk-mute">Pembayaran via transfer bank / e-wallet. Ingin lihat dulu? <Link href="/demo/admin" className="font-semibold text-rk-ink underline underline-offset-4">Coba editornya gratis</Link>.</p>
        </div>
      </section>

      {/* ------------------------------ FAQ ------------------------------ */}
      <section id="faq" className="py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[3px] text-rk-sand">Pertanyaan</p>
            <h2 className="mt-4 font-rk-serif text-[clamp(38px,5vw,64px)] leading-[1]">Yang sering ditanyakan.</h2>
            <p className="mt-5 max-w-[340px] text-[15px] leading-relaxed text-rk-ivory/60">
              Masih ada pertanyaan?{" "}
              <a href={wa(settings, orderText())} target="_blank" rel="noreferrer" className="text-rk-ivory underline underline-offset-4">
                Chat kami di WhatsApp
              </a>
              .
            </p>
          </Reveal>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
                  {q}
                  <Plus className="h-5 w-5 shrink-0 text-rk-sand transition duration-300 group-open:rotate-45" />
                </summary>
                <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-rk-ivory/65">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ CTA + footer ------------------------------ */}
      <section className="px-4 pb-10 sm:px-6">
        <Reveal className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[32px]">
          <Image src="/demo/arya/g-8721.jpg" alt="" fill sizes="1200px" className="object-cover object-[center_35%]" />
          <div className="absolute inset-0 bg-rk-ink/75" />
          <div className="relative px-6 py-20 text-center sm:py-28">
            <h2 className="mx-auto max-w-[760px] font-rk-serif text-[clamp(40px,6vw,76px)] leading-[0.98]">Setiap momen layak dirayakan.</h2>
            <p className="mx-auto mt-5 max-w-[440px] text-[15px] text-rk-ivory/70">Buat undangan yang akan diingat tamu, dan tetap mudah kamu kelola sendiri.</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={wa(settings, orderText())} target="_blank" rel="noreferrer" className="inline-flex h-13 items-center justify-center rounded-full bg-rk-sand px-7 text-[15px] font-bold text-rk-ink">
                Pesan via WhatsApp
              </a>
              <Link href="/demo" className="inline-flex h-13 items-center justify-center rounded-full border border-white/25 px-7 text-[15px] font-semibold">
                Lihat contoh
              </Link>
            </div>
          </div>
        </Reveal>
        <footer className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 pt-10 text-[13px] text-rk-ivory/50 sm:flex-row">
          <span className="flex items-center gap-2">
            <Image src="/brand/logo.png" alt="" width={22} height={18} className="h-4 w-auto" /> © {new Date().getFullYear()} Rayakan.my.id
          </span>
          <span className="flex gap-6">
            <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" className="hover:text-rk-ivory">
              Instagram
            </a>
            <a href={wa(settings, orderText())} target="_blank" rel="noreferrer" className="hover:text-rk-ivory">
              WhatsApp
            </a>
          </span>
        </footer>
      </section>
    </div>
  );
}
