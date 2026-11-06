"use client";

import { Check, ChevronRight, EyeOff, Lock } from "lucide-react";
import {
  blockLabel,
  blockStatus,
  samplePhotos,
  SECTION_KEYS,
  type BlockKey,
} from "@/lib/content";
import { useEditor } from "../context";

const ALL_BLOCKS: BlockKey[] = ["cover", "hero", ...SECTION_KEYS, "closing"];

export function useProgress() {
  const { content: c, plan } = useEditor();
  const locked = plan.locked;
  const rows = ALL_BLOCKS.filter(
    (k) =>
      !(locked as BlockKey[]).includes(k) &&
      !(c.hidden as BlockKey[]).includes(k),
  ).map((k) => ({ key: k, ...blockStatus(c, k) }));
  const complete = rows.filter((r) => r.done === r.total).length;
  return { rows, complete, total: rows.length };
}

export function ChecklistPanel({ onOpen }: { onOpen: (k: BlockKey) => void }) {
  const { content: c, plan, update } = useEditor();
  const { complete, total } = useProgress();
  const toggle = (k: BlockKey, on: boolean) =>
    update(
      (d) =>
        void (d.hidden = on
          ? d.hidden.filter((x) => x !== k)
          : [...d.hidden, k as (typeof d.hidden)[number]]),
    );
  const locked = plan.locked as BlockKey[];
  const samples = samplePhotos(c);
  return (
    <div className="space-y-4">
      {samples.length > 0 && (
        <p className="rounded-2xl bg-rk-gold/15 p-3.5 font-rk-sans text-[12.5px] leading-snug text-rk-ink">
          <b>Masih memakai foto contoh:</b> {samples.join(", ")}. Ganti dengan foto kamu, atau sembunyikan bagiannya, sebelum dikirim ke tamu.
        </p>
      )}
      <div>
        <div className="flex items-baseline justify-between font-rk-sans">
          <span className="text-[14px] font-semibold text-rk-ink">
            {complete} dari {total} bagian lengkap
          </span>
          <span className="text-[12px] text-rk-mute">
            {Math.round((complete / Math.max(1, total)) * 100)}%
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-rk-cream">
          <div
            className="h-full rounded-full bg-rk-ink transition-all"
            style={{ width: `${(complete / Math.max(1, total)) * 100}%` }}
          />
        </div>
      </div>
      <div className="divide-y divide-rk-line overflow-hidden rounded-2xl border border-rk-line bg-white">
        {ALL_BLOCKS.map((k) => {
          const s = blockStatus(c, k);
          const isLocked = locked.includes(k);
          const isHidden = (c.hidden as BlockKey[]).includes(k);
          const ok = s.done === s.total;
          const optional =
            (SECTION_KEYS as readonly string[]).includes(k) && !isLocked;
          return (
            <div key={k} className="flex items-center hover:bg-rk-ivory">
              <button
                type="button"
                onClick={() => onOpen(k)}
                className="flex min-w-0 flex-1 items-center gap-3 py-3.5 pl-4 text-left"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isLocked || isHidden ? "bg-rk-cream text-rk-mute" : ok ? "bg-emerald-600 text-white" : "border-2 border-dashed border-rk-gold"}`}
                >
                  {isLocked ? (
                    <Lock className="h-3 w-3" />
                  ) : isHidden ? (
                    <EyeOff className="h-3 w-3" />
                  ) : ok ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-rk-sans text-[14px] font-semibold text-rk-ink">
                    {blockLabel(k, c.occasion)}
                  </span>
                  <span className="block truncate font-rk-sans text-[12px] text-rk-mute">
                    {isLocked
                      ? "Tidak termasuk paket"
                      : isHidden
                        ? "Disembunyikan"
                        : ok
                          ? "Lengkap"
                          : `Belum: ${s.missing.join(", ")}`}
                  </span>
                </span>
                {!optional && (
                  <ChevronRight className="mr-4 h-4 w-4 text-rk-mute" />
                )}
              </button>
              {optional && (
                <button
                  type="button"
                  role="switch"
                  aria-checked={!isHidden}
                  aria-label={`${isHidden ? "Tampilkan" : "Sembunyikan"} ${blockLabel(k, c.occasion)}`}
                  title={isHidden ? "Tampilkan bagian" : "Sembunyikan bagian"}
                  onClick={() => toggle(k, isHidden)}
                  className="flex h-full shrink-0 items-center py-3.5 pl-2 pr-4"
                >
                  <span
                    className={`relative h-5 w-9 rounded-full transition ${isHidden ? "bg-rk-line" : "bg-rk-ink"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${isHidden ? "left-0.5" : "left-[18px]"}`}
                    />
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
