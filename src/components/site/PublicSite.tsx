import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatEventDate, shareKind, shareTitle, type WeddingContent } from "@/lib/content";
import { SITE_URL } from "@/lib/messages";
import { canEditSite } from "@/lib/server/auth";
import { findSite, getGuestName, getPlan, getPublicSite, getSettings, isExpired, type SiteRecord } from "@/lib/server/data";
import { ThemeRenderer } from "@/themes";

/** Apply package limits so locked sections never reach guests, whatever the editor sent. */
async function contentForGuests(site: SiteRecord): Promise<WeddingContent> {
  const plan = await getPlan(site.planId);
  const c = site.content;
  return {
    ...c,
    hidden: [...new Set([...c.hidden, ...plan.locked])],
    gallery: { ...c.gallery, photos: c.gallery.photos.slice(0, plan.galleryLimit) },
    story: { ...c.story, items: c.story.items.slice(0, plan.storyLimit) },
    style: plan.customColor ? c.style : { ...c.style, accent: "" },
    music: c.music.mode === "upload" && !plan.musicUpload ? { ...c.music, mode: "library" } : c.music,
  };
}

const abs = (u: string) => (!u ? "" : u.startsWith("http") ? u : `${SITE_URL}${u}`);

export async function siteMetadata(slug: string, guestSlug?: string): Promise<Metadata> {
  const site = await getPublicSite(slug);
  if (!site) return { title: "Undangan tidak ditemukan" };
  const c = site.content;
  const guest = guestSlug ? await getGuestName(slug, guestSlug) : null;
  const title = shareTitle(c);
  const date = c.event.date ? formatEventDate(c.event.date) : "";
  const description = [guest ? `Kepada Yth. ${guest}.` : "", `${shareKind(c)}.`, date, c.venue.name ? `di ${c.venue.name}` : ""]
    .filter(Boolean)
    .join(" ");
  const image = abs(c.hero.ogImage || c.hero.imageDesktop);
  const url = `${SITE_URL}/${slug}${guestSlug ? `/${guestSlug}` : ""}`;
  return {
    title: { absolute: guest ? `${title} · ${guest}` : title },
    description,
    // Invitations stay out of search results (privacy), but the "Made with Rayakan.my.id" link may be followed.
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "id_ID",
      siteName: "Rayakan.my.id",
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
    icons: c.logo.mode === "image" && c.logo.image ? { icon: abs(c.logo.image) } : undefined,
  };
}

function Notice({ title, body, cta }: { title: string; body: string; cta?: { href: string; label: string } }) {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-rk-ink px-6 text-center font-rk-sans text-rk-ivory">
      <Image src="/brand/logo.png" alt="" width={56} height={45} />
      <h1 className="max-w-[520px] font-rk-serif text-[40px] leading-[1.05]">{title}</h1>
      <p className="max-w-[420px] text-[15px] leading-relaxed text-rk-ivory/70">{body}</p>
      {cta && (
        <Link href={cta.href} className="rounded-xl bg-rk-sand px-5 py-3 text-[14px] font-bold text-rk-ink">
          {cta.label}
        </Link>
      )}
      <p className="text-[12px] text-rk-ivory/40">Rayakan.my.id</p>
    </main>
  );
}

export async function PublicSite({ slug, guestSlug, preview = false }: { slug: string; guestSlug?: string; preview?: boolean }) {
  if (preview && !(await canEditSite(slug))) notFound();
  const site = preview ? await findSite(slug) : await getPublicSite(slug);
  if (!site) notFound();

  if (!preview && site.status !== "published") {
    return <Notice title="Undangan sedang disiapkan" body="Undangan ini belum diterbitkan. Silakan cek kembali nanti, ya." />;
  }
  if (!preview && isExpired(site)) {
    const settings = await getSettings();
    return (
      <Notice
        title="Masa aktif undangan telah berakhir"
        body="Terima kasih telah merayakan bersama Rayakan.my.id."
        cta={settings.adminWhatsapp ? { href: `https://wa.me/${settings.adminWhatsapp}?text=${encodeURIComponent(`Halo, saya ingin memperpanjang undangan rayakan.my.id/${slug}`)}`, label: "Perpanjang masa aktif" } : undefined}
      />
    );
  }

  const content = await contentForGuests(site);
  const guestName = guestSlug ? await getGuestName(slug, guestSlug) : null;
  if (guestSlug && !guestName && !preview) notFound();

  return (
    <>
      {preview && site.status !== "published" && (
        <div className="fixed inset-x-0 top-0 z-[200] bg-rk-gold py-1.5 text-center font-rk-sans text-[12px] font-bold text-rk-ink">Pratinjau · belum diterbitkan</div>
      )}
      <ThemeRenderer
        mode="live"
        content={content}
        guestName={guestName ?? undefined}
        site={{ slug, guestSlug: guestName ? guestSlug : undefined, guestName: guestName ?? undefined }}
      />
    </>
  );
}
