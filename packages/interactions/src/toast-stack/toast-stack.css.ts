import { globalStyle, style } from "@vanilla-extract/css";

/**
 * 구조 스타일만. 색·모서리·그림자는 toastClassName 으로 준다.
 * 화면 구석에 고정하려면 className 에 position: fixed 와 위치를 준다.
 */
export const region = style({
  width: "100%",
});

export const pause = style({
  display: "contents",
});

export const list = style({
  display: "grid",
  gap: 8,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const toast = style({
  display: "flex",
  alignItems: "start",
  gap: 12,
});

globalStyle(`:where(${toast})`, {
  padding: "12px 12px 12px 16px",
  borderRadius: 12,
  background: "Canvas",
  color: "CanvasText",
  boxShadow: "0 1px 2px color-mix(in oklab, CanvasText 20%, transparent)",
});

export const text = style({
  display: "grid",
  flex: 1,
  gap: 2,
  minWidth: 0,
});

export const title = style({
  fontWeight: 600,
});

export const body = style({
  fontSize: "0.9em",
  opacity: 0.8,
});

export const dismiss = style({
  display: "grid",
  flexShrink: 0,
  placeItems: "center",
  width: 28,
  height: 28,
  padding: 0,
  border: 0,
  borderRadius: 999,
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  selectors: {
    "&:hover": { background: "color-mix(in oklab, currentColor 12%, transparent)" },
    "&:focus-visible": { outline: "2px solid currentColor", outlineOffset: 1 },
  },
});
