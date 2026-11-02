"use client";

import { Check, X } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { Plan } from "@/lib/content";

/* Shared pieces for the client admin (/[slug]/admin). Rayakan.my.id design system: rk-* colours, Plus Jakarta Sans, Instrument Serif. */

export interface AdminSite {
  slug: string;
  title: string;
  status: "draft" | "published";
  plan: Plan;
  expiresAt: string | null;
  isOwner: boolean;
  adminWhatsapp: string;
  siteUrl: string;
}

const Ctx = createContext<AdminSite | null>(null);
export function AdminSiteProvider({ value, children }: { value: AdminSite; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useAdminSite() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AdminSiteProvider missing");
  return v;
}

export const btn = "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3.5 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";
export const btnPrimary = `${btn} bg-rk-ink text-white hover:bg-rk-plum`;
export const btnGhost = `${btn} border border-rk-line bg-white text-rk-ink hover:bg-rk-ivory`;
export const btnGreen = `${btn} border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100`;
export const inputCls = "h-10 w-full rounded-xl border border-rk-line bg-white px-3.5 text-[13px] text-rk-ink outline-none transition placeholder:text-rk-mute/70 focus:border-rk-ink focus:ring-2 focus:ring-rk-gold/25";
export const card = "rounded-2xl border border-rk-line bg-white";

export function StatCard({ label, value, icon, tone = "ink" }: { label: string; value: ReactNode; icon: ReactNode; tone?: "ink" | "green" | "mute" | "gold" }) {
  const toneCls = { ink: "bg-rk-cream text-rk-ink", green: "bg-emerald-50 text-emerald-700", mute: "bg-rk-ivory text-rk-mute", gold: "bg-[#fbf1d4] text-rk-bronze" }[tone];
  return (
    <div className={`${card} flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3`}>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium text-rk-mute sm:text-[12px]">{label}</p>
        <p className="mt-1 text-[19px] font-bold leading-none tabular-nums tracking-tight sm:text-[22px]">{value}</p>
      </div>
      <span className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:flex ${toneCls}`}>{icon}</span>
    </div>
  );
}

export function Field({ label, hint, optional, children }: { label: string; hint?: ReactNode; optional?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[12px] font-bold text-rk-ink">{label}</span>
        {optional && <span className="text-[11px] text-rk-mute">Opsional</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[11px] leading-snug text-rk-mute">{hint}</span>}
    </label>
  );
}

export interface ToastData {
  id: number;
  title: string;
  message?: string;
  tone?: "ok" | "wa" | "error";
}

/** One toast at a time, bottom-right on desktop, bottom-centre on phones. */
export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useRef(0);
  const show = useCallback((title: string, message?: string, tone: ToastData["tone"] = "ok") => {
    if (timer.current) clearTimeout(timer.current);
    id.current += 1;
    setToast({ id: id.current, title, message, tone });
    timer.current = setTimeout(() => setToast(null), 3000);
  }, []);
  const node = toast ? (
    <div key={toast.id} role="status" aria-live="polite" className="rk-sheet-in fixed inset-x-4 bottom-5 z-[90] mx-auto flex max-w-[380px] items-center gap-3 rounded-2xl bg-rk-ink/95 px-4 py-3 text-white shadow-2xl backdrop-blur sm:inset-x-auto sm:right-6 sm:bottom-6">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toast.tone === "error" ? "bg-red-500/20 text-red-300" : toast.tone === "wa" ? "bg-[#25D366]/20 text-[#25D366]" : "bg-emerald-500/20 text-emerald-300"}`}>
        {toast.tone === "error" ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-bold">{toast.title}</span>
        {toast.message && <span className="mt-0.5 block truncate text-[12px] text-white/70">{toast.message}</span>}
      </span>
      <button type="button" aria-label="Tutup" onClick={() => setToast(null)} className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  ) : null;
  return { show, node };
}

/** Copy text, with a fallback for older browsers. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "-", time: "" };
  return {
    date: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(d),
    time: new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).format(d).replace(":", "."),
  };
}

/** Indonesian numbers shown as 0812-3456-7890. */
export function formatPhone(raw: string | null | undefined) {
  const d = (raw || "").replace(/\D/g, "");
  if (!d) return "";
  const local = d.startsWith("62") ? `0${d.slice(2)}` : d.startsWith("8") ? `0${d}` : d;
  return local.replace(/^(\d{4})(\d{4})(\d{0,5})$/, (_, a, b, c) => (c ? `${a}-${b}-${c}` : `${a}-${b}`));
}
