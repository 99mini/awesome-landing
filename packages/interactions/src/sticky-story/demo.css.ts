import { vars } from "@awesome/theme";
import { style, styleVariants } from "@vanilla-extract/css";

/** 데모는 자기 상자 안에서 스크롤한다 — 카드·모달 안에서도 동작하도록 */
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
  // tabIndex 로 Tab 포커스를 받는 스크롤 상자
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.inverse}`, outlineOffset: 2 },
  },
  vars: {
    "--story-step": "240px",
    "--story-top": "32px",
    "--story-gap": "20px",
  },
});

export const story = style({
  padding: "32px 20px 88px",
});

export const panel = style({
  display: "grid",
  placeItems: "center",
  height: 240,
  borderRadius: vars.radius.md,
  color: vars.color.text,
});

export const tone = styleVariants({
  0: { background: vars.color.toneA },
  1: { background: vars.color.toneB },
  2: { background: vars.color.toneC },
});

export const panelNumber = style({
  fontSize: "4.5rem",
  fontWeight: 800,
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums",
});

export const stepTitle = style({
  margin: "0 0 8px",
  fontSize: "1.15rem",
});

export const stepBody = style({
  margin: 0,
  color: vars.color.muted,
  fontSize: "0.95rem",
  lineHeight: 1.5,
});

export const hint = style({
  margin: "0 0 12px",
  color: vars.color.muted,
  fontSize: "0.9rem",
});
