import { globalStyle, style } from "@vanilla-extract/css";

/**
 * 구조 스타일만. 패널의 색·모서리는 panelClassName 으로, 고른 줄의 배경은 --palette-highlight 로.
 * 기본 초기화는 :where() 로 감싸 넘겨받은 클래스가 항상 이긴다.
 */
export const root = style({
  display: "contents",
});

export const trigger = style({
  cursor: "pointer",
  selectors: {
    "&:focus-visible": { outline: "2px solid currentColor", outlineOffset: 3 },
  },
});

globalStyle(`:where(${trigger})`, {
  font: "inherit",
  color: "inherit",
});

/** 가장 가까운 position 이 있는 조상을 덮는다 */
export const layer = style({
  position: "absolute",
  inset: 0,
  zIndex: 20,
  display: "grid",
  alignItems: "start",
  justifyItems: "center",
  padding: 12,
});

/** 화면 전체 위 — 위쪽에 뜬다 */
export const layerFixed = style([
  layer,
  { position: "fixed", zIndex: 50, paddingTop: "max(12px, 12vh)" },
]);

export const backdrop = style({
  position: "absolute",
  inset: 0,
  background: "var(--palette-backdrop, color-mix(in oklab, Canvas 55%, transparent))",
});

export const panel = style({
  position: "relative",
  display: "grid",
  width: "min(340px, 100%)",
  overflow: "hidden",
});

globalStyle(`:where(${panel})`, {
  borderRadius: 12,
  background: "Canvas",
  color: "CanvasText",
  boxShadow: "0 8px 24px color-mix(in oklab, CanvasText 18%, transparent)",
});

export const input = style({
  width: "100%",
  height: 44,
  padding: "0 16px",
  border: 0,
  borderBottom: "1px solid color-mix(in oklab, currentColor 18%, transparent)",
  background: "transparent",
  color: "inherit",
  font: "inherit",
  outline: "none",
  selectors: {
    "&::placeholder": { color: "inherit", opacity: 0.7 },
  },
});

export const list = style({
  display: "grid",
  // 긴 목록은 --palette-list-height 로 늘린다
  maxHeight: "var(--palette-list-height, 176px)",
  padding: 4,
  overflowY: "auto",
  overscrollBehavior: "contain",
});

export const groupLabel = style({
  padding: "8px 12px 4px",
  fontSize: "0.8em",
  opacity: 0.75,
});

export const option = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: 12,
  height: 36,
  padding: "0 12px",
  cursor: "pointer",
});

export const highlight = style({
  position: "absolute",
  inset: 0,
  borderRadius: 8,
  background: "var(--palette-highlight, color-mix(in oklab, currentColor 12%, transparent))",
});

export const label = style({
  position: "relative",
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const hint = style({
  position: "relative",
  fontSize: "0.85em",
  opacity: 0.75,
});

export const empty = style({
  margin: 0,
  padding: 16,
  opacity: 0.75,
});
