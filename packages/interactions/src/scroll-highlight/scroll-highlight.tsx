import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type RefObject } from "react";
import { cx } from "../lib/cx.ts";
import { visuallyHidden } from "../lib/visually-hidden.css.ts";
import * as css from "./scroll-highlight.css.ts";

interface ScrollHighlightProps {
  text: string;
  /**
   * 아직 지나가지 않은 단어의 불투명도. 흐린 단어도 읽혀야 하므로 0.5 이상을 권한다
   * (어두운 바탕의 큰 글자에서 WCAG 3:1 을 넘는다).
   */
  dim?: number;
  /** 페이지가 아닌 상자 안에서 스크롤할 때 그 상자 (position 이 static 이 아니어야 한다) */
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/** 문단이 화면을 지나가는 동안 단어가 하나씩 밝아진다 */
export function ScrollHighlight({ text, dim = 0.5, container, className }: ScrollHighlightProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    container,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cx(css.root, className)}>
      <span className={visuallyHidden}>{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            dim={reduce ? 1 : dim}
          >
            {word}
          </Word>
        ))}
      </span>
    </p>
  );
}

function Word({
  progress,
  range,
  dim,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  dim: number;
  children: string;
}) {
  const opacity = useTransform(progress, range, [dim, 1]);
  return (
    <>
      <m.span data-word style={{ opacity }}>
        {children}
      </m.span>{" "}
    </>
  );
}
