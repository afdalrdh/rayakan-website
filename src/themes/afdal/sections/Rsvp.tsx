"use client";

import { ChevronDown } from "lucide-react";
import { Block, useTheme, useWishes, type Wish } from "../../shared";
import { SECTION_Y } from "./Heading";

const input = "h-[50px] w-full rounded-[12px] bg-t-input px-4 font-sans text-[15px] text-t-accent outline-none transition placeholder:text-[#C4C0C0] focus:ring-2 focus:ring-t-muted/40 md:h-[52px] md:px-5 md:text-[16px]";
const label = "mb-2 block font-sans text-[12px] font-bold uppercase leading-[16px] tracking-[1px] text-[#565156]";

export function Rsvp() {
  const { content: c } = useTheme();
  const w = useWishes();
  return (
    <Block id="rsvp">
      <section id="rsvp" className={`bg-t-alt px-5 font-sans text-[#5B5150] md:px-8 ${SECTION_Y}`}>
        <div className="mx-auto grid w-full max-w-[1120px] gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <form onSubmit={w.submit} className="self-start rounded-[22px] border border-t-muted/25 bg-t-card px-6 py-7 shadow-[0_18px_45px_rgba(74,14,14,0.04)] sm:px-8 md:px-9 md:py-8">
            <p className="text-[12px] font-medium uppercase leading-none tracking-[0.24em] text-t-muted md:text-[13px]">{c.rsvp.eyebrow}</p>
            <h2 className="mt-4 font-serif text-[34px] font-semibold leading-[1.08] text-t-accent md:mt-5 md:text-[44px]">{c.rsvp.title}</h2>
            <div className="mt-6 h-px w-12 bg-t-muted/40" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-5">
              <label className="block">
                <span className={label}>Nama</span>
                <input value={w.form.name} onChange={(e) => w.set("name", e.target.value)} required maxLength={80} placeholder="Nama Anda" className={input} />
              </label>
              <label className="block">
                <span className={label}>Kehadiran</span>
                <div className="relative">
                  <select value={w.form.attendance} onChange={(e) => w.set("attendance", e.target.value as Wish["attendance"])} className={`${input} cursor-pointer appearance-none pr-10`}>
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A8191]" aria-hidden />
                </div>
              </label>
            </div>
            {c.rsvp.askCity && (
              <label className="mt-5 block">
                <span className={label}>Kota / Domisili</span>
                <input value={w.form.location} onChange={(e) => w.set("location", e.target.value)} maxLength={80} placeholder="Kota atau domisili Anda" className={input} />
              </label>
            )}
            <label className="mt-5 block">
              <span className={label}>Ucapan atau Doa</span>
              <textarea
                value={w.form.message}
                onChange={(e) => w.set("message", e.target.value)}
                required
                maxLength={600}
                rows={3}
                placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
                className="min-h-[92px] w-full resize-none rounded-[12px] bg-t-input px-5 py-3.5 text-[15px] leading-[24px] text-t-accent outline-none transition placeholder:text-[#C4C0C0] focus:ring-2 focus:ring-t-muted/40 md:text-[16px]"
              />
            </label>
            {w.status && <p className={`mt-4 rounded-[10px] px-4 py-3 text-[13px] font-semibold ${w.status.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{w.status.text}</p>}
            <button type="submit" disabled={w.busy} className="mt-6 h-[54px] w-full rounded-[12px] bg-t-accent text-[15px] font-bold uppercase tracking-[3px] text-white shadow-[0_14px_25px_rgba(0,0,0,0.12)] transition hover:brightness-90 disabled:opacity-60">
              {w.busy ? "Mengirim..." : "Kirim Ucapan"}
            </button>
          </form>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-serif text-[24px] font-semibold text-t-accent md:text-[28px]">Doa &amp; Ucapan</h3>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-t-input px-3 py-2 text-[12px] font-bold leading-none text-t-accent">{w.stats.present} Kehadiran</span>
                <span className="rounded-full bg-white px-3 py-2 text-[12px] font-bold leading-none text-[#6F6B75] shadow-[0_2px_10px_rgba(31,28,11,0.08)]">{w.stats.total} Ucapan</span>
              </div>
            </div>
            <div className="mt-5 grid max-h-[560px] gap-3 overflow-y-auto pr-1">
              {w.wishes.map((x) => (
                <article key={x.id} className="rounded-[18px] bg-white px-5 py-4 shadow-[0_4px_18px_rgba(31,28,11,0.05)] md:px-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-[16px] font-bold text-t-accent">{x.name}</h4>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ${x.attendance === "Hadir" ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>{x.attendance}</span>
                  </div>
                  {c.rsvp.askCity && x.location && <p className="mt-1 text-[12px] font-medium text-[#9B8E8A]">{x.location}</p>}
                  <p className="mt-1.5 whitespace-pre-line text-[15px] leading-[24px] text-[#6F6B75]">{x.message}</p>
                </article>
              ))}
              {!w.wishes.length && <p className="rounded-[14px] bg-white px-5 py-4 text-[14px] font-semibold text-[#6F6B75] shadow-[0_4px_18px_rgba(31,28,11,0.05)]">Belum ada ucapan. Jadilah yang pertama memberikan doa restu!</p>}
            </div>
            {w.hasMore && (
              <button type="button" onClick={w.loadMore} className="mt-5 w-full rounded-[10px] border border-[#DED8CF] py-3 text-[13px] font-semibold text-[#6F625A] hover:bg-white">
                Muat ucapan lainnya
              </button>
            )}
          </div>
        </div>
      </section>
    </Block>
  );
}
