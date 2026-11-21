import { vars } from "@awesome/theme";
import { style, styleVariants } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
  justifyItems: "center",
  gap: 20,
  width: "min(100%, 280px)",
});

export const stack = style({
  width: "100%",
  height: 180,
});

export const card = style({
  display: "grid",
  height: "100%",
  alignContent: "end",
  gap: 4,
  padding: 20,
  borderRadius: vars.radius.lg,
  color: vars.color.text,
});

export const tone = styleVariants({
  toneA: { background: vars.color.toneA },
  toneB: { background: vars.color.toneB },
  toneC: { background: vars.color.toneC },
  raised: { background: vars.color.surfaceRaised },
});

export const cardTitle = style({
  fontSize: "1.35rem",
  fontWeight: 700,
});

export const cardHint = style({
  color: vars.color.muted,
  fontSize: "0.9rem",
});

export const actions = style({
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

export const status = style({
  margin: 0,
  color: vars.color.muted,
  fontSize: "0.9rem",
});
