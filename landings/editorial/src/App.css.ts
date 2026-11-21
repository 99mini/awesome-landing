import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

/** 이 랜딩 전용 종이 팔레트 (갤러리 다크 테마와 의도적으로 대비) */
export const palette = {
  paper: "#f3efe6",
  ink: "#141210",
  muted: "#6b645a",
  accent: "#c2410c",
};

export const serif = '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';
const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const rule = `1px solid ${palette.ink}`;

export const page = style({
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 16px",
});

export const masthead = style({
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  gap: 16,
  padding: "20px 0 14px",
  borderBottom: rule,
  fontFamily: mono,
  fontSize: "0.75rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  "@media": {
    "(max-width: 640px)": {
      gridTemplateColumns: "1fr",
      justifyItems: "center",
      textAlign: "center",
    },
  },
});

export const mastheadEnd = style({
  justifySelf: "end",
  "@media": { "(max-width: 640px)": { justifySelf: "center" } },
});

export const brand = style({
  fontFamily: serif,
  fontSize: "1.25rem",
  fontStyle: "italic",
  letterSpacing: 0,
  textTransform: "none",
});

export const hero = style({
  padding: "clamp(48px, 10vw, 120px) 0 clamp(40px, 8vw, 96px)",
});

export const kicker = style({
  margin: "0 0 24px",
  color: palette.accent,
  fontFamily: mono,
  fontSize: "0.85rem",
  letterSpacing: "0.12em",
});

export const headline = style({
  margin: 0,
  fontSize: "clamp(3rem, 11vw, 9.5rem)",
  fontWeight: 400,
  lineHeight: 0.92,
  letterSpacing: "-0.035em",
});

export const headlineItalic = style({
  fontStyle: "italic",
  color: palette.accent,
});

export const dek = style({
  maxWidth: "34ch",
  margin: "32px 0 0",
  color: palette.muted,
  fontSize: "clamp(1.125rem, 2vw, 1.4rem)",
  lineHeight: 1.45,
});

export const band = style({
  padding: "18px 0",
  borderTop: rule,
  borderBottom: rule,
  background: palette.ink,
  color: palette.paper,
});

export const bandItem = style({
  fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
  fontStyle: "italic",
  whiteSpace: "nowrap",
});

export const bandMark = style({
  color: palette.accent,
});

export const stats = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  borderBottom: rule,
});

export const stat = style({
  display: "grid",
  gap: 8,
  padding: "40px 24px",
  selectors: {
    "& + &": { borderLeft: rule },
  },
  "@media": {
    "(max-width: 640px)": {
      selectors: { "& + &": { borderLeft: "none", borderTop: rule } },
    },
  },
});

export const statNumber = style({
  fontSize: "clamp(3rem, 7vw, 5rem)",
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums lining-nums",
});

export const statLabel = style({
  color: palette.muted,
  fontFamily: mono,
  fontSize: "0.75rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

export const essay = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
  gap: "clamp(24px, 5vw, 72px)",
  padding: "clamp(56px, 9vw, 112px) 0",
  borderBottom: rule,
  "@media": { "(max-width: 800px)": { gridTemplateColumns: "1fr" } },
});

export const essayTitle = style({
  margin: 0,
  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
  fontWeight: 400,
  lineHeight: 1.1,
});

export const columns = style({
  columns: "2 260px",
  columnGap: 40,
  fontSize: "1.075rem",
  lineHeight: 1.65,
});

export const paragraph = style({
  margin: "0 0 1em",
  breakInside: "avoid",
});

export const lede = style([
  paragraph,
  {
    selectors: {
      "&::first-letter": {
        float: "left",
        margin: "0.06em 0.08em 0 0",
        color: palette.accent,
        fontSize: "4.4em",
        lineHeight: 0.8,
      },
    },
  },
]);

export const pullQuote = style({
  margin: "8px 0 24px",
  padding: "16px 0",
  borderTop: rule,
  borderBottom: rule,
  fontSize: "1.5rem",
  fontStyle: "italic",
  lineHeight: 1.3,
  breakInside: "avoid",
});

export const footer = style({
  display: "grid",
  justifyItems: "start",
  gap: 28,
  padding: "clamp(56px, 9vw, 112px) 0 72px",
});

export const footerTitle = style({
  margin: 0,
  maxWidth: "16ch",
  fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
  fontWeight: 400,
  lineHeight: 1,
  letterSpacing: "-0.02em",
});

export const cta = style({
  padding: "16px 32px",
  border: rule,
  borderRadius: vars.radius.pill,
  background: palette.ink,
  color: palette.paper,
  fontFamily: serif,
  fontSize: "1.05rem",
  fontStyle: "italic",
  cursor: "pointer",
});
