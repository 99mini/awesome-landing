import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";
import { iconButton, muted, stage } from "../styles/ui.css.ts";

export const backdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: 10,
  background: vars.color.overlay,
});

export const layer = style({
  position: "fixed",
  inset: 0,
  zIndex: 11,
  display: "grid",
  placeItems: "center",
  padding: 16,
  pointerEvents: "none",
});

export const dialog = style({
  // <dialog> 기본 스타일 초기화
  position: "relative",
  inset: "auto",
  margin: 0,
  padding: 0,
  color: "inherit",

  width: "min(960px, 100%)",
  maxHeight: "calc(100svh - 32px)",
  overflow: "auto",
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  pointerEvents: "auto",
});

export const modalStage = style([
  stage,
  {
    minHeight: "min(56svh, 520px)",
    margin: 12,
    padding: "48px 24px",
  },
]);

export const body = style({
  padding: "4px 28px 28px",
});

export const title = style({
  display: "inline-block",
  margin: "0 0 16px",
  fontSize: "1.5rem",
});

export const source = style([muted, { margin: "16px 0 0", fontSize: "0.85rem" }]);

export const close = style([iconButton, { position: "absolute", top: 20, right: 20 }]);

export const replaySlot = style({
  position: "absolute",
  top: 20,
  right: 64,
});

export const tools = style({
  display: "grid",
  gap: 16,
  marginTop: 24,
});

/** 이전·다음 — 닫기·다시 보기와 반대편(왼쪽 위) */
export const pager = style({
  position: "absolute",
  top: 20,
  left: 20,
  display: "flex",
  gap: 8,
});

export const pagerButton = style([
  iconButton,
  {
    selectors: { "&:active": { transform: "translateY(1px)" } },
  },
]);
