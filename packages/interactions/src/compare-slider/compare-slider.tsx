import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../lib/cx.ts";
import * as css from "./compare-slider.css.ts";

// 손잡이는 덮개와 함께 transform 으로 움직이는 그림이라 <input type="range"> 대신 role="slider".
// 값·키보드는 slider 패턴(aria-valuenow, 화살표·Home·End)을 그대로 따른다
/* oxlint-disable jsx-a11y/prefer-tag-over-role */

interface CompareSliderProps {
  /** 왼쪽(나누는 선 앞)에 보이는 것 */
  before: ReactNode;
  /** 오른쪽(나누는 선 뒤)에 보이는 것 */
  after: ReactNode;
  /** 손잡이 이름 (스크린 리더) */
  label?: string;
  /** 처음 위치 0 ~ 100 (%) — 마운트할 때 한 번 읽는다 */
  initial?: number;
  /** 화살표 키 한 번에 움직이는 양 (%) */
  step?: number;
  className?: string;
  handleClassName?: string;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/**
 * 두 화면을 겹쳐 놓고 나누는 선을 옮겨 비교한다.
 * 앞 화면은 clip-path 로 자르고 선은 transform 으로 옮긴다 (레이아웃을 다시 계산하지 않는다).
 * 드래그 대신 손잡이에서 화살표·Home·End 로도 옮긴다.
 */
export function CompareSlider({
  before,
  after,
  label = "Divider position",
  initial = 50,
  step = 5,
  className,
  handleClassName,
}: CompareSliderProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(clamp(initial));
  const target = useMotionValue(position);
  // 키보드로 한 칸씩 옮길 때 부드럽게. 드래그는 손가락을 바로 따라가도록 jump 한다
  const smooth = useSpring(target, { stiffness: 700, damping: 60 });
  const value = reduce ? target : smooth;
  const clipPath = useTransform(value, (p) => `inset(0 ${100 - p}% 0 0)`);
  // 덮개 전체를 자기 폭의 p% 만큼 옮긴다 — 선은 덮개의 왼쪽 끝에 있다
  const x = useTransform(value, (p) => `${p}%`);

  function move(next: number, jump: boolean) {
    const p = clamp(next);
    setPosition(p);
    target.set(p);
    if (jump) smooth.jump(p);
  }
  function fromPointer(clientX: number) {
    const box = rootRef.current?.getBoundingClientRect();
    if (!box || box.width === 0) return;
    move(((clientX - box.left) / box.width) * 100, true);
  }

  function onKeyDown(e: KeyboardEvent) {
    const keys: Record<string, number> = {
      ArrowLeft: position - step,
      ArrowDown: position - step,
      ArrowRight: position + step,
      ArrowUp: position + step,
      PageDown: position - 25,
      PageUp: position + 25,
      Home: 0,
      End: 100,
    };
    const next = keys[e.key];
    if (next === undefined) return;
    e.preventDefault();
    move(next, false);
  }

  return (
    <div
      ref={rootRef}
      className={cx(css.root, className)}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        fromPointer(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e.clientX);
      }}
    >
      <div className={css.layer}>{after}</div>
      <m.div className={css.layer} style={{ clipPath }}>
        {before}
      </m.div>
      <m.div className={css.track} style={{ x }}>
        <span className={css.line} />
        <div
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}%`}
          aria-orientation="horizontal"
          className={cx(css.handle, handleClassName)}
          onKeyDown={onKeyDown}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
            <path
              d="M6 4L2 8l4 4M10 4l4 4-4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            />
          </svg>
        </div>
      </m.div>
    </div>
  );
}
