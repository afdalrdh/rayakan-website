"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PLANS, type WeddingContent } from "@/lib/content";
import { loadAllMedia, loadContent, loadPlan } from "@/lib/sandbox-store";
import { ThemeRenderer } from "@/themes";

/** /demo — shows what the sandbox editor saved in this browser. */
export function LiveSite() {
  const params = useSearchParams();
  const [state, setState] = useState<{ content: WeddingContent; media: Record<string, string> } | null>(null);

  useEffect(() => {
    const content = loadContent(params.get("tema"));
    content.hidden = [...new Set([...content.hidden, ...PLANS[loadPlan()].locked])];
    loadAllMedia().then((media) => setState({ content, media }));
  }, [params]);

  if (!state) return <div className="min-h-screen bg-neutral-950" />;
  const to = params.get("to");
  const guest = to ? to.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : undefined;
  return <ThemeRenderer content={state.content} media={state.media} mode="live" guestName={guest} />;
}
