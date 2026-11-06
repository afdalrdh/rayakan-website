"use client";

import { AlertTriangle, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { logoutOwnerAction } from "@/app/actions/studio";
import type { Plan } from "@/lib/content";
import type { AppSettings, ReviewRecord } from "@/lib/records";
import { PlansTab } from "./PlansTab";
import type { Env, SiteSummary } from "./types";
import { RequestsTab } from "./RequestsTab";
import { ReviewsTab } from "./ReviewsTab";
import { SettingsTab } from "./SettingsTab";
import { SitesTab } from "./SitesTab";

export type { SiteSummary } from "./types";

export function StudioApp({ sites, plans, settings, env, reviews }: { sites: SiteSummary[]; plans: Plan[]; settings: AppSettings; env: Env; reviews: ReviewRecord[] }) {
  const [tab, setTab] = useState<"sites" | "requests" | "reviews" | "plans" | "settings">("sites");
  const requests = sites.filter((s) => s.status === "draft" && s.requestedAt).length;
  const pendingReviews = reviews.filter((r) => r.status === "pending").length;
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
                ["sites", "Undangan", 0],
                ["requests", "Permintaan", requests],
                ["reviews", "Ulasan", pendingReviews],
                ["plans", "Paket & Harga", 0],
                ["settings", "Pengaturan", 0],
              ] as const
            ).map(([id, label, badge]) => (
              <button key={id} type="button" onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold ${tab === id ? "bg-rk-ink text-white" : "text-rk-mute hover:text-rk-ink"}`}>
                {label}
                {badge > 0 && <span className={`rounded-full px-1.5 text-[11px] ${tab === id ? "bg-white text-rk-ink" : "bg-rk-gold text-rk-ink"}`}>{badge}</span>}
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
        {tab === "requests" && <RequestsTab sites={sites} plans={plans} />}
        {tab === "reviews" && <ReviewsTab reviews={reviews} />}
        {tab === "plans" && <PlansTab plans={plans} />}
        {tab === "settings" && <SettingsTab settings={settings} />}
      </main>
    </div>
  );
}
