/**
 * Soft-painted botanicals in the same style as the Lily (pure SVG gradients,
 * ~1–2 KB each, no JS). Server-rendered; motion comes only from the optional
 * CSS class (e.g. .rk-sway), which is GPU-cheap and off for reduced motion.
 * Gradient ids come from useId, so the same illustration can appear twice
 * (even when one copy is display:none on small screens) without breaking fills.
 */
import { useId } from "react";

type Props = { className?: string };

const LEAF = "M0 0 C 11 -12, 13 -32, 0 -50 C -13 -32, -11 -12, 0 0 Z";

/** Eucalyptus-like branch with sage leaves and a few cream berries. */
export function Branch({ className = "" }: Props) {
  const u = useId().replace(/[^a-zA-Z0-9]/g, "");
  const leaves: [number, number, number, number][] = [
    // x, y, rotate, scale
    [80, 292, -55, 1],
    [79, 268, 58, 1.05],
    [79, 240, -62, 1.1],
    [82, 212, 60, 1.05],
    [86, 184, -56, 1],
    [87, 158, 58, 0.95],
    [84, 130, -58, 0.9],
    [80, 104, 54, 0.85],
    [78, 80, -48, 0.8],
    [82, 56, 46, 0.7],
    [92, 28, -14, 0.6],
  ];
  return (
    <svg viewBox="0 0 170 320" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${u}br-leaf`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#a39c62" />
          <stop offset="100%" stopColor="#d6cf9e" />
        </linearGradient>
        <linearGradient id={`${u}br-leaf2`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#8f8a57" />
          <stop offset="100%" stopColor="#c4be8a" />
        </linearGradient>
        <radialGradient id={`${u}br-berry`} cx="0.35" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="100%" stopColor="#e2cfa8" />
        </radialGradient>
      </defs>
      <path d="M80 318 C 70 240, 92 160, 80 84 C 75 52, 82 26, 96 4" fill="none" stroke="#a89f62" strokeWidth="2.6" strokeLinecap="round" />
      {leaves.map(([x, y, r, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <path d={LEAF} fill={`url(#${u}${i % 3 === 1 ? "br-leaf2" : "br-leaf"})`} opacity={0.82 + (i % 2) * 0.1} />
          <path d="M0 -3 C 1 -18, 1 -32, 0 -45" fill="none" stroke="#fdf8ea" strokeWidth="0.8" opacity="0.55" />
        </g>
      ))}
      {[
        [96, 196],
        [103, 190],
        [68, 118],
        [62, 112],
        [99, 66],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.2" fill={`url(#${u}br-berry)`} stroke="#d9c49a" strokeWidth="0.6" />
      ))}
    </svg>
  );
}

/** Open blush-cream bloom (peony/rose feel) with two leaves. */
export function Bloom({ className = "" }: Props) {
  const u = useId().replace(/[^a-zA-Z0-9]/g, "");
  const PETAL = "M0 0 C -26 -10, -34 -52, -12 -70 C -4 -76, 4 -76, 12 -70 C 34 -52, 26 -10, 0 0 Z";
  return (
    <svg viewBox="0 0 220 240" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${u}bl-out`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e2d4" />
          <stop offset="100%" stopColor="#e3bfa6" />
        </linearGradient>
        <linearGradient id={`${u}bl-in`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffaf2" />
          <stop offset="100%" stopColor="#f1d9c4" />
        </linearGradient>
        <radialGradient id={`${u}bl-core`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0%" stopColor="#e7c08f" />
          <stop offset="100%" stopColor="#c99a68" />
        </radialGradient>
        <linearGradient id={`${u}bl-leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cfc68f" />
          <stop offset="100%" stopColor="#9c9558" />
        </linearGradient>
      </defs>
      <path d="M110 120 C 112 160, 104 200, 92 238" fill="none" stroke="#a89f62" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M106 170 C 80 160, 46 168, 22 196 C 56 200, 88 192, 106 170 Z" fill={`url(#${u}bl-leaf)`} opacity="0.85" />
      <path d="M104 196 C 128 176, 160 172, 190 182 C 168 204, 132 210, 104 196 Z" fill={`url(#${u}bl-leaf)`} opacity="0.75" />
      <g transform="translate(110 110)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path key={a} d={PETAL} transform={`rotate(${a + 20})`} fill={`url(#${u}bl-out)`} stroke="#e2c2ab" strokeWidth="0.7" />
        ))}
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path key={a} d={PETAL} transform={`rotate(${a}) scale(0.68)`} fill={`url(#${u}bl-in)`} stroke="#ecd2bd" strokeWidth="0.7" />
        ))}
        {[30, 150, 270].map((a) => (
          <path key={a} d={PETAL} transform={`rotate(${a}) scale(0.4)`} fill={`url(#${u}bl-in)`} stroke="#e6c8b1" strokeWidth="0.6" />
        ))}
        <circle r="9" fill={`url(#${u}bl-core)`} opacity="0.9" />
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx="0" cy="-12" r="1.6" transform={`rotate(${a})`} fill="#9a5a34" opacity="0.7" />
        ))}
      </g>
    </svg>
  );
}

/** Airy baby's-breath spray: thin stems with tiny cream florets. */
export function Breath({ className = "" }: Props) {
  const u = useId().replace(/[^a-zA-Z0-9]/g, "");
  const stems = [
    "M100 230 C 96 180, 80 130, 50 80",
    "M100 230 C 100 170, 104 110, 96 50",
    "M100 230 C 108 180, 130 130, 160 92",
    "M88 160 C 72 140, 52 128, 30 124",
    "M104 140 C 118 118, 140 104, 168 102",
    "M98 110 C 86 90, 74 70, 70 40",
  ];
  const dots = [
    [50, 80], [44, 72], [56, 70], [40, 84], [96, 50], [90, 42], [103, 42], [99, 34], [160, 92], [168, 84], [154, 82], [166, 98],
    [30, 124], [24, 116], [36, 114], [168, 102], [176, 96], [172, 110], [70, 40], [64, 32], [77, 33], [72, 26], [60, 96], [126, 120],
  ];
  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${u}bb-dot`} cx="0.35" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ead9b9" />
        </radialGradient>
      </defs>
      {stems.map((d) => (
        <path key={d} d={d} fill="none" stroke="#b3ab74" strokeWidth="1.3" strokeLinecap="round" />
      ))}
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 5 : 3.8} fill={`url(#${u}bb-dot)`} stroke="#dcc6a0" strokeWidth="0.5" />
      ))}
    </svg>
  );
}
