"use client";

import Image from "next/image";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

type Action = (state: { error?: string } | undefined, form: FormData) => Promise<{ error?: string }>;

export function LoginCard({
  title,
  subtitle,
  action,
  fields,
  hidden,
  note,
}: {
  title: string;
  subtitle: string;
  action: Action;
  fields: { name: string; label: string; type?: string; autoComplete?: string }[];
  hidden?: Record<string, string>;
  note?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-rk-ink px-4 py-10 font-rk-sans">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center text-rk-ivory">
          <Image src="/brand/logo.png" alt="" width={52} height={42} priority />
          <h1 className="mt-5 font-rk-serif text-[38px] leading-none">{title}</h1>
          <p className="mt-2 text-[14px] text-rk-ivory/60">{subtitle}</p>
        </div>
        <form action={formAction} className="space-y-4 rounded-[24px] bg-rk-ivory p-6 shadow-2xl">
          {hidden && Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
          {fields.map((f) => (
            <label key={f.name} className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-rk-ink">{f.label}</span>
              <input
                name={f.name}
                type={f.type ?? "text"}
                autoComplete={f.autoComplete}
                required
                className="w-full rounded-xl border border-rk-line bg-white px-3.5 py-3 text-[15px] text-rk-ink outline-none focus:border-rk-ink focus:ring-2 focus:ring-rk-gold/30"
              />
            </label>
          ))}
          {state?.error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-semibold text-red-700">{state.error}</p>}
          <button type="submit" disabled={pending} className="flex h-12 w-full items-center justify-center rounded-xl bg-rk-ink text-[15px] font-bold text-white hover:bg-rk-plum disabled:opacity-60">
            {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Masuk"}
          </button>
          {note && <div className="text-center text-[12px] leading-snug text-rk-mute">{note}</div>}
        </form>
      </div>
    </main>
  );
}
