import { vars } from "@awesome/theme";
import { globalStyle, style } from "@vanilla-extract/css";
import { focusRing } from "../styles/ui.css.ts";

export const viewer = style({
  overflow: "hidden",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
});

export const toolbar = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 8px 8px 12px",
  borderBottom: `1px solid ${vars.color.border}`,
});

export const tabs = style({
  display: "flex",
  flexWrap: "wrap",
  gap: 4,
  flex: 1,
});

export const tab = style([
  focusRing,
  {
    padding: "4px 10px",
    border: 0,
    borderRadius: vars.radius.sm,
    background: "none",
    color: vars.color.muted,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: "0.8rem",
    cursor: "pointer",
    selectors: {
      "&:hover": { color: vars.color.text },
      '&[aria-selected="true"]': { background: vars.color.border, color: vars.color.text },
    },
  },
]);

export const copy = style([
  focusRing,
  {
    flexShrink: 0,
    minWidth: 72,
    padding: "4px 12px",
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.pill,
    background: "none",
    color: vars.color.text,
    fontSize: "0.8rem",
    cursor: "pointer",
    selectors: { "&:hover": { borderColor: vars.color.accent } },
  },
]);

export const code = style({
  maxHeight: 360,
  margin: 0,
  padding: "16px 0",
  overflow: "auto",
  background: "#0e0e13",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "0.8rem",
  lineHeight: 1.6,
  tabSize: 2,
  counterReset: "line",

  // sugar-high 토큰 색
  vars: {
    "--sh-class": "#7dd3fc",
    "--sh-identifier": "#e4e4e7",
    "--sh-sign": "#8b8b98",
    "--sh-property": "#93c5fd",
    "--sh-entity": "#5eead4",
    "--sh-jsxliterals": "#c4b5fd",
    "--sh-string": "#86efac",
    "--sh-keyword": "#f9a8d4",
    "--sh-comment": "#6b6b78",
  },
});

// sugar-high 는 줄 사이에 개행 문자를 넣으므로 줄(span)은 inline 으로 둔다 (block 이면 빈 줄이 생김)
globalStyle(`${code} .sh__line::before`, {
  counterIncrement: "line",
  content: "counter(line)",
  display: "inline-block",
  width: 40,
  marginRight: 16,
  color: "#4a4a55",
  textAlign: "right",
});

export const status = style({
  padding: 16,
  color: vars.color.muted,
  fontSize: "0.85rem",
});
