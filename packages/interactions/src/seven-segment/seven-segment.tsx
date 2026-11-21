import { motion, useReducedMotion } from "motion/react";
import { COLON_W, DIGIT_H, DIGIT_W, GLYPHS, SEGMENTS } from "./geometry.ts";
import * as css from "./seven-segment.css.ts";
import { cx } from "../lib/cx.ts";

interface SevenSegmentProps {
  /** 표시할 문자열 — 0-9, '-', ' ', ':' */
  value: string;
  /** 꺼진 세그먼트를 희미하게 남긴다 (LCD 잔상) */
  ghost?: boolean;
  /** 기울기(deg) — 실제 LCD 처럼 살짝 눕힌다 */
  skew?: number;
  /** 글자 높이(px) */
  height?: number;
  className?: string;
}

const SPACING = 12;

export function SevenSegment({
  value,
  ghost = true,
  skew = 6,
  height = 64,
  className,
}: SevenSegmentProps) {
  const reduce = useReducedMotion();
  const chars = [...value];
  let x = 0;
  const cells = chars.map((char) => {
    const cell = { char, x };
    x += (char === ":" ? COLON_W : DIGIT_W) + SPACING;
    return cell;
  });
  const width = Math.max(x - SPACING, 0);
  // 기울였을 때 잘리지 않도록 여유 폭
  const lean = Math.tan((skew * Math.PI) / 180) * DIGIT_H;

  return (
    <svg
      className={cx(css.root, className)}
      viewBox={`${-lean / 2} 0 ${width + lean} ${DIGIT_H}`}
      height={height}
      role="img"
      aria-label={value}
    >
      <g transform={`translate(${lean / 2} 0) skewX(${-skew}) translate(${-lean / 2} 0)`}>
        {cells.map(({ char, x: cellX }, i) =>
          char === ":" ? (
            <g key={i} transform={`translate(${cellX} 0)`}>
              <circle className={css.on} cx={COLON_W / 2} cy={DIGIT_H * 0.3} r={5} />
              <circle className={css.on} cx={COLON_W / 2} cy={DIGIT_H * 0.7} r={5} />
            </g>
          ) : (
            <g key={i} transform={`translate(${cellX} 0)`}>
              {SEGMENTS.map((points, s) => {
                const lit = GLYPHS[char]?.[s] === 1;
                return (
                  <motion.polygon
                    key={s}
                    points={points}
                    className={css.segment}
                    initial={false}
                    animate={{ opacity: lit ? 1 : ghost ? 0.08 : 0 }}
                    transition={{ duration: reduce ? 0 : 0.18 }}
                  />
                );
              })}
            </g>
          ),
        )}
      </g>
    </svg>
  );
}
