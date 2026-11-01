"use client";

import { initials } from "@/lib/content";
import { Img, useTheme } from "./context";

/**
 * Couple logo: the uploaded image, or a monogram from the two initials.
 * `tone` picks the monogram colour so it reads on light or dark backgrounds.
 */
export function CoupleLogo({ className = "", underline = false, tone = "light" }: { className?: string; underline?: boolean; tone?: "light" | "dark" }) {
  const { content: c } = useTheme();
  if (c.logo.mode === "none") return null;
  if (c.logo.mode === "image" && c.logo.image) {
    return <Img src={c.logo.image} alt="Logo" width={340} height={144} priority className={`object-contain ${className}`} />;
  }
  const [a = "", b = ""] = initials(c.hero.firstName, c.hero.secondName);
  const ink = tone === "light" ? "#fff" : "var(--t-accent)";
  const font = "'Cormorant Garamond', Georgia, serif";
  return (
    <svg viewBox="0 0 120 102" className={className} role="img" aria-label={`${a} & ${b}`}>
      <text x="34" y="70" textAnchor="middle" fontFamily={font} fontSize="78" fontWeight="500" fill={ink}>
        {a}
      </text>
      <text x="60" y="76" textAnchor="middle" fontFamily={font} fontStyle="italic" fontSize="34" fill={tone === "light" ? "var(--t-accent)" : "var(--t-muted)"}>
        &amp;
      </text>
      <text x="86" y="92" textAnchor="middle" fontFamily={font} fontSize="78" fontWeight="500" fill={ink}>
        {b}
      </text>
      {underline && <line x1="20" y1="100" x2="100" y2="100" stroke="var(--t-accent)" strokeOpacity="0.5" />}
    </svg>
  );
}
