import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const shell = style({
  maxWidth: 1120,
  margin: "0 auto",
  padding: "0 16px 96px",
});

export const header = style({
  padding: "24px 0",
});

export const logo = style({
  fontWeight: 800,
  fontSize: "1.25rem",
});

export const logoAccent = style({
  color: vars.color.accent,
});
