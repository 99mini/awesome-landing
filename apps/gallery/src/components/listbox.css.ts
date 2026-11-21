import { vars } from "@awesome/theme";
import { globalStyle, style } from "@vanilla-extract/css";
import { focusRing } from "../styles/ui.css.ts";

/** 태그 선택·검색 자동완성이 함께 쓰는 드롭다운 리스트박스 */

export const anchor = style({
  position: "relative",
});

export const panel = style({
  position: "absolute",
  top: "calc(100% + 8px)",
  left: 0,
  zIndex: 5,
  minWidth: "100%",
  maxHeight: 340,
  margin: 0,
  padding: 4,
  overflowY: "auto",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  // 높이는 한 단계 밝은 면으로 표현한다 (넓은 그림자 + 테두리 겹침은 피한다)
  background: vars.color.surfaceRaised,
  listStyle: "none",
  overscrollBehavior: "contain",
});

export const groupLabel = style({
  padding: "8px 12px 4px",
  color: vars.color.muted,
  fontSize: "0.8rem",
});

export const group = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
  selectors: {
    "& + &": { marginTop: 4, paddingTop: 4, borderTop: `1px solid ${vars.color.border}` },
  },
});

export const option = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
  minHeight: 36,
  padding: "0 12px",
  borderRadius: vars.radius.sm,
  color: vars.color.text,
  fontSize: "0.95rem",
  cursor: "pointer",
  userSelect: "none",
  selectors: {
    // 키보드·포인터로 가리키는 중인 항목
    '&[data-active="true"]': { background: vars.color.border },
  },
});

export const optionLabel = style({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const optionMeta = style({
  color: vars.color.muted,
  fontSize: "0.85rem",
  fontVariantNumeric: "tabular-nums",
});

/** 선택된 항목의 체크 — 강조색은 선택 상태에만 쓴다 */
export const check = style({
  flexShrink: 0,
  width: 16,
  height: 16,
  color: vars.color.accent,
});

export const checkSpacer = style({
  flexShrink: 0,
  width: 16,
});

/** 검색어와 일치한 부분 */
export const match = style({
  background: "none",
  color: "inherit",
  fontWeight: 700,
});

export const empty = style({
  padding: "12px",
  color: vars.color.muted,
  fontSize: "0.9rem",
});

/* ---------- 트리거 (태그 선택 버튼) ---------- */

export const trigger = style([
  focusRing,
  {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    height: 40,
    padding: "0 12px 0 16px",
    border: `1px solid ${vars.color.muted}`,
    borderRadius: vars.radius.pill,
    background: vars.color.surface,
    color: vars.color.text,
    font: "inherit",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "border-color 0.15s, background-color 0.15s",
    selectors: {
      "&:hover": { borderColor: vars.color.text },
      "&:active": { transform: "translateY(1px)" },
      '&[data-value="true"]': { borderColor: vars.color.accent },
    },
  },
]);

export const triggerLabel = style({
  color: vars.color.muted,
});

export const chevron = style({
  width: 16,
  height: 16,
  color: vars.color.muted,
  transition: "transform 0.2s",
  selectors: {
    '[aria-expanded="true"] > &': { transform: "rotate(180deg)" },
  },
  "@media": { "(prefers-reduced-motion: reduce)": { transition: "none" } },
});

/* ---------- 검색 입력 ---------- */

export const searchField = style([
  focusRing,
  {
    width: "100%",
    height: 40,
    padding: "0 16px 0 40px",
    border: `1px solid ${vars.color.muted}`,
    borderRadius: vars.radius.pill,
    background: vars.color.surface,
    color: vars.color.text,
    font: "inherit",
    fontSize: "0.95rem",
    selectors: { "&::placeholder": { color: vars.color.muted } },
  },
]);

export const searchIcon = style({
  position: "absolute",
  top: 12,
  left: 16,
  width: 16,
  height: 16,
  color: vars.color.muted,
  pointerEvents: "none",
});

export const searchAnchor = style([anchor, { flex: "1 1 240px", minWidth: 0, maxWidth: 360 }]);

globalStyle(`${searchField}::-webkit-search-cancel-button`, { display: "none" });
