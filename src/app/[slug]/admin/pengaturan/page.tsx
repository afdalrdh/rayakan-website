import { notFound } from "next/navigation";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { canEditSite } from "@/lib/server/auth";
import { SITE_URL } from "@/lib/messages";
import { findSite, reviewOfSite } from "@/lib/server/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await canEditSite(slug))) return null;
  const site = await findSite(slug);
  if (!site) notFound();
  const r = await reviewOfSite(site.id).catch(() => null);
  const review = r ? { name: r.name, city: r.city ?? "", rating: r.rating, message: r.message, showLink: r.link === `${SITE_URL}/${slug}`, status: r.status } : null;
  return <SettingsPanel waTemplate={site.waTemplate} review={review} />;
}
