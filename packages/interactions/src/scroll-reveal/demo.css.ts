import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const list = style({
  display: "grid",
  gap: "1rem",
  width: "min(100%, 28rem)",
});

export const item = style({
  padding: "1.5rem",
  borderRadius: vars.radius.md,
  background: vars.color.surfaceRaised,
});
