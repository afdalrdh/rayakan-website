import { notFound } from "next/navigation";
import { GuestsManager } from "@/components/admin/GuestsManager";
import { canEditSite } from "@/lib/server/auth";
import { findSite, listGuests } from "@/lib/server/data";

export const dynamic = "force-dynamic";

/** Admin → Undangan: guest list with links and WhatsApp sending. */
export default async function GuestsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await canEditSite(slug))) return null; // the layout shows the login card
  const site = await findSite(slug);
  if (!site) notFound();
  return <GuestsManager initialGuests={await listGuests(site.id)} waTemplate={site.waTemplate} />;
}
