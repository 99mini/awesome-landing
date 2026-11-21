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
  spring: { ...surface, background: vars.color.toneA },
  layout: { ...surface, background: vars.color.toneB },
  focus: { ...surface, background: vars.color.toneC },
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
  // 색 면 위에서는 muted 가 4.5:1 에 못 미친다
  color: vars.color.text,
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
