import { style } from "@vanilla-extract/css";

/** 세그먼트 색은 currentColor — 부모 color 로 바꾼다 */
export const root = style({
  display: "block",
  maxWidth: "100%",
  overflow: "visible",
});

export const segment = style({
  fill: "currentColor",
});

export const on = style({
  fill: "currentColor",
});
