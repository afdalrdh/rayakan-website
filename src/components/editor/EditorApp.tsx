"use client";

import { Sparkles, X } from "lucide-react";
import { useState } from "react";
import { demoContent, type BlockKey, type Plan, type PlanId, type ThemeId, type WeddingContent } from "@/lib/content";
import { loadPlan, resetContent, savePlan } from "@/lib/sandbox-store";
import { Canvas, type Device } from "./canvas/Canvas";
import { BottomNav, Sidebar, Toolbar, TopBar, type Tab } from "./chrome";
import { EditorCtx, type EditorCtxValue } from "./context";
import { MobileSheet, SidePanel, type Panel } from "./PanelHost";
import { DemoGuestsTab, DemoMoreTab, DemoWishesTab } from "./tabs/DemoTabs";
import { GuestsTab } from "./tabs/GuestsTab";
import { MoreTab } from "./tabs/MoreTab";
import { WishesTab } from "./tabs/WishesTab";
import { useContentStore, useIsWide } from "./useContentStore";

export interface EditorProps {
  /** "site" edits a real invitation; "demo" is the public sandbox. */
  mode: "demo" | "site";
  slug: string;
  title: string;
  status: "draft" | "published";
  plans: Plan[];
  planId: PlanId;
  initialContent?: WeddingContent;
  /** Sandbox only: which theme to start from when nothing is saved yet. */
  demoTheme?: ThemeId;
  adminWhatsapp: string;
  waTemplate?: string | null;
  expiresAt?: string | null;
  isOwner?: boolean;
}

/** The client editor: preview canvas + forms, plus the Tamu / Ucapan / Lainnya tabs. */
export function EditorApp(props: EditorProps) {
  const { mode, slug } = props;
  const store = useContentStore({ mode, slug, initial: props.initialContent, demoTheme: props.demoTheme });
  const [planId, setPlanId] = useState<PlanId>(() => (mode === "demo" && typeof window !== "undefined" ? loadPlan() : props.planId));
  const [panel, setPanel] = useState<Panel | null>(null);
  const [tab, setTab] = useState<Tab>("undangan");
  const [device, setDevice] = useState<Device>("hp");
  const [hint, setHint] = useState(true);
  const isWide = useIsWide();
  const plan = props.plans.find((p) => p.id === planId) ?? props.plans[0];
  const { content } = store;

  if (!content) {
    return <div className="flex h-[100dvh] items-center justify-center bg-rk-ivory font-rk-sans text-rk-mute">Memuat editor…</div>;
  }

  const ctx: EditorCtxValue = {
    content,
    update: store.update,
    resolve: store.resolve,
    upload: store.upload,
    uploadOg: store.uploadOg,
    plan,
    plans: props.plans,
    slug,
    mode,
    status: props.status,
    adminWhatsapp: props.adminWhatsapp,
    isOwner: !!props.isOwner,
    expiresAt: props.expiresAt ?? null,
  };
  const openBlock = (key: BlockKey) => {
    setHint(false);
    setPanel({ kind: "block", key });
  };

  return (
    <EditorCtx.Provider value={ctx}>
      <div className="flex h-[100dvh] flex-col bg-rk-ivory font-rk-sans text-rk-ink lg:grid lg:grid-cols-[232px_1fr_420px] lg:grid-rows-[64px_1fr]">
        <Sidebar tab={tab} setTab={setTab} />
        <TopBar title={props.title} saved={store.saved} previewHref={mode === "demo" ? `/demo?tema=${store.content?.theme ?? "arya"}` : `/${slug}/preview`} isOwner={!!props.isOwner} onPublish={() => setPanel({ kind: "publish" })} />

        {tab === "undangan" ? (
          <section className="relative flex min-h-0 flex-1 flex-col lg:col-start-2 lg:row-start-2 lg:border-r lg:border-rk-line">
            <Toolbar device={device} setDevice={setDevice} open={(kind) => setPanel({ kind })} />
            <Canvas device={device} content={content} media={store.media} plan={plan} selected={panel?.kind === "block" ? panel.key : null} onSelect={openBlock} />
            {hint && (
              <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center px-4 lg:bottom-8">
                <span className="rk-fade-in pointer-events-auto flex items-center gap-2 rounded-full bg-rk-ink/90 py-2.5 pl-4 pr-2 text-[13px] font-medium text-white shadow-xl backdrop-blur">
                  <Sparkles className="h-4 w-4 text-rk-gold" />
                  Ketuk bagian undangan untuk mengubahnya
                  <button type="button" aria-label="Tutup" onClick={() => setHint(false)} className="rounded-full p-1 hover:bg-white/10">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              </div>
            )}
          </section>
        ) : (
          <section className="min-h-0 flex-1 overflow-y-auto pb-6 lg:col-span-2 lg:col-start-2 lg:row-start-2">
            {mode === "site" ? (
              <>
                {tab === "tamu" && <GuestsTab waTemplate={props.waTemplate ?? null} />}
                {tab === "ucapan" && <WishesTab />}
                {tab === "lainnya" && <MoreTab />}
              </>
            ) : (
              <>
                {tab === "tamu" && <DemoGuestsTab />}
                {tab === "ucapan" && <DemoWishesTab />}
                {tab === "lainnya" && (
                  <DemoMoreTab
                    plan={planId}
                    plans={props.plans}
                    setPlan={(p) => {
                      setPlanId(p);
                      savePlan(p);
                    }}
                    onReset={() => {
                      resetContent();
                      store.setContent(demoContent(content.theme));
                    }}
                  />
                )}
              </>
            )}
          </section>
        )}

        {tab === "undangan" && isWide && <SidePanel panel={panel} setPanel={setPanel} openBlock={openBlock} />}
        <BottomNav tab={tab} setTab={setTab} />
        {!isWide && <MobileSheet panel={panel} setPanel={setPanel} openBlock={openBlock} />}
      </div>
    </EditorCtx.Provider>
  );
}
