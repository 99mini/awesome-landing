import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const list = style({
  width: "min(100%, 320px)",
});

export const item = style({
  padding: "8px 16px 8px 8px",
  borderRadius: vars.radius.md,
  background: vars.color.surfaceRaised,
  color: vars.color.text,
});

export const handle = style({
  color: vars.color.muted,
  borderRadius: vars.radius.sm,
  selectors: {
    "&:hover": { color: vars.color.text },
  },
});
