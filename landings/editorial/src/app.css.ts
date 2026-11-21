import { style } from "@vanilla-extract/css";
import { ed } from "./theme.css.ts";

const rule = `1px solid ${ed.color.rule}`;

const focus = {
  selectors: {
    "&:active": { transform: "translateY(1px)" },
    "&:focus-visible": { outline: `2px solid ${ed.color.accent}`, outlineOffset: 3 },
  },
} as const;

export const page = style({
  maxWidth: 1360,
  margin: "0 auto",
  padding: "0 clamp(16px, 4vw, 48px)",
});

export const masthead = style({
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "baseline",
  gap: 16,
  padding: "20px 0 14px",
  borderBottom: rule,
  color: ed.color.muted,
  fontSize: "0.95rem",
  "@media": {
    "(max-width: 640px)": { gridTemplateColumns: "1fr", justifyItems: "center" },
  },
});

export const mastheadEnd = style({
  justifySelf: "end",
  "@media": { "(max-width: 640px)": { justifySelf: "center" } },
});

export const wordmark = style({
  color: ed.color.ink,
  fontSize: "1.3rem",
  fontStyle: "italic",
});

/** 첫 화면을 채운다 — 마스트헤드를 뺀 높이 */
export const hero = style({
  display: "grid",
  alignContent: "center",
  gap: 44,
  minHeight: "calc(100svh - 64px)",
  padding: "48px 0",
});

export const headline = style({
  margin: 0,
  maxWidth: "9ch",
  fontSize: "clamp(3.25rem, 12vw, 11.5rem)",
  fontWeight: 400,
  lineHeight: 0.95,
  letterSpacing: "-0.035em",
});

export const dek = style({
  maxWidth: "30ch",
  margin: 0,
  color: ed.color.muted,
  fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
  lineHeight: 1.4,
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 16,
});

const control = {
  display: "inline-flex",
  alignItems: "center",
  height: 48,
  padding: "0 28px",
  borderRadius: 999,
  fontFamily: ed.font.serif,
  fontSize: "1.05rem",
  cursor: "pointer",
  transition: "background-color 0.2s, color 0.2s",
} as const;

export const primary = style({
  ...control,
  ...focus,
  border: `1px solid ${ed.color.ink}`,
  background: ed.color.ink,
  color: ed.color.paper,
});

export const secondary = style({
  ...control,
  border: `1px solid ${ed.color.ink}`,
  background: "transparent",
  color: ed.color.ink,
  textDecoration: "none",
  selectors: {
    "&:hover": { background: ed.color.ink, color: ed.color.paper },
    "&:active": { transform: "translateY(1px)" },
    "&:focus-visible": { outline: `2px solid ${ed.color.accent}`, outlineOffset: 3 },
  },
});

export const band = style({
  padding: "20px 0",
  borderTop: rule,
  borderBottom: rule,
  background: ed.color.ink,
  color: ed.color.paper,
});

export const bandItem = style({
  fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
  fontStyle: "italic",
  whiteSpace: "nowrap",
});

export const bandMark = style({
  color: ed.color.paper,
  opacity: 0.5,
});

export const facts = style({
  display: "grid",
  gap: 40,
  padding: "140px 0 120px",
});

export const sectionHead = style({
  margin: 0,
  fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
  fontWeight: 400,
  lineHeight: 1.05,
});

export const factRow = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  borderTop: rule,
});

export const fact = style({
  display: "grid",
  gap: 12,
  padding: "36px 28px 8px 0",
});

export const factNumber = style({
  color: ed.color.accent,
  fontSize: "clamp(4rem, 9vw, 7.5rem)",
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums lining-nums",
});

export const factLabel = style({
  color: ed.color.muted,
  fontSize: "1.05rem",
});

export const essay = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
  gap: "clamp(32px, 6vw, 96px)",
  padding: "140px 0",
  borderTop: rule,
  "@media": { "(max-width: 860px)": { gridTemplateColumns: "minmax(0, 1fr)" } },
});

export const essayHead = style([
  sectionHead,
  {
    alignSelf: "start",
    "@media": { "(min-width: 861px)": { position: "sticky", top: 48 } },
  },
]);

export const prose = style({
  maxWidth: "60ch",
  fontSize: "1.2rem",
  lineHeight: 1.65,
});

export const paragraph = style({
  margin: "0 0 1.4em",
});

export const lede = style([
  paragraph,
  {
    selectors: {
      "&::first-letter": {
        float: "left",
        margin: "0.06em 0.1em 0 0",
        color: ed.color.accent,
        fontSize: "4.6em",
        lineHeight: 0.8,
      },
    },
  },
]);

export const quote = style({
  margin: 0,
  padding: "160px 0",
  borderTop: rule,
  fontSize: "clamp(2.25rem, 6vw, 5rem)",
  fontStyle: "italic",
  lineHeight: 1.08,
  letterSpacing: "-0.02em",
});

export const quoteText = style({
  display: "block",
  maxWidth: "18ch",
});

export const close = style({
  display: "grid",
  justifyItems: "start",
  gap: 32,
  padding: "140px 0",
  borderTop: rule,
});

export const closeHead = style({
  margin: 0,
  maxWidth: "14ch",
  fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
  fontWeight: 400,
  lineHeight: 1,
  letterSpacing: "-0.02em",
});

export const colophon = style({
  padding: "24px 0 40px",
  borderTop: rule,
  color: ed.color.muted,
  fontSize: "0.95rem",
});
