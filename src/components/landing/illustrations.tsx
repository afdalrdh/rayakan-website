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
