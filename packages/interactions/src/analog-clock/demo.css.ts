import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const clock = style({
  color: vars.color.text,
  vars: { "--clock-accent": vars.color.accent },
});
