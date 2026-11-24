import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { PADDING } from "./geometry.ts";

/** 사진의 가로 ÷ 세로 */
export const aspectVar = createVar();
const padX = createVar();
const padY = createVar();

/**
 * 구조 스타일만. 칸·버튼·막의 모양은 className 들로 준다.
 * 모양의 기본값은 :where() 로 감싸 우선순위 0 — 넘겨받은 클래스가 항상 이긴다.
 */
export const list = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const trigger = style({
  display: "block",
  width: "100%",
  overflow: "hidden",
  cursor: "pointer",
  selectors: {
    "&[data-active]": { opacity: 0 },
    "&:focus-visible": { outline: "2px solid currentColor", outlineOffset: 3 },
  },
});

globalStyle(`:where(${trigger})`, {
  padding: 0,
  border: 0,
  background: "transparent",
  font: "inherit",
  color: "inherit",
  textAlign: "inherit",
});

const layer = {
  inset: 0,
  width: "100%",
  height: "100%",
  maxWidth: "none",
  maxHeight: "none",
  margin: 0,
  padding: 0,
  border: 0,
  background: "transparent",
  overflow: "hidden",
  outline: "none",
  // 틀의 크기를 이 영역에 맞춘다 (cqw · cqh)
  containerType: "size",
} as const;

// 사이트 헤더(보통 z-40~50)보다 위에 — 바꾸려면 :root 에 --viewer-layer-z
export const layerFixed = style({
  ...layer,
  position: "fixed",
  zIndex: "var(--viewer-layer-z, 1000)",
});
export const layerContained = style({ ...layer, position: "absolute", zIndex: 20 });

export const backdrop = style({ position: "absolute", inset: 0 });

globalStyle(`:where(${backdrop})`, {
  background: "var(--viewer-backdrop, color-mix(in oklab, Canvas 85%, transparent))",
});

export const slide = style({
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
  // Motion 이 드래그 축만 남기는 touch-action 을 인라인으로 준다 — 사진은 두 손가락 확대도 되게
  touchAction: "pan-y pinch-zoom !important",
});

export const frame = style({
  vars: { [padX]: `${PADDING.wide.x}px`, [padY]: `${PADDING.wide.y}px` },
  width: `min(100cqw - 2 * ${padX}, (100cqh - 2 * ${padY}) * ${aspectVar})`,
  aspectRatio: aspectVar,
  "@container": {
    [`(width < ${PADDING.narrowBelow}px)`]: {
      vars: { [padX]: `${PADDING.narrow.x}px`, [padY]: `${PADDING.narrow.y}px` },
    },
  },
});

globalStyle(`:where(${frame} > *)`, {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "contain",
});

/** 빈 곳은 아래(사진)로 통과시키고 버튼만 누를 수 있게 */
export const controls = style({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
});

export const control = style({
  position: "absolute",
  display: "grid",
  placeItems: "center",
  width: 44,
  height: 44,
  pointerEvents: "auto",
  cursor: "pointer",
  selectors: {
    "&[aria-disabled=true]": { opacity: 0.4, cursor: "default" },
    "&:focus-visible": { outline: "2px solid currentColor", outlineOffset: 2 },
  },
});

globalStyle(`:where(${control})`, {
  padding: 0,
  border: "1px solid currentColor",
  borderRadius: 999,
  background: "Canvas",
  color: "CanvasText",
});

export const close = style({ top: 12, right: 12 });
export const previous = style({ top: "calc(50% - 22px)", left: 12 });
export const next = style({ top: "calc(50% - 22px)", right: 12 });

// 좁은 화면에서는 사진을 가리지 않게 아래 여백으로
for (const button of [previous, next]) {
  globalStyle(button, {
    "@container": {
      [`(width < ${PADDING.narrowBelow}px)`]: { top: "auto", bottom: 10 },
    },
  });
}

export const counter = style({
  position: "absolute",
  bottom: 20,
  left: "50%",
  margin: 0,
  transform: "translateX(-50%)",
  fontVariantNumeric: "tabular-nums",
});

globalStyle(`:where(${counter})`, {
  padding: "4px 12px",
  borderRadius: 999,
  background: "Canvas",
  color: "CanvasText",
});
