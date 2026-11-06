"use client";

import { Check, Star, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteReviewAction, saveReviewAction, setReviewStatusAction } from "@/app/actions/reviews";


import { OCCASION_IDS, OCCASIONS, type Occasion } from "@/lib/content";
import { SITE_HOST } from "@/lib/messages";
import type { ReviewRecord, ReviewStatus } from "@/lib/records";
import { fmtDate, ghost, input, L, Modal, primary } from "./ui";

type ReviewDraft = { id: number | null; name: string; occasion: Occasion; city: string; rating: number; message: string; link: string; status: ReviewStatus };
const EMPTY_REVIEW: ReviewDraft = { id: null, name: "", occasion: "nikah", city: "", rating: 5, message: "", link: "", status: "shown" };

function Stars({ n, onPick }: { n: number; onPick?: (n: number) => void }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" disabled={!onPick} onClick={() => onPick?.(i)} aria-label={`${i} bintang`} className="disabled:cursor-default">
          <Star className={`h-4 w-4 ${i <= n ? "fill-[#F5B400] text-[#F5B400]" : "text-rk-line"}`} />
        </button>
      ))}
    </span>
  );
}

export function ReviewsTab({ reviews }: { reviews: ReviewRecord[] }) {
  const router = useRouter();
  const [edit, setEdit] = useState<ReviewDraft | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const status = (id: number, st: ReviewStatus) =>
    start(async () => {
      const r = await setReviewStatusAction(id, st);
      if (!r.ok) alert(r.error);
      router.refresh();
    });
  const remove = (id: number) =>
    start(async () => {
      if (!confirm("Hapus ulasan ini?")) return;
      await deleteReviewAction(id);
      router.refresh();
    });
  const LABEL: Record<ReviewStatus, [string, string]> = { pending: ["Menunggu", "bg-rk-gold/30 text-rk-ink"], shown: ["Tampil di beranda", "bg-emerald-50 text-emerald-700"], hidden: ["Disembunyikan", "bg-rk-cream text-rk-mute"] };
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-rk-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-rk-mute">
          Klien bisa menulis ulasan dari halaman admin mereka (Pengaturan → Ulasan). Ulasan baru menunggu persetujuan. Tambahkan manual hanya ulasan <b className="text-rk-ink">asli</b> dari klien, dengan izin mereka.
        </p>
        <button type="button" onClick={() => setEdit({ ...EMPTY_REVIEW })} className={`${primary} shrink-0`}>
          <Plus className="h-4 w-4" /> Tambah ulasan
        </button>
      </div>
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-rk-line bg-white p-10 text-center">
          <p className="font-rk-serif text-[26px]">Belum ada ulasan</p>
          <p className="mt-1 text-[14px] text-rk-mute">Selama kosong, beranda dan /ulasan menampilkan kotak “Ulasan pertama sedang kami kumpulkan”. Ulasan yang ditampilkan langsung menggantikannya.</p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-rk-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold">{r.name}</p>
                  <p className="text-[12px] text-rk-mute">
                    {OCCASIONS[(r.occasion as Occasion) in OCCASIONS ? (r.occasion as Occasion) : "nikah"].name}
                    {r.city ? ` · ${r.city}` : ""} · {fmtDate(r.createdAt)}
                    {r.siteSlug ? ` · dari ${SITE_HOST}/${r.siteSlug}` : ""}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${LABEL[r.status][1]}`}>{LABEL[r.status][0]}</span>
              </div>
              <div className="mt-2">
                <Stars n={r.rating} />
              </div>
              <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed">{r.message}</p>
              {r.link && <p className="mt-2 truncate text-[12px] text-rk-mute">Link: {r.link}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {r.status !== "shown" && (
                  <button type="button" disabled={pending} onClick={() => status(r.id, "shown")} className={primary}>
                    <Check className="h-4 w-4" /> Tampilkan
                  </button>
                )}
                {r.status === "shown" && (
                  <button type="button" disabled={pending} onClick={() => status(r.id, "hidden")} className={ghost}>
                    Sembunyikan
                  </button>
                )}
                <button type="button" onClick={() => setEdit({ id: r.id, name: r.name, occasion: (r.occasion as Occasion) in OCCASIONS ? (r.occasion as Occasion) : "nikah", city: r.city ?? "", rating: r.rating, message: r.message, link: r.link ?? "", status: r.status })} className={ghost}>
                  <Pencil className="h-4 w-4" /> Ubah
                </button>
                <button type="button" disabled={pending} onClick={() => remove(r.id)} className={`${ghost} text-red-700`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {edit && (
        <Modal title={edit.id ? "Ubah ulasan" : "Tambah ulasan"} onClose={() => setEdit(null)}>
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <L label="Nama (seperti ingin ditampilkan)">
                <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className={input} placeholder="Rina & Bagus" />
              </L>
              <L label="Kota">
                <input value={edit.city} onChange={(e) => setEdit({ ...edit, city: e.target.value })} className={input} placeholder="Bandung" />
              </L>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <L label="Acara">
                <select value={edit.occasion} onChange={(e) => setEdit({ ...edit, occasion: e.target.value as Occasion })} className={input}>
                  {OCCASION_IDS.map((id) => (
                    <option key={id} value={id}>
                      {OCCASIONS[id].name}
                    </option>
                  ))}
                </select>
              </L>
              <L label="Nilai">
                <div className="flex h-[42px] items-center">
                  <Stars n={edit.rating} onPick={(n) => setEdit({ ...edit, rating: n })} />
                </div>
              </L>
            </div>
            <L label="Isi ulasan">
              <textarea value={edit.message} onChange={(e) => setEdit({ ...edit, message: e.target.value })} rows={4} className={`${input} resize-none`} />
            </L>
            <L label="Link undangan (opsional)" hint="Hanya bila pemiliknya mengizinkan undangannya dilihat publik. Kosongkan = tampil sebagai undangan privat.">
              <input value={edit.link} onChange={(e) => setEdit({ ...edit, link: e.target.value })} className={input} placeholder="https://rayakan.my.id/…" />
            </L>
            <L label="Status">
              <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value as ReviewStatus })} className={input}>
                <option value="shown">Tampil di beranda</option>
                <option value="pending">Menunggu</option>
                <option value="hidden">Disembunyikan</option>
              </select>
            </L>
            {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-semibold text-red-700">{error}</p>}
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  setError("");
                  const r = await saveReviewAction(edit.id, edit);
                  if (!r.ok) return setError(r.error);
                  setEdit(null);
                  router.refresh();
                })
              }
              className={`${primary} h-11 w-full`}
            >
              Simpan ulasan
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
