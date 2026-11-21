import { vars } from "@awesome/theme";
import { style, styleVariants } from "@vanilla-extract/css";

export const hero = style({
  position: "relative",
  display: "grid",
  placeContent: "center",
  justifyItems: "center",
  gap: 24,
  minHeight: "100svh",
  padding: "0 16px",
  textAlign: "center",
  overflow: "hidden",
});

export const headline = style({
  position: "relative",
  margin: 0,
  fontSize: "clamp(2.5rem, 8vw, 6rem)",
  lineHeight: 1,
  letterSpacing: "-0.04em",
});

export const lead = style({
  position: "relative",
  margin: 0,
  color: "#b9b9c8",
  fontSize: "1.125rem",
});

export const aurora = style({
  position: "absolute",
  inset: 0,
  filter: "blur(90px)",
  opacity: 0.55,
});

const blob = style({
  position: "absolute",
  width: "40vmax",
  height: "40vmax",
  borderRadius: "50%",
});

/** 오로라 블롭 — 색과 시작 위치 */
export const blobs = [
  { color: "#6d5dfc", className: style([blob, { top: "-10%", left: "10%" }]) },
  { color: "#e05cff", className: style([blob, { top: "20%", right: 0 }]) },
  { color: "#00d4ff", className: style([blob, { bottom: "-20%", left: "30%" }]) },
];

export const cta = style({
  position: "relative",
  padding: "16px 36px",
  border: "none",
  borderRadius: vars.radius.pill,
  background: "#fff",
  color: "#000",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
});

export const features = style({
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  maxWidth: 1040,
  margin: "0 auto",
  padding: "96px 16px",
});

export const feature = style({
  padding: 28,
  border: "1px solid #22222c",
  borderRadius: vars.radius.lg,
  background: "#0e0e16",
});

export const featureText = styleVariants({
  title: { margin: "0 0 8px" },
  body: { margin: 0, color: "#9a9aab" },
});
