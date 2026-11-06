import "server-only";
import { unstable_cache } from "next/cache";
import { PLAN_IDS, PLANS, type Plan, type PlanId } from "@/lib/content";
import { TAG } from "../cache";
import { query } from "../db/client";
import { json } from "./rows";

/** Packages and prices, editable in Studio. Missing rows fall back to the defaults in lib/content/plans.ts. */
async function loadPlans(): Promise<Plan[]> {
  let rows: { id: string; data: Plan | string }[] = [];
  try {
    rows = await query<{ id: string; data: Plan | string }>(`SELECT id, data FROM plans ORDER BY sort ASC`);
  } catch (e) {
    console.error("[plans] fallback to defaults:", e);
    return PLAN_IDS.map((id) => PLANS[id]);
  }
  const byId = new Map(rows.map((r) => [r.id, { ...PLANS[r.id as PlanId], ...json(r.data), id: r.id as PlanId }]));
  return PLAN_IDS.map((id) => byId.get(id) ?? PLANS[id]);
}

export const getPlans = unstable_cache(loadPlans, ["plans-v2"], { tags: [TAG.plans], revalidate: 3600 });

export async function getPlan(id: PlanId) {
  return (await getPlans()).find((p) => p.id === id) ?? PLANS[id];
}

export async function savePlan(p: Plan, sort: number) {
  await query(
    `INSERT INTO plans (id, data, sort, updated_at) VALUES ($1, $2, $3, NOW())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, sort = EXCLUDED.sort, updated_at = NOW()`,
    [p.id, JSON.stringify(p), sort],
  );
}
