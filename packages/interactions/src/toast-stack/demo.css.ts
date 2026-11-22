import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
  justifyItems: "center",
  alignContent: "start",
  gap: 16,
  width: "min(100%, 320px)",
  // 높이를 고정해 둔다 — 데모는 무대 가운데에 놓이므로, 알림 수에 따라 높이가 바뀌면
  // Notify 버튼까지 통째로 위아래로 움직인다 (알림 3개가 들어가는 높이)
  minHeight: 340,
});

export const stack = style({
  minHeight: 64,
});

export const toast = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  background: vars.color.surfaceRaised,
  color: vars.color.text,
  boxShadow: "none",
});

export const button = style({
  height: 36,
  padding: "0 16px",
  border: `1px solid ${vars.color.muted}`,
  borderRadius: vars.radius.pill,
  background: "transparent",
  color: vars.color.text,
  font: "inherit",
  fontSize: "0.9rem",
  cursor: "pointer",
  selectors: {
    "&:hover": { borderColor: vars.color.text },
    "&:active": { transform: "translateY(1px)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.inverse}`, outlineOffset: 2 },
  },
});

export const status = style({
  margin: 0,
  color: vars.color.muted,
  fontSize: "0.9rem",
});
