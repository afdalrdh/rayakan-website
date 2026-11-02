"use client";

import {
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  KeyRound,
  Loader2,
  LogOut,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  checkSlugAction,
  createSiteAction,
  deleteSiteAction,
  logoutOwnerAction,
  resetPasswordAction,
  savePlansAction,
  saveSettingsAction,
  setPublishedAction,
  updateSiteMetaAction,
} from "@/app/actions/studio";
import { activeLabel, BLOCK_LABELS, FONT_PAIR_IDS, FONT_PAIRS, PALETTE_IDS, PALETTES, rupiah, slugify, THEME_IDS, THEMES, themeSwatch, type ColorMode, type Plan, type PlanId, type ThemeId } from "@/lib/content";
import { SITE_HOST, SITE_URL, waLink } from "@/lib/messages";
import type { AppSettings } from "@/lib/server/data";

export interface SiteSummary {
  slug: string;
  title: string;
  planId: PlanId;
  status: "draft" | "published";
  clientName: string | null;
  clientPhone: string | null;
  notes: string | null;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  guests: number;
  wishes: number;
  eventDate: string;
}

type Env = { database: boolean; media: boolean; secret: boolean; studioPassword: boolean; siteUrl: boolean };

const input = "w-full rounded-xl border border-rk-line bg-white px-3.5 py-2.5 text-[14px] text-rk-ink outline-none focus:border-rk-ink focus:ring-2 focus:ring-rk-gold/30";
const btn = "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-[13px] font-semibold transition disabled:opacity-40";
const primary = `${btn} bg-rk-ink text-white hover:bg-rk-plum`;
const ghost = `${btn} border border-rk-line bg-white text-rk-ink hover:bg-rk-ivory`;
const fmtDate = (d: string | null, withYear = true) =>
  d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) }) : "–";

function L({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-rk-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-rk-mute">{hint}</span>}
    </label>
  );
}

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label="Tutup" onClick={onClose} className="rk-fade-in absolute inset-0 bg-rk-ink/40" />
      <div className={`rk-sheet-in relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] bg-rk-ivory p-6 sm:rounded-[24px] ${wide ? "max-w-[640px]" : "max-w-[480px]"}`}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-rk-serif text-[28px] leading-none">{title}</h2>
          <button type="button" aria-label="Tutup" onClick={onClose} className="rounded-full p-2 hover:bg-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function StudioApp({ sites, plans, settings, env }: { sites: SiteSummary[]; plans: Plan[]; settings: AppSettings; env: Env }) {
  const [tab, setTab] = useState<"sites" | "plans" | "settings">("sites");
  const envWarnings = [
    !env.database && "DATABASE_URL belum diisi (memakai database lokal).",
    !env.media && "CLOUDINARY_URL belum diisi (foto disimpan lokal).",
    !env.secret && "SESSION_SECRET belum diisi.",
    !env.studioPassword && "Password studio masih bawaan (admin123).",
    !settings.adminWhatsapp && "Nomor WhatsApp admin belum diisi di Pengaturan.",
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-[100dvh] bg-rk-ivory font-rk-sans text-rk-ink">
      <header className="sticky top-0 z-30 border-b border-rk-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" />
            <span className="font-rk-serif text-[20px] leading-none">Studio</span>
          </Link>
          <nav className="no-scrollbar ml-2 flex flex-1 gap-1 overflow-x-auto">
            {(
              [
                ["sites", "Undangan"],
                ["plans", "Paket & Harga"],
                ["settings", "Pengaturan"],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" onClick={() => setTab(id)} className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold ${tab === id ? "bg-rk-ink text-white" : "text-rk-mute hover:text-rk-ink"}`}>
                {label}
              </button>
            ))}
          </nav>
          <form action={logoutOwnerAction}>
            <button type="submit" aria-label="Keluar" className="flex h-9 w-9 items-center justify-center rounded-full text-rk-mute hover:bg-rk-ivory hover:text-rk-ink">
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {envWarnings.length > 0 && (
          <div className="flex gap-3 rounded-2xl border border-rk-gold/50 bg-rk-gold/10 p-4 text-[13px]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Sebelum online, lengkapi:</p>
              <ul className="mt-1 list-disc pl-4 text-rk-mute">
                {envWarnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {tab === "sites" && <SitesTab sites={sites} plans={plans} />}
        {tab === "plans" && <PlansTab plans={plans} />}
        {tab === "settings" && <SettingsTab settings={settings} />}
      </main>
    </div>
  );
}

/* ================================ UNDANGAN ================================ */

function SitesTab({ sites, plans }: { sites: SiteSummary[]; plans: Plan[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [modal, setModal] = useState<null | { kind: "new" } | { kind: "edit" | "access" | "delete"; site: SiteSummary } | { kind: "created"; slug: string; password: string; phone: string; title: string }>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const planOf = (id: PlanId) => plans.find((p) => p.id === id) ?? plans[0];

  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    return sites.filter((s) => (status === "all" || s.status === status) && (!n || s.slug.includes(n) || s.title.toLowerCase().includes(n) || (s.clientName ?? "").toLowerCase().includes(n)));
  }, [sites, q, status]);

  const now = new Date();
  const thisMonth = sites.filter((s) => s.publishedAt && new Date(s.publishedAt).getMonth() === now.getMonth() && new Date(s.publishedAt).getFullYear() === now.getFullYear());
  const revenue = thisMonth.reduce((n, s) => n + planOf(s.planId).price, 0);

  const togglePublish = (s: SiteSummary) =>
    start(async () => {
      const r = await setPublishedAction(s.slug, s.status !== "published");
      if (!r.ok) alert(r.error);
      router.refresh();
    });

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [sites.length, "Total undangan"],
          [sites.filter((s) => s.status === "published").length, "Sudah terbit"],
          [sites.filter((s) => s.status === "draft").length, "Draft"],
          [rupiah(revenue), "Terbit bulan ini (estimasi)"],
        ].map(([n, l]) => (
          <div key={String(l)} className="rounded-2xl border border-rk-line bg-white p-4">
            <p className="text-[26px] font-semibold leading-none tracking-tight tabular-nums">{n}</p>
            <p className="mt-1.5 text-[12px] text-rk-mute">{l}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rk-mute" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, alamat, atau klien" className={`${input} h-11 pl-10`} />
        </div>
        <div className="flex gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={`${input} h-11 w-auto`}>
            <option value="all">Semua status</option>
            <option value="published">Sudah terbit</option>
            <option value="draft">Draft</option>
          </select>
          <button type="button" onClick={() => setModal({ kind: "new" })} className={`${primary} h-11 shrink-0`}>
            <Plus className="h-4 w-4" /> Undangan baru
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-rk-line bg-white">
        {shown.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-rk-serif text-[26px]">{sites.length ? "Tidak ada yang cocok" : "Belum ada undangan"}</p>
            <p className="mt-1 text-[14px] text-rk-mute">{sites.length ? "Coba kata kunci lain." : "Buat undangan pertama untuk klien kamu."}</p>
          </div>
        ) : (
          <ul className="divide-y divide-rk-line">
            {shown.map((s) => {
              const p = planOf(s.planId);
              const expired = s.expiresAt && new Date(s.expiresAt) < now;
              return (
                <li key={s.slug} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 sm:flex-nowrap">
                  <div className="min-w-0 flex-1 basis-[220px]">
                    <p className="truncate text-[15px] font-bold">{s.title}</p>
                    <a href={`/${s.slug}`} target="_blank" rel="noreferrer" className="block truncate text-[12px] text-rk-mute hover:text-rk-ink">
                      {SITE_HOST}/{s.slug}
                    </a>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-1.5 text-[11px] font-bold">
                    <span className="rounded-full bg-rk-cream px-2.5 py-1">{p.name}</span>
                    <span className={`rounded-full px-2.5 py-1 ${expired ? "bg-red-50 text-red-700" : s.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-rk-cream text-rk-mute"}`}>
                      {expired ? "Kedaluwarsa" : s.status === "published" ? "Terbit" : "Draft"}
                    </span>
                  </div>
                  <div className="hidden w-[150px] shrink-0 text-[12px] text-rk-mute md:block">
                    <p>{s.clientName || "–"}</p>
                    <p>Acara {fmtDate(s.eventDate || null)}</p>
                  </div>
                  <div className="hidden w-[110px] shrink-0 text-[12px] text-rk-mute lg:block">
                    <p>{s.guests} tamu</p>
                    <p>{s.wishes} ucapan</p>
                  </div>
                  <div className="hidden w-[120px] shrink-0 text-[12px] text-rk-mute lg:block">
                    <p>Aktif s.d.</p>
                    <p className="font-semibold text-rk-ink">{s.status === "published" ? (s.expiresAt ? fmtDate(s.expiresAt) : "Selamanya") : "–"}</p>
                  </div>
                  <div className="relative ml-auto flex shrink-0 items-center gap-1.5">
                    <a href={`/${s.slug}/admin`} className={ghost}>
                      <Pencil className="h-4 w-4" /> Admin
                    </a>
                    <button type="button" disabled={pending} onClick={() => togglePublish(s)} className={s.status === "published" ? ghost : primary}>
                      {s.status === "published" ? "Jadikan draft" : "Terbitkan"}
                    </button>
                    <button type="button" aria-label="Menu" onClick={() => setMenu(menu === s.slug ? null : s.slug)} className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-rk-ivory">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {menu === s.slug && (
                      <>
                        <button type="button" aria-label="Tutup menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenu(null)} />
                        <div className="rk-fade-in absolute right-0 top-11 z-20 w-56 overflow-hidden rounded-2xl border border-rk-line bg-white py-1.5 shadow-xl">
                          {[
                            { icon: ExternalLink, label: "Lihat pratinjau", on: () => window.open(`/${s.slug}/preview`, "_blank") },
                            { icon: Pencil, label: "Ubah paket & klien", on: () => setModal({ kind: "edit", site: s }) },
                            { icon: KeyRound, label: "Reset password & kirim akses", on: () => setModal({ kind: "access", site: s }) },
                            { icon: Trash2, label: "Hapus undangan", on: () => setModal({ kind: "delete", site: s }), danger: true },
                          ].map((m) => (
                            <button
                              key={m.label}
                              type="button"
                              onClick={() => {
                                setMenu(null);
                                m.on();
                              }}
                              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-rk-ivory ${m.danger ? "text-red-700" : ""}`}
                            >
                              <m.icon className="h-4 w-4" /> {m.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {modal?.kind === "new" && (
        <NewSiteModal
          plans={plans}
          onClose={() => setModal(null)}
          onCreated={(r) => {
            setModal({ kind: "created", ...r });
            router.refresh();
          }}
        />
      )}
      {modal?.kind === "created" && <AccessModal title="Undangan dibuat" slug={modal.slug} password={modal.password} phone={modal.phone} coupleTitle={modal.title} onClose={() => setModal(null)} />}
      {modal?.kind === "access" && <ResetAccessModal site={modal.site} onClose={() => setModal(null)} />}
      {modal?.kind === "edit" && (
        <EditSiteModal
          site={modal.site}
          plans={plans}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            router.refresh();
          }}
        />
      )}
      {modal?.kind === "delete" && (
        <DeleteModal
          site={modal.site}
          onClose={() => setModal(null)}
          onDeleted={() => {
            setModal(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function NewSiteModal({ plans, onClose, onCreated }: { plans: Plan[]; onClose: () => void; onCreated: (r: { slug: string; password: string; phone: string; title: string }) => void }) {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [checked, setChecked] = useState<{ slug: string; available: boolean; reason?: string } | null>(null);
  const [planId, setPlanId] = useState<PlanId>(plans.find((p) => p.highlight)?.id ?? "premium");
  const [theme, setTheme] = useState<ThemeId>("arya");
  const [start0, setStart0] = useState<"theme" | "custom">("theme");
  const [custom, setCustom] = useState<{ mode: ColorMode; palette: string; fonts: string }>({ mode: "light", palette: "sage", fonts: "elegan" });
  const [date, setDate] = useState("");
  const [client, setClient] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [sample, setSample] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const auto = slugify(`${first} ${second}`);
  const finalSlug = slugTouched ? slugify(slug) : auto;

  // Only trust a result that belongs to the slug currently typed.
  const check = finalSlug.length >= 3 && checked?.slug === finalSlug ? checked : null;

  useEffect(() => {
    if (finalSlug.length < 3) return;
    const t = setTimeout(() => checkSlugAction(finalSlug).then(setChecked), 350);
    return () => clearTimeout(t);
  }, [finalSlug]);

  return (
    <Modal title="Undangan baru" onClose={onClose} wide>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <L label="Nama panggilan 1">
            <input value={first} onChange={(e) => setFirst(e.target.value)} className={input} placeholder="Afdal" />
          </L>
          <L label="Nama panggilan 2">
            <input value={second} onChange={(e) => setSecond(e.target.value)} className={input} placeholder="Putri" />
          </L>
        </div>
        <L label="Alamat undangan">
          <div className="flex items-center overflow-hidden rounded-xl border border-rk-line bg-white focus-within:border-rk-ink">
            <span className="shrink-0 pl-3.5 text-[14px] text-rk-mute">{SITE_HOST}/</span>
            <input
              value={slugTouched ? slug : auto}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-[14px] outline-none"
            />
            {check && <span className={`shrink-0 pr-3 text-[12px] font-semibold ${check.available ? "text-emerald-700" : "text-red-700"}`}>{check.available ? "✓ Tersedia" : check.reason}</span>}
          </div>
        </L>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-[13px] font-semibold">Tampilan awal</span>
            <div className="flex rounded-full bg-rk-cream p-0.5 text-[12px] font-semibold">
              {(
                [
                  ["theme", "Pakai tema"],
                  ["custom", "Custom"],
                ] as const
              ).map(([v, l]) => (
                <button key={v} type="button" onClick={() => setStart0(v)} className={`rounded-full px-3 py-1.5 ${start0 === v ? "bg-white shadow-sm" : "text-rk-mute"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {start0 === "theme" ? (
            <div className="grid grid-cols-2 gap-2">
              {THEME_IDS.map((id) => {
                const sw = themeSwatch(THEMES[id]);
                return (
                  <button key={id} type="button" onClick={() => setTheme(id)} className={`flex items-center gap-3 rounded-2xl border bg-white p-2 text-left ${theme === id ? "border-rk-ink ring-2 ring-rk-ink" : "border-rk-line"}`}>
                    <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-rk-cream">
                      <Image src={THEMES[id].preview.mobile} alt="" fill sizes="44px" className="object-cover object-top" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold">{THEMES[id].name}</span>
                      <span className="block truncate text-[11px] text-rk-mute">{THEMES[id].tagline}</span>
                      <span className="mt-1 flex gap-1">
                        {[sw.bg, sw.accent, sw.muted].map((c) => (
                          <span key={c} className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: c }} />
                        ))}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 rounded-2xl border border-rk-line bg-white p-3">
              <div className="flex gap-2">
                {(
                  [
                    ["light", "Terang"],
                    ["dark", "Gelap"],
                  ] as const
                ).map(([m, l]) => (
                  <button key={m} type="button" onClick={() => setCustom((c) => ({ ...c, mode: m }))} className={`h-9 flex-1 rounded-xl border text-[13px] font-semibold ${custom.mode === m ? "border-rk-ink bg-rk-ink text-white" : "border-rk-line"}`}>
                    {l}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {PALETTE_IDS.map((id) => {
                  const p = PALETTES[id][custom.mode];
                  return (
                    <button key={id} type="button" title={PALETTES[id].name} onClick={() => setCustom((c) => ({ ...c, palette: id }))} className={`flex h-10 items-center justify-center rounded-lg ${custom.palette === id ? "ring-2 ring-rk-ink ring-offset-1" : "ring-1 ring-black/10"}`} style={{ background: p.bg }}>
                      <span className="h-4 w-4 rounded-full" style={{ background: p.accent }} />
                    </button>
                  );
                })}
              </div>
              <select value={custom.fonts} onChange={(e) => setCustom((c) => ({ ...c, fonts: e.target.value }))} className={input}>
                {FONT_PAIR_IDS.map((id) => (
                  <option key={id} value={id}>
                    Huruf {FONT_PAIRS[id].name} · {FONT_PAIRS[id].desc}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-rk-mute">Tata letak tiap bagian memakai pilihan standar; klien bisa menggantinya sendiri dari editor.</p>
            </div>
          )}
        </div>
        <div>
          <span className="mb-1.5 block text-[13px] font-semibold">Paket</span>
          <div className="grid gap-2 sm:grid-cols-3">
            {plans.map((p) => (
              <button key={p.id} type="button" onClick={() => setPlanId(p.id)} className={`rounded-2xl border p-3 text-left ${planId === p.id ? "border-rk-ink bg-white ring-2 ring-rk-ink" : "border-rk-line bg-white"}`}>
                <span className="block text-[14px] font-bold">{p.name}</span>
                <span className="block text-[13px]">{rupiah(p.price)}</span>
                <span className="block text-[11px] text-rk-mute">Aktif {activeLabel(p)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <L label="Tanggal acara">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={input} />
          </L>
          <L label="Nama klien">
            <input value={client} onChange={(e) => setClient(e.target.value)} className={input} />
          </L>
          <L label="WhatsApp klien">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className={input} placeholder="0812…" />
          </L>
        </div>
        <L label="Catatan internal" hint="Hanya terlihat di Studio. Misal: sudah DP, minta tema warna sage.">
          <input value={notes} onChange={(e) => setNotes(e.target.value)} className={input} />
        </L>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-rk-line bg-white px-3.5 py-3">
          <input type="checkbox" checked={sample} onChange={(e) => setSample(e.target.checked)} className="mt-0.5 h-4 w-4 accent-rk-ink" />
          <span>
            <span className="block text-[14px] font-semibold">Isi dengan contoh lengkap</span>
            <span className="block text-[12px] text-rk-mute">Foto, kisah, lokasi, galeri, dan rekening contoh dari tema. Untuk undangan demo atau portofolio.</span>
          </span>
        </label>
        {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-semibold text-red-700">{error}</p>}
        <button
          type="button"
          disabled={pending || !first.trim() || !second.trim() || (check !== null && !check.available)}
          onClick={() =>
            start(async () => {
              setError("");
              const r = await createSiteAction({ firstName: first, secondName: second, slug: finalSlug, planId, theme: start0 === "custom" ? (custom.mode === "dark" ? "arya" : "afdal") : theme, style: start0 === "custom" ? custom : undefined, eventDate: date, clientName: client, clientPhone: phone, notes, sample });
              if (r.ok) onCreated({ slug: r.slug, password: r.password, phone, title: `${first} & ${second}` });
              else setError(r.error);
            })
          }
          className={`${primary} h-12 w-full`}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buat undangan"}
        </button>
      </div>
    </Modal>
  );
}

function AccessModal({ title, slug, password, phone, coupleTitle, onClose }: { title: string; slug: string; password: string; phone: string; coupleTitle: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const text = `Halo! Undangan digital ${coupleTitle} sudah siap diisi 🎉\n\nBuka halaman admin:\n${SITE_URL}/${slug}/admin\nPassword: ${password}\n\nDi menu Undangan kamu bisa menambah tamu dan mengirim link lewat WhatsApp. Buka menu Desain Undangan → Edit Tampilan untuk mengganti foto, teks, warna, dan tata letak.\n\nRayakan.my.id`;
  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-4">
        <div className="space-y-2 rounded-2xl border border-rk-line bg-white p-4 text-[14px]">
          <p className="flex justify-between gap-3">
            <span className="text-rk-mute">Admin</span>
            <span className="truncate font-semibold">{SITE_HOST}/{slug}/admin</span>
          </p>
          <p className="flex justify-between gap-3">
            <span className="text-rk-mute">Password</span>
            <span className="font-mono font-semibold">{password}</span>
          </p>
        </div>
        <p className="text-[12px] text-rk-mute">Password hanya ditampilkan sekali. Simpan atau kirim langsung ke klien.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              })
            }
            className={`${ghost} h-12 flex-1`}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Salin pesan
          </button>
          <a href={phone ? waLink(phone, text) : `https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer" className={`${btn} h-12 flex-1 bg-[#25D366] text-white`}>
            <Send className="h-4 w-4" /> Kirim ke klien via WA
          </a>
        </div>
      </div>
    </Modal>
  );
}

function ResetAccessModal({ site, onClose }: { site: SiteSummary; onClose: () => void }) {
  const [password, setPassword] = useState<string | null>(null);
  const [pending, start] = useTransition();
  if (password) return <AccessModal title="Akses baru" slug={site.slug} password={password} phone={site.clientPhone ?? ""} coupleTitle={site.title} onClose={onClose} />;
  return (
    <Modal title="Reset password" onClose={onClose}>
      <p className="text-[14px] text-rk-mute">Password lama untuk {SITE_HOST}/{site.slug} langsung tidak berlaku dan klien yang sedang masuk akan keluar otomatis.</p>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await resetPasswordAction(site.slug);
            if (r.ok) setPassword(r.password);
            else alert(r.error);
          })
        }
        className={`${primary} mt-5 h-12 w-full`}
      >
        Buat password baru
      </button>
    </Modal>
  );
}

function EditSiteModal({ site, plans, onClose, onSaved }: { site: SiteSummary; plans: Plan[]; onClose: () => void; onSaved: () => void }) {
  const [planId, setPlanId] = useState(site.planId);
  const [client, setClient] = useState(site.clientName ?? "");
  const [phone, setPhone] = useState(site.clientPhone ?? "");
  const [notes, setNotes] = useState(site.notes ?? "");
  const [expires, setExpires] = useState(site.expiresAt ? site.expiresAt.slice(0, 10) : "");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  return (
    <Modal title={site.title} onClose={onClose}>
      <div className="space-y-4">
        <L label="Paket" hint={site.publishedAt ? "Mengganti paket menghitung ulang masa aktif sejak tanggal terbit." : undefined}>
          <select value={planId} onChange={(e) => setPlanId(e.target.value as PlanId)} className={input}>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {rupiah(p.price)} · {activeLabel(p)}
              </option>
            ))}
          </select>
        </L>
        <div className="grid grid-cols-2 gap-3">
          <L label="Nama klien">
            <input value={client} onChange={(e) => setClient(e.target.value)} className={input} />
          </L>
          <L label="WhatsApp klien">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={input} />
          </L>
        </div>
        <L label="Aktif sampai" hint="Kosongkan untuk aktif selamanya. Bisa dipakai untuk perpanjangan.">
          <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className={input} />
        </L>
        <L label="Catatan internal">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${input} resize-none`} />
        </L>
        {error && <p className="text-[13px] font-semibold text-red-700">{error}</p>}
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await updateSiteMetaAction(site.slug, { planId, clientName: client, clientPhone: phone, notes, expiresAt: expires || null });
              if (r.ok) onSaved();
              else setError(r.error);
            })
          }
          className={`${primary} h-12 w-full`}
        >
          Simpan
        </button>
      </div>
    </Modal>
  );
}

function DeleteModal({ site, onClose, onDeleted }: { site: SiteSummary; onClose: () => void; onDeleted: () => void }) {
  const [confirmText, setConfirm] = useState("");
  const [pending, start] = useTransition();
  return (
    <Modal title="Hapus undangan" onClose={onClose}>
      <p className="text-[14px] text-rk-mute">
        Undangan, daftar tamu ({site.guests}) dan ucapan ({site.wishes}) akan dihapus permanen. Ketik <b className="text-rk-ink">{site.slug}</b> untuk konfirmasi.
      </p>
      <input value={confirmText} onChange={(e) => setConfirm(e.target.value)} className={`${input} mt-4`} />
      <button
        type="button"
        disabled={pending || confirmText !== site.slug}
        onClick={() =>
          start(async () => {
            const r = await deleteSiteAction(site.slug, confirmText);
            if (r.ok) onDeleted();
            else alert(r.error);
          })
        }
        className={`${btn} mt-4 h-12 w-full bg-red-600 text-white`}
      >
        Hapus permanen
      </button>
    </Modal>
  );
}

/* ================================ PAKET ================================ */

const LOCKABLE = ["story", "gift"] as const;

function PlansTab({ plans: initial }: { plans: Plan[] }) {
  const router = useRouter();
  const [plans, setPlans] = useState(initial);
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  const set = (i: number, patch: Partial<Plan>) => setPlans((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const num = (v: string) => (v === "" ? 0 : Number(v.replace(/\D/g, "")));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-rk-serif text-[36px] leading-none">Paket &amp; Harga</h1>
          <p className="mt-1.5 text-[14px] text-rk-mute">Perubahan langsung tampil di halaman harga dan berlaku untuk semua undangan dengan paket tersebut.</p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-[13px] font-semibold text-emerald-700">{msg}</span>}
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const r = await savePlansAction(plans);
                setMsg(r.ok ? "✓ Tersimpan" : r.error);
                router.refresh();
                setTimeout(() => setMsg(""), 2500);
              })
            }
            className={`${primary} h-11`}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan semua paket"}
          </button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((p, i) => (
          <section key={p.id} className={`space-y-4 rounded-[24px] border bg-white p-5 ${p.highlight ? "border-rk-ink" : "border-rk-line"}`}>
            <div className="flex items-center justify-between gap-2">
              <input value={p.name} onChange={(e) => set(i, { name: e.target.value })} className="w-full bg-transparent font-rk-serif text-[30px] leading-none outline-none" />
              <label className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold">
                <input type="checkbox" checked={p.highlight} onChange={(e) => setPlans((ps) => ps.map((x, j) => ({ ...x, highlight: j === i ? e.target.checked : e.target.checked ? false : x.highlight })))} />
                Paling laris
              </label>
            </div>
            <L label="Tagline">
              <input value={p.tagline} onChange={(e) => set(i, { tagline: e.target.value })} className={input} />
            </L>
            <div className="grid grid-cols-2 gap-3">
              <L label="Harga promo">
                <input inputMode="numeric" value={p.price.toLocaleString("id-ID")} onChange={(e) => set(i, { price: num(e.target.value) })} className={input} />
              </L>
              <L label="Harga normal">
                <input inputMode="numeric" value={p.normalPrice.toLocaleString("id-ID")} onChange={(e) => set(i, { normalPrice: num(e.target.value) })} className={input} />
              </L>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <L label="Masa aktif (bulan)">
                <input inputMode="numeric" disabled={p.activeMonths === null} value={p.activeMonths ?? ""} placeholder="Selamanya" onChange={(e) => set(i, { activeMonths: num(e.target.value) || 1 })} className={`${input} disabled:bg-rk-cream`} />
              </L>
              <label className="mt-7 flex items-center gap-2 text-[13px] font-semibold">
                <input type="checkbox" checked={p.activeMonths === null} onChange={(e) => set(i, { activeMonths: e.target.checked ? null : 12 })} /> Selamanya
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <L label="Foto galeri">
                <input inputMode="numeric" value={p.galleryLimit} onChange={(e) => set(i, { galleryLimit: num(e.target.value) })} className={input} />
              </L>
              <L label="Babak kisah">
                <input inputMode="numeric" value={p.storyLimit} onChange={(e) => set(i, { storyLimit: num(e.target.value) })} className={input} />
              </L>
              <L label="Tamu">
                <input inputMode="numeric" disabled={p.guestLimit === null} value={p.guestLimit ?? ""} placeholder="∞" onChange={(e) => set(i, { guestLimit: num(e.target.value) })} className={`${input} disabled:bg-rk-cream`} />
              </L>
            </div>
            <label className="flex items-center gap-2 text-[13px] font-semibold">
              <input type="checkbox" checked={p.guestLimit === null} onChange={(e) => set(i, { guestLimit: e.target.checked ? null : 150 })} /> Tamu tanpa batas
            </label>
            <div className="space-y-2 rounded-2xl bg-rk-ivory p-3.5">
              <p className="text-[12px] font-bold uppercase tracking-wider text-rk-mute">Fitur termasuk</p>
              {LOCKABLE.map((k) => (
                <label key={k} className="flex items-center gap-2 text-[13px] font-semibold">
                  <input type="checkbox" checked={!p.locked.includes(k)} onChange={(e) => set(i, { locked: e.target.checked ? p.locked.filter((x) => x !== k) : [...p.locked, k] })} />
                  {BLOCK_LABELS[k]}
                </label>
              ))}
              <label className="flex items-center gap-2 text-[13px] font-semibold">
                <input type="checkbox" checked={p.musicUpload} onChange={(e) => set(i, { musicUpload: e.target.checked })} /> Unggah lagu sendiri
              </label>
              <label className="flex items-center gap-2 text-[13px] font-semibold">
                <input type="checkbox" checked={p.customColor} onChange={(e) => set(i, { customColor: e.target.checked })} /> Warna aksen sendiri
              </label>
            </div>
            <L label="Daftar benefit (tampil di halaman harga)" hint="Satu benefit per baris.">
              <textarea value={p.benefits.join("\n")} rows={7} onChange={(e) => set(i, { benefits: e.target.value.split("\n") })} className={`${input} resize-none leading-relaxed`} />
            </L>
          </section>
        ))}
      </div>
    </>
  );
}

/* ================================ PENGATURAN ================================ */

function SettingsTab({ settings }: { settings: AppSettings }) {
  const router = useRouter();
  const [s, setS] = useState(settings);
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  return (
    <div className="max-w-[640px] space-y-5">
      <div>
        <h1 className="font-rk-serif text-[36px] leading-none">Pengaturan</h1>
        <p className="mt-1.5 text-[14px] text-rk-mute">Dipakai di landing page, tombol pesan, dan tombol terbitkan di editor klien.</p>
      </div>
      <div className="space-y-4 rounded-[24px] border border-rk-line bg-white p-5">
        <L label="Nomor WhatsApp admin" hint="Format 62812…. Semua tombol Pesan / Terbitkan / Upgrade mengarah ke nomor ini.">
          <input value={s.adminWhatsapp} inputMode="tel" onChange={(e) => setS({ ...s, adminWhatsapp: e.target.value })} className={input} placeholder="6281234567890" />
        </L>
        <L label="Instagram">
          <input value={s.instagram} onChange={(e) => setS({ ...s, instagram: e.target.value })} className={input} />
        </L>
        <div className="grid gap-3 sm:grid-cols-2">
          <L label="Label promo" hint="Contoh: Harga perkenalan, Promo November.">
            <input value={s.promoLabel} onChange={(e) => setS({ ...s, promoLabel: e.target.value })} className={input} />
          </L>
          <L label="Promo berakhir" hint="Kosongkan bila tanpa batas waktu.">
            <input type="date" value={s.promoEndsAt} onChange={(e) => setS({ ...s, promoEndsAt: e.target.value })} className={input} />
          </L>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const r = await saveSettingsAction(s);
                setMsg(r.ok ? "✓ Tersimpan" : r.error);
                router.refresh();
                setTimeout(() => setMsg(""), 2500);
              })
            }
            className={`${primary} h-11`}
          >
            Simpan pengaturan
          </button>
          {msg && <span className="text-[13px] font-semibold text-emerald-700">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
