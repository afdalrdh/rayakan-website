import { notFound } from "next/navigation";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { canEditSite } from "@/lib/server/auth";
import { findSite } from "@/lib/server/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await canEditSite(slug))) return null;
  const site = await findSite(slug);
  if (!site) notFound();
  return <SettingsPanel waTemplate={site.waTemplate} />;
}
