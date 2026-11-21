import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useState, type PointerEvent, type ReactNode } from "react";
import * as css from "./cursor-follower.css.ts";
import { cx } from "../lib/cx.ts";

interface CursorFollowerProps {
  children?: ReactNode;
  /** 따라다니는 원의 지름(px) */
  size?: number;
  /** 스프링 강도 — 클수록 커서에 빨리 붙는다 */
  stiffness?: number;
  className?: string;
  /** 원 스타일 (색, blend mode 등) */
  dotClassName?: string;
}

/** 영역 안에서 스프링으로 커서를 따라오는 원 */
export function CursorFollower({
  children,
  size = 32,
  stiffness = 300,
  className,
  dotClassName,
}: CursorFollowerProps) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const spring = { stiffness, damping: 28, mass: 0.6 };
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    const ny = e.clientY - rect.top;
    if (reduce || !visible) {
      // 처음 들어올 때는 바로 그 자리에서 시작
      x.jump(nx);
      y.jump(ny);
    } else {
      x.set(nx);
      y.set(ny);
    }
    setVisible(true);
  }

  return (
    <div
      className={cx(css.area, className)}
      style={assignInlineVars({ [css.sizeVar]: `${size}px` })}
      onPointerMove={handleMove}
      onPointerLeave={() => setVisible(false)}
    >
      {children}
      <m.div
        aria-hidden
        className={cx(css.dot, dotClassName)}
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.4 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
