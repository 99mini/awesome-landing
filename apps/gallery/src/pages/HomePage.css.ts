import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const section = style({
  marginTop: 48,
});

export const sectionTitle = style({
  margin: "0 0 16px",
  fontSize: "1.5rem",
});

export const grid = style({
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
});

export const landingCard = style({
  display: "block",
  height: "100%",
  padding: 20,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  background: vars.color.surface,
  transition: "border-color 0.2s, transform 0.2s",
  selectors: {
    "&:hover": { borderColor: vars.color.accent, transform: "translateY(-2px)" },
  },
});

export const landingTitle = style({
  margin: "8px 0 4px",
});

export const landingText = style({
  margin: 0,
  color: vars.color.muted,
  fontSize: "0.9rem",
});
