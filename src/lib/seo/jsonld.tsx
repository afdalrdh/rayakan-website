import type { Plan } from "@/lib/content";
import { SITE_URL } from "@/lib/messages";

/* Structured data (schema.org) for Google rich results. Rendered as JSON-LD script tags. */

export const BRAND = "Rayakan.my.id";
const LOGO = `${SITE_URL}/brand/logo.png`;

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: "<" is escaped so the script tag can't be closed early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationLd(sameAs: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND,
    url: SITE_URL,
    logo: LOGO,
    description: "Undangan digital pernikahan, ulang tahun, dan khitanan yang bisa dibuat dan diubah sendiri dari HP.",
    areaServed: "ID",
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BRAND,
    url: SITE_URL,
    inLanguage: "id-ID",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** The service with one offer per package, so Google can show prices. */
export function serviceLd(plans: Plan[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#service`,
    name: "Website Undangan Digital",
    serviceType: "Undangan digital pernikahan, ulang tahun, dan khitanan",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Indonesia" },
    url: SITE_URL,
    offers: plans.map((p) => ({
      "@type": "Offer",
      name: `Paket ${p.name}`,
      description: p.tagline,
      price: p.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/#harga`,
    })),
  };
}

export function faqLd(items: readonly (readonly string[])[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
  };
}
