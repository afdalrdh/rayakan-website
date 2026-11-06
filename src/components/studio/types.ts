import type { Occasion, PlanId } from "@/lib/content";

/** One invitation as listed in Studio (built in app/studio/page.tsx). */
export interface SiteSummary {
  slug: string;
  title: string;
  planId: PlanId;
  status: "draft" | "published";
  clientName: string | null;
  clientPhone: string | null;
  notes: string | null;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  guests: number;
  wishes: number;
  eventDate: string;
  occasion: Occasion;
  source: "studio" | "self";
  requestPlan: PlanId | null;
  requestedAt: string | null;
}

export type Env = { database: boolean; media: boolean; secret: boolean; studioPassword: boolean; siteUrl: boolean };
