import { style } from "@vanilla-extract/css";
import { au } from "./theme.css.ts";

/*
 * Hallmark · waive 29 · the drifting green bloom behind the headline is the motion this landing
 * exists to demonstrate; one hue, three blooms, reduced motion holds them still
 */

export const hero = style({
  position: "relative",
  display: "grid",
  alignContent: "center",
  justifyItems: "start",
  gap: 28,
  minHeight: "100svh",
  // 넓은 화면에서도 내용이 1360px 컨테이너 안에 머물도록
  paddingInline: "max(clamp(16px, 6vw, 120px), calc((100% - 1360px) / 2))",
  overflow: "hidden",
});

export const headline = style({
  position: "relative",
  maxWidth: "11ch",
  margin: 0,
  fontSize: "clamp(3rem, 9vw, 8rem)",
  fontWeight: 600,
  lineHeight: 0.98,
  letterSpacing: "-0.04em",
});

export const lead = style({
  position: "relative",
  maxWidth: "32ch",
  margin: 0,
  color: au.color.muted,
  fontSize: "clamp(1.15rem, 2vw, 1.4rem)",
  lineHeight: 1.45,
});

export const aurora = style({
  position: "absolute",
  inset: 0,
  filter: "blur(90px)",
  opacity: 0.5,
});

const blob = style({
  position: "absolute",
  width: "40vmax",
  height: "40vmax",
  borderRadius: "50%",
});

/** 오로라 블룸 — 색과 시작 위치 (같은 색조 안에서만) */
export const blobs = [
  { color: au.color.bloomA, className: style([blob, { top: "-15%", left: "0%" }]) },
  { color: au.color.bloomB, className: style([blob, { top: "20%", left: "22%" }]) },
  { color: au.color.bloomC, className: style([blob, { bottom: "-30%", left: "-8%" }]) },
];

export const cta = style({
  position: "relative",
  height: 48,
  padding: "0 32px",
  border: "none",
  borderRadius: 999,
  background: au.color.action,
  color: au.color.actionInk,
  fontFamily: au.font.display,
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
  selectors: {
    "&:active": { transform: "translateY(1px)" },
    "&:focus-visible": { outline: `2px solid ${au.color.ink}`, outlineOffset: 3 },
  },
});

export const parts = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.6fr)",
  gap: "clamp(32px, 6vw, 96px)",
  // 히어로와 같은 좌우 여백 — 모든 섹션의 왼쪽 선을 맞춘다
  padding: "160px 0 180px",
  paddingInline: "max(clamp(16px, 6vw, 120px), calc((100% - 1360px) / 2))",
  "@media": { "(max-width: 860px)": { gridTemplateColumns: "minmax(0, 1fr)" } },
});

export const partsHead = style({
  margin: 0,
  fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
  fontWeight: 600,
  lineHeight: 1.05,
  letterSpacing: "-0.03em",
});

export const list = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
  borderTop: `1px solid ${au.color.rule}`,
});

export const row = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 12rem) minmax(0, 1fr)",
  gap: 24,
  padding: "28px 0",
  borderBottom: `1px solid ${au.color.rule}`,
  "@media": { "(max-width: 560px)": { gridTemplateColumns: "minmax(0, 1fr)", gap: 8 } },
});

export const rowTitle = style({
  margin: 0,
  fontSize: "1.5rem",
  fontWeight: 600,
});

export const rowBody = style({
  margin: 0,
  color: au.color.muted,
  fontSize: "1.1rem",
  lineHeight: 1.55,
});

export const start = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
  alignItems: "end",
  gap: "28px clamp(32px, 6vw, 96px)",
  "@media": { "(max-width: 860px)": { gridTemplateColumns: "minmax(0, 1fr)" } },
  padding: "160px 0 200px",
  paddingInline: "max(clamp(16px, 6vw, 120px), calc((100% - 1360px) / 2))",
  borderTop: `1px solid ${au.color.rule}`,
});

export const command = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 16,
});

export const code = style({
  padding: "12px 16px",
  borderRadius: 8,
  background: au.color.rule,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "1rem",
});

export const copy = style({
  height: 48,
  padding: "0 24px",
  border: `1px solid ${au.color.muted}`,
  borderRadius: 999,
  background: "transparent",
  color: au.color.ink,
  fontFamily: au.font.display,
  fontSize: "1rem",
  cursor: "pointer",
  transition: "border-color 0.2s",
  selectors: {
    "&:hover": { borderColor: au.color.ink },
    "&:active": { transform: "translateY(1px)" },
    "&:focus-visible": { outline: `2px solid ${au.color.ink}`, outlineOffset: 3 },
  },
});

/** 마무리 문장 — 섹션 크기의 statement */
export const startHead = style({
  margin: 0,
  fontSize: "clamp(2.5rem, 6vw, 5rem)",
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: "-0.04em",
});
