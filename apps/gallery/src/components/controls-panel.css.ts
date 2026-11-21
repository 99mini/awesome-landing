import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";
import { focusRing } from "../styles/ui.css.ts";

export const panel = style({
  display: "grid",
  gap: 12,
  padding: 16,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const heading = style({
  margin: 0,
  fontSize: "0.9rem",
});

export const reset = style([
  focusRing,
  {
    padding: "4px 12px",
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.pill,
    background: "none",
    color: vars.color.muted,
    fontSize: "0.8rem",
    cursor: "pointer",
    selectors: { "&:hover": { color: vars.color.text } },
  },
]);

export const row = style({
  display: "grid",
  gridTemplateColumns: "96px 1fr 64px",
  alignItems: "center",
  gap: 12,
  fontSize: "0.85rem",
});

export const range = style([focusRing, { width: "100%", accentColor: vars.color.accent }]);

export const value = style({
  color: vars.color.muted,
  fontVariantNumeric: "tabular-nums",
  textAlign: "right",
});

export const toggle = style([
  focusRing,
  { justifySelf: "start", width: 18, height: 18, margin: 0, accentColor: vars.color.accent },
]);
