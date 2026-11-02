import { notFound } from "next/navigation";
import { loginSiteAction } from "@/app/actions/site";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSiteProvider } from "@/components/admin/ui";
import { LoginCard } from "@/components/auth/LoginCard";
import { SITE_HOST, SITE_URL } from "@/lib/messages";
import { canEditSite, isOwner } from "@/lib/server/auth";
import { findSite, getPlan, getSettings } from "@/lib/server/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Undangan · Rayakan.my.id", robots: { index: false } };

/** Client admin: login gate + menu frame. Pages inside load their own data. */
export default async function SiteAdminLayout({ params, children }: { params: Promise<{ slug: string }>; children: React.ReactNode }) {
  const { slug } = await params;
  const site = await findSite(slug);
  if (!site) notFound();
  const settings = await getSettings();

  if (!(await canEditSite(slug))) {
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

  const [plan, owner] = await Promise.all([getPlan(site.planId), isOwner()]);
  return (
    <AdminSiteProvider value={{ slug, title: site.title, status: site.status, plan, expiresAt: site.expiresAt, isOwner: owner, adminWhatsapp: settings.adminWhatsapp, siteUrl: SITE_URL }}>
      <AdminShell>{children}</AdminShell>
    </AdminSiteProvider>
  );
}
