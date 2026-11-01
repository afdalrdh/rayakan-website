"use client";

import { motion } from "motion/react";

/**
 * Hand-drawn style line illustrations. Strokes draw themselves in when they
 * scroll into view, then the whole drawing floats gently (see .rk-float).
 * Colour comes from `currentColor`, size from the className.
 */

type Props = { className?: string; delay?: number };

function Draw({ d, delay = 0, width = 1.3 }: { d: string; delay?: number; width?: number }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 2.2, delay, ease: [0.65, 0, 0.35, 1] }}
    />
  );
}

/** A curved stem with leaves. */
export function Sprig({ className = "", delay = 0 }: Props) {
  const leaves = [
    "M38 150 C 22 140, 16 124, 22 110 C 36 118, 42 134, 38 150 Z",
    "M44 122 C 58 110, 74 108, 86 114 C 76 128, 58 132, 44 122 Z",
    "M48 96 C 34 84, 32 66, 40 54 C 52 66, 54 82, 48 96 Z",
    "M58 72 C 72 62, 88 62, 98 70 C 86 82, 70 82, 58 72 Z",
    "M66 48 C 58 34, 60 18, 70 8 C 78 22, 76 38, 66 48 Z",
  ];
  return (
    <svg viewBox="0 0 110 200" className={className} aria-hidden="true">
      <Draw d="M30 196 C 34 150, 44 110, 52 84 C 58 64, 64 44, 68 20" delay={delay} />
      {leaves.map((l, i) => (
        <Draw key={l} d={l} delay={delay + 0.3 + i * 0.18} width={1.1} />
      ))}
    </svg>
  );
}

/** Two interlocking rings with a small stone. */
export function Rings({ className = "", delay = 0 }: Props) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <Draw d="M60 46 m -34 0 a 34 34 0 1 0 68 0 a 34 34 0 1 0 -68 0" delay={delay} />
      <Draw d="M100 66 m -34 0 a 34 34 0 1 0 68 0 a 34 34 0 1 0 -68 0" delay={delay + 0.35} />
      <Draw d="M52 12 L60 4 L68 12 L60 22 Z M52 12 H68" delay={delay + 0.9} width={1.1} />
    </svg>
  );
}

/** Envelope sealed with wax. */
export function Envelope({ className = "", delay = 0 }: Props) {
  return (
    <svg viewBox="0 0 180 130" className={className} aria-hidden="true">
      <Draw d="M10 20 H170 V122 H10 Z" delay={delay} />
      <Draw d="M10 20 L90 82 L170 20" delay={delay + 0.5} />
      <Draw d="M10 122 L70 68 M170 122 L110 68" delay={delay + 0.8} width={1.1} />
      <Draw d="M90 82 m -15 0 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0" delay={delay + 1.1} />
      <Draw d="M90 89 C 80 82, 82 74, 90 78 C 98 74, 100 82, 90 89 Z" delay={delay + 1.4} width={1} />
    </svg>
  );
}

/** Four-point sparkle. */
export function Sparkle({ className = "", delay = 0 }: Props) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <Draw d="M20 2 C 21 14, 26 19, 38 20 C 26 21, 21 26, 20 38 C 19 26, 14 21, 2 20 C 14 19, 19 14, 20 2 Z" delay={delay} width={1.1} />
    </svg>
  );
}

const PETALS = [
  { r: -160, s: 0.92, back: true },
  { r: -100, s: 1, back: true },
  { r: -40, s: 0.95, back: true },
  { r: -130, s: 1.05, back: false },
  { r: -70, s: 1.1, back: false },
  { r: -10, s: 1, back: false },
];

/** Soft-painted lily (pure SVG gradients, ~2 KB). Sways gently via .rk-sway. */
export function Lily({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lily-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="70%" stopColor="#f6ead3" />
          <stop offset="100%" stopColor="#e9d2a8" />
        </linearGradient>
        <linearGradient id="lily-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e6cc" />
          <stop offset="100%" stopColor="#dcc391" />
        </linearGradient>
        <linearGradient id="lily-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cfc68f" />
          <stop offset="100%" stopColor="#9c9558" />
        </linearGradient>
      </defs>
      {/* stem + leaves */}
      <path d="M150 120 C 175 170, 215 225, 275 292" fill="none" stroke="#a89f62" strokeWidth="3" strokeLinecap="round" />
      <path d="M190 182 C 160 175, 120 190, 92 225 C 130 222, 170 208, 190 182 Z" fill="url(#lily-leaf)" opacity="0.9" />
      <path d="M215 212 C 240 175, 262 150, 290 140 C 282 175, 255 205, 215 212 Z" fill="url(#lily-leaf)" opacity="0.85" />
      <path d="M232 238 C 205 245, 180 268, 168 296 C 200 285, 225 262, 232 238 Z" fill="url(#lily-leaf)" opacity="0.75" />
      <path d="M168 150 C 200 120, 240 108, 268 112 C 245 135, 205 150, 168 150 Z" fill="url(#lily-leaf)" opacity="0.8" />
      {/* bud */}
      <path d="M118 118 C 98 96, 74 72, 58 40 C 82 52, 104 80, 120 112 Z" fill="url(#lily-back)" opacity="0.9" />
      <path d="M150 120 C 140 118, 128 116, 120 112" fill="none" stroke="#a89f62" strokeWidth="2" />
      {/* petals */}
      <g transform="translate(150 118)">
        {PETALS.map((p) => (
          <g key={p.r} transform={`rotate(${p.r + 90}) scale(${p.s})`}>
            <path d="M0 0 C -20 -26, -27 -68, -4 -104 C 6 -96, 12 -90, 10 -84 C 26 -62, 22 -26, 0 0 Z" fill={p.back ? "url(#lily-back)" : "url(#lily-petal)"} stroke="#e3cc9f" strokeWidth="0.8" />
            <path d="M0 -6 C -4 -36, -4 -64, -3 -92" fill="none" stroke="#d9bd88" strokeWidth="0.7" opacity="0.7" />
            {!p.back && <circle cx="-3" cy="-30" r="1.3" fill="#c48a5a" opacity="0.6" />}
          </g>
        ))}
        {/* stamens */}
        {[-150, -120, -95, -70, -45, -20].map((a, i) => (
          <g key={a} transform={`rotate(${a + 90})`}>
            <path d={`M0 0 C 2 -18, ${i % 2 ? -3 : 3} -34, 0 -${44 + (i % 3) * 5}`} fill="none" stroke="#c9b27a" strokeWidth="0.9" />
            <ellipse cx="0" cy={-(46 + (i % 3) * 5)} rx="2.4" ry="5" fill="#9a5a34" />
          </g>
        ))}
      </g>
    </svg>
  );
}
