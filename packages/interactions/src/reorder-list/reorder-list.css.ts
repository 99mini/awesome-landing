import { globalStyle, style } from "@vanilla-extract/css";

export const list = style({
  display: "grid",
  gap: 8,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const item = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
  position: "relative",
});

/** 손잡이 — 터치에서 스크롤 대신 드래그가 되도록 touch-action 을 끈다 */
export const handle = style({
  display: "grid",
  placeItems: "center",
  width: 32,
  height: 32,
  padding: 0,
  cursor: "grab",
  touchAction: "none",
  selectors: {
    "&:active": { cursor: "grabbing" },
    "&:focus-visible": { outline: "2px solid currentColor", outlineOffset: 2 },
  },
});

globalStyle(`:where(${handle})`, {
  border: 0,
  background: "transparent",
  color: "inherit",
});
