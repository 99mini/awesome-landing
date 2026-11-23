import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";
import { focusRing } from "../styles/ui.css.ts";

export const button = style([
  focusRing,
  {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    height: 36,
    padding: "0 12px",
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.pill,
    background: vars.color.surface,
    color: vars.color.muted,
    font: "inherit",
    fontSize: "0.9rem",
    cursor: "pointer",
    selectors: {
      "&:hover": { borderColor: vars.color.muted, color: vars.color.text },
    },
  },
]);

export const icon = style({
  width: 16,
  height: 16,
});

/** 좁은 화면에서는 아이콘만 (이름은 aria-label 에 있다) */
export const label = style({
  "@media": { "(max-width: 480px)": { display: "none" } },
});
