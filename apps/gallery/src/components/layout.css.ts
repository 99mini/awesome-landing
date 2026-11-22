import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";
import { focusRing } from "../styles/ui.css.ts";

export const shell = style({
  maxWidth: 1120,
  margin: "0 auto",
  padding: "0 16px 96px",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "24px 0",
});

export const logo = style([
  focusRing,
  {
    borderRadius: vars.radius.sm,
    fontWeight: 800,
    fontSize: "1.25rem",
  },
]);

export const logoAccent = style({
  color: vars.color.muted,
});
