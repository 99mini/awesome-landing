/* Hallmark · checked: 2026-11-24 · genre: modern-minimal · scope: page
 * floor: 0 FAIL · fixed: 3, 20, 44c, 49a, 58, 59, 77, 79, F19 · structural: none printed
 * built: the project · redesign: new · v2.0.0 */
/* Hallmark · dismissed F7 · the pill selectors it counts are the two buttons, the compare handle and the toast close button, which are controls; the only non-control pill is the change tag */
import { globalStyle, style } from "@vanilla-extract/css";
import { oc } from "./theme.css.ts";

const page = {
  width: "min(1120px, 100%)",
  marginInline: "auto",
  paddingInline: 24,
} as const;

const focus = {
  "&:focus-visible": { outline: `2px solid ${oc.color.accent}`, outlineOffset: 3 },
} as const;

const pill = {
  display: "inline-flex",
  alignItems: "center",
  height: 44,
  paddingInline: 20,
  borderRadius: 999,
  font: "inherit",
  fontSize: "1rem",
  fontWeight: 600,
  textDecoration: "none",
  whiteSpace: "nowrap",
  cursor: "pointer",
} as const;

export const header = style({
  ...page,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  paddingBlock: 20,
});

export const wordmark = style({
  fontFamily: oc.font.display,
  fontStretch: "125%",
  fontWeight: 800,
  fontSize: "1.125rem",
});

export const primary = style({
  ...pill,
  border: 0,
  background: oc.color.accent,
  color: oc.color.accentInk,
  selectors: {
    ...focus,
    "&:hover": { opacity: 0.9 },
    "&:active": { transform: "translateY(1px)" },
  },
});

export const secondary = style({
  ...pill,
  border: `1px solid ${oc.color.ink}`,
  background: "transparent",
  color: oc.color.ink,
  selectors: {
    ...focus,
    "&:hover": { background: oc.color.soft },
    "&:active": { transform: "translateY(1px)" },
  },
});

export const hero = style({
  ...page,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  alignItems: "center",
  gap: 48,
  paddingBlock: "48px 96px",
  // 넓은 화면: 히어로가 제 화면만 채운다 (다음 섹션이 접히는 선 바로 위에서 시작) — 내용은 세로 가운데
  "@media": {
    "(min-width: 960px)": {
      gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
      minHeight: "calc(100svh - 216px)",
      paddingBlock: 0,
    },
  },
});

export const heroText = style({
  display: "grid",
  gap: 32,
  minWidth: 0,
});

export const title = style({
  fontFamily: oc.font.display,
  fontStretch: "125%",
  fontWeight: 800,
  fontSize: "clamp(2.5rem, 6vw, 5.25rem)",
  lineHeight: 1.02,
  letterSpacing: "-0.02em",
});

export const lead = style({
  maxWidth: "34ch",
  color: oc.color.muted,
  fontSize: "1.25rem",
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
});

export const heroSlot = style({
  minWidth: 0,
});

export const note = style({
  display: "grid",
  gap: 16,
  margin: 0,
  padding: 24,
  border: `1px solid ${oc.color.border}`,
  borderRadius: 8,
  background: oc.color.surface,
});

export const noteTitle = style({
  fontFamily: oc.font.display,
  fontStretch: "110%",
  fontWeight: 800,
  fontSize: "1.25rem",
});

export const noteList = style({
  display: "grid",
  gap: 12,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const noteItem = style({
  display: "grid",
  gridTemplateColumns: "88px minmax(0, 1fr)",
  alignItems: "baseline",
  gap: 12,
});

export const tag = style({
  justifySelf: "start",
  padding: "2px 12px",
  borderRadius: 999,
  background: oc.color.soft,
  fontSize: "0.875rem",
  fontWeight: 600,
});

export const section = style({
  ...page,
  display: "grid",
  gap: 24,
  paddingBlock: 64,
  borderTop: `1px solid ${oc.color.border}`,
});

export const heading = style({
  fontFamily: oc.font.display,
  fontStretch: "125%",
  fontWeight: 800,
  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
  lineHeight: 1.08,
});

export const sectionLead = style({
  color: oc.color.muted,
});

export const muted = style({
  color: oc.color.muted,
});

/** 폰에서는 한 줄로 — 그림이 위에 붙어 있고 단계가 그 아래로 지나간다 */
export const story = style({
  vars: { "--story-top": "96px", "--story-step": "55vh", "--story-gap": "48px" },
  "@media": {
    "(max-width: 760px)": {
      gridTemplateColumns: "minmax(0, 1fr)",
      vars: { "--story-top": "12px", "--story-step": "45vh", "--story-gap": "16px" },
    },
  },
});

export const step = style({
  display: "grid",
  gap: 8,
  maxWidth: "40ch",
});

export const stepNumber = style({
  fontFamily: oc.font.display,
  fontStretch: "125%",
  fontWeight: 800,
  fontSize: "1.5rem",
  color: oc.color.accent,
});

export const stepTitle = style({
  fontSize: "1.375rem",
  fontWeight: 800,
});

export const visual = style({
  display: "grid",
  alignContent: "center",
  minHeight: 280,
  padding: 24,
  border: `1px solid ${oc.color.border}`,
  borderRadius: 8,
  background: oc.color.surface,
  // 폰에서 그림이 위에 붙어 있을 때 아래 단계 글이 비쳐 보이지 않게
  zIndex: 1,
});

export const visualStack = style({
  display: "grid",
  gap: 12,
});

export const commit = style({
  padding: "8px 12px",
  borderRadius: 8,
  background: oc.color.ground,
  fontSize: "0.875rem",
  overflowWrap: "anywhere",
});

export const drafted = style({
  justifySelf: "start",
  padding: "4px 12px",
  borderRadius: 8,
  background: oc.color.soft,
  fontWeight: 600,
  fontSize: "0.9rem",
});

export const reviewLine = style({
  padding: "8px 12px",
  borderRadius: 8,
  background: oc.color.ground,
});

export const comment = style({
  display: "grid",
  gap: 4,
  marginLeft: 24,
  padding: "8px 12px",
  borderRadius: 8,
  background: oc.color.soft,
});

export const destinations = style({
  display: "grid",
  gap: 12,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const destination = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 16px",
  border: `1px solid ${oc.color.border}`,
  borderRadius: 8,
  fontWeight: 600,
});

export const check = style({
  flexShrink: 0,
  color: oc.color.accent,
});

export const compare = style({
  borderRadius: 8,
  border: `1px solid ${oc.color.border}`,
  // 나누는 선의 색
  color: oc.color.ink,
});

export const handle = style({
  border: 0,
  background: oc.color.ink,
  color: oc.color.ground,
  selectors: focus,
});

// 넓은 화면: 대화는 왼쪽 절반에, 노트는 오른쪽 절반에 — 처음 위치(55%)에서 둘 다 온전히 보이고,
// 선을 끌면 한쪽이 다른 쪽을 덮는다. 좁은 화면은 절반이 너무 좁아 둘 다 전체 폭으로 겹쳐 두고 선으로 넘겨 본다
export const thread = style({
  display: "grid",
  alignContent: "start",
  gap: 12,
  margin: 0,
  padding: 24,
  paddingRight: "calc(48% + 24px)",
  minHeight: "100%",
  background: oc.color.ground,
  "@media": {
    "(max-width: 760px)": { padding: 16 },
  },
});

export const message = style({
  display: "grid",
  gap: 2,
  maxWidth: "52ch",
});

export const who = style({
  fontWeight: 600,
  fontSize: "0.9rem",
});

export const compareAfter = style({
  display: "grid",
  alignContent: "center",
  justifyItems: "end",
  height: "100%",
  padding: 24,
  background: oc.color.soft,
  "@media": { "(max-width: 760px)": { padding: 16 } },
});

export const compareNote = style({
  width: "42%",
  "@media": { "(max-width: 760px)": { width: "100%" } },
});

export const counts = style({
  display: "flex",
  flexWrap: "wrap",
  gap: 48,
  margin: 0,
});

export const count = style({
  display: "grid",
  gap: 4,
});

export const countValue = style({
  margin: 0,
  fontFamily: oc.font.display,
  fontStretch: "125%",
  fontWeight: 800,
  fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
});

export const footnote = style({
  color: oc.color.muted,
  fontSize: "0.9rem",
});

/** 마무리 한 줄 — 히어로 크기의 진술로 세운다 (얇은 섹션이 되지 않게) */
export const statement = style({
  fontFamily: oc.font.display,
  fontStretch: "125%",
  fontWeight: 800,
  fontSize: "clamp(2.5rem, 7vw, 5.25rem)",
  lineHeight: 1.02,
  letterSpacing: "-0.02em",
  maxWidth: "14ch",
});

export const closing = style({
  ...page,
  display: "grid",
  justifyItems: "start",
  gap: 24,
  paddingBlock: 64,
  borderTop: `1px solid ${oc.color.border}`,
});

export const footer = style({
  ...page,
  paddingBlock: "64px 48px",
  borderTop: `1px solid ${oc.color.border}`,
  fontSize: "0.9rem",
});

/** 화면 오른쪽 아래에 고정 */
export const toasts = style({
  position: "fixed",
  right: 16,
  bottom: 16,
  zIndex: 10,
  width: "min(360px, calc(100% - 32px))",
});

export const toast = style({
  border: `1px solid ${oc.color.border}`,
  borderRadius: 8,
  background: oc.color.surface,
  color: oc.color.ink,
  boxShadow: "none",
});

// 토스트 닫기 버튼도 같은 포커스 링
globalStyle(`${toast} button:focus-visible`, {
  outline: `2px solid ${oc.color.accent}`,
  outlineOffset: 1,
});
