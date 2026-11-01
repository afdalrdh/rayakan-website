"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const HIDDEN = {
  up: "translate-y-6 opacity-0",
  blur: "translate-y-4 opacity-0 blur-[10px]",
  scale: "scale-[0.96] opacity-0",
  left: "-translate-x-8 opacity-0",
  right: "translate-x-8 opacity-0",
} as const;

/**
 * Plays an entrance once the element scrolls into view (CSS transition, no JS animation loop).
 * Reduced-motion users get the content immediately.
 */
export function Reveal({ children, delay = 0, className = "", variant = "up" }: { children: ReactNode; delay?: number; className?: string; variant?: keyof typeof HIDDEN }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform,filter] duration-[1000ms] ease-[cubic-bezier(.2,.7,.2,1)] ${shown ? "translate-x-0 translate-y-0 scale-100 opacity-100 blur-none" : HIDDEN[variant]} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-none motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}
