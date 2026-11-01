import { CalendarHeart, Check, Globe2, MessageCircleHeart, Music2, Palette, Send, Smartphone, Users } from "lucide-react";
import type { ReactNode } from "react";
import { THEMES } from "@/lib/content";
import { Reveal } from "./Reveal";

function Card({ icon, title, body, children, delay }: { icon: ReactNode; title: string; body: string; children: ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col overflow-hidden rounded-[26px] border border-rk-line/80 bg-[#fffdf9] p-6 shadow-[0_1px_0_rgba(0,0,0,0.02),0_20px_40px_-30px_rgba(60,40,20,0.25)] sm:p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rk-line bg-rk-paper text-rk-bronze">{icon}</span>
        <h3 className="font-rk-display text-[26px] font-light leading-[1.05] tracking-[-0.02em]">{title}</h3>
      </div>
      <p className="mt-4 text-[14.5px] leading-relaxed text-rk-ink/65">{body}</p>
      <div className="mt-6 flex-1">{children}</div>
    </Reveal>
  );
}

const pill = "flex items-center gap-3 rounded-2xl border border-rk-line/80 bg-rk-paper/60 px-3.5 py-2.5 text-[13px]";

/** "Fitur" grid: each card carries a tiny illustration of the feature. */
export function Features() {
  const afdal = THEMES.afdal;
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <Card delay={0} icon={<Smartphone className="h-5 w-5" />} title="Ubah sendiri dari HP" body="Ketuk bagian undangan, ganti foto atau teks di panel kecil. Tersimpan otomatis, tanpa aplikasi.">
        <div className="space-y-2">
          {["Foto utama", "Profil mempelai", "Galeri foto"].map((t) => (
            <div key={t} className={pill}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check className="h-3 w-3" />
              </span>
              {t}
              <span className="ml-auto text-[11px] text-rk-mute">Lengkap</span>
            </div>
          ))}
        </div>
      </Card>

      <Card delay={80} icon={<Users className="h-5 w-5" />} title="Link nama per tamu" body="Import daftar tamu dari Excel, lalu kirim lewat WhatsApp sekali ketuk. Nama tamu tampil di sampul.">
        <div className="space-y-2">
          {[
            ["Keluarga Wijaya", "Terkirim"],
            ["Rina & Bagus", "Terkirim"],
            ["Budi Santoso", "Kirim"],
          ].map(([n, s], i) => (
            <div key={n} className={pill}>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rk-cream text-[11px] font-semibold text-rk-bronze">{i + 1}</span>
              {n}
              <span className={`ml-auto flex items-center gap-1 text-[11px] font-semibold ${s === "Kirim" ? "text-rk-ink" : "text-emerald-700"}`}>
                {s === "Kirim" && <Send className="h-3 w-3" />}
                {s}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card delay={160} icon={<CalendarHeart className="h-5 w-5" />} title="Acara tersusun rapi" body="Jadwal akad dan resepsi, lokasi dengan tombol Maps, dan catatan untuk tamu, semua di satu halaman.">
        <ol className="relative ml-1.5 space-y-4 border-l border-rk-line pl-5">
          {[
            ["08.00 WIB", "Akad Nikah"],
            ["11.00 WIB", "Resepsi"],
            ["Marsoeta Coffee & Eatery", "Lihat di Maps"],
          ].map(([a, b]) => (
            <li key={a} className="relative">
              <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-rk-bronze" />
              <p className="text-[11px] uppercase tracking-[2px] text-rk-mute">{a}</p>
              <p className="text-[15px] font-semibold">{b}</p>
            </li>
          ))}
        </ol>
      </Card>

      <Card delay={0} icon={<MessageCircleHeart className="h-5 w-5" />} title="RSVP & ucapan" body="Tamu konfirmasi kehadiran dan menulis doa. Rekapnya langsung muncul di dashboard kalian.">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-rk-line/80 bg-rk-paper/60 p-4">
            <p className="font-rk-display text-[40px] font-light leading-none">128</p>
            <p className="mt-1 text-[12px] text-rk-mute">Akan hadir</p>
          </div>
          <div className="rounded-2xl border border-rk-line/80 bg-rk-paper/60 p-4">
            <p className="font-rk-display text-[40px] font-light leading-none">96</p>
            <p className="mt-1 text-[12px] text-rk-mute">Ucapan & doa</p>
          </div>
          <p className="col-span-2 rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[13px] italic leading-relaxed text-rk-ink/75 shadow-sm">“Selamat menempuh hidup baru, semoga sakinah, mawaddah, warahmah.”</p>
        </div>
        <p className="mt-2 text-[11px] text-rk-mute">Contoh tampilan</p>
      </Card>

      <Card delay={80} icon={<Globe2 className="h-5 w-5" />} title="Alamat atas nama kalian" body="Satu link yang mudah diingat dan dibagikan, lengkap dengan gambar pratinjau saat dikirim di WhatsApp.">
        <div className="relative overflow-hidden rounded-2xl bg-[#211b19] p-4 text-white">
          <div className="rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/80">rayakan.my.id/afdal-putri</div>
          <p className="mt-6 font-rk-display text-[30px] font-light italic leading-none text-[#e6d3b3]">Afdal & Putri</p>
          <p className="mt-1 text-[12px] text-white/50">Sabtu, 4 Juli 2026</p>
        </div>
      </Card>

      <Card delay={160} icon={<Palette className="h-5 w-5" />} title="Warna & lagu pilihan" body="Pilih palet warna yang serasi dengan busana kalian, pasang logo inisial, dan lagu latar favorit.">
        <div className="flex flex-wrap gap-2">
          {Object.values(afdal.palettes).map((p) => (
            <span key={p.name} className="flex items-center gap-2 rounded-full border border-rk-line/80 bg-rk-paper/60 py-1.5 pl-1.5 pr-3 text-[12px]">
              <span className="h-5 w-5 rounded-full" style={{ background: p.accent }} />
              {p.name}
            </span>
          ))}
        </div>
        <div className={`${pill} mt-3`}>
          <Music2 className="h-4 w-4 text-rk-bronze" /> Lagu latar diputar saat undangan dibuka
        </div>
      </Card>
    </div>
  );
}
