"use client";

import { BookOpen, ExternalLink, LogOut, Mail, Menu, Palette, Settings, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { logoutSiteAction } from "@/app/actions/site";
import { SITE_HOST } from "@/lib/messages";
import { useAdminSite } from "./ui";

const MENUS = [
  { path: "", label: "Undangan", icon: Mail, title: "Undangan", subtitle: "Kelola daftar tamu dan bagikan link undangan." },
  { path: "/reservasi", label: "Reservasi", icon: Users, title: "Reservasi", subtitle: "Pantau konfirmasi kehadiran dan doa restu tamu." },
  { path: "/desain", label: "Desain Undangan", icon: Palette, title: "Desain Undangan", subtitle: "Tampilan, warna, huruf, dan tata letak undangan." },
  { path: "/pengaturan", label: "Pengaturan", icon: Settings, title: "Pengaturan", subtitle: "Pesan WhatsApp, paket, dan keamanan akun." },
  { path: "/panduan", label: "Cara Pakai", icon: BookOpen, title: "Cara Pakai", subtitle: "Panduan singkat mengelola undangan." },
] as const;

function Nav({ base, active, onNavigate }: { base: string; active: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {MENUS.map(({ path, label, icon: Icon }) => {
        const on = active === path;
        return (
          <Link
            key={path}
            href={`${base}${path}`}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition ${on ? "bg-rk-ink text-white" : "text-rk-mute hover:bg-rk-ivory hover:text-rk-ink"}`}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SiteCard() {
  const { slug, status, isOwner } = useAdminSite();
  return (
    <div className="space-y-2">
      <div className="rounded-2xl bg-rk-cream p-4">
        <p className="text-[12px] font-semibold text-rk-mute">Undangan kamu</p>
        <p className="mt-0.5 truncate text-[14px] font-bold">
          {SITE_HOST}/{slug}
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className={`inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-bold ${status === "published" ? "text-emerald-700" : "text-rk-mute"}`}>{status === "published" ? "● Sudah terbit" : "● Draft"}</span>
          <a href={`/${slug}/preview`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] font-bold text-rk-ink hover:underline">
            Lihat <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
      <form action={logoutSiteAction.bind(null, slug)}>
        <button type="submit" className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-rk-mute transition hover:bg-red-50 hover:text-red-700">
          <LogOut className="h-4 w-4" />
          {isOwner ? "Kembali ke Studio" : "Keluar"}
        </button>
      </form>
    </div>
  );
}

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/brand/logo.png" alt="" width={30} height={24} className="h-6 w-auto" />
      <span className="font-rk-serif text-[20px] leading-none">Rayakan.my.id</span>
    </span>
  );
}

/** Frame of the client admin: sidebar on desktop, top bar + drawer on phones. */
export function AdminShell({ children }: { children: ReactNode }) {
  const { slug, title, isOwner } = useAdminSite();
  const pathname = usePathname();
  const base = `/${slug}/admin`;
  const active = MENUS.find((m) => m.path && pathname.startsWith(`${base}${m.path}`))?.path ?? "";
  const current = MENUS.find((m) => m.path === active)!;
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-rk-ivory font-rk-sans text-rk-ink lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-[100dvh] w-[248px] shrink-0 flex-col border-r border-rk-line bg-white lg:flex">
        <div className="flex h-16 items-center px-5">
          <Brand />
        </div>
        <div className="px-5 pb-4">
          <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-rk-mute">{isOwner ? "Admin (pemilik)" : "Admin undangan"}</p>
          <span className="mt-2 inline-flex max-w-full truncate rounded-full bg-rk-cream px-3 py-1.5 text-[12px] font-bold">{title}</span>
        </div>
        <div className="flex-1 overflow-y-auto px-3">
          <Nav base={base} active={active} />
        </div>
        <div className="p-3">
          <SiteCard />
        </div>
      </aside>

      {/* Phone top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-rk-line bg-white/95 px-3 backdrop-blur lg:hidden">
        <button type="button" onClick={() => setOpen(true)} aria-label="Buka menu" className="rounded-xl p-2 hover:bg-rk-ivory">
          <Menu className="h-5 w-5" />
        </button>
        <p className="min-w-0 flex-1 truncate text-[15px] font-bold">{current.title}</p>
        <span className="max-w-[40%] truncate rounded-full bg-rk-cream px-3 py-1.5 text-[12px] font-bold">{title}</span>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Tutup menu" onClick={() => setOpen(false)} className="rk-fade-in absolute inset-0 bg-rk-ink/35 backdrop-blur-[2px]" />
          <div className="rk-sheet-in absolute inset-y-0 left-0 flex w-[272px] flex-col bg-white p-3 shadow-2xl">
            <div className="flex h-12 items-center justify-between px-2">
              <Brand />
              <button type="button" aria-label="Tutup menu" onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-rk-ivory">
                <X className="h-5 w-5" />
              </button>
            </div>
            <span className="mx-2 mt-2 inline-flex max-w-full self-start truncate rounded-full bg-rk-cream px-3 py-1.5 text-[12px] font-bold">{title}</span>
            <div className="mt-4 flex-1 overflow-y-auto">
              <Nav base={base} active={active} onNavigate={() => setOpen(false)} />
            </div>
            <SiteCard />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-6">
          <header className="mb-4 hidden lg:block">
            <h1 className="font-rk-serif text-[30px] leading-none">{current.title}</h1>
            <p className="mt-1.5 text-[13px] text-rk-mute">{current.subtitle}</p>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
