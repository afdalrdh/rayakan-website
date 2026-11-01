import { PublicSite } from "@/components/site/PublicSite";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false } };

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  return <PublicSite slug={(await params).slug} preview />;
}
