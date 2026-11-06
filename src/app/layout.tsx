import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/messages";
import "./globals.css";

const sourceSerif = localFont({
  variable: "--font-source-serif",
  display: "swap",
  preload: false, // only used inside themes / editor, not worth delaying the landing page
  src: [
    { path: "./fonts/source-serif-4-latin-wght-normal.woff2", weight: "200 900", style: "normal" },
    { path: "./fonts/source-serif-4-latin-wght-italic.woff2", weight: "200 900", style: "italic" },
  ],
});
const instrument = localFont({
  variable: "--font-instrument",
  display: "swap",
  preload: false,
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
});
/** Roboto Serif, condensed light cut (wdth 62, opsz 144) — tall, slim display serif for the landing page. */
const display = localFont({
  variable: "--font-landing",
  display: "swap",
  src: [
    { path: "./fonts/roboto-serif-display-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/roboto-serif-display-italic.woff2", weight: "300", style: "italic" },
  ],
});
const jakarta = localFont({
  variable: "--font-jakarta",
  display: "swap",
  src: [{ path: "./fonts/plus-jakarta-sans-latin-wght-normal.woff2", weight: "200 800", style: "normal" }],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Rayakan.my.id · Undangan Digital Nikah, Ulang Tahun & Khitanan", template: "%s · Rayakan.my.id" },
  description: "Undangan digital pernikahan, ulang tahun, dan khitanan yang bisa kamu buat dan ubah sendiri dari HP. Coba gratis.",
  applicationName: "Rayakan.my.id",
  icons: { icon: "/brand/logo.png", apple: "/brand/logo.png" },
  openGraph: { siteName: "Rayakan.my.id", locale: "id_ID", type: "website" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  // Search Console ownership: set GOOGLE_SITE_VERIFICATION in Vercel (the "content" value of the meta tag).
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sourceSerif.variable} ${instrument.variable} ${display.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
