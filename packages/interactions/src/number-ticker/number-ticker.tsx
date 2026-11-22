import { m, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { cx } from "../lib/cx.ts";
import { visuallyHidden } from "../lib/visually-hidden.css.ts";
import * as css from "./number-ticker.css.ts";

interface NumberTickerProps {
  value: number;
  /** 자릿수가 굴러가는 시간(s) */
  duration?: number;
  /** 오른쪽 자리부터 늦게 출발하는 간격(s) — 0 이면 한꺼번에 */
  stagger?: number;
  /** Intl.NumberFormat 옵션 (천 단위 구분 등) */
  format?: Intl.NumberFormatOptions;
  locale?: string;
  className?: string;
}

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * 자릿수마다 0~9 를 세로로 쌓은 기둥을 굴려 숫자를 바꾼다.
 * 스크린 리더는 숨긴 텍스트로 숫자 전체를 한 번에 읽고, 굴러가는 기둥은 aria-hidden.
 */
export function NumberTicker({
  value,
  duration = 0.6,
  stagger = 0.04,
  format,
  locale,
  className,
}: NumberTickerProps) {
  const reduce = useReducedMotion();
  const text = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0, ...format }).format(value),
    [value, locale, format],
  );
  // 오른쪽(일의 자리)부터 번호를 매겨 key 로 쓴다 — 자릿수가 늘어도 기존 기둥이 제자리에 남는다
  const chars = [...text].map((char, i, all) => ({ char, place: all.length - 1 - i }));

  return (
    <span className={cx(css.root, className)}>
      <span className={visuallyHidden}>{text}</span>
      <span aria-hidden className={css.digits}>
        {chars.map(({ char, place }) =>
          /\d/.test(char) ? (
            <span key={place} className={css.column}>
              <m.span
                className={css.reel}
                initial={{ y: "0%" }}
                animate={{ y: `${-Number(char) * 10}%` }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration, delay: place * stagger, ease: [0.22, 1, 0.36, 1] }
                }
              >
                {DIGITS.map((d) => (
                  <span key={d} className={css.digit}>
                    {d}
                  </span>
                ))}
              </m.span>
            </span>
          ) : (
            <span key={`${place}${char}`} className={css.symbol}>
              {char}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
