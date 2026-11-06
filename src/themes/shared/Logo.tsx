"use client";

import { initials, namesOf } from "@/lib/content";
import { Img, useTheme } from "./context";

/**
 * Couple logo: the uploaded image, or a monogram from the two initials.
 * `tone` picks the monogram colour so it reads on light or dark backgrounds.
 */
export function CoupleLogo({ className = "", underline = false, tone = "light" }: { className?: string; underline?: boolean; tone?: "light" | "dark" }) {
  const { content: c } = useTheme();
  if (c.logo.mode === "none") return null;
  if (c.logo.mode === "image" && c.logo.image) {
    // Logos are uploaded in a light colour (for photos); on a light background show them dark.
    const darken = tone === "dark" && c.style.mode === "light";
    return <Img src={c.logo.image} alt="Logo" width={340} height={144} priority className={`object-contain ${darken ? "brightness-0" : ""} ${className}`} />;
  }
  const n = namesOf(c);
  const [a = "", b = ""] = initials(n.first, n.second);
  const ink = tone === "light" ? "#fff" : "var(--t-accent)";
  const font = "'Cormorant Garamond', Georgia, serif";
  if (n.single) {
    return (
      <svg viewBox="0 0 120 102" className={className} role="img" aria-label={a}>
        <circle cx="60" cy="52" r="40" fill="none" stroke={tone === "light" ? "rgba(255,255,255,0.6)" : "var(--t-muted)"} strokeWidth="1.5" />
        <text x="60" y="78" textAnchor="middle" fontFamily={font} fontSize="72" fontWeight="500" fill={ink}>
          {a}
        </text>
      </svg>
    );
  }
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
