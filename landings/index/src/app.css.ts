/* Hallmark · theme: custom · idea: "every name on the page runs" · vibe: "a contents page you can touch" · paper: pink 86% (hue 352) · accent: none, the plum ink carries selection · faces: Antonio display, Hanken Grotesk body, JetBrains Mono code only · hero: the index itself, twelve names beside the stage that runs the one you point at · posture: drenched pink ground, dark stage as the only surface · axes: light/display-condensed/chromatic-pink */
/* Hallmark · critique: the names are the navigation and the proof at once; no section explains what the stage already shows */
/* Hallmark · dismissed 44c · a custom hero is free of 44a and 44c (direction.md); the index column and the stage are one composition */
/* Hallmark · dismissed 26a · focus rings live in vanilla-extract selectors the static tier cannot read; checked in the browser, 2px ink outline, instant */

import { style } from "@vanilla-extract/css";
import { ix } from "./theme.css.ts";

const rule = `1px solid ${ix.color.rule}`;
const gutter = "max(clamp(16px, 4vw, 56px), calc((100% - 1360px) / 2))";

const focus = {
  "&:focus-visible": { outline: `2px solid ${ix.color.ink}`, outlineOffset: 3 },
} as const;

/** 히어로가 정확히 한 화면이 되도록 높이를 고정한다 (hero = 100svh - 64px) */
export const nav = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  height: 64,
  paddingInline: gutter,
});

export const wordmark = style({
  fontFamily: ix.font.display,
  fontSize: "1.5rem",
  fontWeight: 700,
  letterSpacing: "-0.01em",
});

export const navLink = style({
  fontWeight: 500,
  textUnderlineOffset: 4,
  selectors: { ...focus, "&:hover": { textDecorationThickness: 2 } },
});

/* ---------- hero: the live index ---------- */

export const hero = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
  gap: "clamp(24px, 4vw, 64px)",
  minHeight: "calc(100svh - 64px)",
  padding: `8px ${gutter} 40px`,
  "@media": { "(max-width: 960px)": { gridTemplateColumns: "minmax(0, 1fr)" } },
});

export const heroText = style({
  display: "grid",
  alignContent: "start",
  gap: 16,
});

export const headline = style({
  margin: 0,
  fontFamily: ix.font.display,
  fontSize: "clamp(3rem, 6.2vw, 6rem)",
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: "-0.01em",
  textTransform: "uppercase",
});

export const sentence = style({
  maxWidth: "34ch",
  margin: 0,
  color: ix.color.muted,
  fontSize: "1.2rem",
});

export const index = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  columnGap: 24,
  margin: "8px 0 0",
  padding: 0,
  listStyle: "none",
  borderTop: rule,
  "@media": { "(max-width: 520px)": { gridTemplateColumns: "minmax(0, 1fr)" } },
});

export const entry = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 12,
  width: "100%",
  padding: "9px 10px",
  border: 0,
  borderBottom: rule,
  background: "transparent",
  color: ix.color.ink,
  textAlign: "left",
  cursor: "pointer",
  transition: "background-color 0.15s, color 0.15s",
  selectors: {
    ...focus,
    "&:hover": { background: ix.color.rule },
    '&[aria-pressed="true"]': { background: ix.color.selected, color: ix.color.selectedInk },
    "&:active": { transform: "translateY(1px)" },
  },
});

export const entryName = style({
  fontFamily: ix.font.display,
  fontSize: "clamp(1.25rem, 1.8vw, 1.65rem)",
  fontWeight: 600,
  lineHeight: 1.1,
  textTransform: "uppercase",
});

export const entryKind = style({
  fontSize: "0.9rem",
  opacity: 0.75,
});

export const stageColumn = style({
  display: "grid",
  alignContent: "start",
  gap: 14,
  "@media": { "(min-width: 961px)": { position: "sticky", top: 16, alignSelf: "start" } },
});

export const stage = style({
  position: "relative",
  display: "grid",
  placeItems: "center",
  minHeight: "min(58svh, 520px)",
  padding: "40px 28px",
  overflow: "hidden",
  borderRadius: 18,
  background: ix.color.stage,
  color: ix.color.stageInk,
});

export const stageDemo = style({
  display: "grid",
  placeItems: "center",
  width: "100%",
});

export const caption = style({
  display: "grid",
  gap: 4,
  margin: 0,
});

export const captionTitle = style({
  fontWeight: 600,
});

export const captionText = style({
  color: ix.color.muted,
});

export const open = style({
  justifySelf: "start",
  display: "inline-flex",
  alignItems: "center",
  height: 48,
  padding: "0 24px",
  borderRadius: 999,
  background: ix.color.ink,
  color: ix.color.ground,
  fontWeight: 600,
  textDecoration: "none",
  transition: "background-color 0.15s",
  selectors: {
    ...focus,
    "&:hover": { background: ix.color.muted },
    "&:active": { transform: "translateY(1px)" },
  },
});

/* ---------- sections ---------- */

const section = {
  paddingBlock: 140,
  paddingInline: gutter,
  borderTop: rule,
} as const;

export const sectionHead = style({
  margin: "0 0 48px",
  maxWidth: "18ch",
  fontFamily: ix.font.display,
  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
  fontWeight: 700,
  lineHeight: 1,
  textTransform: "uppercase",
});

export const kinds = style(section);

export const kindRow = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
  gap: 24,
});

export const kind = style({
  display: "grid",
  alignContent: "start",
  gap: 8,
  paddingTop: 16,
  borderTop: `3px solid ${ix.color.ink}`,
});

export const kindCount = style({
  fontFamily: ix.font.display,
  fontSize: "clamp(4.5rem, 9vw, 8rem)",
  fontWeight: 700,
  lineHeight: 1,
  fontVariantNumeric: "lining-nums tabular-nums",
});

export const kindName = style({
  fontSize: "1.15rem",
  fontWeight: 600,
});

export const kindMembers = style({
  margin: 0,
  color: ix.color.muted,
});

export const large = style(section);

export const largeGrid = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
  gap: 24,
  "@media": { "(max-width: 900px)": { gridTemplateColumns: "minmax(0, 1fr)" } },
});

export const largeStage = style([
  stage,
  {
    minHeight: 340,
    margin: 0,
  },
]);

export const largeWide = style({
  gridColumn: "1 / -1",
});

export const take = style([
  section,
  {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
    gap: "clamp(32px, 5vw, 80px)",
    alignItems: "start",
    "@media": { "(max-width: 900px)": { gridTemplateColumns: "minmax(0, 1fr)" } },
  },
]);

export const steps = style({
  display: "grid",
  gap: 28,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const step = style({
  display: "grid",
  gap: 10,
});

export const stepText = style({
  margin: 0,
  fontSize: "1.15rem",
});

export const code = style({
  display: "block",
  padding: "14px 16px",
  overflowX: "auto",
  borderRadius: 10,
  background: ix.color.stage,
  color: ix.color.stageInk,
  fontFamily: ix.font.code,
  fontSize: "0.95rem",
  whiteSpace: "pre",
});

export const footer = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 16,
  padding: `28px ${gutter} 40px`,
  borderTop: rule,
});

export const footerLinks = style({
  display: "flex",
  flexWrap: "wrap",
  gap: 20,
});
