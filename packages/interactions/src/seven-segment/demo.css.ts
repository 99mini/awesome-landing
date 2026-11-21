import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const display = style({
  padding: "20px 24px",
  borderRadius: 12,
  background: vars.color.lcdGround,
  boxShadow: `inset 0 0 0 1px ${vars.color.lcdEdge}`,
  color: vars.color.lcdOn,
});
