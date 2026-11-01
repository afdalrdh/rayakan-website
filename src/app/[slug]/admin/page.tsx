import { notFound } from "next/navigation";
import { loginSiteAction } from "@/app/actions/site";
import { LoginCard } from "@/components/auth/LoginCard";
import { EditorApp } from "@/components/editor/EditorApp";
import { SITE_HOST } from "@/lib/messages";
import { canEditSite, isOwner } from "@/lib/server/auth";
import { findSite, getPlans, getSettings } from "@/lib/server/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Undangan · Rayakan.my.id", robots: { index: false } };

export default async function SiteAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await findSite(slug);
  if (!site) notFound();

  if (!(await canEditSite(slug))) {
    const settings = await getSettings();
    return (
      <LoginCard
        title={site.title}
        subtitle={`Masuk untuk mengelola ${SITE_HOST}/${slug}`}
        action={loginSiteAction}
        hidden={{ slug }}
        fields={[{ name: "password", label: "Password", type: "password", autoComplete: "current-password" }]}
        note={
          settings.adminWhatsapp ? (
            <>
              Lupa password?{" "}
              <a className="font-semibold text-rk-ink underline" href={`https://wa.me/${settings.adminWhatsapp}?text=${encodeURIComponent(`Halo, saya lupa password admin ${SITE_HOST}/${slug}`)}`}>
                Hubungi admin
              </a>
            </>
          ) : (
            "Lupa password? Hubungi admin Rayakan.my.id."
          )
        }
      />
    );
  }

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
      waTemplate={site.waTemplate}
      expiresAt={site.expiresAt}
      isOwner={owner}
    />
  );
}
