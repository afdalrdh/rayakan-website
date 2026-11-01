import { EditorApp } from "@/components/editor/EditorApp";
import { THEME_IDS, type ThemeId } from "@/lib/content";
import { getPlans, getSettings } from "@/lib/server/data";

export const metadata = { title: "Coba Editor Undangan · Rayakan.my.id", robots: { index: false } };

type Props = { searchParams: Promise<{ tema?: string }> };

/** Public sandbox editor. `?tema=afdal` starts from that theme's sample. */
export default async function DemoAdminPage({ searchParams }: Props) {
  const { tema } = await searchParams;
  const demoTheme = (THEME_IDS as readonly string[]).includes(tema ?? "") ? (tema as ThemeId) : undefined;
  const [plans, settings] = await Promise.all([getPlans(), getSettings()]);
  return <EditorApp mode="demo" slug="afdal-putri" title="Contoh" status="draft" plans={plans} planId="premium" adminWhatsapp={settings.adminWhatsapp} demoTheme={demoTheme} />;
}
