"use client";

import { Check, ChevronRight, EyeOff, Lock } from "lucide-react";
import { BLOCK_LABELS, blockStatus, SECTION_KEYS, type BlockKey } from "@/lib/content";
import { useEditor } from "../context";

const ALL_BLOCKS: BlockKey[] = ["cover", "hero", ...SECTION_KEYS, "closing"];

export function useProgress() {
  const { content: c, plan } = useEditor();
  const locked = plan.locked;
  const rows = ALL_BLOCKS.filter((k) => !(locked as BlockKey[]).includes(k) && !(c.hidden as BlockKey[]).includes(k)).map((k) => ({ key: k, ...blockStatus(c, k) }));
  const complete = rows.filter((r) => r.done === r.total).length;
  return { rows, complete, total: rows.length };
}

export function ChecklistPanel({ onOpen }: { onOpen: (k: BlockKey) => void }) {
  const { content: c, plan } = useEditor();
  const { complete, total } = useProgress();
  const locked = plan.locked as BlockKey[];
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-baseline justify-between font-rk-sans">
          <span className="text-[14px] font-semibold text-rk-ink">
            {complete} dari {total} bagian lengkap
          </span>
          <span className="text-[12px] text-rk-mute">{Math.round((complete / Math.max(1, total)) * 100)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-rk-cream">
          <div className="h-full rounded-full bg-rk-ink transition-all" style={{ width: `${(complete / Math.max(1, total)) * 100}%` }} />
        </div>
      </div>
      <div className="divide-y divide-rk-line overflow-hidden rounded-2xl border border-rk-line bg-white">
        {ALL_BLOCKS.map((k) => {
          const s = blockStatus(c, k);
          const isLocked = locked.includes(k);
          const isHidden = (c.hidden as BlockKey[]).includes(k);
          const ok = s.done === s.total;
          return (
            <button key={k} type="button" onClick={() => onOpen(k)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-rk-ivory">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isLocked || isHidden ? "bg-rk-cream text-rk-mute" : ok ? "bg-emerald-600 text-white" : "border-2 border-dashed border-rk-gold"}`}>
                {isLocked ? <Lock className="h-3 w-3" /> : isHidden ? <EyeOff className="h-3 w-3" /> : ok ? <Check className="h-3.5 w-3.5" /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-rk-sans text-[14px] font-semibold text-rk-ink">{BLOCK_LABELS[k]}</span>
                <span className="block truncate font-rk-sans text-[12px] text-rk-mute">
                  {isLocked ? "Tidak termasuk paket" : isHidden ? "Disembunyikan" : ok ? "Lengkap" : `Belum: ${s.missing.join(", ")}`}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-rk-mute" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
