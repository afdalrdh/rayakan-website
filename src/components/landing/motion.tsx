import type { CSSProperties, ReactNode } from "react";

/*
 * First-paint entrances for marketing pages. Pure CSS (`.rk-enter`, `.rk-lift`
 * in globals.css), so they run before any JavaScript and never delay LCP.
 */

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * Headline that comes into focus word by word on load.
 * `lines` = array of lines; wrap a word in *asterisks* to set it in italic.
 */
export function BlurInTitle({ lines, className = "" }: { lines: string[]; className?: string }) {
  let i = 0;
  return (
    <h1 className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((raw) => {
            const italic = raw.startsWith("*") && raw.endsWith("*");
            const word = italic ? raw.slice(1, -1) : raw;
            const at = 0.08 * i++;
            return (
              <span key={`${li}-${raw}-${at}`} style={delay(at)} className={`rk-enter mr-[0.22em] inline-block last:mr-0 ${italic ? "italic text-rk-bronze" : ""}`}>
                {word}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/** Rises in after the headline (`delay` in seconds). */
export function FadeUp({ children, delay: at = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div style={delay(at)} className={`rk-lift ${className}`}>
      {children}
    </div>
  );
}
