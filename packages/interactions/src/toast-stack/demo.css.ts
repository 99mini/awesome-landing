import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
  justifyItems: "center",
  gap: 16,
  width: "min(100%, 320px)",
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
