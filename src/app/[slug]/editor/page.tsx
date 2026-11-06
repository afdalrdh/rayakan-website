import { notFound, redirect } from "next/navigation";
import { EditorApp } from "@/components/editor/EditorApp";
import { canEditSite, isOwner } from "@/server/auth";
import { findSite } from "@/server/repositories/sites";
import { getPlans } from "@/server/repositories/plans";
import { getSettings } from "@/server/repositories/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Tampilan", robots: { index: false } };

/** Full-screen design editor, opened in its own tab from Admin → Desain Undangan. */
export default async function SiteEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await findSite(slug);
  if (!site) notFound();
  if (!(await canEditSite(slug))) redirect(`/${slug}/admin`);
  const [plans, settings, owner] = await Promise.all([getPlans(), getSettings(), isOwner()]);
  return (
    <EditorApp
      mode="site"
      slug={slug}
      title={site.title}
      status={site.status}
      plans={plans}
      planId={site.planId}
      initialContent={site.content}
      adminWhatsapp={settings.adminWhatsapp}
      expiresAt={site.expiresAt}
      isOwner={owner}
    />
  );
}
