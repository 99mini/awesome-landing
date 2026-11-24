import {
  animate,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import * as css from "./analog-clock.css.ts";
import { cx } from "../lib/cx.ts";

interface AnalogClockProps {
  /** true: 모든 바늘이 연속으로 흐른다 / false: 초침이 1초마다 스프링으로 '틱' */
  smooth?: boolean;
  secondHand?: boolean;
  /** 지름(px) */
  size?: number;
  /** 스크린 리더가 읽을 이름 */
  label?: string;
  className?: string;
}

const R = 90;

/** 자정부터 흐른 시간으로 각 바늘의 누적 각도를 구한다 (59→0 에서 거꾸로 돌지 않도록 360 으로 나누지 않음) */
function anglesAt(date: Date, smooth: boolean) {
  const ms = smooth ? date.getMilliseconds() / 1000 : 0;
  const s = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds() + ms;
  return { hour: (s / 120) % 720, minute: s / 10, second: s * 6 };
}

export function AnalogClock({
  smooth = false,
  secondHand = true,
  size = 200,
  label = "Analog clock",
  className,
}: AnalogClockProps) {
  const reduce = useReducedMotion();
  // 첫 렌더에 한 번만 현재 시각을 읽는다
  const [initial] = useState(() => anglesAt(new Date(), smooth));
  const hour = useMotionValue(initial.hour);
  const minute = useMotionValue(initial.minute);
  const second = useMotionValue(initial.second);

  // smooth: 매 프레임 motion value 만 갱신 (React 리렌더 없음)
  useAnimationFrame(() => {
    if (!smooth) return;
    const a = anglesAt(new Date(), true);
    hour.set(a.hour);
    minute.set(a.minute);
    second.set(a.second);
  });

  // tick: 1초마다 초침을 스프링으로 튕기듯 이동
  useEffect(() => {
    if (smooth) return;
    const id = setInterval(() => {
      const a = anglesAt(new Date(), false);
      hour.set(a.hour);
      minute.set(a.minute);
      if (reduce) second.set(a.second);
      else animate(second, a.second, { type: "spring", stiffness: 700, damping: 18 });
    }, 1000);
    return () => clearInterval(id);
  }, [smooth, reduce, hour, minute, second]);

  return (
    <svg
      className={cx(css.face, className)}
      width={size}
      height={size}
      viewBox="-100 -100 200 200"
      role="img"
      aria-label={label}
    >
      <circle className={css.dial} r={R} />
      {Array.from({ length: 60 }, (_, i) => {
        const major = i % 5 === 0;
        return (
          <line
            key={i}
            className={major ? css.tickMajor : css.tickMinor}
            y1={-R + (major ? 12 : 6)}
            y2={-R + 2}
            transform={`rotate(${i * 6})`}
          />
        );
      })}
      <Hand angle={hour} length={46} className={css.hourHand} />
      <Hand angle={minute} length={68} className={css.minuteHand} />
      {secondHand && <Hand angle={second} length={76} tail={16} className={css.secondHand} />}
      <circle className={css.pin} r={3.5} />
    </svg>
  );
}

function Hand({
  angle,
  length,
  tail = 0,
  className,
}: {
  angle: MotionValue<number>;
  length: number;
  tail?: number;
  className: string;
}) {
  const ref = useRef<SVGGElement>(null);
  // SVG transform 속성을 직접 갱신 — 회전 중심을 문자판 중심(0,0)으로 고정
  useMotionValueEvent(angle, "change", (deg) =>
    ref.current?.setAttribute("transform", `rotate(${deg})`),
  );

  return (
    <g ref={ref} transform={`rotate(${angle.get()})`}>
      <line className={className} y1={tail} y2={-length} />
    </g>
  );
}
