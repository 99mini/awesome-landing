import { useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cx } from "../lib/cx.ts";
import * as css from "./sticky-story.css.ts";

interface StickyStoryProps {
  /** 차례로 읽히는 단계들 */
  steps: readonly ReactNode[];
  /** 지금 화면 가운데에 있는 단계 번호로 그리는 고정 영역 */
  renderVisual: (active: number) => ReactNode;
  /** 페이지가 아닌 상자 안에서 스크롤할 때 그 상자 (없으면 화면) */
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * 스크롤 스토리텔링 — 한쪽은 고정(sticky)되고, 다른 쪽 단계가 화면 가운데를 지날 때마다
 * 고정 영역이 그 단계로 바뀐다. 단계 높이는 `--story-step`, 고정 위치는 `--story-top` 으로 조절.
 */
export function StickyStory({ steps, renderVisual, container, className }: StickyStoryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className={cx(css.root, className)}>
      <div className={css.visual}>{renderVisual(active)}</div>
      <ol className={css.steps}>
        {steps.map((step, i) => (
          <Step key={i} index={i} root={container} active={i === active} onActive={setActive}>
            {step}
          </Step>
        ))}
      </ol>
    </div>
  );
}

function Step({
  index,
  root,
  active,
  onActive,
  children,
}: {
  index: number;
  root?: RefObject<HTMLElement | null>;
  active: boolean;
  onActive: (index: number) => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // 스크롤 영역의 가운데 가는 띠에 걸리면 이 단계가 지금 단계
  const inView = useInView(ref, { root, margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className={css.step} aria-current={active ? "step" : undefined}>
      {children}
    </li>
  );
}
