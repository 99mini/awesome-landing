import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const marquee = style({
  width: "100%",
});

export const item = style({
  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
  fontWeight: 700,
  whiteSpace: "nowrap",
});

export const dot = style({
  color: vars.color.signal,
});
