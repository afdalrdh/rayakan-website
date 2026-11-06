/**
 * Faceless figures for photo-free invitations ("ilustrasi tanpa wajah").
 * Drawn in local coordinates with the feet at (0, 0), about 150 units tall.
 * Place them with <g transform="translate(x y) scale(s)">.
 */

const SKIN = "#EBC2A0";
const SKIN_SHADE = "#D9A985";
const HAIR = "#2B211D";

export type Attire = "modern" | "jawa" | "sunda" | "islami";

function Head({ cy, r = 15 }: { cy: number; r?: number }) {
  return (
    <>
      <rect x={-4} y={cy + r - 3} width={8} height={9} rx={3} fill={SKIN_SHADE} />
      <circle cx={0} cy={cy} r={r} fill={SKIN} />
    </>
  );
}

/** Groom. `hand` is where his right hand meets the bride's (relative to his feet). */
export function Groom({ attire = "modern", hand = { x: 30, y: -66 } }: { attire?: Attire; hand?: { x: number; y: number } }) {
  const jacket = attire === "modern" ? "#2C2D3A" : attire === "islami" ? "#F7F3EA" : "#2E241D";
  const lower = attire === "modern" ? "#25262F" : attire === "islami" ? "#3F6B57" : "#6B4A2B";
  return (
    <g>
      {/* legs / jarik */}
      {attire === "modern" ? (
        <path d="M-13 -58 L-12 -2 L-3 -2 L-1 -42 L1 -42 L3 -2 L12 -2 L13 -58 Z" fill={lower} />
      ) : (
        <>
          <path d="M-15 -60 L-17 -2 L17 -2 L15 -60 Z" fill={lower} />
          {[-11, -5, 1, 7, 13].map((x) => (
            <path key={x} d={`M${x} -56 l-3 6 l3 6 l-3 6 l3 6 l-3 6 l3 6 l-3 6 l3 6`} stroke="#E2C48C" strokeOpacity={0.55} strokeWidth={1.1} fill="none" />
          ))}
          <path d="M-2 -60 L4 -2" stroke="#E2C48C" strokeOpacity={0.6} strokeWidth={1.2} />
        </>
      )}
      <ellipse cx={-8} cy={-1} rx={7} ry={3} fill="#1B1A1F" />
      <ellipse cx={8} cy={-1} rx={7} ry={3} fill="#1B1A1F" />
      {/* jacket */}
      <path d="M-21 -102 Q-24 -68 -16 -56 L16 -56 Q24 -68 21 -102 Q11 -111 0 -111 Q-11 -111 -21 -102 Z" fill={jacket} stroke={attire === "islami" ? "#D9CFBC" : "none"} strokeWidth={1} />
      {attire === "modern" && (
        <>
          <path d="M-6 -109 L0 -88 L6 -109 Z" fill="#FBF8F2" />
          <path d="M-5 -106 L0 -103 L5 -106 L5 -101 L0 -103 L-5 -101 Z" fill="var(--t-accent)" />
          <circle cx={0} cy={-80} r={1.3} fill="#9EA0B0" />
          <circle cx={0} cy={-70} r={1.3} fill="#9EA0B0" />
          <path d="M11 -98 l4 4 l-4 3 Z" fill="#FBF8F2" />
        </>
      )}
      {(attire === "jawa" || attire === "sunda") && (
        <>
          <path d="M-4 -110 L4 -110 L10 -58" stroke="#C9A253" strokeWidth={1.4} fill="none" />
          {[-96, -86, -76, -66].map((y) => (
            <circle key={y} cx={7 + (y + 96) / 12} cy={y} r={1.4} fill="#E2C48C" />
          ))}
          <path d="M-20 -60 L20 -60" stroke="#C9A253" strokeWidth={3} />
        </>
      )}
      {attire === "islami" && (
        <>
          <path d="M-6 -110 L0 -100 L6 -110" stroke="#C9BFAA" strokeWidth={1.4} fill="none" />
          {[-96, -88, -80].map((y) => (
            <circle key={y} cx={0} cy={y} r={1.2} fill="#BBA97F" />
          ))}
        </>
      )}
      {/* left arm hanging, right arm reaching */}
      <path d="M-20 -98 Q-29 -78 -25 -60" stroke={jacket} strokeWidth={9} strokeLinecap="round" fill="none" />
      <circle cx={-25} cy={-58} r={4.4} fill={SKIN} />
      <path d={`M19 -98 Q${hand.x - 4} ${hand.y - 20} ${hand.x - 3} ${hand.y - 2}`} stroke={jacket} strokeWidth={9} strokeLinecap="round" fill="none" />
      <circle cx={hand.x} cy={hand.y} r={4.4} fill={SKIN} />
      <Head cy={-127} />
      {/* hair / headwear */}
      {attire === "modern" && <path d="M-15 -128 Q-17 -146 0 -145 Q17 -146 15 -128 Q11 -137 0 -137 Q-11 -137 -15 -128 Z" fill={HAIR} />}
      {attire === "islami" && <path d="M-15 -133 L-14 -146 Q0 -150 14 -146 L15 -133 Q0 -137 -15 -133 Z" fill="#1F1D22" />}
      {(attire === "jawa" || attire === "sunda") && (
        <>
          <path d="M-16 -128 Q-18 -148 0 -147 Q18 -148 16 -128 Q0 -134 -16 -128 Z" fill="#4A3424" />
          <path d="M-13 -140 Q0 -146 13 -140" stroke="#C9A253" strokeWidth={1} fill="none" />
          {attire === "jawa" ? <ellipse cx={13} cy={-131} rx={6} ry={5} fill="#3A2819" /> : <path d="M10 -146 l10 -6 l-4 9 Z" fill="#4A3424" />}
        </>
      )}
    </g>
  );
}

/** Bride. Her left hand is at (−30, −66) so it meets the groom's when placed 60 apart. */
export function Bride({ attire = "modern", bouquet = true }: { attire?: Attire; bouquet?: boolean }) {
  const top = attire === "modern" ? "#FFFDF8" : attire === "islami" ? "#FFFDF8" : "#FBF3E6";
  return (
    <g>
      {attire === "modern" && <path d="M7 -142 Q34 -112 30 -30 Q22 -60 4 -120 Z" fill="#FFFFFF" fillOpacity={0.7} stroke="#E9E1D4" strokeWidth={0.8} />}
      {/* skirt */}
      {attire === "modern" || attire === "islami" ? (
        <path d="M-13 -96 Q-17 -64 -34 -2 L34 -2 Q17 -64 13 -96 Z" fill={top} stroke="#E4DACB" strokeWidth={1} />
      ) : (
        <>
          <path d="M-14 -66 L-18 -2 L18 -2 L14 -66 Z" fill="#6B4A2B" />
          {[-12, -6, 0, 6, 12].map((x) => (
            <path key={x} d={`M${x} -62 l-3 6 l3 6 l-3 6 l3 6 l-3 6 l3 6 l-3 6 l3 6 l-3 6`} stroke="#E2C48C" strokeOpacity={0.55} strokeWidth={1.1} fill="none" />
          ))}
        </>
      )}
      {/* bodice / kebaya */}
      <path d={attire === "modern" ? "M-13 -98 Q-15 -78 -12 -66 L12 -66 Q15 -78 13 -98 Q7 -106 0 -106 Q-7 -106 -13 -98 Z" : "M-17 -100 Q-19 -76 -18 -56 L18 -56 Q19 -76 17 -100 Q8 -108 0 -108 Q-8 -108 -17 -100 Z"} fill={top} stroke="#E4DACB" strokeWidth={1} />
      {attire !== "modern" && (
        <>
          <path d="M-6 -106 L0 -84 L6 -106" stroke="#D8C5A3" strokeWidth={1} fill="none" />
          {[-100, -92, -84, -76, -68, -60].map((y, i) => (
            <circle key={y} cx={(i % 2 ? 1 : -1) * 13} cy={y} r={1.6} fill="#E4CE9F" />
          ))}
        </>
      )}
      <path d="M-12 -68 L12 -68" stroke="var(--t-accent)" strokeOpacity={0.8} strokeWidth={2.5} />
      {/* arms */}
      <path d="M-13 -96 Q-27 -84 -27 -68" stroke={top} strokeWidth={8} strokeLinecap="round" fill="none" />
      <circle cx={-27} cy={-66} r={4.2} fill={SKIN} />
      <path d="M13 -96 Q20 -84 10 -78" stroke={top} strokeWidth={8} strokeLinecap="round" fill="none" />
      {bouquet && (
        <g transform="translate(6 -78)">
          <path d="M0 0 L-4 12 M0 0 L2 13 M0 0 L5 11" stroke="#6C8B5E" strokeWidth={1.4} />
          <circle cx={-5} cy={-2} r={4.5} fill="#F2B6B6" />
          <circle cx={3} cy={-4} r={4.5} fill="#F7D4C8" />
          <circle cx={0} cy={3} r={4} fill="#E79A9F" />
          <circle cx={7} cy={2} r={3.5} fill="#FFFFFF" />
        </g>
      )}
      <Head cy={-124} r={14} />
      {/* hair & headwear */}
      {attire === "modern" && (
        <>
          <path d="M-14 -126 Q-16 -142 0 -141 Q16 -142 14 -126 Q8 -134 0 -134 Q-8 -134 -14 -126 Z" fill={HAIR} />
          <circle cx={9} cy={-136} r={7} fill={HAIR} />
          <circle cx={13} cy={-138} r={2.4} fill="#FFFFFF" />
        </>
      )}
      {(attire === "jawa" || attire === "sunda") && (
        <>
          <path d="M-14 -125 Q-16 -142 0 -141 Q16 -142 14 -125 Q8 -133 0 -133 Q-8 -133 -14 -125 Z" fill={HAIR} />
          <ellipse cx={12} cy={-128} rx={9} ry={8} fill={HAIR} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={17 + i * 1.5} cy={-122 + i * 6} r={1.8} fill="#FFFFFF" />
          ))}
          {attire === "sunda" && <path d="M-14 -138 Q0 -156 14 -138 L10 -136 Q0 -148 -10 -136 Z" fill="#D6B25E" stroke="#B48C3A" strokeWidth={0.8} />}
          {attire === "jawa" && <path d="M-11 -139 Q0 -145 11 -139" stroke="#2B211D" strokeWidth={2.4} fill="none" />}
        </>
      )}
      {attire === "islami" && <path d="M-17 -122 Q-19 -146 0 -146 Q19 -146 17 -122 Q16 -100 22 -92 L-22 -92 Q-16 -100 -17 -122 Z" fill="#EAD9CF" stroke="#D9C3B6" strokeWidth={0.8} />}
    </g>
  );
}

export function Couple({ attire = "modern" }: { attire?: Attire }) {
  return (
    <g>
      <g transform="translate(-30 0)">
        <Groom attire={attire} hand={{ x: 30, y: -66 }} />
      </g>
      <g transform="translate(30 0)">
        <Bride attire={attire === "islami" ? "islami" : attire} />
      </g>
    </g>
  );
}

/** Birthday girl with a party hat and a balloon. */
export function KidParty({ balloon = "#FF7A6B" }: { balloon?: string }) {
  return (
    <g>
      <path d="M26 -78 Q36 -110 30 -140" stroke="#9A8F86" strokeWidth={1} fill="none" />
      <g className="t-anim t-bob" style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
        <ellipse cx={30} cy={-156} rx={14} ry={17} fill={balloon} />
        <ellipse cx={25} cy={-162} rx={3.5} ry={5} fill="#FFFFFF" fillOpacity={0.45} />
        <path d="M27 -139 l3 3 l3 -3 Z" fill={balloon} />
      </g>
      <path d="M-8 -36 L-8 -2 M8 -36 L8 -2" stroke={SKIN} strokeWidth={6} strokeLinecap="round" />
      <ellipse cx={-9} cy={-1} rx={6} ry={2.6} fill="#E46A8C" />
      <ellipse cx={9} cy={-1} rx={6} ry={2.6} fill="#E46A8C" />
      <path d="M-11 -76 Q-14 -54 -26 -34 L26 -34 Q14 -54 11 -76 Q5 -82 0 -82 Q-5 -82 -11 -76 Z" fill="#FFC845" />
      {[-16, -6, 4, 14].map((x) => (
        <circle key={x} cx={x} cy={-44} r={2} fill="#FF7A6B" />
      ))}
      <path d="M-24 -36 Q0 -30 24 -36" stroke="#FF8FB7" strokeWidth={2.2} fill="none" />
      <path d="M-10 -74 Q-20 -62 -22 -52" stroke={SKIN} strokeWidth={5.5} strokeLinecap="round" fill="none" />
      <path d="M10 -74 Q20 -78 26 -80" stroke={SKIN} strokeWidth={5.5} strokeLinecap="round" fill="none" />
      <Head cy={-96} r={14} />
      <path d="M-14 -98 Q-15 -113 0 -112 Q15 -113 14 -98 Q8 -106 0 -106 Q-8 -106 -14 -98 Z" fill="#5A3A2C" />
      <circle cx={-16} cy={-96} r={5} fill="#5A3A2C" />
      <circle cx={16} cy={-96} r={5} fill="#5A3A2C" />
      <path d="M-8 -108 L2 -134 L10 -108 Z" fill="#3CC5B6" />
      <path d="M-5 -116 L7 -116 M-2 -124 L5 -124" stroke="#FFFFFF" strokeWidth={2} />
      <circle cx={2} cy={-136} r={3.5} fill="#FF7A6B" />
    </g>
  );
}

/** Little astronaut: the helmet keeps the face hidden. */
export function KidAstronaut() {
  return (
    <g>
      <path d="M-10 -40 L-10 -4 M10 -40 L10 -4" stroke="#EDEFF7" strokeWidth={9} strokeLinecap="round" />
      <ellipse cx={-10} cy={-2} rx={7} ry={3.4} fill="#8C7CFF" />
      <ellipse cx={10} cy={-2} rx={7} ry={3.4} fill="#8C7CFF" />
      <rect x={-25} y={-82} width={50} height={46} rx={14} fill="#F4F5FB" stroke="#CBD0E6" strokeWidth={1.2} />
      <rect x={-10} y={-72} width={20} height={14} rx={3} fill="#2B2F7A" />
      <circle cx={-4} cy={-65} r={2} fill="#FFD166" />
      <circle cx={4} cy={-65} r={2} fill="#4ED1C2" />
      <path d="M-24 -76 Q-34 -64 -30 -50" stroke="#F4F5FB" strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M24 -76 Q36 -86 38 -98" stroke="#F4F5FB" strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M38 -98 L38 -130" stroke="#C9CDE0" strokeWidth={1.6} />
      <path d="M38 -130 L56 -124 L38 -118 Z" fill="#FFD166" />
      <circle cx={0} cy={-104} r={22} fill="#F4F5FB" stroke="#CBD0E6" strokeWidth={1.2} />
      <circle cx={0} cy={-104} r={16} fill="#2B2F7A" />
      <path d="M-9 -112 Q-4 -118 4 -116" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" fill="none" />
    </g>
  );
}

/** Boy in koko, peci and sarung (khitanan). */
export function KidKhitan() {
  return (
    <g>
      <ellipse cx={-7} cy={-1} rx={6} ry={2.6} fill="#5B4636" />
      <ellipse cx={7} cy={-1} rx={6} ry={2.6} fill="#5B4636" />
      <path d="M-15 -52 L-16 -4 L16 -4 L15 -52 Z" fill="var(--t-accent)" />
      {[-46, -36, -26, -16].map((y) => (
        <path key={y} d={`M-15 ${y} L15 ${y}`} stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={1.6} />
      ))}
      {[-8, 0, 8].map((x) => (
        <path key={x} d={`M${x} -52 L${x} -4`} stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={1.4} />
      ))}
      <path d="M-17 -86 Q-19 -64 -16 -50 L16 -50 Q19 -64 17 -86 Q9 -94 0 -94 Q-9 -94 -17 -86 Z" fill="#FBFAF6" stroke="#DCD6C8" strokeWidth={1} />
      <path d="M-5 -93 L0 -84 L5 -93" stroke="#CFC6B1" strokeWidth={1.2} fill="none" />
      {[-80, -73, -66].map((y) => (
        <circle key={y} cx={0} cy={y} r={1.1} fill="#C2B48F" />
      ))}
      <path d="M-16 -84 Q-25 -70 -21 -56" stroke="#FBFAF6" strokeWidth={7.5} strokeLinecap="round" fill="none" />
      <path d="M16 -84 Q25 -70 21 -56" stroke="#FBFAF6" strokeWidth={7.5} strokeLinecap="round" fill="none" />
      <circle cx={-21} cy={-54} r={3.8} fill={SKIN} />
      <circle cx={21} cy={-54} r={3.8} fill={SKIN} />
      <Head cy={-109} r={14} />
      <path d="M-14 -113 L-13 -126 Q0 -130 13 -126 L14 -113 Q0 -117 -14 -113 Z" fill="#1F1D22" />
      <path d="M-13 -121 Q0 -124 13 -121" stroke="#C9A253" strokeWidth={0.9} fill="none" />
    </g>
  );
}
