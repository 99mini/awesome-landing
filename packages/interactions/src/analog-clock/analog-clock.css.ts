import { style } from "@vanilla-extract/css";

/** 색은 currentColor 기반 — 부모의 color 로 문자판 전체가 바뀐다. 초침은 --clock-accent */
export const face = style({
  display: "block",
  overflow: "visible",
});

export const dial = style({
  fill: "none",
  stroke: "currentColor",
  strokeOpacity: 0.25,
  strokeWidth: 1,
});

const tick = {
  stroke: "currentColor",
  strokeLinecap: "round",
} as const;

export const tickMajor = style({ ...tick, strokeWidth: 2.5 });
export const tickMinor = style({ ...tick, strokeWidth: 1, strokeOpacity: 0.4 });

const hand = {
  stroke: "currentColor",
  strokeLinecap: "round",
} as const;

export const hourHand = style({ ...hand, strokeWidth: 6 });
export const minuteHand = style({ ...hand, strokeWidth: 4 });
export const secondHand = style({
  ...hand,
  stroke: "var(--clock-accent, #ef4444)",
  strokeWidth: 1.5,
});

export const pin = style({
  fill: "var(--clock-accent, #ef4444)",
});
