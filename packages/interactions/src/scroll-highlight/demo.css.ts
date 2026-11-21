import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  width: "min(100%, 520px)",
});

export const scroller = style({
  position: "relative",
  height: 300,
  overflowY: "auto",
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  // tabIndex 로 Tab 포커스를 받는 스크롤 상자
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.inverse}`, outlineOffset: 2 },
  },
});

/** 문단 위아래 여백 — 문단 끝이 상자의 45% 지점까지 올라올 수 있어야 마지막 단어까지 밝아진다 */
export const track = style({
  padding: "240px 24px 280px",
});

export const text = style({
  color: vars.color.text,
  fontSize: "1.6rem",
  fontWeight: 700,
  lineHeight: 1.3,
});

export const hint = style({
  margin: "0 0 12px",
  color: vars.color.muted,
  fontSize: "0.9rem",
});
