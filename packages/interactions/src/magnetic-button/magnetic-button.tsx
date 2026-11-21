import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ComponentProps, PointerEvent } from "react";

interface MagneticButtonProps extends ComponentProps<typeof motion.button> {
  /** 커서를 따라가는 정도 (0 ~ 1) */
  strength?: number;
}

export function MagneticButton({ strength = 0.35, style, ...props }: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });

  function handleMove(e: PointerEvent<HTMLButtonElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      {...props}
      style={{ ...style, x, y }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.95 }}
    />
  );
}
