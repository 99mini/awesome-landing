import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const area = style({
  display: "grid",
  placeItems: "center",
  width: "100%",
  minHeight: 220,
  border: `1px dashed ${vars.color.border}`,
  borderRadius: vars.radius.md,
});

export const hint = style({
  margin: 0,
  fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
  fontWeight: 700,
});

export const dot = style({
  background: "#fff",
  // 글자 위를 지날 때 색이 반전된다
  mixBlendMode: "difference",
});
