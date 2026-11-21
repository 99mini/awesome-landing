import { vars } from "@awesome/theme";
import { style, styleVariants } from "@vanilla-extract/css";

export const chart = style({
  width: "min(100%, 420px)",
  color: vars.color.muted,
});

export const series = styleVariants({
  primary: { color: vars.color.accent },
  secondary: { color: "#5eead4" },
});
