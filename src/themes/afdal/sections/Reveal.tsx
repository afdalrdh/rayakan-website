"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Soft fade-up when a block scrolls into view (used across this theme). */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.75, delay }} className={className}>
      {children}
    </motion.div>
  );
}
