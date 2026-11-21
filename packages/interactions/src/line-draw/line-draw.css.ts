import { style } from "@vanilla-extract/css";

/** 선 색은 currentColor — 시리즈마다 lineClassName 으로 color 를 준다 */
export const root = style({
  display: "block",
  width: "100%",
  height: "auto",
  overflow: "visible",
});

export const grid = style({
  stroke: "currentColor",
  strokeOpacity: 0.1,
  strokeDasharray: "2 4",
});

export const line = style({
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

export const dot = style({
  fill: "currentColor",
});
