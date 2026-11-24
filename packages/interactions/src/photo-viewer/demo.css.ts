import { vars } from "@awesome/theme";
import { style, styleVariants } from "@vanilla-extract/css";

export const area = style({
  position: "relative",
  // 크게 보는 층(z-index 20)이 데모 밖의 모달보다 위에 그려지지 않게
  isolation: "isolate",
  display: "grid",
  alignContent: "center",
  width: "100%",
  minHeight: 340,
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 8,
  width: "min(100%, 300px)",
  marginInline: "auto",
});

export const trigger = style({
  aspectRatio: "1",
  borderRadius: vars.radius.sm,
});

export const thumb = style({
  display: "block",
  height: "100%",
});

/** 하늘과 땅 두 색면 — 잘리고 펼쳐지는 것이 보이도록 경계를 비스듬히 둔다 */
const paint = (sky: string, land: string, at: string) => ({
  display: "grid",
  alignContent: "end",
  width: "100%",
  height: "100%",
  background: `linear-gradient(${at}, ${land} 42%, ${sky} 42.2%)`,
});

export const scene = styleVariants({
  dusk: paint(vars.color.rampFrom, vars.color.toneA, "14deg"),
  forest: paint(vars.color.toneB, vars.color.signalAlt, "-18deg"),
  sea: paint(vars.color.toneA, vars.color.signalAlt, "0deg"),
  field: paint(vars.color.toneC, vars.color.signal, "8deg"),
  ridge: paint(vars.color.toneA, vars.color.toneC, "-10deg"),
  cliff: paint(vars.color.toneC, vars.color.toneB, "24deg"),
});

export const caption = style({
  justifySelf: "start",
  margin: 12,
  padding: "4px 12px",
  borderRadius: vars.radius.pill,
  background: vars.color.surface,
  color: vars.color.text,
  fontWeight: 600,
});

export const backdrop = style({
  borderRadius: vars.radius.md,
  background: vars.color.overlay,
});

export const control = style({
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
});

export const counter = style({
  padding: "4px 12px",
  borderRadius: vars.radius.pill,
  background: vars.color.surface,
  color: vars.color.text,
  fontSize: "0.9rem",
});
