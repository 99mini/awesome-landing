import { globalStyle, style } from "@vanilla-extract/css";

/**
 * 구조 스타일만. 색·여백·모서리는 className / panelClassName 으로 준다.
 * 기본 초기화는 :where() 로 감싸 우선순위 0 — 넘겨받은 클래스가 항상 이긴다.
 * borderRadius 는 Motion 이 모핑 중 보정하므로 className 의 border-radius 를 그대로 쓴다.
 */
export const trigger = style({
  display: "block",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": { outline: "2px solid currentColor", outlineOffset: 3 },
  },
});

globalStyle(`:where(${trigger})`, {
  padding: 0,
  border: 0,
  font: "inherit",
  color: "inherit",
});

export const content = style({
  display: "block",
});

const layer = {
  zIndex: 20,
  display: "grid",
  placeItems: "center",
  padding: 16,
} as const;

// 화면 전체를 덮을 때는 사이트 헤더(보통 z-40~50)보다 위에 — 바꾸려면 :root 에 --morph-layer-z
export const layerFixed = style({
  ...layer,
  position: "fixed",
  inset: 0,
  zIndex: "var(--morph-layer-z, 1000)",
});
export const layerContained = style({ ...layer, position: "absolute", inset: 0 });

export const backdrop = style({
  position: "absolute",
  inset: 0,
});

// 기본값은 페이지 바탕색(Canvas)으로 덮어 흐리게 — --morph-backdrop 이나 backdropClassName 으로 바꾼다 (우선순위 0)
globalStyle(`:where(${backdrop})`, {
  background: "var(--morph-backdrop, color-mix(in oklab, Canvas 60%, transparent))",
});

export const panel = style({
  // <dialog> 기본 위치 지정 해제 — 레이어 grid 가 가운데 둔다
  position: "relative",
  inset: "auto",
  width: "min(560px, 100%)",
  maxHeight: "100%",
  overflow: "auto",
});

globalStyle(`:where(${panel})`, {
  margin: 0,
  padding: 0,
  border: 0,
  color: "inherit",
  background: "transparent",
});

export const close = style({
  position: "absolute",
  top: 12,
  right: 12,
  cursor: "pointer",
  selectors: {
    "&:focus-visible": { outline: "2px solid currentColor", outlineOffset: 2 },
  },
});

// 모양은 우선순위 0 — closeClassName 이 언제나 덮어쓴다
globalStyle(`:where(${close})`, {
  padding: "8px 12px",
  border: "1px solid currentColor",
  borderRadius: 999,
  background: "transparent",
  color: "inherit",
  font: "inherit",
  fontSize: "0.85rem",
});
