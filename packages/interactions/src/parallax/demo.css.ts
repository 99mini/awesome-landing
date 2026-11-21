import { vars } from "@awesome/theme";
import { style, styleVariants } from "@vanilla-extract/css";

/** 가운데 정렬된 무대 안에서 내용만큼 줄어들지 않도록 폭을 정한다 */
export const root = style({
  width: "min(100%, 560px)",
});

export const scroller = style({
  position: "relative",
  width: "100%",
  height: 300,
  overflowY: "auto",
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  // 포커스 가능한 자식이 없는 스크롤 상자는 브라우저가 Tab 으로 포커스를 준다
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.inverse}`, outlineOffset: 2 },
  },
});

/** 스크롤할 거리를 만드는 긴 장면 */
export const scene = style({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  alignItems: "center",
  gap: 16,
  height: 300,
  margin: "260px 20px",
});

export const layer = style({
  display: "grid",
  placeItems: "center",
  borderRadius: vars.radius.md,
  color: vars.color.text,
  fontWeight: 700,
});

export const depth = styleVariants({
  back: { height: 120, background: vars.color.toneA },
  mid: { height: 170, background: vars.color.toneB },
  front: { height: 220, background: vars.color.toneC },
});

export const speed = style({
  display: "block",
  marginTop: 4,
  color: vars.color.muted,
  fontSize: "0.85rem",
  fontWeight: 400,
  fontVariantNumeric: "tabular-nums",
});

export const hint = style({
  margin: "0 0 12px",
  color: vars.color.muted,
  fontSize: "0.9rem",
});
