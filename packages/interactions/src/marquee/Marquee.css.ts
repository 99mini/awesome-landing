import { createVar, keyframes, style } from "@vanilla-extract/css";

export const durationVar = createVar();
export const gapVar = createVar();

const scroll = keyframes({
  from: { transform: "translateX(0)" },
  to: { transform: "translateX(-50%)" },
});

export const viewport = style({
  overflow: "hidden",
  // 양 끝을 부드럽게 흐리게
  maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
});

export const track = style({
  display: "flex",
  width: "max-content",
  // 무한 루프는 CSS 애니메이션이 가장 가볍다 (JS 프레임 업데이트 없음)
  animation: `${scroll} ${durationVar} linear infinite`,
  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});

export const reverse = style({
  animationDirection: "reverse",
});

export const pausable = style({
  selectors: {
    [`${viewport}:hover &`]: { animationPlayState: "paused" },
  },
});

export const group = style({
  display: "flex",
  flexShrink: 0,
  alignItems: "center",
  gap: gapVar,
  // 두 그룹 사이 간격도 gap 과 같게 해서 이음새가 보이지 않게
  paddingRight: gapVar,
});
