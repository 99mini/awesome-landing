import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const list = style({
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  padding: 0,
  margin: "12px 0 0",
  listStyle: "none",
});

export const tag = style({
  fontSize: "0.75rem",
  padding: "2px 8px",
  borderRadius: vars.radius.pill,
  background: vars.color.border,
});
