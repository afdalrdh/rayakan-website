import { notFound } from "next/navigation";
import { DesignOverview } from "@/components/admin/DesignOverview";
import { canEditSite } from "@/lib/server/auth";
import { findSite } from "@/lib/server/data";

export const dynamic = "force-dynamic";

export default async function DesignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await canEditSite(slug))) return null;
  const site = await findSite(slug);
  if (!site) notFound();
  return <DesignOverview content={site.content} />;
}
