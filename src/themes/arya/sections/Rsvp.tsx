"use client";

import { ChevronDown } from "lucide-react";
import { Block, useTheme, useWishes, type Wish } from "../../shared";

const input = "h-[50px] w-full rounded-[12px] border border-white/10 bg-t-input px-4 font-sans text-[14px] text-white outline-none transition placeholder:text-neutral-500 focus:border-t-accent md:text-[15px]";
const label = "mb-2 block text-[12px] font-bold uppercase tracking-[1px] text-neutral-400";

/** RSVP form + wishes list (logic lives in useWishes). */
export function Rsvp() {
  const { content: c } = useTheme();
  const w = useWishes();
  return (
    <Block id="rsvp">
      <section id="rsvp" className="relative bg-t-alt px-4 py-20 font-sans text-neutral-200 sm:px-6 md:px-8 md:py-28">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-[0.95fr_1fr] lg:gap-14">
          <form onSubmit={w.submit} className="self-start rounded-[22px] border border-white/10 bg-t-card p-6 shadow-[0_20px_45px_rgba(0,0,0,0.4)] sm:p-8 md:p-9">
            <p className="text-[12px] uppercase tracking-[3px] text-t-muted md:text-[13px]">{c.rsvp.eyebrow}</p>
            <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-t-accent md:text-[38px]">{c.rsvp.title}</h2>
            <div className="mt-5 h-px w-14 bg-t-muted/60" />
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
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
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
                className="w-full resize-none rounded-[12px] border border-white/10 bg-t-input px-4 py-3 text-[14px] leading-relaxed text-white outline-none transition placeholder:text-neutral-500 focus:border-t-accent md:text-[15px]"
              />
            </label>
            {w.status && (
              <p className={`mt-4 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold ${w.status.ok ? "border border-emerald-500/30 bg-emerald-950/60 text-emerald-300" : "border border-red-500/30 bg-red-950/60 text-red-300"}`}>{w.status.text}</p>
            )}
            <button type="submit" disabled={w.busy} className="mt-6 h-[52px] w-full rounded-[12px] bg-t-accent text-[14px] font-bold uppercase tracking-[2px] text-neutral-950 transition hover:brightness-90 disabled:opacity-50">
              {w.busy ? "Mengirim..." : "Kirim Ucapan"}
            </button>
          </form>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-serif text-[22px] font-semibold text-white">Doa &amp; Ucapan</h3>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 text-[12px] font-semibold text-emerald-400">{w.stats.present} Kehadiran</span>
                <span className="rounded-full border border-white/10 bg-t-input px-3 py-1 text-[12px] font-semibold text-neutral-300">{w.stats.total} Ucapan</span>
              </div>
            </div>
            <div className="mt-6 max-h-[640px] space-y-4 overflow-y-auto pr-1">
              {w.wishes.map((x) => (
                <article key={x.id} className="rounded-[16px] border border-white/10 bg-t-card p-5 shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-serif text-[17px] font-semibold text-t-accent">{x.name}</h4>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none ${x.attendance === "Hadir" ? "border border-emerald-500/30 bg-emerald-950/60 text-emerald-400" : "border border-neutral-700 bg-neutral-800/80 text-neutral-400"}`}>{x.attendance}</span>
                  </div>
                  {c.rsvp.askCity && <p className="mt-1 text-[12px] text-neutral-400">{x.location || "Lokasi tidak dicantumkan"}</p>}
                  <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-neutral-200">{x.message}</p>
                </article>
              ))}
              {!w.wishes.length && <p className="rounded-[14px] border border-white/10 bg-t-card px-5 py-4 text-[14px] text-neutral-400">Belum ada ucapan. Jadilah yang pertama memberikan doa restu!</p>}
            </div>
            {w.hasMore && (
              <button type="button" onClick={w.loadMore} className="mt-5 w-full rounded-[12px] border border-white/15 py-3 text-[13px] font-semibold text-neutral-300 hover:bg-white/5">
                Muat ucapan lainnya
              </button>
            )}
          </div>
        </div>
      </section>
    </Block>
  );
}
