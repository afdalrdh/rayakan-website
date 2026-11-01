import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demoContent, getThemeMeta, THEME_IDS, type ThemeId } from "@/lib/content";
import { ThemeRenderer } from "@/themes";

/**
 * /tema/<id>: the untouched sample invitation for one theme, linked from the
 * landing page. Fully static; the editable sandbox lives at /demo/admin.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return THEME_IDS.map((id) => ({ id }));
}

type Props = { params: Promise<{ id: string }> };

const isTheme = (id: string): id is ThemeId => (THEME_IDS as readonly string[]).includes(id);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!isTheme(id)) return {};
  const c = demoContent(id);
  const title = `Tema ${getThemeMeta(id).name} · The Wedding of ${c.hero.firstName} & ${c.hero.secondName}`;
  return {
    title,
    description: `Contoh undangan digital tema ${getThemeMeta(id).name} dari Rayakan.my.id.`,
    openGraph: { title, images: c.hero.ogImage ? [{ url: c.hero.ogImage, width: 1200, height: 630 }] : undefined },
  };
}

export default async function ThemeSample({ params }: Props) {
  const { id } = await params;
  if (!isTheme(id)) notFound();
  return <ThemeRenderer mode="live" content={demoContent(id)} />;
}
