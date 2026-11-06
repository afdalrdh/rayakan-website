import type { Metadata } from "next";
import { BuatWizard } from "@/components/landing/BuatWizard";
import { contactHref } from "@/components/landing/chrome";
import { isThemeId } from "@/lib/content";
import { getSettings } from "@/lib/server/data";

export const metadata: Metadata = {
  title: "Buat Undangan Digital Gratis",
  description: "Pilih acara dan tema, isi nama dan tanggal, undanganmu langsung jadi. Coba gratis tanpa daftar, bayar saat siap disebar.",
  alternates: { canonical: "/buat" },
};

type Props = { searchParams: Promise<{ tema?: string; acara?: string }> };

/** "Coba Gratis": choose an occasion and a theme, fill three fields, then the free editor opens. */
export default async function BuatPage({ searchParams }: Props) {
  const { tema } = await searchParams;
  const settings = await getSettings();
  return <BuatWizard initialTheme={isThemeId(tema) ? tema : undefined} consultHref={contactHref(settings, "Halo Rayakan.my.id, saya mau konsultasi undangan digital.")} />;
}
