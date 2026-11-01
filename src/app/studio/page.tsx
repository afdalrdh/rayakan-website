import { loginOwnerAction } from "@/app/actions/studio";
import { LoginCard } from "@/components/auth/LoginCard";
import { StudioApp, type SiteSummary } from "@/components/studio/StudioApp";
import { isOwner, ownerCredentials } from "@/lib/server/auth";
import { storageProvider } from "@/lib/server/media";
import { getPlans, getSettings, listSites } from "@/lib/server/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Studio · Rayakan.my.id", robots: { index: false } };

export default async function StudioPage() {
  if (!(await isOwner())) {
    const creds = ownerCredentials();
    return (
      <LoginCard
        title="Studio"
        subtitle="Dashboard pemilik Rayakan.my.id"
        action={loginOwnerAction}
        fields={[
          { name: "username", label: "Username", autoComplete: "username" },
          { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
        ]}
        note={creds?.isDefault ? "Mode lokal: username admin · password admin123. Atur STUDIO_USERNAME & STUDIO_PASSWORD sebelum online." : undefined}
      />
    );
  }
  const [sites, plans, settings] = await Promise.all([listSites(), getPlans(), getSettings()]);
  const summary: SiteSummary[] = sites.map((s) => ({
    slug: s.slug,
    title: s.title,
    planId: s.planId,
    status: s.status,
    clientName: s.clientName,
    clientPhone: s.clientPhone,
    notes: s.notes,
    publishedAt: s.publishedAt,
    expiresAt: s.expiresAt,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    guests: s.guests,
    wishes: s.wishes,
    eventDate: s.content.event.date,
  }));
  const env = {
    database: !!process.env.DATABASE_URL,
    media: ["cloudinary", "blob"].includes(storageProvider() ?? ""),
    secret: (process.env.SESSION_SECRET?.length ?? 0) >= 24,
    studioPassword: !ownerCredentials()?.isDefault,
    siteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
  };
  return <StudioApp sites={summary} plans={plans} settings={settings} env={env} />;
}
