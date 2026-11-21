import { globalStyle, style } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
});

/** popLayout 이 닫히는 패널을 absolute 로 띄울 기준 */
export const item = style({
  position: "relative",
});

export const heading = style({
  margin: 0,
  font: "inherit",
});

export const trigger = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  selectors: {
    "&:focus-visible": { outline: "2px solid currentColor", outlineOffset: 2 },
  },
});

globalStyle(`:where(${trigger})`, {
  padding: 0,
  border: 0,
  background: "transparent",
  color: "inherit",
  font: "inherit",
});

export const panel = style({});
