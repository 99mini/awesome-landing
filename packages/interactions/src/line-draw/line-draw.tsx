import { m, useReducedMotion } from "motion/react";
import * as css from "./line-draw.css.ts";

import { smoothPath } from "./path.ts";
import { cx } from "../lib/cx.ts";

// m.svg 는 <svg> 다 — 차트 그림에 role="img" + aria-label 이 맞는 표기인데, 린트는 m.svg 를 svg 로 알아보지 못한다
/* oxlint-disable jsx-a11y/prefer-tag-over-role */

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
    // 화면에 들어오면 그린다 — whileInView 는 Motion 기능 묶음이 늦게 와도(LazyMotion) 그때 관찰을 시작해 놓치지 않는다.
    // (useInView 로 animate 값을 바꾸면, 페이지 맨 위처럼 기능이 오기 전에 이미 보이는 경우 그리지 않고 멈춰 있었다)
    <m.svg
      className={cx(css.root, className)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
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
            <m.path
              d={d}
              className={css.line}
              style={{ strokeWidth: thickness }}
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                shown: {
                  pathLength: 1,
                  opacity: 1,
                  transition: {
                    pathLength: { duration: time, delay, ease: [0.65, 0, 0.35, 1] },
                    opacity: { duration: 0.01, delay },
                  },
                },
              }}
            />
            {end && (
              <m.circle
                className={css.dot}
                cx={end[0]}
                cy={end[1]}
                r={thickness + 2}
                variants={{
                  hidden: { scale: 0 },
                  shown: {
                    scale: 1,
                    transition: {
                      delay: delay + time,
                      type: "spring",
                      stiffness: 500,
                      damping: 18,
                    },
                  },
                }}
              />
            )}
          </g>
        );
      })}
    </m.svg>
  );
}
