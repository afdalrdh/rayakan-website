"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

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
            const delay = 0.08 * i++;
            return (
              <motion.span
                key={`${li}-${raw}-${delay}`}
                initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay, ease: EASE }}
                className={`mr-[0.22em] inline-block last:mr-0 ${italic ? "italic text-rk-bronze" : ""}`}
              >
                {word}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/** Fades children up after the headline. */
export function FadeUp({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}
