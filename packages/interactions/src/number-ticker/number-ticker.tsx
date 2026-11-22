import { AnimatePresence, m, useInView, useReducedMotion } from "motion/react";
import { useMemo, useRef, useState } from "react";
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
 * - 처음에는 화면에 들어올 때 0 에서부터 굴러간다.
 * - 나중에 생긴 자리는 0 을 거치지 않고 제 숫자로 작게 나타나 커지고, 기존 자리는 layout 으로 옆으로 비켜난다.
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
  const ref = useRef<HTMLSpanElement>(null);
  // 한 번 화면에 들어오면 계속 true — 그 전의 자리들은 0 에서, 그 뒤에 생긴 자리는 제 숫자에서 시작한다
  const started = useInView(ref, { once: true, amount: 0.5 });

  const text = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0, ...format }).format(value),
    [value, locale, format],
  );
  // 오른쪽(일의 자리)부터 번호를 매겨 key 로 쓴다 — 자릿수가 늘어도 기존 기둥이 제자리에 남는다
  const chars = [...text].map((char, i, all) => ({ char, place: all.length - 1 - i }));
  const ease = [0.22, 1, 0.36, 1] as const;
  // 새 자리가 커지며 들어오고, 사라지는 자리는 작아지며 나간다 (transform·opacity 만)
  const grow = reduce
    ? {}
    : {
        initial: { opacity: 0, scale: 0.4 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.4 },
      };
  const slide = reduce ? { duration: 0 } : { duration, ease };

  return (
    <span ref={ref} className={cx(css.root, className)}>
      <span className={visuallyHidden}>{text}</span>
      <span aria-hidden className={css.digits}>
        <AnimatePresence initial={false} mode="popLayout">
          {chars.map(({ char, place }) =>
            /\d/.test(char) ? (
              <m.span
                key={place}
                layout={reduce ? false : "position"}
                className={css.column}
                transition={slide}
                {...grow}
              >
                <Reel
                  digit={Number(char)}
                  // 처음 자리들은 화면에 들어오기 전까지 0 에 머문다
                  target={started ? Number(char) : 0}
                  fromZero={!started}
                  transition={reduce ? { duration: 0 } : { duration, delay: place * stagger, ease }}
                />
              </m.span>
            ) : (
              <m.span
                key={`${place}${char}`}
                layout={reduce ? false : "position"}
                className={css.symbol}
                transition={slide}
                {...grow}
              >
                {char}
              </m.span>
            ),
          )}
        </AnimatePresence>
      </span>
    </span>
  );
}

/** 0~9 기둥. 처음 생길 때의 위치를 기억해 거기서 시작한다 */
function Reel({
  digit,
  target,
  fromZero,
  transition,
}: {
  digit: number;
  target: number;
  fromZero: boolean;
  transition: object;
}) {
  // 첫 굴림 전에 있던 자리는 0 에서, 나중에 생긴 자리는 제 숫자에서 시작 — 생길 때 한 번만 정한다
  const [start] = useState(() => (fromZero ? 0 : digit));
  return (
    <m.span
      className={css.reel}
      initial={{ y: `${-start * 10}%` }}
      animate={{ y: `${-target * 10}%` }}
      transition={transition}
    >
      {DIGITS.map((d) => (
        <span key={d} className={css.digit}>
          {d}
        </span>
      ))}
    </m.span>
  );
}
