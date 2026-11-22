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
  // popLayout 은 사라지는 알림을 absolute 로 띄워 제자리에 둔다 — 그 기준이 이 목록이어야 한다.
  // 없으면 더 바깥 조상 기준으로 놓여 엉뚱한 자리(목록 아래 등)로 튀었다가 사라진다
  position: "relative",
  display: "grid",
  gap: 8,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

/** 겹친 더미 — 모두 같은 칸에 두고, 뒤 알림이 비어져 나올 자리를 아래에 남긴다 */
export const stacked = style({
  paddingBottom: 20,
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

// 겹친 더미: 모두 같은 칸에 겹치고 같은 높이로 맞춘다 (높이가 다르면 뒤 알림이 들쭉날쭉 비어져 나온다).
// 줄어드는 기준을 아래 가장자리에 두어, 뒤 알림이 정확히 PEEK 만큼 아래로 보인다
globalStyle(`${stacked} > ${toast}`, {
  gridArea: "1 / 1",
  alignSelf: "stretch",
  transformOrigin: "50% 100%",
});
