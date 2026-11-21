import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";
import { focusRing, stage } from "../styles/ui.css.ts";

export const masonry = style({
  columns: "3 300px",
  columnGap: 16,
});

export const item = style({
  breakInside: "avoid",
  marginBottom: 16,
});

export const card = style({
  overflow: "hidden",
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  cursor: "pointer",
  transition: "border-color 0.2s",
  selectors: {
    "&:hover": { borderColor: vars.color.accent },
  },
});

export const cardStage = style([
  stage,
  {
    position: "relative",
    minHeight: 180,
    margin: 8,
    padding: "32px 20px",
  },
]);

/** 다시 보기 버튼 자리 — 카드 hover/포커스 시 선명해진다 */
export const replaySlot = style({
  position: "absolute",
  top: 10,
  right: 10,
  opacity: 0.55,
  transition: "opacity 0.2s",
  selectors: {
    [`${card}:hover &, &:focus-within`]: { opacity: 1 },
  },
});

export const footer = style({
  padding: "4px 16px 16px",
});

export const openButton = style([
  focusRing,
  {
    display: "flex",
    alignItems: "center",
    minHeight: 36,
    padding: 0,
    margin: "4px 0 0",
    border: 0,
    borderRadius: vars.radius.sm,
    background: "none",
    color: "inherit",
    font: "inherit",
    textAlign: "left",
    cursor: "pointer",
  },
]);

export const title = style({
  display: "inline-block",
  fontSize: "1.05rem",
  fontWeight: 700,
});
