import { vars } from "@awesome/theme";
import { style, styleVariants } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
  gap: 16,
  width: "min(100%, 420px)",
});

export const toolbar = style({
  display: "flex",
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

export const layout = styleVariants({
  grid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },
  list: { display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 8 },
});

export const tile = style({
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  borderRadius: vars.radius.md,
  color: vars.color.text,
  fontWeight: 700,
});

export const size = styleVariants({
  grid: { height: 96 },
  list: { height: 48 },
});

export const tone = styleVariants({
  one: { background: vars.color.toneA },
  two: { background: vars.color.toneB },
  three: { background: vars.color.toneC },
  four: { background: vars.color.surfaceRaised },
});
