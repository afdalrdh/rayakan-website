/* Small inline icons shared by every theme. Colour follows `currentColor`. */

type P = { className?: string; size?: number };

export const InstagramIcon = ({ className = "", size = 14 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`shrink-0 ${className}`}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.4" fill="currentColor" />
  </svg>
);

export const CopyIcon = ({ className = "", size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M4 16c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ContactlessIcon = ({ className = "" }: P) => (
  <svg width="28" height="34" viewBox="0 0 34 46" fill="none" aria-hidden="true" className={className}>
    <path d="M5 12C11.5 17.8 11.5 28.2 5 34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M13 7C22 16 22 30 13 39" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
    <path d="M21 2C33 14.5 33 31.5 21 44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
  </svg>
);

export const ArrowUpRightIcon = ({ className = "", size = 19 }: P) => (
  <svg width={size} height={size} viewBox="0 0 19 19" fill="none" aria-hidden="true" className={`shrink-0 ${className}`}>
    <path d="M5.25 13.75L13.75 5.25M8 5.25H13.75V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CloseIcon = ({ className = "", size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ChevronIcon = ({ dir, className = "", size = 22 }: P & { dir: "left" | "right" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path d={dir === "left" ? "M15 5L8 12L15 19" : "M9 5L16 12L9 19"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MenuIcon = () => (
  <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
    <path d="M1 2H21M1 8H21M1 14H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const EnvelopeIcon = ({ className = "" }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M2 7L12 14L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowDownIcon = ({ className = "" }: P) => (
  <svg width="18" height="24" viewBox="0 0 18 24" fill="none" aria-hidden="true" className={className}>
    <path d="M9 1V21M2 14L9 21L16 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const InfoIcon = ({ className = "" }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className={`shrink-0 ${className}`}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

export const GiftIcon = ({ className = "" }: P) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
  </svg>
);

export const PlayIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <path d="M56 40L30 56V24L56 40Z" fill="currentColor" />
  </svg>
);
