import { m } from "motion/react";
import { useState, type MouseEvent } from "react";
import * as css from "./replay-button.css.ts";

/** 데모를 다시 마운트해 처음 상태부터 재생하기 위한 key */
export function useReplay() {
  const [count, setCount] = useState(0);
  return { replayKey: count, replay: () => setCount((c) => c + 1) };
}

interface ReplayButtonProps {
  replayKey: number;
  onReplay: () => void;
  size?: keyof typeof css.size;
}

export function ReplayButton({ replayKey, onReplay, size = "md" }: ReplayButtonProps) {
  function handleClick(e: MouseEvent) {
    // 미리보기 카드에선 클릭이 카드(모달 열기)로 버블링되지 않도록
    e.stopPropagation();
    onReplay();
  }

  return (
    <m.button
      layout="position"
      type="button"
      className={css.size[size]}
      aria-label="인터랙션 다시 보기"
      title="다시 보기"
      onClick={handleClick}
    >
      <m.svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        animate={{ rotate: -360 * replayKey }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
      </m.svg>
    </m.button>
  );
}
