"use client";

import { KeyRound, Loader2, MessageSquareText, ReceiptText } from "lucide-react";
import { useState, useTransition } from "react";
import { changePasswordAction, saveWaTemplateAction } from "@/app/actions/site";
import { activeLabel } from "@/lib/content";
import { DEFAULT_WA_TEMPLATE, renderWaMessage, SITE_HOST } from "@/lib/messages";
import { btnGhost, btnPrimary, card, Field, inputCls, useAdminSite, useToast } from "./ui";

function SectionTitle({ icon, title, note }: { icon: React.ReactNode; title: string; note: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rk-cream">{icon}</span>
      <div>
        <h2 className="text-[15px] font-bold">{title}</h2>
        <p className="mt-0.5 text-[12px] text-rk-mute">{note}</p>
      </div>
    </div>
  );
}

/** Pengaturan: WhatsApp message, package info and password. */
export function SettingsPanel({ waTemplate }: { waTemplate: string | null }) {
  const { slug, plan, status, expiresAt, isOwner, siteUrl } = useAdminSite();
  const [tpl, setTpl] = useState(waTemplate || DEFAULT_WA_TEMPLATE);
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [pending, start] = useTransition();
  const toast = useToast();
  const preview = renderWaMessage(tpl, "Bapak Budi & Keluarga", `${siteUrl}/${slug}/bapak-budi-keluarga`);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section className={`${card} p-5 sm:p-6`}>
        <SectionTitle icon={<MessageSquareText className="h-[18px] w-[18px]" />} title="Pesan WhatsApp" note="Dipakai saat tombol Salin atau Kirim ditekan di menu Undangan." />
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <div>
            <Field label="Isi pesan" hint={<>Pakai <code className="rounded bg-rk-cream px-1 font-semibold">{"{{nama}}"}</code> untuk nama tamu dan <code className="rounded bg-rk-cream px-1 font-semibold">{"{{link}}"}</code> untuk link undangan.</>}>
              <textarea value={tpl} onChange={(e) => setTpl(e.target.value)} rows={14} maxLength={2000} className={`${inputCls} h-auto resize-y py-3 leading-relaxed`} />
            </Field>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const r = await saveWaTemplateAction(slug, tpl.trim() === DEFAULT_WA_TEMPLATE.trim() ? "" : tpl);
                    toast.show(r.ok ? "Pesan WhatsApp disimpan" : "Gagal menyimpan", r.ok ? undefined : r.error, r.ok ? "ok" : "error");
                  })
                }
                className={btnPrimary}
              >
                {pending && <Loader2 className="h-4 w-4 animate-spin" />} Simpan pesan
              </button>
              <button type="button" onClick={() => setTpl(DEFAULT_WA_TEMPLATE)} className={btnGhost}>
                Pakai pesan bawaan
              </button>
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[12px] font-bold">Contoh tampilan</p>
            <div className="rounded-2xl bg-[#e5ddd5] p-3">
              <div className="ml-auto max-w-[92%] whitespace-pre-line rounded-xl rounded-tr-none bg-[#d9fdd3] px-3 py-2 text-[13px] leading-relaxed text-[#111b21] shadow-sm">{preview}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-5">
        <section className={`${card} p-5`}>
          <SectionTitle icon={<ReceiptText className="h-[18px] w-[18px]" />} title="Paket & alamat" note="Hubungi admin Rayakan.my.id untuk upgrade." />
          <dl className="mt-4 divide-y divide-rk-line text-[13px]">
            {[
              ["Alamat", `${SITE_HOST}/${slug}`],
              ["Paket", `${plan.name} · aktif ${activeLabel(plan)}`],
              ["Status", status === "published" ? "Sudah terbit" : "Draft (belum terbit)"],
              ["Aktif sampai", expiresAt ? new Date(expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : status === "published" ? "Selamanya" : "Dihitung sejak terbit"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2.5">
                <dt className="text-rk-mute">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={`${card} p-5`}>
          <SectionTitle icon={<KeyRound className="h-[18px] w-[18px]" />} title="Ganti password" note="Minimal 8 karakter." />
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              start(async () => {
                const r = await changePasswordAction(slug, cur, next);
                toast.show(r.ok ? "Password diganti" : "Password belum diganti", r.ok ? undefined : r.error, r.ok ? "ok" : "error");
                if (r.ok) {
                  setCur("");
                  setNext("");
                }
              });
            }}
          >
            {!isOwner && (
              <Field label="Password lama">
                <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" className={inputCls} />
              </Field>
            )}
            <Field label="Password baru">
              <input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" className={inputCls} />
            </Field>
            <button type="submit" disabled={pending || next.length < 8} className={`${btnPrimary} h-10 w-full`}>
              Simpan password
            </button>
          </form>
        </section>
      </div>
      {toast.node}
    </div>
  );
}
