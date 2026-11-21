import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  width: "min(100%, 420px)",
  borderTop: `1px solid ${vars.color.border}`,
});

export const item = style({
  borderBottom: `1px solid ${vars.color.border}`,
});

export const trigger = style({
  minHeight: 48,
  padding: "0 4px",
  color: vars.color.text,
  fontSize: "1.05rem",
  fontWeight: 600,
  selectors: {
    "&:hover": { color: vars.color.signal },
  },
});

export const panel = style({
  padding: "0 4px 16px",
  color: vars.color.muted,
  lineHeight: 1.55,
});
