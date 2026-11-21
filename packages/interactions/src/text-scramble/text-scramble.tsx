import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { visuallyHidden } from "../lib/visually-hidden.css.ts";
import * as css from "./text-scramble.css.ts";
import { cx } from "../lib/cx.ts";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=?<>/[]{}";

interface TextScrambleProps {
  text: string;
  /** 전체 글자가 풀리는 데 걸리는 시간(s) */
  duration?: number;
  className?: string;
}

/** 무작위 글리프가 왼쪽부터 원래 글자로 풀려나가는 텍스트 */
export function TextScramble({ text, duration = 1.2, className }: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [output, setOutput] = useState(() => scramble(text, 0));

  useEffect(() => {
    if (!inView || reduce) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      setOutput(scramble(text, progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, text, duration]);

  return (
    <span ref={ref} className={cx(css.root, className)}>
      {/* 역할 없는 span 의 aria-label 은 읽히지 않을 수 있어, 읽을 글은 숨긴 텍스트로 둔다 */}
      <span className={visuallyHidden}>{text}</span>
      <span aria-hidden>{reduce ? text : output}</span>
    </span>
  );
}

function scramble(text: string, progress: number) {
  const resolved = Math.floor(progress * text.length);
  return [...text]
    .map((char, i) => {
      if (i < resolved || char === " ") return char;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    })
    .join("");
}
