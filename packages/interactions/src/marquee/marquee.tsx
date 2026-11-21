import { assignInlineVars } from "@vanilla-extract/dynamic";
import type { ReactNode } from "react";
import * as css from "./marquee.css.ts";
import { cx } from "../lib/cx.ts";

interface MarqueeProps {
  children: ReactNode;
  /** 한 바퀴 도는 시간(s) — 작을수록 빠르다 */
  duration?: number;
  /** 항목 간격 (CSS 길이) */
  gap?: string;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

/** 내용을 두 번 이어 붙여 끊김 없이 흐르는 띠 */
export function Marquee({
  children,
  duration = 20,
  gap = "2rem",
  direction = "left",
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const trackClass = cx(
    css.track,
    direction === "right" && css.reverse,
    pauseOnHover && css.pausable,
  );

  return (
    <div
      className={cx(css.viewport, className)}
      style={assignInlineVars({ [css.durationVar]: `${duration}s`, [css.gapVar]: gap })}
    >
      <div className={trackClass}>
        <div className={css.group}>{children}</div>
        <div className={css.group} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
