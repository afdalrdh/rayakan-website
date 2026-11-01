"use client";

import { ExternalLink, Gift, Laptop, LayoutList, ListChecks, MessageCircleHeart, MoreHorizontal, Music2, Palette, Send, Smartphone, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SITE_HOST } from "@/lib/messages";
import type { Device } from "./canvas/Canvas";
import { useEditor } from "./context";
import { useProgress } from "./panels";
import type { PanelKind } from "./PanelHost";

/* Editor frame: sidebar (desktop), top bar, toolbar and bottom tabs (phone). */

export type Tab = "undangan" | "tamu" | "ucapan" | "lainnya";

function BrandMark() {
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" />
      <span className="font-rk-serif text-[20px] leading-none">Rayakan.my.id</span>
    </span>
  );
}

const TABS: { id: Tab; label: string; icon: typeof Gift }[] = [
  { id: "undangan", label: "Undangan", icon: LayoutList },
  { id: "tamu", label: "Tamu", icon: Users },
  { id: "ucapan", label: "Ucapan", icon: MessageCircleHeart },
  { id: "lainnya", label: "Lainnya", icon: MoreHorizontal },
];

export function Sidebar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const { slug, status } = useEditor();
  return (
    <aside className="hidden border-r border-rk-line bg-white lg:row-span-2 lg:flex lg:flex-col">
      <div className="flex h-16 items-center px-5">
        <BrandMark />
      </div>
      <nav className="flex-1 space-y-1 px-3 pt-4">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition ${tab === id ? "bg-rk-ink text-white" : "text-rk-mute hover:bg-rk-ivory hover:text-rk-ink"}`}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </nav>
      <div className="m-3 rounded-2xl bg-rk-cream p-4">
        <p className="text-[12px] font-semibold text-rk-mute">Undangan kamu</p>
        <p className="mt-0.5 truncate text-[14px] font-bold">
          {SITE_HOST}/{slug}
        </p>
        <span className={`mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-bold ${status === "published" ? "text-emerald-700" : "text-rk-mute"}`}>{status === "published" ? "● Sudah terbit" : "● Draft"}</span>
      </div>
    </aside>
  );
}

export function TopBar({ title, saved, previewHref, isOwner, onPublish }: { title: string; saved: "saved" | "saving" | "error"; previewHref: string; isOwner: boolean; onPublish: () => void }) {
  const { status } = useEditor();
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-rk-line bg-white px-4 lg:col-span-2 lg:col-start-2 lg:h-16 lg:px-6">
      <span className="lg:hidden">
        <Image src="/brand/logo.png" alt="Rayakan.my.id" width={30} height={24} className="h-6 w-auto" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold leading-tight lg:text-[15px]">
          {isOwner && <Link href="/studio" className="mr-1.5 text-rk-mute hover:text-rk-ink">Studio /</Link>}
          Undangan {title}
        </p>
        <p className={`flex items-center gap-1.5 text-[12px] ${saved === "error" ? "font-semibold text-red-700" : "text-rk-mute"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${saved === "saved" ? "bg-emerald-500" : saved === "error" ? "bg-red-600" : "animate-pulse bg-rk-gold"}`} />
          {saved === "saved" ? "Tersimpan" : saved === "error" ? "Gagal menyimpan · periksa koneksi" : "Menyimpan…"}
        </p>
      </div>
      <a href={previewHref} target="_blank" rel="noreferrer" className="flex h-10 items-center gap-1.5 rounded-xl border border-rk-line px-3 text-[13px] font-semibold hover:bg-rk-ivory">
        <ExternalLink className="h-4 w-4" />
        <span className="hidden sm:inline">Lihat undangan</span>
      </a>
      <button type="button" onClick={onPublish} className="flex h-10 items-center gap-1.5 rounded-xl bg-rk-ink px-4 text-[13px] font-bold text-white hover:bg-rk-plum">
        <Send className="h-4 w-4" />
        {status === "published" ? "Bagikan" : "Terbitkan"}
      </button>
    </header>
  );
}

export function Toolbar({ device, setDevice, open }: { device: Device; setDevice: (d: Device) => void; open: (k: PanelKind) => void }) {
  const { complete, total } = useProgress();
  const chip = "flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-rk-line bg-white px-3.5 text-[13px] font-semibold hover:border-rk-ink/40";
  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b border-rk-line bg-rk-ivory px-3 lg:px-5">
      <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
        <button type="button" onClick={() => open("checklist")} className={`${chip} lg:hidden`}>
          <ListChecks className="h-4 w-4" />
          Isian {complete}/{total}
        </button>
        <button type="button" onClick={() => open("theme")} className={chip}>
          <Palette className="h-4 w-4" />
          Warna &amp; Logo
        </button>
        <button type="button" onClick={() => open("music")} className={chip}>
          <Music2 className="h-4 w-4" />
          Musik
        </button>
        <button type="button" onClick={() => open("order")} className={chip}>
          <LayoutList className="h-4 w-4" />
          Urutan
        </button>
      </div>
      <div className="flex shrink-0 rounded-full border border-rk-line bg-white p-0.5">
        {(
          [
            ["hp", Smartphone, "HP"],
            ["laptop", Laptop, "Laptop"],
          ] as const
        ).map(([id, Icon, label]) => (
          <button
            key={id}
            type="button"
            aria-label={`Pratinjau ${label}`}
            onClick={() => setDevice(id)}
            className={`flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-semibold ${device === id ? "bg-rk-ink text-white" : "text-rk-mute"}`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <nav className="grid shrink-0 grid-cols-4 border-t border-rk-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" onClick={() => setTab(id)} className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${tab === id ? "text-rk-ink" : "text-rk-mute"}`}>
          <span className={`flex h-7 w-12 items-center justify-center rounded-full transition ${tab === id ? "bg-rk-cream" : ""}`}>
            <Icon className="h-5 w-5" strokeWidth={tab === id ? 2.2 : 1.8} />
          </span>
          {label}
        </button>
      ))}
    </nav>
  );
}
