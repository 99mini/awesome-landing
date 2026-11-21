import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import * as css from "./line-draw.css.ts";
import { smoothPath } from "./path.ts";
import { cx } from "../lib/cx.ts";

interface LineDrawProps {
  /** 시리즈별 y 값 배열 (x 는 균등 간격) */
  series: readonly (readonly number[])[];
  /** 한 줄을 그리는 시간(s) */
  duration?: number;
  thickness?: number;
  width?: number;
  height?: number;
  className?: string;
  /** 시리즈 i 의 선 클래스 (색 지정) */
  lineClassName?: (index: number) => string | undefined;
}

const PAD = 8;

/** 화면에 들어오면 선이 왼쪽부터 그려지는 차트 (Motion pathLength) */
export function LineDraw({
  series,
  duration = 2,
  thickness = 2.5,
  width = 320,
  height = 160,
  className,
  lineClassName,
}: LineDrawProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const all = series.flat();
  const max = Math.max(...all, 0);
  const min = Math.min(...all, 0);
  const span = max - min || 1;

  const paths = series.map((ys) => {
    const step = (width - PAD * 2) / Math.max(ys.length - 1, 1);
    const pts = ys.map(
      (y, i) => [PAD + i * step, PAD + (1 - (y - min) / span) * (height - PAD * 2)] as const,
    );
    return { d: smoothPath(pts), end: pts.at(-1) };
  });

  return (
    <svg
      ref={ref}
      className={cx(css.root, className)}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Line chart"
    >
      {[0.25, 0.5, 0.75].map((r) => (
        <line key={r} className={css.grid} x1={0} x2={width} y1={height * r} y2={height * r} />
      ))}
      {paths.map(({ d, end }, i) => {
        const delay = reduce ? 0 : i * 0.25;
        const time = reduce ? 0 : duration;
        return (
          <g key={i} className={lineClassName?.(i)}>
            <motion.path
              d={d}
              className={css.line}
              style={{ strokeWidth: thickness }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{
                pathLength: { duration: time, delay, ease: [0.65, 0, 0.35, 1] },
                opacity: { duration: 0.01, delay },
              }}
            />
            {end && (
              <motion.circle
                className={css.dot}
                cx={end[0]}
                cy={end[1]}
                r={thickness + 2}
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : undefined}
                transition={{ delay: delay + time, type: "spring", stiffness: 500, damping: 18 }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
