import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const button = style({
  padding: "1rem 2.5rem",
  border: "none",
  borderRadius: vars.radius.pill,
  background: vars.color.inverse,
  color: vars.color.inverseInk,
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
});
