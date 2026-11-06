import { OccasionLanding } from "@/components/landing/OccasionLanding";
import { occasionMetadata } from "@/lib/seo/metadata";
import { OCCASION_PAGES } from "@/lib/marketing";
import { getPlans } from "@/server/repositories/plans";
import { getSettings } from "@/server/repositories/settings";

export const revalidate = 3600;

const page = OCCASION_PAGES.nikah;

export const metadata = occasionMetadata(page);

export default async function Page() {
  const [plans, settings] = await Promise.all([getPlans(), getSettings()]);
  return <OccasionLanding page={page} plans={plans} settings={settings} />;
}
