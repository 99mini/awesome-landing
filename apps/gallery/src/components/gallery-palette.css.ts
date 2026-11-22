import { vars } from "@awesome/theme";
import { globalStyle, style } from "@vanilla-extract/css";

export const trigger = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
});

// 여는 버튼은 CommandPalette 의 <button> — 그 안의 내용으로 모양을 준다
globalStyle(`button:has(> ${trigger})`, {
  height: 36,
  padding: "0 8px 0 12px",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
  background: vars.color.surface,
  color: vars.color.muted,
  fontSize: "0.9rem",
});

globalStyle(`button:has(> ${trigger}):hover`, {
  borderColor: vars.color.muted,
  color: vars.color.text,
});

// 포커스 표시는 갤러리 강조색 (선택·상태·포커스에만 쓰는 색)
globalStyle(`button:has(> ${trigger}):focus-visible`, {
  outline: `2px solid ${vars.color.accent}`,
  outlineOffset: 2,
});

export const icon = style({
  width: 16,
  height: 16,
});

export const kbd = style({
  padding: "2px 8px",
  borderRadius: vars.radius.pill,
  background: vars.color.surfaceRaised,
  font: "inherit",
  fontSize: "0.8rem",
  // 키보드가 없는 터치 화면에서는 단축키 표시를 뺀다
  "@media": { "(hover: none)": { display: "none" } },
});

/** 팔레트 전체(덮개 포함)에 물려줄 값 — 덮개는 패널의 형제라 패널이 아니라 여기서 정한다 */
export const root = style({
  vars: { "--palette-backdrop": vars.color.scrim },
});

export const panel = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  background: vars.color.surfaceRaised,
  color: vars.color.text,
  boxShadow: "none",
  width: "min(560px, 100%)",
  vars: {
    "--palette-highlight": vars.color.border,
    "--palette-list-height": "min(360px, 60vh)",
  },
});
