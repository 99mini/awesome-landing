import { createVar, style } from "@vanilla-extract/css";

export const sizeVar = createVar();

export const area = style({
  position: "relative",
  overflow: "hidden",
  // 기본 커서는 숨기지 않는다 — 필요하면 className 으로 cursor: none 지정
});

export const dot = style({
  position: "absolute",
  top: 0,
  left: 0,
  width: sizeVar,
  height: sizeVar,
  marginTop: `calc(${sizeVar} / -2)`,
  marginLeft: `calc(${sizeVar} / -2)`,
  borderRadius: "50%",
  pointerEvents: "none",
});
