"use client";

import { ArrowDown, ArrowUp, ImagePlus, Loader2, Lock, Trash2 } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

export const inputCls =
  "w-full rounded-xl border border-rk-line bg-white px-3.5 py-3 font-rk-sans text-[15px] text-rk-ink outline-none transition placeholder:text-rk-mute/60 focus:border-rk-ink focus:ring-2 focus:ring-rk-gold/30";

export function Field({ label, hint, children, counter }: { label: string; hint?: ReactNode; children: ReactNode; counter?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="font-rk-sans text-[13px] font-semibold text-rk-ink">{label}</span>
        {counter && <span className="font-rk-sans text-[11px] text-rk-mute">{counter}</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block font-rk-sans text-[12px] leading-snug text-rk-mute">{hint}</span>}
    </label>
  );
}

export function Text({ value, onChange, placeholder, maxLength }: { value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number }) {
  return <input value={value} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />;
}

export function Area({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls} resize-none leading-relaxed`} />;
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-4 rounded-xl border border-rk-line bg-white px-3.5 py-3 text-left">
      <span>
        <span className="block font-rk-sans text-[14px] font-semibold text-rk-ink">{label}</span>
        {hint && <span className="mt-0.5 block font-rk-sans text-[12px] text-rk-mute">{hint}</span>}
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-rk-ink" : "bg-rk-line"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; disabled?: boolean }[] }) {
  return (
    <div className="flex rounded-xl bg-rk-cream p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          disabled={o.disabled}
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-lg px-2 py-2 font-rk-sans text-[13px] font-semibold transition disabled:opacity-40 ${
            value === o.value ? "bg-white text-rk-ink shadow-sm" : "text-rk-mute"
          }`}
        >
          {o.disabled && <Lock className="-mt-0.5 mr-1 inline h-3 w-3" />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Group({ title, children, action }: { title?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="space-y-3.5">
      {(title || action) && (
        <div className="flex items-center justify-between">
          {title && <h3 className="font-rk-sans text-[11px] font-bold uppercase tracking-[1.5px] text-rk-mute">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export type Uploader = (file: File, opts?: { maxSide?: number }) => Promise<string>;

/** Photo slot: shows a preview, lets the user replace or remove it. */
export function ImageField({
  label,
  hint,
  value,
  resolve,
  upload,
  onChange,
  aspect = "aspect-[4/3]",
  maxSide,
  optional,
  fit = "cover",
  onFile,
}: {
  label: string;
  hint?: ReactNode;
  value: string;
  resolve: (src: string) => string;
  upload: Uploader;
  onChange: (v: string) => void;
  aspect?: string;
  maxSide?: number;
  optional?: boolean;
  fit?: "cover" | "contain";
  onFile?: (file: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const url = resolve(value);
  const pick = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    setError("");
    try {
      onChange(await upload(f, { maxSide }));
      onFile?.(f);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah foto.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="font-rk-sans text-[13px] font-semibold text-rk-ink">{label}</span>
          {optional && <span className="font-rk-sans text-[11px] text-rk-mute">Opsional</span>}
        </div>
      )}
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`group relative w-full overflow-hidden rounded-xl border border-rk-line bg-[repeating-conic-gradient(#f3ece0_0_25%,#fbf7ef_0_50%)] bg-[length:16px_16px] ${aspect}`}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`} />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-rk-mute">
            <ImagePlus className="h-6 w-6" strokeWidth={1.6} />
            <span className="font-rk-sans text-[13px] font-medium">Pilih foto</span>
          </span>
        )}
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="h-6 w-6 animate-spin text-rk-ink" />
          </span>
        )}
        {url && !busy && (
          <span className="absolute bottom-2 right-2 rounded-full bg-rk-ink/85 px-3 py-1.5 font-rk-sans text-[12px] font-semibold text-white backdrop-blur">Ganti foto</span>
        )}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 font-rk-sans text-[12px] font-semibold text-red-700">{error}</p>}
      <div className="mt-1.5 flex items-start justify-between gap-3">
        {hint && <span className="font-rk-sans text-[12px] leading-snug text-rk-mute">{hint}</span>}
        {url && optional && (
          <button type="button" onClick={() => onChange("")} className="shrink-0 font-rk-sans text-[12px] font-semibold text-red-700">
            Hapus
          </button>
        )}
      </div>
    </div>
  );
}

/** Card wrapper for one item in a repeatable list (story chapter, schedule, account…). */
export function ItemCard({
  title,
  children,
  onUp,
  onDown,
  onRemove,
}: {
  title: string;
  children: ReactNode;
  onUp?: () => void;
  onDown?: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rk-line bg-rk-ivory p-3.5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="truncate font-rk-sans text-[13px] font-bold text-rk-ink">{title}</span>
        <span className="flex shrink-0 items-center gap-1">
          {onUp && (
            <button type="button" aria-label="Naikkan" onClick={onUp} className="rounded-lg p-1.5 text-rk-mute hover:bg-white">
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
          {onDown && (
            <button type="button" aria-label="Turunkan" onClick={onDown} className="rounded-lg p-1.5 text-rk-mute hover:bg-white">
              <ArrowDown className="h-4 w-4" />
            </button>
          )}
          {onRemove && (
            <button type="button" aria-label="Hapus" onClick={onRemove} className="rounded-lg p-1.5 text-red-700 hover:bg-white">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function AddButton({ onClick, children, disabled }: { onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-xl border border-dashed border-rk-ink/30 py-3 font-rk-sans text-[14px] font-semibold text-rk-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function UpgradeNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-rk-gold/40 bg-rk-gold/10 px-3.5 py-3 font-rk-sans text-[13px] leading-snug text-rk-ink">
      <Lock className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function move<T>(arr: T[], i: number, d: -1 | 1): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
