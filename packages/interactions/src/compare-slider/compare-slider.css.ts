import { globalStyle, style } from "@vanilla-extract/css";

/** 구조 스타일만. 손잡이 색은 handleClassName 으로, 선 색은 color(currentColor) 로 */
export const root = style({
  position: "relative",
  display: "grid",
  overflow: "hidden",
  cursor: "ew-resize",
  // 세로 스크롤은 그대로 두고 가로 드래그만 받는다
  touchAction: "pan-y",
  userSelect: "none",
});

/** 두 화면을 같은 칸에 겹친다 */
export const layer = style({
  gridArea: "1 / 1",
  minWidth: 0,
});

/** 선과 손잡이를 담은 덮개 — 전체 크기로 겹쳐 두고 transform 으로 옮긴다 */
export const track = style({
  gridArea: "1 / 1",
  position: "relative",
  pointerEvents: "none",
});

export const line = style({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: -1,
  width: 2,
  background: "currentColor",
});

export const handle = style({
  position: "absolute",
  top: "50%",
  left: 0,
  display: "grid",
  placeItems: "center",
  width: 36,
  height: 36,
  borderRadius: 999,
  transform: "translate(-50%, -50%)",
  pointerEvents: "auto",
  cursor: "grab",
  selectors: {
    "&:active": { cursor: "grabbing" },
    "&:focus-visible": { outline: "2px solid currentColor", outlineOffset: 3 },
  },
});

globalStyle(`:where(${handle})`, {
  background: "Canvas",
  color: "CanvasText",
  border: "2px solid currentColor",
});
