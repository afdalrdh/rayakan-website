"use client";

import { Check, Copy, Loader2, Lock, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { checkDraftSlugAction, createDraftAction } from "@/app/actions/draft";
import { saveContentAction } from "@/app/actions/site";
import { ResponsiveDialog } from "@/components/admin/ResponsiveDialog";
import { namesOf, slugify, type WeddingContent } from "@/lib/content";
import { SITE_HOST } from "@/lib/messages";
import { getMedia, rememberDraft, resetContent } from "@/lib/sandbox-store";
import { uploadToServer } from "@/lib/upload-client";
import { Field, inputCls } from "./fields";

/* "Simpan draf" for Coba Gratis: turns the browser-only sandbox into a real draft invitation. */

/** Every "media:<id>" reference in the content (sandbox uploads kept in this browser). */
function mediaRefs(v: unknown, out = new Set<string>()) {
  if (typeof v === "string") {
    if (v.startsWith("media:")) out.add(v);
  } else if (Array.isArray(v)) v.forEach((x) => mediaRefs(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => mediaRefs(x, out));
  return out;
}

function replaceRefs<T>(v: T, map: Map<string, string>): T {
  if (typeof v === "string") return (map.has(v) ? map.get(v) : v) as T;
  if (Array.isArray(v)) return v.map((x) => replaceRefs(x, map)) as T;
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, replaceRefs(x, map)])) as T;
  return v;
}

type Step = { kind: "form" } | { kind: "saving"; text: string } | { kind: "done"; slug: string; password: string };

export function SaveDraftDialog({ open, intent, content, onClose }: { open: boolean; intent: "save" | "send"; content: WeddingContent; onClose: () => void }) {
  const names = namesOf(content);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [slug, setSlug] = useState(() => slugify(names.single ? names.first : `${names.first}-${names.second}`));
  const [check, setCheck] = useState<Awaited<ReturnType<typeof checkDraftSlugAction>> | null>(null);
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>({ kind: "form" });
  const [copied, setCopied] = useState(false);

  // Live address check while typing.
  useEffect(() => {
    const s = slugify(slug);
    if (s.length < 3) return;
    let alive = true;
    const t = setTimeout(() => {
      checkDraftSlugAction(s)
        .then((r) => alive && setCheck(r))
        .catch(() => {});
    }, 400);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [slug]);
  const cleanSlug = slugify(slug);
  const shownCheck = cleanSlug.length < 3 ? { slug: cleanSlug, available: false, reason: "Minimal 3 huruf." } : check?.slug === cleanSlug ? check : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStep({ kind: "saving", text: "Membuat draf…" });
    try {
      const r = await createDraftAction({ name, phone, slug: cleanSlug, content, website });
      if (!r.ok) throw new Error(r.error);
      // Move photos that only live in this browser to the server, then save the full content.
      const refs = [...mediaRefs(content)];
      const map = new Map<string, string>();
      for (const [i, ref] of refs.entries()) {
        setStep({ kind: "saving", text: `Mengunggah foto ${i + 1} dari ${refs.length}…` });
        const blob = await getMedia(ref.slice(6));
        if (blob) map.set(ref, await uploadToServer(r.slug, blob, `foto-${i + 1}.${blob.type.includes("png") ? "png" : blob.type.includes("webp") ? "webp" : blob.type.startsWith("audio") ? "mp3" : "jpg"}`));
      }
      if (map.size) {
        setStep({ kind: "saving", text: "Menyimpan…" });
        const saved = await saveContentAction(r.slug, replaceRefs(content, map));
        if (!saved.ok) throw new Error(saved.error);
      }
      resetContent();
      rememberDraft(r.slug, names.joined || r.slug);
      setStep({ kind: "done", slug: r.slug, password: r.password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan. Coba lagi.");
      setStep({ kind: "form" });
    }
  };

  const done = step.kind === "done" ? step : null;
  const go = () => done && (window.location.href = `/${done.slug}/editor${intent === "send" ? "?kirim=1" : ""}`);

  return (
    <ResponsiveDialog
      open={open}
      onClose={() => (done ? go() : onClose())}
      title={done ? "Draf tersimpan 🎉" : intent === "send" ? "Simpan dulu, lalu kirim ke admin" : "Simpan draf undangan"}
      description={done ? "Simpan info masuk di bawah. Kamu bisa lanjut mengedit kapan saja." : "Gratis. Draf belum bisa dibuka tamu sampai diterbitkan."}
      icon={done ? <Check className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
      widthClass="max-w-[460px]"
    >
      {done ? (
        <div className="space-y-4 font-rk-sans">
          <div className="space-y-3 rounded-2xl bg-rk-cream p-4">
            <div>
              <p className="text-[12px] font-semibold text-rk-mute">Alamat undangan</p>
              <p className="break-all text-[15px] font-bold">
                {SITE_HOST}/{done.slug}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-rk-mute">Halaman edit & kelola tamu</p>
              <p className="break-all text-[15px] font-bold">
                {SITE_HOST}/{done.slug}/admin
              </p>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold text-rk-mute">Password</p>
                <p className="font-mono text-[18px] font-bold tracking-wide">{done.password}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(`Undangan: https://${SITE_HOST}/${done.slug}\nEdit: https://${SITE_HOST}/${done.slug}/admin\nPassword: ${done.password}`).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1600);
                  })
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-rk-line bg-white px-3 text-[13px] font-semibold"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Disalin" : "Salin semua"}
              </button>
            </div>
          </div>
          <p className="text-[12px] leading-snug text-rk-mute">Screenshot atau salin info ini. Di perangkat ini kamu sudah otomatis masuk.</p>
          <button type="button" onClick={go} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-rk-ink text-[15px] font-bold text-white">
            {intent === "send" ? (
              <>
                <Send className="h-4 w-4" /> Lanjut kirim ke admin
              </>
            ) : (
              "Lanjut edit undangan"
            )}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4 font-rk-sans">
          <Field label="Nama kamu">
            <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} placeholder="Nama lengkap" autoComplete="name" className={inputCls} />
          </Field>
          <Field label="Nomor WhatsApp" hint="Untuk konfirmasi pembayaran dan bantuan dari admin.">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required inputMode="tel" placeholder="0812 3456 7890" autoComplete="tel" className={inputCls} />
          </Field>
          <Field label="Alamat undangan">
            <div className="flex items-center overflow-hidden rounded-xl border border-rk-line bg-white focus-within:border-rk-ink focus-within:ring-2 focus-within:ring-rk-gold/30">
              <span className="shrink-0 pl-3.5 text-[14px] text-rk-mute">{SITE_HOST}/</span>
              <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} required className="min-w-0 flex-1 bg-transparent px-1 py-3 text-[15px] outline-none" />
            </div>
            {shownCheck && (
              <span className={`mt-1.5 block text-[12px] font-semibold ${shownCheck.available ? "text-emerald-700" : "text-red-700"}`}>
                {shownCheck.available ? "✓ Alamat tersedia" : `${shownCheck.reason ?? "Tidak tersedia"}`}
                {!shownCheck.available && check?.suggestion && (
                  <button type="button" onClick={() => setSlug(check.suggestion!)} className="ml-1.5 underline underline-offset-2">
                    Pakai {check.suggestion}
                  </button>
                )}
              </span>
            )}
          </Field>
          {/* honeypot */}
          <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-px w-px opacity-0" name="website" />
          {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-semibold text-red-700">{error}</p>}
          <button type="submit" disabled={step.kind === "saving" || (shownCheck !== null && !shownCheck.available)} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-rk-ink text-[15px] font-bold text-white disabled:opacity-50">
            {step.kind === "saving" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {step.text}
              </>
            ) : (
              "Simpan draf"
            )}
          </button>
          <p className="text-center text-[11.5px] leading-snug text-rk-mute">Dengan menyimpan, admin Rayakan.my.id boleh menghubungimu lewat WhatsApp terkait undangan ini.</p>
        </form>
      )}
    </ResponsiveDialog>
  );
}
