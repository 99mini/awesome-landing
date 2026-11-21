import { style } from "@vanilla-extract/css";

export const root = style({
  // 글자가 바뀌어도 폭이 흔들리지 않도록
  fontVariantNumeric: "tabular-nums",
  // 공백은 유지하되 좁은 영역에서는 줄바꿈
  whiteSpace: "pre-wrap",
});
