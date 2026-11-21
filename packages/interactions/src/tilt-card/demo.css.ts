import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const card = style({
  display: "grid",
  placeItems: "center",
  width: 280,
  height: 180,
  borderRadius: vars.radius.lg,
  fontWeight: 700,
  background: "linear-gradient(135deg, #6d5dfc, #e05cff)",
});
