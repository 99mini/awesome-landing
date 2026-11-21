import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  /** 등장 시 이동 거리(px) */
  offset?: number;
  delay?: number;
  once?: boolean;
}

export function ScrollReveal({ children, offset = 40, delay = 0, once = true }: ScrollRevealProps) {
  const reduce = useReducedMotion();

  return (
    <m.div
      initial={{ opacity: 0, y: reduce ? 0 : offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
