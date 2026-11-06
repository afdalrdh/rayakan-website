import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demoContent, getOccasion, getThemeMeta, namesOf, THEME_IDS, type ThemeId } from "@/lib/content";
import { OCCASION_PAGES } from "@/lib/marketing";
import { breadcrumbLd, JsonLd, webPageLd } from "@/lib/seo/jsonld";
import { ThemeSampleBar } from "@/components/site/ThemeSampleBar";
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
  const name = getThemeMeta(id).name;
  const title = `Contoh Undangan Digital Tema ${name}`;
  const kind = getOccasion(c.occasion).name.toLowerCase();
  const description = `Lihat contoh undangan ${kind} digital tema ${name}: ${namesOf(c).joined}. Warna, ornamen, dan tata letak bisa diubah sendiri dari HP di Rayakan.my.id.`;
  const image = c.hero.ogImage;
  return {
    title,
    description,
    alternates: { canonical: `/tema/${id}` },
    openGraph: { title: `${title} · Rayakan.my.id`, description, url: `/tema/${id}`, images: image ? [{ url: image, width: 1200, height: 630 }] : undefined },
  };
}

export default async function ThemeSample({ params }: Props) {
  const { id } = await params;
  if (!isTheme(id)) notFound();
  const c = demoContent(id);
  const meta = getThemeMeta(id);
  const occasion = OCCASION_PAGES[meta.occasion];
  return (
    <>
      <JsonLd
        data={[
          webPageLd({ path: `/tema/${id}`, name: `Contoh Undangan Digital Tema ${meta.name}`, description: meta.tagline, image: c.hero.ogImage || meta.preview.desktop }),
          breadcrumbLd([
            { name: "Beranda", path: "/" },
            { name: occasion.name, path: occasion.path },
            { name: `Tema ${meta.name}`, path: `/tema/${id}` },
          ]),
        ]}
      />
      <ThemeRenderer mode="live" content={c} trial />
      <ThemeSampleBar themeId={id} themeName={meta.name} />
    </>
  );
}
