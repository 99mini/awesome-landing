import { style } from "@vanilla-extract/css";

export const root = style({
  display: "inline",
});

/** 단어는 쪼개지지 않는 한 덩어리 */
export const word = style({
  display: "inline-block",
  whiteSpace: "nowrap",
});

export const char = style({
  display: "inline-block",
});
