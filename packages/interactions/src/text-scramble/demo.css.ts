import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const text = style({
  margin: 0,
  color: vars.color.accent,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "clamp(1.25rem, 3vw, 2rem)",
  letterSpacing: "0.08em",
});
