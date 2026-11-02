"use client";

import { useState } from "react";
import { BANKS, type BankAccount } from "@/lib/content";
import { BankCard, CONTAINER, CopyIcon, GiftIcon, Heading, Img, Section, useCopy, useShowEmpty, useSrc, useTheme, validThru } from "../shared";

/* Bank / e-wallet accounts, plus an optional "send a present" card. */

type Gift = () => React.JSX.Element;

function NoAccounts() {
  const showEmpty = useShowEmpty();
  if (!showEmpty) return null;
  return <p className="mx-auto mt-10 max-w-[480px] rounded-[16px] border border-dashed border-t-muted/50 bg-t-card px-6 py-8 text-center text-[14px] text-t-fg2">Rekening belum diisi. Tambahkan dari editor bagian Amplop Digital.</p>;
}

function Registry({ className = "" }: { className?: string }) {
  const { content: c } = useTheme();
  const reg = c.gift.registry;
  if (!reg.url) return null;
  return (
    <article className={`flex flex-col overflow-hidden rounded-[20px] border border-t-line bg-t-card ${className}`}>
      {reg.image && (
        <div className="relative min-h-[200px] flex-1 px-6 pt-6 md:px-8 md:pt-8">
          <div className="relative h-full min-h-[200px] w-full">
            <Img src={reg.image} alt="" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-contain" />
          </div>
        </div>
      )}
      <div className="px-6 pb-7 pt-6 md:px-8 md:pb-8">
        <h3 className="t-head text-[26px] leading-[1.1] text-t-accent md:text-[30px]">{reg.title || "Kirim Hadiah"}</h3>
        {reg.body && <p className="mt-3 text-[15px] leading-[1.7] text-t-fg2">{reg.body}</p>}
        <a href={reg.url} target="_blank" rel="noreferrer" className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-t-accent px-6 text-[13px] font-bold uppercase tracking-[1.5px] text-t-on-accent transition hover:brightness-95">
          Pilih Hadiah <GiftIcon />
        </a>
      </div>
    </article>
  );
}

/** "Kartu Bank" (from Malam Emas): debit-card style accounts in a grid. */
const Kartu: Gift = () => {
  const { content: c } = useTheme();
  const g = c.gift;
  return (
    <Section block="gift">
      <div className="mx-auto w-full max-w-[960px]">
        <Heading eyebrow={g.eyebrow} title={g.title} body={g.body} />
        {!g.accounts.length && <NoAccounts />}
        <div className={`mt-12 grid gap-6 md:gap-8 ${g.accounts.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-[480px]"}`}>
          {g.accounts.map((a) => (
            <BankCard key={a.id} account={a} validThru={validThru(c.event.date)} />
          ))}
        </div>
        <Registry className="mt-8 sm:flex-row" />
      </div>
    </Section>
  );
};

/** "Kartu & Hadiah" (from Putih Marun): cards left, present card right with equal height. */
const Samping: Gift = () => {
  const { content: c } = useTheme();
  const g = c.gift;
  const side = !!g.registry.url;
  return (
    <Section block="gift">
      <div className={CONTAINER}>
        <Heading eyebrow={g.eyebrow} title={g.title} body={g.body} />
        {!g.accounts.length && <NoAccounts />}
        <div className={`mx-auto mt-12 grid gap-5 md:mt-14 lg:items-stretch lg:gap-8 ${side ? "max-w-[520px] lg:max-w-none lg:grid-cols-2" : "max-w-[1000px]"}`}>
          <div className={`grid content-center gap-5 ${side ? "" : g.accounts.length > 1 ? "md:grid-cols-2" : "mx-auto w-full max-w-[520px]"}`}>
            {g.accounts.map((a) => (
              <BankCard key={a.id} account={a} validThru={validThru(c.event.date)} className="shadow-[0_22px_45px_-18px_rgba(0,0,0,0.35)]" />
            ))}
          </div>
          {side && <Registry />}
        </div>
      </div>
    </Section>
  );
};

/** "Amplop Terbuka": accounts appear after the guest taps the button. */
const Amplop: Gift = () => {
  const { content: c, mode } = useTheme();
  const g = c.gift;
  const [open, setOpen] = useState(mode !== "live");
  return (
    <Section block="gift" tone="alt" className="text-center">
      <div className="mx-auto max-w-[960px]">
        <Heading eyebrow={g.eyebrow} title={g.title} body={g.body} />
        {!open ? (
          <button type="button" onClick={() => setOpen(true)} className="mt-10 inline-flex items-center gap-2.5 rounded-[12px] bg-t-accent px-7 py-4 text-[14px] font-bold uppercase tracking-[1.5px] text-t-on-accent shadow-lg transition hover:brightness-95">
            <GiftIcon /> Kirim Amplop Digital
          </button>
        ) : (
          <div className="rk-fade-in">
            {!g.accounts.length && <NoAccounts />}
            <div className={`mt-12 grid gap-6 text-left ${g.accounts.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-[480px]"}`}>
              {g.accounts.map((a) => (
                <BankCard key={a.id} account={a} validThru={validThru(c.event.date)} />
              ))}
            </div>
            <Registry className="mx-auto mt-8 max-w-[520px] text-left" />
          </div>
        )}
      </div>
    </Section>
  );
};

function AccountRow({ a }: { a: BankAccount }) {
  const preset = BANKS[a.bank] ?? BANKS.lainnya;
  const logo = useSrc(preset.logo);
  const { copied, copy } = useCopy();
  return (
    <div className="flex items-center gap-4 rounded-[16px] border border-t-line bg-t-card p-4 md:p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] text-[11px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${preset.gradient.join(", ")})` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {logo ? <img src={logo} alt="" className="h-6 w-auto max-w-[36px] object-contain" /> : preset.name.slice(0, 3)}
      </span>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[12px] font-semibold uppercase tracking-[1px] text-t-muted">{preset.name}</p>
        <p className="mt-1 truncate text-[18px] font-semibold tabular-nums text-t-fg">{a.number || "0000 0000"}</p>
        <p className="truncate text-[13px] text-t-fg2">a.n. {a.holder || "Nama pemilik"}</p>
      </div>
      <button type="button" onClick={() => copy(a.number.replace(/\s/g, ""), a.id)} className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-t-line px-3 py-2 text-[12px] font-semibold text-t-accent transition hover:bg-t-input">
        <CopyIcon size={15} />
        {copied === a.id ? "Disalin" : "Salin"}
      </button>
    </div>
  );
}

/** "Daftar Sederhana": compact rows with a copy button. */
const Daftar: Gift = () => {
  const { content: c } = useTheme();
  const g = c.gift;
  return (
    <Section block="gift">
      <div className="mx-auto max-w-[640px]">
        <Heading eyebrow={g.eyebrow} title={g.title} body={g.body} />
        {!g.accounts.length && <NoAccounts />}
        <div className="mt-10 space-y-3">
          {g.accounts.map((a) => (
            <AccountRow key={a.id} a={a} />
          ))}
        </div>
        <Registry className="mt-8" />
      </div>
    </Section>
  );
};

export const GIFT_LAYOUTS: Record<string, Gift> = { kartu: Kartu, samping: Samping, amplop: Amplop, daftar: Daftar };
