"use client";

import { ArrowLeft, ArrowRight, Check, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { applyOccasion, demoContent, OCCASION_IDS, OCCASIONS, THEMES, type Occasion, type ThemeId } from "@/lib/content";
import { lastDraft, saveContent } from "@/lib/sandbox-store";
import { DecorScene } from "@/themes/decor/art";
import { isDecor } from "@/themes/decor/catalog";
import { styleVars } from "@/themes/style";
import { ThemePicker } from "./ThemeCatalog";

/* /buat — three short steps from the landing page to the free editor. */

const PICTURE: Record<Occasion, ThemeId> = { nikah: "sejoli", ultah: "konfeti", khitan: "khitan" };
const BLURB: Record<Occasion, string> = {
  nikah: "Akad, resepsi, ngunduh mantu",
  ultah: "Anak, sweet seventeen, dewasa",
  khitan: "Tasyakuran khitanan putra",
};

function OccasionArt({ occasion }: { occasion: Occasion }) {
  const t = THEMES[PICTURE[occasion]];
  return (
    <span style={styleVars({ ...t.style, accent: "" }) as React.CSSProperties} className="block rounded-[20px] bg-t-bg p-2">
      <DecorScene decor={isDecor(t.style.decor) ? t.style.decor : "none"} occasion={occasion} />
    </span>
  );
}

export function BuatWizard({ initialTheme, consultHref }: { initialTheme?: ThemeId; consultHref: string }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(initialTheme ? 3 : 1);
  const [occasion, setOccasion] = useState<Occasion>(initialTheme ? THEMES[initialTheme].occasion : "nikah");
  const [theme, setTheme] = useState<ThemeId | null>(initialTheme ?? null);
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<{ slug: string; title: string } | null>(null);
  useEffect(() => {
    // Read after mount: the browser's saved draft is not known on the server.
    const t = setTimeout(() => setDraft(lastDraft()), 0);
    return () => clearTimeout(t);
  }, []);
  const single = OCCASIONS[occasion].single;
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const start = () => {
    if (!theme || !first.trim()) return;
    setBusy(true);
    const c = demoContent(theme);
    if (c.occasion !== occasion) applyOccasion(c, occasion);
    const a = first.trim().slice(0, 16);
    const b = single ? "" : second.trim().slice(0, 16);
    c.hero.firstName = a;
    c.hero.secondName = b;
    if (THEMES[theme].occasion !== occasion) c.hero.eyebrow = "";
    c.couple.first = { ...c.couple.first, fullName: a, instagram: "" };
    c.couple.second = { ...c.couple.second, fullName: b, instagram: "" };
    c.closing.displayName = single ? a : `${a} & ${b}`;
    c.closing.hashtag = "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) c.event.date = date;
    if (venue.trim()) c.venue.name = venue.trim().slice(0, 80);
    saveContent(c);
    router.push(`/demo/admin?tema=${theme}`);
  };

  const steps = ["Acara", "Tema", "Data"];
  return (
    <div className="min-h-[100dvh] bg-rk-paper font-rk-sans text-rk-ink">
      <header className="sticky top-0 z-30 border-b border-rk-line/70 bg-rk-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center gap-3 px-4 sm:px-6">
          {step > 1 ? (
            <button type="button" onClick={() => setStep((s) => (s === 3 && initialTheme ? 2 : ((s - 1) as 1 | 2)))} aria-label="Kembali" className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <Link href="/" aria-label="Beranda" className="flex items-center">
              <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" />
            </Link>
          )}
          <ol className="flex flex-1 items-center justify-center gap-1.5 text-[12px] font-semibold">
            {steps.map((l, i) => (
              <li key={l} className="flex items-center gap-1.5">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${step > i + 1 ? "bg-emerald-600 text-white" : step === i + 1 ? "bg-rk-ink text-white" : "bg-rk-cream text-rk-mute"}`}>{step > i + 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
                <span className={step === i + 1 ? "text-rk-ink" : "hidden text-rk-mute sm:inline"}>{l}</span>
                {i < 2 && <span className="mx-1 h-px w-4 bg-rk-line sm:w-8" />}
              </li>
            ))}
          </ol>
          <a href={consultHref} target="_blank" rel="noreferrer" className="shrink-0 rounded-full border border-rk-ink/15 bg-white px-3 py-1.5 text-[12px] font-semibold">
            Konsultasi
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        {draft && step === 1 && (
          <a href={`/${draft.slug}/editor`} className="mb-6 flex items-center gap-3 rounded-2xl border border-rk-line bg-white p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rk-cream">
              <Pencil className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold">Lanjutkan draf {draft.title}</span>
              <span className="block truncate text-[12px] text-rk-mute">rayakan.my.id/{draft.slug}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </a>
        )}

        {step === 1 && (
          <section>
            <h1 className="font-rk-display text-[clamp(36px,8vw,60px)] font-light leading-[1.02] tracking-[-0.02em]">Mau merayakan apa?</h1>
            <p className="mt-3 text-[15px] text-rk-ink/65">Pilih acaranya dulu. Gratis dicoba, tanpa daftar akun.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {OCCASION_IDS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => {
                    setOccasion(o);
                    setStep(2);
                  }}
                  className="group flex items-center gap-4 rounded-[26px] border border-rk-line bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-rk-ink/40 hover:shadow-[0_24px_40px_-30px_rgba(60,40,20,0.6)] sm:flex-col sm:items-stretch sm:p-4"
                >
                  <span className="w-[42%] shrink-0 sm:w-full">
                    <OccasionArt occasion={o} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-rk-display text-[28px] font-light leading-none tracking-[-0.01em]">{OCCASIONS[o].name}</span>
                    <span className="mt-1.5 block text-[13px] text-rk-mute">{BLURB[o]}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold">
                      Pilih <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h1 className="font-rk-display text-[clamp(34px,7.5vw,56px)] font-light leading-[1.02] tracking-[-0.02em]">Pilih tema {OCCASIONS[occasion].name.toLowerCase()}</h1>
            <p className="mt-3 text-[15px] text-rk-ink/65">Tenang, tema, warna, ornamen, dan tata letak tiap bagian masih bisa diganti nanti.</p>
            <div className="mt-8">
              <ThemePicker
                occasion={occasion}
                onPick={(id) => {
                  setTheme(id);
                  setStep(3);
                }}
              />
            </div>
          </section>
        )}

        {step === 3 && theme && (
          <section className="grid items-start gap-8 md:grid-cols-[1fr_300px] md:gap-14">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                start();
              }}
            >
              <h1 className="font-rk-display text-[clamp(34px,7.5vw,56px)] font-light leading-[1.02] tracking-[-0.02em]">Sedikit lagi!</h1>
              <p className="mt-3 text-[15px] text-rk-ink/65">
                Isi data singkat, undangan {OCCASIONS[occasion].name.toLowerCase()}mu langsung tampil dengan tema {THEMES[theme].name}.{" "}
                <button type="button" onClick={() => setStep(1)} className="font-semibold text-rk-ink underline underline-offset-4">
                  Ganti acara
                </button>
              </p>
              <div className={`mt-5 grid gap-3 ${single ? "" : "grid-cols-2"}`}>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-semibold">{single ? (occasion === "khitan" ? "Nama panggilan ananda" : "Nama yang berulang tahun") : "Nama panggilan 1"}</span>
                  <input value={first} onChange={(e) => setFirst(e.target.value)} required maxLength={16} autoFocus placeholder={single ? (occasion === "khitan" ? "Rafa" : "Alea") : "Arya"} className="w-full rounded-xl border border-rk-line bg-white px-3.5 py-3 text-[16px] outline-none focus:border-rk-ink focus:ring-2 focus:ring-rk-gold/30" />
                </label>
                {!single && (
                  <label className="block">
                    <span className="mb-1.5 block text-[13px] font-semibold">Nama panggilan 2</span>
                    <input value={second} onChange={(e) => setSecond(e.target.value)} required maxLength={16} placeholder="Almalia" className="w-full rounded-xl border border-rk-line bg-white px-3.5 py-3 text-[16px] outline-none focus:border-rk-ink focus:ring-2 focus:ring-rk-gold/30" />
                  </label>
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-semibold">Tanggal acara</span>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-rk-line bg-white px-3.5 py-3 text-[15px] outline-none focus:border-rk-ink" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-semibold">
                    Tempat <span className="font-normal text-rk-mute">(opsional)</span>
                  </span>
                  <input value={venue} onChange={(e) => setVenue(e.target.value)} maxLength={80} placeholder="Gedung / rumah" className="w-full rounded-xl border border-rk-line bg-white px-3.5 py-3 text-[15px] outline-none focus:border-rk-ink" />
                </label>
              </div>
              <button type="submit" disabled={busy || !first.trim() || (!single && !second.trim())} className="mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-rk-ink text-[16px] font-bold text-white transition hover:bg-rk-plum disabled:opacity-40">
                {busy ? "Menyiapkan…" : "Lihat undanganku"} <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-3 text-center text-[12px] text-rk-mute">Tersimpan di HP ini. Simpan draf kapan saja dengan nama & nomor WhatsApp.</p>
            </form>
            <button type="button" onClick={() => setStep(2)} className="group order-first mx-auto block w-[46%] max-w-[260px] text-center md:order-none md:w-full">
              <span className="relative block aspect-[390/800] rounded-[30px] bg-[#0d0b0a] p-[6px] shadow-[0_30px_50px_-28px_rgba(60,40,20,0.7)]">
                <span className="relative block h-full w-full overflow-hidden rounded-[24px] bg-rk-cream">
                  <Image src={THEMES[theme].preview.mobile} alt={`Tema ${THEMES[theme].name}`} fill sizes="260px" className="object-cover object-top" />
                </span>
              </span>
              <span className="mt-3 block text-[13px] font-semibold">{THEMES[theme].name}</span>
              <span className="text-[12px] text-rk-mute underline underline-offset-2 group-hover:text-rk-ink">Ganti tema</span>
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
