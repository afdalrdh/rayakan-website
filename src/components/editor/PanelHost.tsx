"use client";

import { ChevronLeft } from "lucide-react";
import { BLOCK_LABELS, type BlockKey } from "@/lib/content";
import { SITE_HOST } from "@/lib/messages";
import { BLOCK_FORMS } from "./blocks";
import { useEditor } from "./context";
import { ChecklistPanel, MusicPanel, OrderPanel, PublishPanel, ThemePanel } from "./panels";

/* Where forms and panels open: a side panel on desktop, a bottom sheet on phones. */

export type PanelKind = "theme" | "music" | "order" | "checklist" | "publish";
export type Panel = { kind: "block"; key: BlockKey } | { kind: PanelKind };

const PANEL_TITLES: Record<PanelKind, string> = {
  theme: "Tema & Warna",
  music: "Musik",
  order: "Urutan Bagian",
  checklist: "Isian Undangan",
  publish: "Terbitkan Undangan",
};

function panelTitle(p: Panel) {
  return p.kind === "block" ? BLOCK_LABELS[p.key] : PANEL_TITLES[p.kind];
}

function PanelBody({ panel, openBlock }: { panel: Panel; openBlock: (k: BlockKey) => void }) {
  if (panel.kind === "block") {
    const Form = BLOCK_FORMS[panel.key];
    return <BlockBody blockKey={panel.key} Form={Form} />;
  }
  if (panel.kind === "theme") return <ThemePanel />;
  if (panel.kind === "music") return <MusicPanel />;
  if (panel.kind === "order") return <OrderPanel />;
  if (panel.kind === "publish") return <PublishPanel />;
  return <ChecklistPanel onOpen={openBlock} />;
}

function BlockBody({ blockKey, Form }: { blockKey: BlockKey; Form: () => React.JSX.Element }) {
  const { plan, adminWhatsapp, slug } = useEditor();
  const lockedIn = (plan.locked as BlockKey[]).includes(blockKey);
  if (lockedIn) {
    return (
      <div className="space-y-4 rounded-2xl bg-rk-cream p-5 text-center">
        <p className="font-rk-serif text-[26px] leading-tight">{BLOCK_LABELS[blockKey]} belum termasuk paket {plan.name}</p>
        <p className="text-[13px] text-rk-mute">Upgrade ke Premium untuk menampilkan {BLOCK_LABELS[blockKey].toLowerCase()} di undangan kamu.</p>
        <a href={`https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(`Halo, saya ingin upgrade paket undangan ${SITE_HOST}/${slug}`)}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-xl bg-rk-ink px-5 text-[14px] font-bold text-white">
          Upgrade paket
        </a>
      </div>
    );
  }
  return <Form />;
}

export function SidePanel({ panel, setPanel, openBlock }: { panel: Panel | null; setPanel: (p: Panel | null) => void; openBlock: (k: BlockKey) => void }) {
  const current: Panel = panel ?? { kind: "checklist" };
  return (
    <aside className="hidden min-h-0 flex-col bg-white lg:col-start-3 lg:row-start-2 lg:flex">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-rk-line px-5">
        {panel && panel.kind !== "checklist" && (
          <button type="button" aria-label="Kembali ke isian" onClick={() => setPanel(null)} className="-ml-2 rounded-lg p-1.5 hover:bg-rk-ivory">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <h2 className="font-rk-serif text-[24px] leading-none">{panelTitle(current)}</h2>
      </div>
      <div key={JSON.stringify(current)} className="rk-sheet-in min-h-0 flex-1 overflow-y-auto px-5 py-6">
        <PanelBody panel={current} openBlock={openBlock} />
      </div>
    </aside>
  );
}

export function MobileSheet({ panel, setPanel, openBlock }: { panel: Panel | null; setPanel: (p: Panel | null) => void; openBlock: (k: BlockKey) => void }) {
  if (!panel) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
      <button type="button" aria-label="Tutup" className="rk-fade-in absolute inset-0 bg-rk-ink/25" onClick={() => setPanel(null)} />
      <div className="rk-sheet-in relative flex max-h-[62dvh] flex-col rounded-t-[28px] bg-white shadow-[0_-20px_40px_-10px_rgba(18,13,16,0.25)]">
        <div className="flex justify-center pt-2.5">
          <span className="h-1 w-10 rounded-full bg-rk-line" />
        </div>
        <div className="flex items-center gap-2 px-5 pb-3 pt-2">
          {panel.kind === "block" && (
            <button type="button" aria-label="Ke daftar isian" onClick={() => setPanel({ kind: "checklist" })} className="-ml-2 rounded-lg p-1.5 text-rk-mute">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="flex-1 font-rk-serif text-[26px] leading-none">{panelTitle(panel)}</h2>
          <button type="button" onClick={() => setPanel(null)} className="h-9 rounded-full bg-rk-ink px-4 text-[13px] font-bold text-white">
            Selesai
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-2">
          <PanelBody panel={panel} openBlock={openBlock} />
        </div>
      </div>
    </div>
  );
}
