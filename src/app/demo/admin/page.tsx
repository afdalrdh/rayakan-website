import { EditorApp } from "@/components/editor/EditorApp";
import { THEME_IDS, type ThemeId } from "@/lib/content";
import { getPlans } from "@/server/repositories/plans";
import { getSettings } from "@/server/repositories/settings";

export const metadata = { title: "Coba Editor Undangan", robots: { index: false } };

type Props = { searchParams: Promise<{ tema?: string }> };

/** Public sandbox editor. `?tema=afdal` starts from that theme's sample. */
export default async function DemoAdminPage({ searchParams }: Props) {
  const { tema } = await searchParams;
  const demoTheme = (THEME_IDS as readonly string[]).includes(tema ?? "") ? (tema as ThemeId) : undefined;
  const [plans, settings] = await Promise.all([getPlans(), getSettings()]);
  return <EditorApp mode="demo" slug="afdal-putri" title="Contoh" status="draft" plans={plans} planId="gratis" adminWhatsapp={settings.adminWhatsapp} demoTheme={demoTheme} />;
}
