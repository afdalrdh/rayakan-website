import { notFound } from "next/navigation";
import { WishesManager } from "@/components/admin/WishesManager";
import { canEditSite } from "@/server/auth";
import { findSite } from "@/server/repositories/sites";
import { listWishes } from "@/server/repositories/wishes";

export const dynamic = "force-dynamic";

export default async function WishesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await canEditSite(slug))) return null;
  const site = await findSite(slug);
  if (!site) notFound();
  return <WishesManager initial={await listWishes(site.id, 2000)} />;
}
