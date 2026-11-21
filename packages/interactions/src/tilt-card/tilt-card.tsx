import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import * as css from "./tilt-card.css.ts";
import { cx } from "../lib/cx.ts";

interface TiltCardProps {
  children: ReactNode;
  /** 최대 회전 각도(deg) */
  maxTilt?: number;
  className?: string;
}

export function TiltCard({ children, maxTilt = 12, className }: TiltCardProps) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 20 };
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), spring);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div className={css.viewport}>
      <m.div
        className={cx(css.card, className)}
        style={{ rotateX, rotateY }}
        onPointerMove={handleMove}
        onPointerLeave={reset}
      >
        {children}
      </m.div>
    </div>
  );
}
