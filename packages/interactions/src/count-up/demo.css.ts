import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const stat = style({
  display: "grid",
  justifyItems: "center",
  gap: 4,
});

export const number = style({
  fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
  fontWeight: 800,
  fontVariantNumeric: "tabular-nums",
  letterSpacing: "-0.03em",
});

export const label = style({
  color: vars.color.muted,
  fontSize: "0.9rem",
});
