"use client";

import { Check, Copy, Loader2, Send } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { checkSlugAction, createSiteAction, deleteSiteAction, resetPasswordAction, updateSiteMetaAction } from "@/app/actions/studio";
import { activeLabel, FONT_PAIR_IDS, FONT_PAIRS, OCCASION_IDS, OCCASIONS, PAID_PLAN_IDS, PALETTE_IDS, PALETTES, rupiah, slugify, THEME_IDS, THEMES, themeSwatch, type ColorMode, type Occasion, type Plan, type PlanId, type ThemeId } from "@/lib/content";
import { SITE_HOST, SITE_URL, waLink } from "@/lib/messages";
import { btn, ghost, input, L, Modal, primary } from "./ui";
import type { SiteSummary } from "./types";

export function NewSiteModal({ plans, onClose, onCreated }: { plans: Plan[]; onClose: () => void; onCreated: (r: { slug: string; password: string; phone: string; title: string }) => void }) {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [checked, setChecked] = useState<{ slug: string; available: boolean; reason?: string } | null>(null);
  const [planId, setPlanId] = useState<PlanId>(plans.find((p) => p.highlight)?.id ?? "mandiri");
  const [theme, setTheme] = useState<ThemeId>("arya");
  const [start0, setStart0] = useState<"theme" | "custom">("theme");
  const [custom, setCustom] = useState<{ mode: ColorMode; palette: string; fonts: string }>({ mode: "light", palette: "sage", fonts: "elegan" });
  const [date, setDate] = useState("");
  const [client, setClient] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [sample, setSample] = useState(false);
  const [occasion, setOccasion] = useState<Occasion>("nikah");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const single = OCCASIONS[occasion].single;

  const auto = slugify(single ? first : `${first} ${second}`);
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
        <div className="flex rounded-xl bg-rk-cream p-1">
          {OCCASION_IDS.map((id) => (
            <button key={id} type="button" onClick={() => setOccasion(id)} className={`flex-1 rounded-lg py-2 text-[13px] font-semibold ${occasion === id ? "bg-white shadow-sm" : "text-rk-mute"}`}>
              {OCCASIONS[id].name}
            </button>
          ))}
        </div>
        <div className={single ? "" : "grid grid-cols-2 gap-3"}>
          <L label={single ? "Nama panggilan" : "Nama panggilan 1"}>
            <input value={first} onChange={(e) => setFirst(e.target.value)} className={input} placeholder={single ? "Alea" : "Afdal"} />
          </L>
          {!single && (
            <L label="Nama panggilan 2">
              <input value={second} onChange={(e) => setSecond(e.target.value)} className={input} placeholder="Putri" />
            </L>
          )}
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
              {[...THEME_IDS].sort((a, b) => Number(THEMES[b].occasion === occasion) - Number(THEMES[a].occasion === occasion)).map((id) => {
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
          <div className="grid gap-2 sm:grid-cols-2">
            {plans.filter((p) => PAID_PLAN_IDS.includes(p.id)).map((p) => (
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
          disabled={pending || !first.trim() || (!single && !second.trim()) || (check !== null && !check.available)}
          onClick={() =>
            start(async () => {
              setError("");
              const r = await createSiteAction({ firstName: first, secondName: second, slug: finalSlug, planId, theme: start0 === "custom" ? (custom.mode === "dark" ? "arya" : "afdal") : theme, style: start0 === "custom" ? custom : undefined, eventDate: date, clientName: client, clientPhone: phone, notes, sample, occasion });
              if (r.ok) onCreated({ slug: r.slug, password: r.password, phone, title: single ? first : `${first} & ${second}` });
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

export function AccessModal({ title, slug, password, phone, coupleTitle, onClose }: { title: string; slug: string; password: string; phone: string; coupleTitle: string; onClose: () => void }) {
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

export function ResetAccessModal({ site, onClose }: { site: SiteSummary; onClose: () => void }) {
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

export function EditSiteModal({ site, plans, onClose, onSaved }: { site: SiteSummary; plans: Plan[]; onClose: () => void; onSaved: () => void }) {
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

export function DeleteModal({ site, onClose, onDeleted }: { site: SiteSummary; onClose: () => void; onDeleted: () => void }) {
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
