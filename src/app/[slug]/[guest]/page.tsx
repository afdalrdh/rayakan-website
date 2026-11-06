import { PublicSite, siteMetadata } from "@/components/site/PublicSite";

export const revalidate = 86400;

/** Pages are rendered on first visit, then served from cache until the site changes. */
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string; guest: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug, guest } = await params;
  return siteMetadata(slug, guest);
}

export default async function GuestPage({ params }: Props) {
  const { slug, guest } = await params;
  // No Suspense here on purpose: an unknown address must answer with a real 404 status.
  return <PublicSite slug={slug} guestSlug={guest} />;
}
