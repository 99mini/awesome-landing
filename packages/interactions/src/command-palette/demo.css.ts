import { vars } from "@awesome/theme";
import { globalStyle, style } from "@vanilla-extract/css";

/** 패널이 이 영역 안에 뜬다 */
export const root = style({
  position: "relative",
  display: "grid",
  justifyItems: "center",
  alignContent: "center",
  gap: 16,
  width: "min(100%, 360px)",
  minHeight: 260,
  vars: {
    // 데모 영역만 덮으면 어두운 사각형이 생겨서, 데모에서는 뒤를 흐리지 않는다.
    // (덮개는 패널의 형제라 패널이 아니라 여기서 정한다)
    "--palette-backdrop": "transparent",
  },
});

export const tile = style({
  width: 72,
  height: 72,
  borderRadius: vars.radius.md,
});

export const round = style({
  borderRadius: "50%",
});

export const yellow = style({
  background: vars.color.signal,
});

export const teal = style({
  background: vars.color.signalAlt,
});

export const trigger = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
});

// 여는 버튼은 CommandPalette 의 <button> — 그 안의 내용으로 모양을 준다
globalStyle(`button:has(> ${trigger})`, {
  height: 38,
  padding: "0 8px 0 16px",
  border: `1px solid ${vars.color.muted}`,
  borderRadius: vars.radius.pill,
  background: "transparent",
  fontSize: "0.9rem",
});

globalStyle(`button:has(> ${trigger}):hover`, {
  borderColor: vars.color.text,
});

export const kbd = style({
  // 키보드가 없는 터치 화면에서는 단축키 표시를 뺀다
  "@media": { "(hover: none)": { display: "none" } },
  padding: "2px 8px",
  borderRadius: vars.radius.pill,
  background: vars.color.surfaceRaised,
  color: vars.color.muted,
  font: "inherit",
  fontSize: "0.8rem",
});

export const panel = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  background: vars.color.surfaceRaised,
  color: vars.color.text,
  boxShadow: "none",
  vars: {
    "--palette-highlight": vars.color.border,
  },
});

export const status = style({
  margin: 0,
  color: vars.color.muted,
  fontSize: "0.9rem",
});
