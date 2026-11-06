"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import type { Occasion } from "@/lib/content/occasion";
import type { DecorId } from "./catalog";
import { Couple, KidAstronaut, KidKhitan, KidParty, type Attire } from "./figures";

/*
 * Artwork for the ornament sets. Everything is inline SVG coloured with the
 * site's tokens (var(--t-accent), var(--t-muted)…) plus a few fixed accent
 * colours per set, so ornaments follow the chosen palette in light and dark
 * mode. Animations are CSS classes from globals.css (t-sway, t-bob, t-fall…),
 * all switched off for visitors who prefer reduced motion.
 */

const A = "var(--t-accent)";
const M = "var(--t-muted)";
const GOLD = "#C9A253";
const GOLD_LIGHT = "#E8CF8E";

/* ------------------------------------------------------------------ */
/* Small shapes                                                        */
/* ------------------------------------------------------------------ */

function Flower({ x, y, r, color, center = "#F6D27A", rot = 0 }: { x: number; y: number; r: number; color: string; center?: string; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={0} cy={-r * 0.62} rx={r * 0.46} ry={r * 0.66} fill={color} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.3} fill={center} />
    </g>
  );
}

function Leaf({ x, y, s = 1, rot = 0, color = "#7E9C6F" }: { x: number; y: number; s?: number; rot?: number; color?: string }) {
  return <path d="M0 0 C 6 -10, 18 -12, 26 -2 C 16 4, 6 6, 0 0 Z" fill={color} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} />;
}

function Star({ x, y, r, fill, className, style }: { x: number; y: number; r: number; fill: string; className?: string; style?: CSSProperties }) {
  const p = Array.from({ length: 10 }, (_, i) => {
    const rr = i % 2 ? r * 0.45 : r;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return <polygon points={p} fill={fill} className={className} style={style} />;
}

function Heart({ x, y, s = 1, fill = "none", stroke = A, sw = 2 }: { x: number; y: number; s?: number; fill?: string; stroke?: string; sw?: number }) {
  return <path d="M0 4 C -8 -4, -14 4, 0 14 C 14 4, 8 -4, 0 4 Z" transform={`translate(${x} ${y}) scale(${s})`} fill={fill} stroke={stroke} strokeWidth={sw / s} strokeLinejoin="round" />;
}

function Balloon({ x, y, color, s = 1 }: { x: number; y: number; color: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 22 Q-6 40 4 58" stroke="#B9AEA4" strokeWidth={1.2} fill="none" />
      <ellipse cx={0} cy={0} rx={16} ry={20} fill={color} />
      <ellipse cx={-6} cy={-7} rx={4} ry={6} fill="#FFFFFF" fillOpacity={0.4} />
      <path d="M-3 19 L0 23 L3 19 Z" fill={color} />
    </g>
  );
}

/** Classic "mega mendung" cloud from Cirebon/West Java: layered outlines. */
function Cloud({ x, y, s = 1, fill = A, line = "var(--t-bg)" }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  const d = "M0 40 Q0 20 22 22 Q26 4 46 8 Q60 -6 78 8 Q100 6 100 28 Q114 32 108 44 Q60 50 0 40 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={d} fill={fill} />
      <path d={d} fill="none" stroke={line} strokeWidth={2.2} transform="translate(12 7) scale(0.78)" />
      <path d={d} fill="none" stroke={line} strokeWidth={2.4} transform="translate(25 14) scale(0.52)" />
    </g>
  );
}

function Lantern({ x, len, s = 1, color = GOLD, glow = "#FFE7A3", delay = 0 }: { x: number; len: number; s?: number; color?: string; glow?: string; delay?: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <g className="t-anim t-swing" style={{ transformOrigin: "0px 0px", animationDelay: `${delay}s` }}>
        <path d={`M0 0 L0 ${len}`} stroke={color} strokeWidth={1.2} />
        <g transform={`translate(0 ${len}) scale(${s})`}>
          <path d="M-7 0 L7 0 L4 -6 L-4 -6 Z" fill={color} />
          <path d="M-12 4 L12 4 L14 30 L-14 30 Z" fill={glow} stroke={color} strokeWidth={2} />
          <path d="M-12 4 L0 0 L12 4 M-14 30 L0 34 L14 30" stroke={color} strokeWidth={2} fill={color} />
          <path d="M-6 6 L-7 28 M0 5 L0 30 M6 6 L7 28" stroke={color} strokeOpacity={0.55} strokeWidth={1.2} />
          <path d="M0 34 L0 42" stroke={color} strokeWidth={2} />
          <circle cx={0} cy={44} r={2.4} fill={color} />
        </g>
      </g>
    </g>
  );
}

function Planet({ x, y, r, body, ring }: { x: number; y: number; r: number; body: string; ring: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={0} rx={r * 1.75} ry={r * 0.5} fill="none" stroke={ring} strokeWidth={r * 0.16} transform="rotate(-18)" />
      <circle r={r} fill={body} />
      <path d={`M${-r * 0.8} ${-r * 0.2} Q0 ${-r * 0.5} ${r * 0.8} ${-r * 0.1}`} stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={r * 0.18} fill="none" />
      <path d={`M${-r * 1.75} ${r * 0.1} A ${r * 1.75} ${r * 0.5} 0 0 0 ${r * 1.75} ${-r * 0.1}`} fill="none" stroke={ring} strokeWidth={r * 0.16} transform="rotate(-18)" />
    </g>
  );
}

function Rocket({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M-6 18 Q0 34 6 18 Z" fill="#FF9F5A" className="t-anim t-flicker" />
      <path d="M0 -26 Q14 -10 10 16 L-10 16 Q-14 -10 0 -26 Z" fill="#F4F5FB" stroke="#CBD0E6" strokeWidth={1} />
      <circle cx={0} cy={-4} r={5} fill="#4ED1C2" stroke="#2B2F7A" strokeWidth={1.6} />
      <path d="M-10 6 L-18 18 L-10 16 Z M10 6 L18 18 L10 16 Z" fill="#FF7A6B" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Corner ornaments (drawn for the top-left corner)                    */
/* ------------------------------------------------------------------ */

function CornerArt({ decor }: { decor: DecorId }) {
  switch (decor) {
    case "bunga":
      return (
        <g>
          <path d="M-4 22 C 52 26, 96 62, 124 134" stroke="#86A479" strokeWidth={2.2} fill="none" />
          <path d="M40 30 C 64 20, 92 30, 110 22" stroke="#86A479" strokeWidth={1.6} fill="none" />
          <Leaf x={26} y={25} s={1.1} rot={-20} />
          <Leaf x={58} y={34} s={1.2} rot={30} color="#9DB78F" />
          <Leaf x={84} y={58} s={1.1} rot={-35} />
          <Leaf x={98} y={82} s={1.3} rot={60} color="#9DB78F" />
          <Leaf x={112} y={108} s={1} rot={-50} />
          <Leaf x={86} y={26} s={0.9} rot={-10} color="#9DB78F" />
          <Flower x={46} y={30} r={15} color="#F2B6B6" />
          <Flower x={92} y={70} r={18} color="#F7D4C8" rot={20} />
          <Flower x={120} y={132} r={13} color="#E79A9F" rot={10} />
          <Flower x={110} y={22} r={9} color="#FFFFFF" center="#F2B6B6" />
          <circle cx={70} cy={48} r={3} fill="#F2B6B6" />
          <circle cx={104} cy={100} r={3} fill="#F7D4C8" />
        </g>
      );
    case "jawa":
      return (
        <g fill="none">
          <path d="M8 196 L8 8 L196 8" stroke={GOLD} strokeWidth={2.4} />
          <path d="M18 150 L18 18 L150 18" stroke={GOLD} strokeWidth={1.1} />
          <g transform="translate(36 36)">
            {[0, 90, 180, 270].map((a) => (
              <ellipse key={a} cx={0} cy={-11} rx={6.5} ry={11} transform={`rotate(${a})`} fill={GOLD} fillOpacity={0.18} stroke={GOLD} strokeWidth={1.4} />
            ))}
            <circle r={2.6} fill={GOLD} />
          </g>
          <path d="M60 18 C 80 30, 90 52, 72 60 C 60 66, 56 50, 66 48 M18 60 C 30 80, 52 90, 60 72 C 66 60, 50 56, 48 66" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" />
          <path d="M96 18 C 110 26, 118 40, 108 46 M18 96 C 26 110, 40 118, 46 108" stroke={GOLD} strokeWidth={1.2} strokeLinecap="round" />
          {[110, 130, 150, 170].map((x) => (
            <path key={x} d={`M${x} 8 l6 8 l6 -8`} stroke={GOLD} strokeWidth={1.1} />
          ))}
          {[110, 130, 150, 170].map((y) => (
            <path key={y} d={`M8 ${y} l8 6 l-8 6`} stroke={GOLD} strokeWidth={1.1} />
          ))}
        </g>
      );
    case "sunda":
      return (
        <g>
          <g className="t-anim t-drift" style={{ animationDuration: "14s" }}>
            <Cloud x={-8} y={4} s={1.15} fill="#6F9A7C" />
          </g>
          <g transform="translate(14 70)">
            <path d="M0 0 L0 140" stroke="#7FA06B" strokeWidth={7} strokeLinecap="round" />
            {[24, 58, 92, 126].map((y) => (
              <path key={y} d={`M-4 ${y} L4 ${y}`} stroke="#5E7F4E" strokeWidth={2} />
            ))}
            <g className="t-anim t-sway" style={{ transformOrigin: "0px 30px" }}>
              <Leaf x={2} y={30} s={1.4} rot={-20} color="#6E9A5B" />
              <Leaf x={2} y={44} s={1.2} rot={10} color="#8DB57A" />
              <Leaf x={2} y={74} s={1.3} rot={-30} color="#6E9A5B" />
            </g>
          </g>
        </g>
      );
    case "islami":
      return (
        <g>
          <Lantern x={34} len={40} s={1.05} />
          <Lantern x={78} len={78} s={0.85} delay={0.8} />
          <Lantern x={118} len={26} s={0.7} delay={1.6} />
          <Star x={150} y={30} r={6} fill={GOLD} className="t-anim t-twinkle" />
          <Star x={60} y={140} r={4} fill={GOLD} className="t-anim t-twinkle" style={{ animationDelay: "1s" }} />
        </g>
      );
    case "pesta":
      return (
        <g>
          <path d="M-6 10 Q60 46 130 6" stroke="#B9AEA4" strokeWidth={1.2} fill="none" />
          {[
            [10, 16, "#FF7A6B"],
            [34, 26, "#FFC845"],
            [58, 32, "#3CC5B6"],
            [82, 30, "#8C6CF2"],
            [106, 22, "#FF8FB7"],
          ].map(([x, y, c]) => (
            <path key={x as number} d={`M${x as number - 8} ${y} L${x as number + 8} ${(y as number) - 2} L${x} ${(y as number) + 16} Z`} fill={c as string} />
          ))}
          <g className="t-anim t-bob">
            <Balloon x={34} y={86} color="#FF7A6B" s={1.1} />
            <Balloon x={64} y={104} color="#FFC845" />
            <Balloon x={22} y={128} color="#3CC5B6" s={0.9} />
          </g>
        </g>
      );
    case "angkasa":
      return (
        <g>
          <g className="t-anim t-bob" style={{ animationDuration: "7s" }}>
            <Planet x={52} y={50} r={20} body="#8C7CFF" ring="#FFD166" />
          </g>
          <Star x={110} y={24} r={5} fill="#FFD166" className="t-anim t-twinkle" />
          <Star x={24} y={110} r={4} fill="#FFFFFF" className="t-anim t-twinkle" style={{ animationDelay: "1.2s" }} />
          <Star x={96} y={84} r={3} fill="#9AA6FF" className="t-anim t-twinkle" style={{ animationDelay: "0.6s" }} />
          <circle cx={140} cy={60} r={2} fill="#FFFFFF" />
          <circle cx={70} cy={140} r={1.6} fill="#FFFFFF" />
        </g>
      );
    case "doodle":
      return (
        <g fill="none" stroke={A} strokeWidth={2} strokeLinecap="round">
          <path d="M10 70 C 30 20, 70 60, 50 80 C 30 100, 20 60, 70 40 C 110 24, 120 70, 150 50" strokeOpacity={0.6} />
          <Heart x={40} y={20} s={1.4} stroke={A} />
          <Heart x={150} y={36} s={0.9} fill={M} stroke={M} />
          <Heart x={20} y={110} s={1.1} stroke={M} />
          <path d="M100 96 l0 14 M93 103 l14 0 M95 98 l10 10 M105 98 l-10 10" stroke={M} strokeWidth={1.6} />
        </g>
      );
    default:
      return null;
  }
}

/** Corner ornament for a section. `at` picks the corner; the art is mirrored to fit. */
/** Where corners sit. "hero" keeps them clear of the header bar and the scroll link at the bottom. */
const CORNER_POS = {
  edge: { tl: "left-0 top-0", tr: "right-0 top-0", bl: "left-0 bottom-0", br: "right-0 bottom-0" },
  hero: { tl: "left-0 top-[64px] md:top-[84px]", tr: "right-0 top-[64px] md:top-[84px]", bl: "left-0 bottom-[70px] md:bottom-[82px]", br: "right-0 bottom-[70px] md:bottom-[82px]" },
} as const;

export function DecorCorner({
  decor,
  at,
  className = "",
  sizeClass = "w-[34vw] max-w-[190px] min-w-[110px] md:w-[200px] md:max-w-none",
  inset = "edge",
}: {
  decor: DecorId;
  at: "tl" | "tr" | "bl" | "br";
  className?: string;
  sizeClass?: string;
  inset?: keyof typeof CORNER_POS;
}) {
  if (decor === "none") return null;
  const flip = { tl: "", tr: "-scale-x-100", bl: "-scale-y-100", br: "-scale-100" }[at];
  const pos = CORNER_POS[inset][at];
  // Hanging lanterns and bunting only make sense from the top edge.
  if ((decor === "islami" || decor === "pesta") && (at === "bl" || at === "br")) return null;
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={`pointer-events-none absolute ${pos} ${flip} h-auto ${sizeClass} ${className}`}>
      <CornerArt decor={decor} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Divider under section titles                                        */
/* ------------------------------------------------------------------ */

export function DecorDivider({ decor, className = "" }: { decor: DecorId; className?: string }) {
  if (decor === "none") return null;
  const icon = (() => {
    switch (decor) {
      case "bunga":
        return (
          <>
            <Leaf x={40} y={13} s={0.7} rot={180} />
            <Leaf x={80} y={11} s={0.7} />
            <Flower x={60} y={12} r={9} color="#F2B6B6" />
          </>
        );
      case "jawa":
        return <path d="M60 0 C 70 6, 74 14, 70 22 L50 22 C 46 14, 50 6, 60 0 Z M56 22 L56 16 L64 16 L64 22" fill={GOLD} fillOpacity={0.25} stroke={GOLD} strokeWidth={1.4} />;
      case "sunda":
        return <Cloud x={42} y={1} s={0.36} fill="#6F9A7C" />;
      case "islami":
        return (
          <g transform="translate(60 12)">
            <rect x={-8} y={-8} width={16} height={16} fill="none" stroke={A} strokeWidth={1.6} />
            <rect x={-8} y={-8} width={16} height={16} fill="none" stroke={A} strokeWidth={1.6} transform="rotate(45)" />
            <circle r={2.4} fill={GOLD} />
          </g>
        );
      case "pesta":
        return (
          <>
            {["#FF7A6B", "#FFC845", "#3CC5B6", "#8C6CF2", "#FF8FB7"].map((c, i) => (
              <rect key={c} x={38 + i * 9} y={i % 2 ? 9 : 13} width={6} height={4} rx={1} fill={c} transform={`rotate(${i * 25 - 40} ${41 + i * 9} 12)`} />
            ))}
          </>
        );
      case "angkasa":
        return <Star x={60} y={12} r={9} fill="#FFD166" />;
      case "doodle":
        return <path d="M36 14 C 44 4, 50 22, 58 12 C 62 6, 70 6, 70 12 C 70 18, 60 22, 60 22 C 60 22, 50 18, 50 12 M70 12 C 76 20, 82 6, 86 14" fill="none" stroke={A} strokeWidth={1.8} strokeLinecap="round" />;
      default:
        return null;
    }
  })();
  const line = decor === "jawa" ? GOLD : M;
  return (
    <svg viewBox="0 0 120 24" aria-hidden className={`mx-auto block h-6 w-[120px] ${className}`}>
      <path d="M0 12 L34 12 M86 12 L120 12" stroke={line} strokeOpacity={0.6} strokeWidth={1} />
      {icon}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Background patterns                                                 */
/* ------------------------------------------------------------------ */

export function DecorPattern({ decor, opacity = 0.07, className = "" }: { decor: DecorId; opacity?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  const tile = (() => {
    switch (decor) {
      case "jawa":
        return {
          size: 48,
          body: (
            <g transform="translate(24 24)" fill="none" stroke={A} strokeWidth={1.4}>
              {[0, 90, 180, 270].map((a) => (
                <ellipse key={a} cx={0} cy={-11} rx={6} ry={10.5} transform={`rotate(${a})`} />
              ))}
              <circle r={2} fill={A} />
            </g>
          ),
        };
      case "islami":
        return {
          size: 56,
          body: (
            <g transform="translate(28 28)" fill="none" stroke={A} strokeWidth={1.2}>
              <rect x={-12} y={-12} width={24} height={24} />
              <rect x={-12} y={-12} width={24} height={24} transform="rotate(45)" />
              <path d="M-28 0 L-17 0 M17 0 L28 0 M0 -28 L0 -17 M0 17 L0 28" />
            </g>
          ),
        };
      case "sunda":
        return {
          size: 64,
          body: <path d="M0 40 Q16 24 32 40 Q48 56 64 40 M0 52 Q16 36 32 52 Q48 68 64 52" fill="none" stroke={A} strokeWidth={1.2} />,
        };
      case "pesta":
        return {
          size: 44,
          body: (
            <>
              <circle cx={8} cy={10} r={3} fill="#FF7A6B" />
              <circle cx={30} cy={20} r={2.5} fill="#3CC5B6" />
              <circle cx={16} cy={34} r={2.5} fill="#FFC845" />
              <circle cx={38} cy={40} r={2} fill="#8C6CF2" />
            </>
          ),
        };
      case "angkasa":
        return {
          size: 70,
          body: (
            <>
              <circle cx={10} cy={14} r={1.4} fill="#FFFFFF" />
              <circle cx={44} cy={30} r={1} fill="#FFFFFF" />
              <circle cx={24} cy={56} r={1.2} fill="#FFD166" />
              <circle cx={60} cy={62} r={0.9} fill="#FFFFFF" />
            </>
          ),
        };
      default:
        return null;
    }
  })();
  if (!tile) return null;
  return (
    <svg aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} style={{ opacity: decor === "angkasa" ? 0.8 : opacity }}>
      <defs>
        <pattern id={id} width={tile.size} height={tile.size} patternUnits="userSpaceOnUse">
          {tile.body}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Particle layer                                                      */
/* ------------------------------------------------------------------ */

type Particle = "petals" | "jasmine" | "leaves" | "stars" | "confetti" | "hearts";

const CONFETTI = ["#FF7A6B", "#FFC845", "#3CC5B6", "#8C6CF2", "#FF8FB7"];

function ParticleShape({ kind, i }: { kind: Particle; i: number }) {
  switch (kind) {
    case "petals":
      return <path d="M0 0 C 6 -8, 14 -4, 10 6 C 6 12, -2 8, 0 0 Z" fill={i % 3 ? "#F4C3C3" : "#F7D9CF"} />;
    case "jasmine":
      return (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-4} rx={2.6} ry={4.4} transform={`rotate(${a})`} fill="#FFFDF5" stroke="#E5D9B8" strokeWidth={0.6} />
          ))}
          <circle r={1.6} fill="#E9CF7E" />
        </g>
      );
    case "leaves":
      return <path d="M0 0 C 4 -7, 12 -8, 18 -1 C 11 3, 4 4, 0 0 Z" fill={i % 2 ? "#7FA06B" : "#A8C08A"} />;
    case "stars":
      return <Star x={0} y={0} r={i % 3 ? 3 : 5} fill={i % 4 ? GOLD_LIGHT : "#FFFFFF"} />;
    case "confetti":
      return <rect x={-3} y={-5} width={6} height={10} rx={1} fill={CONFETTI[i % CONFETTI.length]} />;
    case "hearts":
      return <Heart x={0} y={-6} s={0.7} fill={i % 2 ? "#F2B6C6" : "var(--t-accent)"} stroke="none" />;
  }
}

/** Gently moving particles over the whole page. Fixed, never blocks taps. */
export function DecorParticles({ kind, count = 14 }: { kind: Particle | "none"; count?: number }) {
  if (kind === "none") return null;
  const twinkle = kind === "stars";
  const rise = kind === "hearts";
  return (
    <div aria-hidden className="t-particles pointer-events-none fixed inset-0 z-[105] overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        // Deterministic spread so server and client render the same thing.
        const left = (i * 37 + 11) % 100;
        const top = (i * 53 + 7) % 100;
        const dur = 11 + ((i * 7) % 9);
        const delay = -((i * 13) % dur);
        const size = 0.8 + ((i * 5) % 6) / 10;
        const style: CSSProperties = twinkle
          ? { left: `${left}%`, top: `${top}%`, animationDelay: `${(i % 5) * 0.7}s`, animationDuration: `${3 + (i % 4)}s` }
          : { left: `${left}%`, top: rise ? "auto" : "-5%", bottom: rise ? "-5%" : "auto", animationDuration: `${dur}s`, animationDelay: `${delay}s`, ["--dx" as string]: `${((i % 5) - 2) * 24}px`, ["--rot" as string]: `${(i % 2 ? 1 : -1) * (240 + i * 20)}deg` };
        return (
          <span key={i} className={`t-anim absolute block ${twinkle ? "t-twinkle" : rise ? "t-rise" : "t-fall"}`} style={style}>
            <svg width={24 * size} height={24 * size} viewBox="-12 -12 24 24" className="block overflow-visible">
              <ParticleShape kind={kind} i={i} />
            </svg>
          </span>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scenes for photo-free hero layouts                                  */
/* ------------------------------------------------------------------ */

const PORTAL: Record<DecorId, string> = {
  // Shapes in a 400×400 box. The figures (or the photo) sit inside.
  none: "M110 330 L110 170 A90 90 0 0 1 290 170 L290 330 Z",
  doodle: "M108 332 L108 168 A92 92 0 0 1 292 168 L292 332 Z",
  sunda: "M110 330 L110 170 A90 90 0 0 1 290 170 L290 330 Z",
  bunga: "M200 62 A128 128 0 1 1 199.9 62 Z",
  jawa: "M200 34 C 232 70, 300 150, 316 226 C 324 270, 300 312, 262 330 L138 330 C 100 312, 76 270, 84 226 C 100 150, 168 70, 200 34 Z",
  islami: "M120 330 L120 196 C 120 150, 168 118, 200 84 C 232 118, 280 150, 280 196 L280 330 Z",
  pesta: "M200 72 A124 124 0 1 1 199.9 72 Z",
  angkasa: "M200 74 A122 122 0 1 1 199.9 74 Z",
};

function attireFor(decor: DecorId): Attire {
  if (decor === "jawa") return "jawa";
  if (decor === "sunda") return "sunda";
  if (decor === "islami") return "islami";
  return "modern";
}

function Figures({ decor, occasion }: { decor: DecorId; occasion: Occasion }) {
  const y = decor === "bunga" || decor === "pesta" || decor === "angkasa" ? 318 : 326;
  if (occasion === "khitan") {
    return (
      <g transform={`translate(200 ${y}) scale(1.35)`}>
        <KidKhitan />
      </g>
    );
  }
  if (occasion === "ultah") {
    return <g transform={`translate(196 ${y}) scale(1.3)`}>{decor === "angkasa" ? <KidAstronaut /> : <KidParty balloon={decor === "pesta" ? "#FF7A6B" : "#F2B6C6"} />}</g>;
  }
  return (
    <g transform={`translate(200 ${y}) scale(1.22)`}>
      <Couple attire={attireFor(decor)} />
    </g>
  );
}

function Backdrop({ decor }: { decor: DecorId }) {
  switch (decor) {
    case "jawa":
      return (
        <>
          <circle cx={200} cy={190} r={150} fill={A} fillOpacity={0.06} />
          <path d="M-10 330 L80 250 L140 300 L210 220 L300 300 L350 260 L410 330 Z" fill={M} fillOpacity={0.18} />
          <g className="t-anim t-drift">
            <Cloud x={14} y={70} s={0.7} fill={GOLD} line="var(--t-bg)" />
          </g>
          <g className="t-anim t-drift" style={{ animationDelay: "-6s" }}>
            <Cloud x={300} y={40} s={0.6} fill={GOLD} line="var(--t-bg)" />
          </g>
        </>
      );
    case "sunda":
      return (
        <>
          <g className="t-anim t-drift">
            <Cloud x={130} y={22} s={1.3} fill="#6F9A7C" />
          </g>
          {[60, 340].map((x, k) => (
            <g key={x} transform={`translate(${x} 70)`}>
              <path d="M0 0 L0 270" stroke="#7FA06B" strokeWidth={10} strokeLinecap="round" />
              {[40, 100, 160, 220].map((yy) => (
                <path key={yy} d={`M-6 ${yy} L6 ${yy}`} stroke="#5E7F4E" strokeWidth={2.4} />
              ))}
              <g className="t-anim t-sway" style={{ transformOrigin: "0px 40px", animationDelay: `${k}s` }}>
                <Leaf x={0} y={40} s={1.8} rot={k ? 200 : -20} color="#6E9A5B" />
                <Leaf x={0} y={100} s={1.5} rot={k ? 160 : 20} color="#8DB57A" />
                <Leaf x={0} y={160} s={1.6} rot={k ? 210 : -30} color="#6E9A5B" />
              </g>
            </g>
          ))}
        </>
      );
    case "islami":
      return (
        <>
          <path d="M140 120 C 140 70, 200 56, 200 30 C 200 56, 260 70, 260 120 Z" fill={A} fillOpacity={0.14} />
          <path d="M206 14 A10 10 0 1 0 214 30 A8 8 0 1 1 206 14 Z" fill={GOLD} />
          <g transform="translate(0 0)">
            <Lantern x={70} len={70} s={1.2} />
            <Lantern x={330} len={100} s={1} delay={1} />
          </g>
          <Star x={40} y={190} r={5} fill={GOLD} className="t-anim t-twinkle" />
          <Star x={360} y={60} r={4} fill={GOLD} className="t-anim t-twinkle" style={{ animationDelay: "1s" }} />
        </>
      );
    case "pesta":
      return (
        <>
          <path d="M0 26 Q200 92 400 26" stroke="#B9AEA4" strokeWidth={1.4} fill="none" />
          {Array.from({ length: 11 }, (_, i) => {
            const x = 18 + i * 36;
            const yy = Math.round(26 + 66 * (1 - ((x - 200) / 200) ** 2) * 0.62);
            return <path key={i} d={`M${x - 11} ${yy - 2} L${x + 11} ${yy - 2} L${x} ${yy + 20} Z`} fill={CONFETTI[i % 5]} />;
          })}
          <g className="t-anim t-bob">
            <Balloon x={44} y={190} color="#FF7A6B" s={1.4} />
            <Balloon x={76} y={232} color="#FFC845" s={1.1} />
          </g>
          <g className="t-anim t-bob" style={{ animationDelay: "-2s" }}>
            <Balloon x={356} y={186} color="#3CC5B6" s={1.4} />
            <Balloon x={326} y={236} color="#8C6CF2" s={1.1} />
          </g>
        </>
      );
    case "angkasa":
      return (
        <>
          <circle cx={330} cy={70} r={30} fill="#F4F1DE" />
          <circle cx={318} cy={62} r={6} fill="#E3DFC4" />
          <circle cx={340} cy={82} r={4} fill="#E3DFC4" />
          {[
            [40, 60, 5],
            [90, 120, 3],
            [360, 220, 4],
            [30, 280, 3],
            [250, 30, 3],
          ].map(([x, y, r], i) => (
            <Star key={i} x={x} y={y} r={r} fill={i % 2 ? "#FFFFFF" : "#FFD166"} className="t-anim t-twinkle" style={{ animationDelay: `${i * 0.6}s` }} />
          ))}
          <g className="t-anim t-orbit" style={{ transformOrigin: "200px 196px" }}>
            <g transform="translate(200 40) rotate(90)">
              <Rocket s={1.2} />
            </g>
          </g>
        </>
      );
    case "doodle":
      return (
        <>
          <path d="M60 110 Q200 40 340 110" stroke={M} strokeWidth={1.4} fill="none" strokeDasharray="4 6" />
          {[90, 140, 200, 260, 310].map((x, i) => {
            const yy = Math.round(110 - 70 * (1 - ((x - 200) / 140) ** 2) * 0.62);
            return (
              <g key={x} className="t-anim t-swing" style={{ transformOrigin: `${x}px ${yy}px`, animationDelay: `${i * 0.4}s` }}>
                <path d={`M${x} ${yy} L${x} ${yy + 16}`} stroke={M} strokeWidth={1} />
                <Heart x={x} y={yy + 14} s={0.9} fill={i % 2 ? "#F2B6C6" : A} stroke="none" />
              </g>
            );
          })}
          <ellipse cx={86} cy={330} rx={56} ry={26} fill="#A8C08A" fillOpacity={0.55} />
          <ellipse cx={318} cy={330} rx={60} ry={28} fill="#A8C08A" fillOpacity={0.55} />
        </>
      );
    default:
      return null;
  }
}

function PortalFrame({ decor }: { decor: DecorId }) {
  const d = PORTAL[decor];
  if (decor === "bunga") {
    const ring = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      // Rounded so server and browser produce identical markup.
      return { x: Math.round(200 + Math.cos(a) * 132), y: Math.round(190 + Math.sin(a) * 132), deg: Math.round((a * 180) / Math.PI) };
    });
    return (
      <>
        <path d={d} fill="none" stroke="#9DB78F" strokeWidth={2} />
        {ring.map((p, i) => (
          <Leaf key={i} x={p.x} y={p.y} s={1.15} rot={p.deg + (i % 2 ? 70 : 110)} color={i % 3 ? "#86A479" : "#A9C29B"} />
        ))}
        {ring
          .filter((_, i) => i % 4 === 1)
          .map((p, i) => (
            <Flower key={i} x={p.x} y={p.y} r={i % 2 ? 16 : 13} color={["#F2B6B6", "#F7D4C8", "#E79A9F"][i % 3]} rot={i * 20} />
          ))}
      </>
    );
  }
  if (decor === "jawa") {
    return (
      <>
        <path d={d} fill="none" stroke={GOLD} strokeWidth={3} />
        <path d={d} fill="none" stroke={GOLD} strokeWidth={1} transform="translate(200 190) scale(0.94) translate(-200 -190)" />
        <g fill="none" stroke={GOLD} strokeOpacity={0.4} strokeWidth={1.4}>
          <path d="M200 70 L200 200 M200 120 C 170 110, 150 130, 160 150 M200 120 C 230 110, 250 130, 240 150 M200 160 C 160 150, 130 180, 150 200 M200 160 C 240 150, 270 180, 250 200" />
        </g>
        <path d="M176 330 L176 304 L224 304 L224 330" fill={A} fillOpacity={0.15} stroke={GOLD} strokeWidth={2} />
      </>
    );
  }
  if (decor === "angkasa") {
    return (
      <>
        <path d={d} fill="none" stroke="#9AA6FF" strokeWidth={2.4} />
        <ellipse cx={200} cy={196} rx={184} ry={40} fill="none" stroke="#FFD166" strokeOpacity={0.7} strokeWidth={4} transform="rotate(-14 200 196)" />
      </>
    );
  }
  if (decor === "pesta") return <path d={d} fill="none" stroke={A} strokeWidth={2.4} strokeDasharray="2 9" strokeLinecap="round" />;
  if (decor === "doodle") return <path d={d} fill="none" stroke={A} strokeWidth={2.4} strokeLinecap="round" strokeDasharray="160 6 40 8" />;
  return (
    <>
      <path d={d} fill="none" stroke={decor === "islami" ? GOLD : A} strokeWidth={2.4} />
      <path d={d} fill="none" stroke={decor === "islami" ? GOLD : M} strokeOpacity={0.6} strokeWidth={1} transform="translate(200 210) scale(0.94) translate(-200 -210)" />
    </>
  );
}

/**
 * Illustrated scene: background art + a frame with faceless figures that fit
 * the occasion, or the client's own photo / AI image inside the frame.
 */
export function DecorScene({ decor, occasion, photo, className = "" }: { decor: DecorId; occasion: Occasion; photo?: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const d = PORTAL[decor];
  return (
    <svg viewBox="0 0 400 360" className={`h-auto w-full overflow-visible ${className}`} role="img" aria-label="Ilustrasi undangan">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={d} />
        </clipPath>
        <radialGradient id={`${id}-glow`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="var(--t-card)" />
          <stop offset="100%" stopColor="var(--t-input)" />
        </radialGradient>
      </defs>
      <Backdrop decor={decor} />
      <path d={d} fill={`url(#${id}-glow)`} />
      {photo ? (
        <image href={photo} x={60} y={30} width={280} height={310} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id}-clip)`} />
      ) : (
        <g clipPath={`url(#${id}-clip)`}>
          {decor === "sunda" && <path d="M110 300 L170 240 L196 252 L232 232 L290 300 Z" fill={M} fillOpacity={0.25} />}
          {decor === "angkasa" && (
            <>
              <circle cx={150} cy={130} r={2} fill="#FFFFFF" />
              <circle cx={260} cy={160} r={1.6} fill="#FFFFFF" />
              <circle cx={230} cy={110} r={1.2} fill="#FFD166" />
            </>
          )}
          <g className="t-anim t-breathe" style={{ transformOrigin: "200px 330px" }}>
            <Figures decor={decor} occasion={occasion} />
          </g>
        </g>
      )}
      <PortalFrame decor={decor} />
    </svg>
  );
}

/** Wrapper used by covers and photo-free sections: pattern + four corners. */
export function DecorFrame({ decor, children, corners = ["tl", "tr", "bl", "br"], inset = "edge" }: { decor: DecorId; children?: ReactNode; corners?: ("tl" | "tr" | "bl" | "br")[]; inset?: "edge" | "hero" }) {
  if (decor === "none") return <>{children}</>;
  // Under a header the corners are a bit smaller so they frame the content instead of crowding it.
  const size = inset === "hero" ? "w-[28vw] max-w-[150px] min-w-[96px] md:w-[170px] md:max-w-none" : undefined;
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <DecorPattern decor={decor} />
        {corners.map((c) => (
          <DecorCorner key={c} decor={decor} at={c} inset={inset} sizeClass={size} />
        ))}
      </div>
      {children}
    </>
  );
}
