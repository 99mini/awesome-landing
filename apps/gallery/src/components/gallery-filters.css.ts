import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";
import { focusRing } from "../styles/ui.css.ts";

export const toolbar = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 12,
  marginBottom: 20,
});

const field = {
  height: 40,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
  background: vars.color.surface,
  color: vars.color.text,
  font: "inherit",
  fontSize: "0.95rem",
} as const;

/** 입력칸 테두리는 주변과 3:1 이상 — 일반 border 토큰은 1.4:1 로 부족하다 */
const fieldEdge = { borderColor: vars.color.muted } as const;

export const search = style([
  focusRing,
  {
    ...field,
    ...fieldEdge,
    flex: "1 1 220px",
    minWidth: 0,
    maxWidth: 320,
    padding: "0 16px",
    selectors: { "&::placeholder": { color: vars.color.muted } },
  },
]);

export const chips = style({
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
  // <fieldset> 기본 테두리·여백 제거
  minWidth: 0,
  margin: 0,
  padding: 0,
  border: 0,
});

export const chip = style([
  focusRing,
  {
    ...field,
    padding: "0 14px",
    cursor: "pointer",
    transition: "background-color 0.15s, border-color 0.15s, color 0.15s",
    selectors: {
      "&:hover": { borderColor: vars.color.muted },
      "&:active": { transform: "translateY(1px)" },
      '&[aria-pressed="true"]': {
        borderColor: vars.color.accent,
        background: vars.color.accent,
        color: vars.color.accentInk,
      },
    },
  },
]);

export const count = style({
  marginLeft: 6,
  opacity: 0.7,
  fontVariantNumeric: "tabular-nums",
});

export const select = style([
  focusRing,
  {
    ...field,
    ...fieldEdge,
    padding: "0 14px",
    cursor: "pointer",
  },
]);

export const summary = style({
  marginLeft: "auto",
  color: vars.color.muted,
  fontSize: "0.9rem",
  fontVariantNumeric: "tabular-nums",
});

export const clear = style([
  focusRing,
  {
    ...field,
    padding: "0 16px",
    background: "transparent",
    cursor: "pointer",
    selectors: {
      "&:hover": { borderColor: vars.color.muted },
      "&:active": { transform: "translateY(1px)" },
    },
  },
]);

export const empty = style({
  display: "grid",
  justifyItems: "start",
  gap: 12,
  padding: "48px 0",
  color: vars.color.muted,
});

export const visuallyHidden = style({
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});
