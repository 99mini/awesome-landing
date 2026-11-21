import { createVar, globalStyle, style } from "@vanilla-extract/css";

/** 요소에 붙일 전환 이름 — assignInlineVars 로 인스턴스마다 지정 */
export const nameVar = createVar();

export const named = style({
  viewTransitionName: nameVar,
});

// 전환 시간은 useViewTransition(duration) 이 --vt-duration 으로 넘긴다 (문서 전체에 한 번에 하나)
globalStyle("::view-transition-group(*)", {
  animationDuration: "var(--vt-duration, 0.35s)",
  animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
});

globalStyle("::view-transition-old(*), ::view-transition-new(*)", {
  animationDuration: "var(--vt-duration, 0.35s)",
});

globalStyle("::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*)", {
  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});
