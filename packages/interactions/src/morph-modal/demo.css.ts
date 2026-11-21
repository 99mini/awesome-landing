import { vars } from "@awesome/theme";
import { style, styleVariants } from "@vanilla-extract/css";

export const area = style({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 12,
  width: "100%",
  minHeight: 300,
  alignContent: "center",
});

const surface = {
  borderRadius: 16,
  color: vars.color.text,
};

export const tone = styleVariants({
  spring: { ...surface, background: "oklch(34% 0.06 262)" },
  layout: { ...surface, background: "oklch(34% 0.05 170)" },
  focus: { ...surface, background: "oklch(34% 0.05 60)" },
});

export const card = style({
  padding: "20px 16px",
  minHeight: 120,
});

export const cardTitle = style({
  display: "block",
  fontSize: "1.05rem",
  fontWeight: 700,
});

export const cardHint = style({
  display: "block",
  marginTop: 6,
  color: vars.color.muted,
  fontSize: "0.85rem",
});

export const panel = style({
  padding: "28px 24px 24px",
});

export const panelTitle = style({
  margin: "0 0 12px",
  fontSize: "1.5rem",
});

export const panelBody = style({
  margin: 0,
  maxWidth: "48ch",
  lineHeight: 1.6,
});
