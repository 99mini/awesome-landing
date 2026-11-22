import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
  justifyItems: "center",
  gap: 20,
});

export const number = style({
  color: vars.color.text,
  fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
  fontWeight: 700,
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: 8,
});

export const button = style({
  height: 36,
  padding: "0 16px",
  border: `1px solid ${vars.color.muted}`,
  borderRadius: vars.radius.pill,
  background: "transparent",
  color: vars.color.text,
  font: "inherit",
  fontSize: "0.9rem",
  cursor: "pointer",
  selectors: {
    "&:hover": { borderColor: vars.color.text },
    "&:active": { transform: "translateY(1px)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.inverse}`, outlineOffset: 2 },
  },
});
