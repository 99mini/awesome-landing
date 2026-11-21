import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  /** 애니메이션 시간(s) */
  duration?: number;
  /** Intl.NumberFormat 옵션 (소수점, 통화 등) */
  format?: Intl.NumberFormatOptions;
  locale?: string;
  className?: string;
}

/** 화면에 들어오면 숫자가 목표값까지 올라간다 */
export function CountUp({ to, from = 0, duration = 1.6, format, locale, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const value = useMotionValue(from);
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0, ...format }),
    [locale, format],
  );
  const text = useTransform(value, (v) => formatter.format(v));

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, reduce, value, to, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
