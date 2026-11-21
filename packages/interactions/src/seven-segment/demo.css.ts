import { style } from "@vanilla-extract/css";

export const display = style({
  padding: "20px 24px",
  borderRadius: 12,
  background: "#0a0f0a",
  boxShadow: "inset 0 0 0 1px #1c2a1c",
  color: "#7dff9b",
  // 켜진 세그먼트가 살짝 번지는 LCD 느낌
  filter: "drop-shadow(0 0 6px rgb(125 255 155 / 0.45))",
});
