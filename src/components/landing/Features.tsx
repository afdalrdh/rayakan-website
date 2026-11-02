import { CalendarDays, Check, Heart, ImageIcon, Lock, MessageCircleHeart, Palette, Pencil, Play, Send, Smartphone, User, Users, Globe2 } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Eyebrow, Title } from "./chrome";
import { Lily } from "./illustrations";
import { InView, Reveal } from "./Reveal";

/*
 * "Fitur" section. Each card pairs copy with a small illustration built from
 * HTML/CSS (no images except one reused hero screenshot), animated with CSS only:
 * elements settle in when the card enters the viewport (group-data-[in=true])
 * and keep a gentle idle motion. Cheap to load, smooth to scroll.
 */

const ease = "transition-all duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)]";

function Card({ icon, title, body, art, delay }: { icon: ReactNode; title: string; body: string; art: ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <InView className="relative flex h-full flex-row items-center gap-3 overflow-hidden rounded-[24px] border border-[#efe2cf] bg-linear-to-br from-[#fffdf9] to-[#fbf3e8] p-5 shadow-[0_24px_50px_-36px_rgba(120,80,40,0.35)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(120,80,40,0.4)] sm:gap-5 sm:rounded-[28px] sm:p-7 xl:gap-3 xl:p-6 min-[1440px]:p-7">
        <div className="relative z-10 w-[55%] shrink-0 sm:w-[50%] xl:w-[47%]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6e9d6] text-[#8b6b43] sm:h-12 sm:w-12 [&_svg]:h-[18px] [&_svg]:w-[18px] sm:[&_svg]:h-5 sm:[&_svg]:w-5">{icon}</span>
          <h3 className="mt-4 font-rk-display text-[22px] font-light leading-[1.05] tracking-[-0.02em] sm:mt-5 sm:text-[26px] lg:text-[24px] xl:text-[26px]">{title}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-rk-ink/65 sm:mt-3 sm:text-[14.5px] lg:text-[13.5px] xl:text-[14.5px]">{body}</p>
        </div>
        {/*
          The illustration is drawn on a fixed 210px stage and scaled down in
          steps when the space is narrower (container queries), so it always
          keeps its padding on the right instead of being cut off.
        */}
        <div className="@container relative flex min-h-[130px] min-w-0 flex-1 items-center justify-center self-stretch sm:min-h-[170px]">
          <span className="absolute h-[60%] max-h-[150px] w-auto aspect-square rounded-full bg-[radial-gradient(circle,#f6e6cf,transparent_70%)]" />
          <div className="flex w-[210px] shrink-0 origin-center items-center justify-center @max-[209px]:scale-[0.9] @max-[189px]:scale-[0.8] @max-[169px]:scale-[0.7] @max-[149px]:scale-[0.62] @max-[134px]:scale-[0.56] @max-[119px]:scale-[0.5]">
            {art}
          </div>
        </div>
      </InView>
    </Reveal>
  );
}

/* ---------- illustrations ---------- */

/** Mini editor card: a photo with "Ganti foto", a name field being edited, and a saved badge. */
function EditArt() {
  return (
    <div className="relative w-full max-w-[176px]">
      <div className={`${ease} w-full rotate-2 translate-y-6 rounded-2xl border border-[#efe2cf] bg-white p-2.5 opacity-0 shadow-[0_18px_34px_-18px_rgba(80,50,20,0.45)] group-data-[in=true]:translate-y-0 group-data-[in=true]:opacity-100`}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
          <Image src="/landing/afdal-desktop.webp" alt="" fill unoptimized className="object-cover object-[30%_30%]" />
          <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded-full bg-[#1d1714]/85 px-2 py-0.5 text-[9.5px] font-semibold text-white">
            <ImageIcon className="h-2.5 w-2.5" /> Ganti foto
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-[#e8d9c2] px-2.5 py-1.5 text-[11.5px] font-medium">
          <span className="truncate border-r border-rk-ink/60 pr-0.5">Afdal &amp; Putri</span>
          <Pencil className="ml-auto h-3 w-3 text-[#8b6b43]" />
        </div>
      </div>
      <span
        style={{ transitionDelay: "450ms" }}
        className={`${ease} absolute -left-3 -top-3 inline-flex scale-90 items-center gap-1 rounded-full border border-[#efe2cf] bg-white px-2.5 py-1 text-[10px] font-semibold text-emerald-700 opacity-0 shadow-[0_10px_20px_-12px_rgba(80,50,20,0.5)] group-data-[in=true]:scale-100 group-data-[in=true]:opacity-100`}
      >
        <Check className="h-3 w-3" /> Tersimpan
      </span>
    </div>
  );
}

function GuestsArt() {
  const rows = ["Kel. Wijaya", "Rina & Bagus", "Budi Santoso"];
  return (
    <div className="relative w-full max-w-[200px] space-y-2.5">
      <span className="rk-twinkle absolute right-1 -top-5 text-[#c9a46a]">✦</span>
      {rows.map((r, i) => (
        <div
          key={r}
          style={{ transitionDelay: `${150 + i * 140}ms` }}
          className={`${ease} flex translate-x-8 items-center gap-2.5 rounded-full border border-[#efe2cf] bg-white px-3 py-2 text-[12.5px] opacity-0 shadow-[0_10px_20px_-14px_rgba(80,50,20,0.4)] group-data-[in=true]:translate-x-0 group-data-[in=true]:opacity-100 ${i === 0 ? "-rotate-2" : ""}`}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f6e9d6] text-[#8b6b43]">
            <User className="h-3.5 w-3.5" />
          </span>
          <span className="min-w-0 truncate">{r}</span>
          {i === 0 && <Send className="ml-auto h-3.5 w-3.5 shrink-0 text-[#8b6b43]" />}
        </div>
      ))}
    </div>
  );
}

function ScheduleArt() {
  return (
    <div className={`${ease} w-full max-w-[170px] translate-y-6 rounded-2xl border border-[#efe2cf] bg-white p-4 opacity-0 shadow-[0_18px_34px_-18px_rgba(80,50,20,0.45)] group-data-[in=true]:translate-y-0 group-data-[in=true]:opacity-100`}>
      <ol className="relative space-y-4 border-l border-[#d8c3a2] pl-4">
        {[
          ["08.00 WIB", "Akad Nikah"],
          ["11.00 WIB", "Resepsi"],
        ].map(([t, n], i) => (
          <li key={t} className="relative" style={{ transitionDelay: `${300 + i * 200}ms` }}>
            <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#8b6b43] ring-4 ring-[#f6e9d6]" />
            <p className="text-[10.5px] tracking-wide text-rk-mute">{t}</p>
            <p className="text-[14px] font-semibold">{n}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function RsvpArt() {
  return (
    <div className="relative w-full max-w-[172px]">
      <div className={`${ease} w-full -rotate-3 translate-y-6 rounded-2xl border border-[#efe2cf] bg-white p-4 opacity-0 shadow-[0_18px_34px_-18px_rgba(80,50,20,0.45)] group-data-[in=true]:translate-y-0 group-data-[in=true]:opacity-100`}>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6e9d6]">
            <Heart className="h-3.5 w-3.5 fill-[#c08a5b] text-[#c08a5b]" />
          </span>
          <span className="h-2 flex-1 rounded-full bg-[#eadfcf]" />
        </div>
        <span className="mt-3 block h-2 w-[85%] rounded-full bg-[#f0e7da]" />
        <span className="mt-2 block h-2 w-[60%] rounded-full bg-[#f0e7da]" />
        <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Hadir</span>
      </div>
      {[0, 1, 2].map((i) => (
        <Heart key={i} className="rk-rise absolute h-3.5 w-3.5 fill-[#d79a8a] text-[#d79a8a]" style={{ right: `${6 + i * 18}px`, bottom: "6px", animationDelay: `${i * 1.1}s` }} />
      ))}
    </div>
  );
}

function UrlArt() {
  return (
    <div className={`${ease} w-full max-w-[216px] translate-y-6 overflow-hidden rounded-2xl border border-[#efe2cf] bg-[#fbf5ec] opacity-0 shadow-[0_18px_34px_-18px_rgba(80,50,20,0.45)] group-data-[in=true]:translate-y-0 group-data-[in=true]:opacity-100`}>
      <div className="flex items-center gap-1.5 px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[#e6a57e]" />
        <span className="h-2 w-2 rounded-full bg-[#e8cf7d]" />
        <span className="h-2 w-2 rounded-full bg-[#a9c08a]" />
      </div>
      <div className="mx-3 mb-3 flex items-center gap-2 rounded-xl bg-white px-2.5 py-2.5 text-[10px] font-medium shadow-sm">
        <Lock className="h-3 w-3 shrink-0 text-[#8b6b43]" />
        <span className="w-0 max-w-full overflow-hidden whitespace-nowrap border-r border-rk-ink/60 pr-0.5 group-data-[in=true]:rk-type">rayakan.my.id/afdal-putri</span>
      </div>
    </div>
  );
}

function PaletteArt() {
  const sw = ["#6b2f2f", "#5d6340", "#ecd9b8"];
  return (
    <div className="flex w-full max-w-[190px] flex-col items-center gap-4">
      <div className="relative h-[70px] w-[160px]">
        {sw.map((c, i) => (
          <span
            key={c}
            style={{ background: c, transitionDelay: `${200 + i * 120}ms`, left: `${i * 48}px` }}
            className={`${ease} absolute top-2 h-[54px] w-[62px] rounded-[16px] border-4 border-white shadow-[0_12px_22px_-12px_rgba(60,40,20,0.6)] ${["group-data-[in=true]:-rotate-12", "group-data-[in=true]:-translate-y-2", "group-data-[in=true]:rotate-12"][i]}`}
          />
        ))}
      </div>
      <div className="flex w-full items-center gap-3 rounded-full border border-[#efe2cf] bg-white px-3 py-2 shadow-sm">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6b2f2f] text-white">
          <Play className="h-3 w-3 fill-white" />
        </span>
        <span className="flex h-6 flex-1 items-center gap-[3px]">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="rk-eq w-[3px] flex-1 rounded-full bg-[#c9ab7c]" style={{ animationDelay: `${(i * 137) % 900}ms`, height: `${30 + ((i * 37) % 70)}%` }} />
          ))}
        </span>
      </div>
    </div>
  );
}

/* ---------- section ---------- */

export function Features() {
  return (
    <section id="fitur" className="relative scroll-mt-16 overflow-hidden bg-[radial-gradient(70%_50%_at_85%_0%,#f8e9d8,transparent_70%),linear-gradient(#fbf6ef,#f7efe4)] px-4 py-24 sm:px-6 lg:py-32">
      <div className="pointer-events-none absolute -right-4 top-20 w-[140px] opacity-95 sm:w-[230px] lg:right-[5%] lg:top-16 lg:w-[290px]">
        <Lily className="rk-sway h-auto w-full" />
      </div>
      <div className="relative mx-auto max-w-[1360px]">
        <Reveal variant="blur" className="max-w-[760px] pr-20 sm:pr-40 lg:pr-0">
          <Eyebrow>Fitur lengkap</Eyebrow>
          <Title className="mt-4 text-[clamp(40px,5.6vw,72px)]">
            Semua kebutuhan undanganmu, <em className="text-rk-bronze">terhubung</em> dengan indah.
          </Title>
          <p className="mt-5 max-w-[560px] text-[16px] leading-relaxed text-rk-ink/65">Dari kelola undangan, daftar tamu, hingga detail acara. Semua dirancang agar momen spesialmu lebih mudah, rapi, dan berkesan.</p>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Card delay={0} icon={<Smartphone className="h-5 w-5" />} title="Ubah sendiri dari HP" body="Kelola undangan, ganti foto, dan teks langsung dari ponsel." art={<EditArt />} />
          <Card delay={80} icon={<Users className="h-5 w-5" />} title="Link nama per tamu" body="Buat link undangan personal dari daftar tamu, kirim lewat WhatsApp." art={<GuestsArt />} />
          <Card delay={160} icon={<CalendarDays className="h-5 w-5" />} title="Acara tersusun rapi" body="Atur jadwal, lokasi, dan catatan acara dalam satu halaman." art={<ScheduleArt />} />
          <Card delay={0} icon={<MessageCircleHeart className="h-5 w-5" />} title="RSVP & ucapan" body="Terima konfirmasi kehadiran dan doa dari para tamu." art={<RsvpArt />} />
          <Card delay={80} icon={<Globe2 className="h-5 w-5" />} title="Alamat web pribadi" body="Link yang mudah diingat dan bisa dibagikan ke siapa saja." art={<UrlArt />} />
          <Card delay={160} icon={<Palette className="h-5 w-5" />} title="Warna & lagu pilihan" body="Pilih palet warna, logo inisial, dan lagu latar favorit." art={<PaletteArt />} />
        </div>
      </div>
    </section>
  );
}
