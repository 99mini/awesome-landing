import { style } from "@vanilla-extract/css";

/** 구조만 — 단계 높이와 고정 위치는 CSS 변수로 연다 */
export const root = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
  gap: "var(--story-gap, 24px)",
  alignItems: "start",
});

export const visual = style({
  position: "sticky",
  top: "var(--story-top, 0px)",
});

export const steps = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const step = style({
  display: "grid",
  alignContent: "center",
  minHeight: "var(--story-step, 60vh)",
});
